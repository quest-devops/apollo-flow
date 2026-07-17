# Copyright (c) 2023-present Plane Software, Inc. and contributors
# SPDX-License-Identifier: AGPL-3.0-only
# See the LICENSE file for details.

# Python imports
import os
from urllib.parse import urljoin

# Django imports
from django.http import HttpResponseRedirect

# Third party imports
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView

# Module imports
from plane.authentication.rate_limit import AuthenticationThrottle
from plane.authentication.utils.host import base_host
from plane.authentication.utils.login import user_login
from plane.authentication.utils.redirection_path import get_redirection_path
from plane.db.models import User
from plane.license.models import Instance
from plane.license.utils.instance_value import get_configuration_value
from plane.utils.path_validator import validate_next_path


class DemoLoginEndpoint(APIView):
    """Auto-login de demonstração (somente leitura, por convenção de papel).

    Cria uma sessão para um usuário demo PRÉ-EXISTENTE e redireciona para o app.
    Pensado para instâncias de vitrine (ex.: demo.<dominio>) embutidas no site
    institucional. Desligado por padrão: só age quando a instância define
    ENABLE_DEMO_LOGIN=1 e DEMO_USER_EMAIL aponta para um usuário ativo — em
    qualquer outra instância o endpoint apenas redireciona para a home.

    O usuário demo deve ser provisionado com papel Guest (read-only) no
    workspace/projetos de demonstração; este endpoint não cria usuário nem
    concede papel algum (usuário novo continuaria barrado pelo fluxo normal
    de cadastro fechado).
    """

    permission_classes = [AllowAny]

    throttle_classes = [AuthenticationThrottle]

    def get(self, request):
        host = base_host(request=request, is_app=True)

        def home(path="/"):
            response = HttpResponseRedirect(urljoin(host, path))
            response["Cache-Control"] = "no-store"
            return response

        # Instância precisa estar configurada
        instance = Instance.objects.first()
        if instance is None or not instance.is_setup_done:
            return home()

        (ENABLE_DEMO_LOGIN, DEMO_USER_EMAIL) = get_configuration_value(
            [
                {
                    "key": "ENABLE_DEMO_LOGIN",
                    "default": os.environ.get("ENABLE_DEMO_LOGIN", "0"),
                },
                {
                    "key": "DEMO_USER_EMAIL",
                    "default": os.environ.get("DEMO_USER_EMAIL", ""),
                },
            ]
        )

        # Gate: instâncias normais (default "0") nunca criam sessão por aqui
        if ENABLE_DEMO_LOGIN != "1" or not DEMO_USER_EMAIL:
            return home()

        user = User.objects.filter(email=str(DEMO_USER_EMAIL).lower().strip(), is_active=True).first()
        if user is None:
            return home()

        # Sessão normal de app (cookie); idempotente para quem já tem sessão
        user_login(request=request, user=user, is_app=True)

        next_path = request.GET.get("next_path")
        if next_path:
            path = str(validate_next_path(next_path))
        else:
            path = get_redirection_path(user=user)
        return home(path)
