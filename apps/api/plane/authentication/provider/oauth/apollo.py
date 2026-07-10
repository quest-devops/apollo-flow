# Copyright (c) 2023-present Plane Software, Inc. and contributors
# SPDX-License-Identifier: AGPL-3.0-only
# See the LICENSE file for details.

import os
from datetime import datetime, timedelta
from urllib.parse import urlencode, urlparse

import jwt
import pytz
import requests

# Module imports
from plane.authentication.adapter.oauth import OauthAdapter
from plane.license.utils.instance_value import get_configuration_value
from plane.authentication.adapter.error import (
    AUTHENTICATION_ERROR_CODES,
    AuthenticationException,
)
from plane.db.models import Workspace, WorkspaceMember
from plane.utils.exception_logger import log_exception


# Simple module-level cache so the OIDC discovery document is fetched only
# once per issuer for the lifetime of the process.
_OIDC_DISCOVERY_CACHE = {}
# Cache of jwt.PyJWKClient per jwks_uri so signing keys are reused across requests.
_JWKS_CLIENT_CACHE = {}

# Mapping between the "role" claim issued by the IdP and Plane workspace roles
# (see plane.db.models.workspace ROLE_CHOICES: Admin=20, Member=15, Guest=5)
APOLLO_ROLE_MAP = {"admin": 20, "member": 15, "guest": 5}


class ApolloOIDCProvider(OauthAdapter):
    provider = "apollo"
    scope = "openid email profile groups"

    def __init__(self, request, code=None, state=None, callback=None):
        (APOLLO_ISSUER_URL, APOLLO_CLIENT_ID, APOLLO_CLIENT_SECRET) = get_configuration_value(
            [
                {
                    "key": "APOLLO_ISSUER_URL",
                    "default": os.environ.get("APOLLO_ISSUER_URL"),
                },
                {
                    "key": "APOLLO_CLIENT_ID",
                    "default": os.environ.get("APOLLO_CLIENT_ID"),
                },
                {
                    "key": "APOLLO_CLIENT_SECRET",
                    "default": os.environ.get("APOLLO_CLIENT_SECRET"),
                },
            ]
        )

        if not (APOLLO_ISSUER_URL and APOLLO_CLIENT_ID and APOLLO_CLIENT_SECRET):
            raise AuthenticationException(
                error_code=AUTHENTICATION_ERROR_CODES["APOLLO_NOT_CONFIGURED"],
                error_message="APOLLO_NOT_CONFIGURED",
            )

        # Enforce scheme and normalize trailing slash(es)
        parsed = urlparse(APOLLO_ISSUER_URL)
        if not parsed.scheme or parsed.scheme not in ("https", "http"):
            raise AuthenticationException(
                error_code=AUTHENTICATION_ERROR_CODES["APOLLO_NOT_CONFIGURED"],
                error_message="APOLLO_NOT_CONFIGURED",  # avoid leaking details to query params
            )
        self.issuer_url = APOLLO_ISSUER_URL.rstrip("/")

        # Resolve provider endpoints via OIDC discovery (cached per issuer)
        discovery = self.__get_discovery_document(self.issuer_url)
        authorization_endpoint = discovery.get("authorization_endpoint")
        self.token_url = discovery.get("token_endpoint")
        self.userinfo_url = discovery.get("userinfo_endpoint")
        self.jwks_uri = discovery.get("jwks_uri")

        client_id = APOLLO_CLIENT_ID
        client_secret = APOLLO_CLIENT_SECRET

        redirect_uri = f"{'https' if request.is_secure() else 'http'}://{request.get_host()}/auth/apollo/callback/"
        url_params = {
            "client_id": client_id,
            "scope": self.scope,
            "redirect_uri": redirect_uri,
            "response_type": "code",
            "state": state,
        }
        auth_url = f"{authorization_endpoint}?{urlencode(url_params)}"

        super().__init__(
            request,
            self.provider,
            client_id,
            self.scope,
            redirect_uri,
            auth_url,
            self.token_url,
            self.userinfo_url,
            client_secret,
            code,
            callback=callback,
        )

    @staticmethod
    def __get_discovery_document(issuer_url):
        discovery = _OIDC_DISCOVERY_CACHE.get(issuer_url)
        if discovery:
            return discovery
        try:
            response = requests.get(
                f"{issuer_url}/.well-known/openid-configuration", timeout=10
            )
            response.raise_for_status()
            discovery = response.json()
        except (requests.RequestException, ValueError) as e:
            log_exception(e)
            raise AuthenticationException(
                error_code=AUTHENTICATION_ERROR_CODES["APOLLO_OAUTH_PROVIDER_ERROR"],
                error_message="APOLLO_OAUTH_PROVIDER_ERROR",  # avoid leaking details to query params
            )
        required_keys = (
            "authorization_endpoint",
            "token_endpoint",
            "jwks_uri",
            "userinfo_endpoint",
        )
        if not all(discovery.get(key) for key in required_keys):
            raise AuthenticationException(
                error_code=AUTHENTICATION_ERROR_CODES["APOLLO_NOT_CONFIGURED"],
                error_message="APOLLO_NOT_CONFIGURED",
            )
        _OIDC_DISCOVERY_CACHE[issuer_url] = discovery
        return discovery

    def set_token_data(self):
        data = {
            "code": self.code,
            "client_id": self.client_id,
            "client_secret": self.client_secret,
            "redirect_uri": self.redirect_uri,
            "grant_type": "authorization_code",
        }
        headers = {"Accept": "application/json"}
        token_response = self.get_user_token(data=data, headers=headers)
        super().set_token_data(
            {
                "access_token": token_response.get("access_token"),
                "refresh_token": token_response.get("refresh_token", None),
                "access_token_expired_at": (
                    datetime.now(tz=pytz.utc) + timedelta(seconds=token_response.get("expires_in"))
                    if token_response.get("expires_in")
                    else None
                ),
                "refresh_token_expired_at": (
                    datetime.fromtimestamp(token_response.get("refresh_token_expired_at"), tz=pytz.utc)
                    if token_response.get("refresh_token_expired_at")
                    else None
                ),
                "id_token": token_response.get("id_token", ""),
            }
        )

    def __validate_id_token(self, id_token):
        try:
            jwks_client = _JWKS_CLIENT_CACHE.get(self.jwks_uri)
            if jwks_client is None:
                jwks_client = jwt.PyJWKClient(self.jwks_uri)
                _JWKS_CLIENT_CACHE[self.jwks_uri] = jwks_client
            signing_key = jwks_client.get_signing_key_from_jwt(id_token)
            return jwt.decode(
                id_token,
                signing_key.key,
                algorithms=["RS256"],
                audience=self.client_id,
                # Accept the issuer both with and without a trailing slash
                # (PyJWT >= 2.10 accepts a sequence of issuers)
                issuer=[self.issuer_url, f"{self.issuer_url}/"],
            )
        except Exception as e:
            log_exception(e)
            raise AuthenticationException(
                error_code=AUTHENTICATION_ERROR_CODES["APOLLO_OAUTH_PROVIDER_ERROR"],
                error_message="APOLLO_OAUTH_PROVIDER_ERROR: Invalid id_token",
            )

    def set_user_data(self):
        id_token = self.token_data.get("id_token")
        if not id_token:
            raise AuthenticationException(
                error_code=AUTHENTICATION_ERROR_CODES["APOLLO_OAUTH_PROVIDER_ERROR"],
                error_message="APOLLO_OAUTH_PROVIDER_ERROR: No id_token returned by the provider",
            )

        claims = self.__validate_id_token(id_token)

        email = claims.get("email")
        if not email:
            raise AuthenticationException(
                error_code=AUTHENTICATION_ERROR_CODES["APOLLO_OAUTH_PROVIDER_ERROR"],
                error_message="APOLLO_OAUTH_PROVIDER_ERROR: No email found in id_token",
            )

        # Keep the role/groups claims for workspace membership sync after login.
        # NOTE: role sync is intentionally unconditional (the IdP is the source of
        # truth for the access matrix). TODO: _apollo_groups is reserved for the
        # future company-group (co-*) to workspace mapping; unused today.
        self._apollo_role = claims.get("role")
        self._apollo_groups = claims.get("groups", [])

        super().set_user_data(
            {
                "email": email,
                "user": {
                    "provider_id": str(claims.get("sub")),
                    "email": email,
                    "avatar": claims.get("picture"),
                    "first_name": claims.get("name") or claims.get("preferred_username"),
                    "last_name": "",  # full name is kept in first_name (single name claim)
                    "is_password_autoset": True,
                },
            }
        )

    def complete_login_or_signup(self):
        user = super().complete_login_or_signup()
        # Workspace role sync must never break the login flow
        try:
            self.__sync_workspace_role(user)
        except Exception as e:
            log_exception(e)
        return user

    def __sync_workspace_role(self, user):
        (APOLLO_WORKSPACE_SLUG,) = get_configuration_value(
            [
                {
                    "key": "APOLLO_WORKSPACE_SLUG",
                    "default": os.environ.get("APOLLO_WORKSPACE_SLUG"),
                }
            ]
        )
        if not APOLLO_WORKSPACE_SLUG:
            self.logger.info("APOLLO_WORKSPACE_SLUG not configured, skipping workspace role sync")
            return

        role = getattr(self, "_apollo_role", None)
        if role not in APOLLO_ROLE_MAP:
            self.logger.info(
                "No valid role claim in id_token for user %s, skipping workspace role sync",
                user.id,
            )
            return

        workspace = Workspace.objects.filter(slug=APOLLO_WORKSPACE_SLUG).first()
        if workspace is None:
            self.logger.warning(
                "Workspace with slug %s not found, skipping workspace role sync",
                APOLLO_WORKSPACE_SLUG,
            )
            return

        WorkspaceMember.objects.update_or_create(
            workspace=workspace,
            member=user,
            defaults={"role": APOLLO_ROLE_MAP[role], "is_active": True},
        )
