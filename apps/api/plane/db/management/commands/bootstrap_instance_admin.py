# Copyright (c) 2023-present Plane Software, Inc. and contributors
# SPDX-License-Identifier: AGPL-3.0-only
# See the LICENSE file for details.

# Apollo: semeia o admin da instancia (god-mode) de forma nao-interativa a partir
# de variaveis de ambiente, para que a instancia ja nasca com um admin e a tela
# /god-mode/setup nao fique aberta a qualquer visitante (janela em que o primeiro
# a postar vira admin). Idempotente: chamado no boot (docker-entrypoint-api.sh)
# logo apos register_instance. No-op silencioso se as variaveis nao estiverem
# setadas, entao instancias sem essas envs seguem no fluxo manual de setup.
#
# Espelha a logica de InstanceAdminSignUpEndpoint.post (license/api/views/admin.py)
# sem o request/redirect, e a validacao de senha de reset_password.

# Python imports
import os
import uuid

# Django imports
from django.contrib.auth.hashers import make_password
from django.core.management.base import BaseCommand
from django.utils import timezone

# Third party imports
from zxcvbn import zxcvbn

# Module imports
from plane.db.models import Profile, User
from plane.license.models import Instance, InstanceAdmin


class Command(BaseCommand):
    help = "Semeia o admin da instancia a partir de variaveis de ambiente (idempotente)"

    def handle(self, *args, **options):
        email = os.environ.get("INSTANCE_ADMIN_EMAIL")
        password = os.environ.get("INSTANCE_ADMIN_PASSWORD")
        first_name = os.environ.get("INSTANCE_ADMIN_FIRST_NAME", "Apollo")
        last_name = os.environ.get("INSTANCE_ADMIN_LAST_NAME", "")
        company_name = os.environ.get("INSTANCE_ADMIN_COMPANY", "Apollo Solution")

        # Opcional por instancia: sem credenciais, nao faz nada (fluxo manual segue valido)
        if not email or not password:
            self.stdout.write("bootstrap_instance_admin: INSTANCE_ADMIN_EMAIL/PASSWORD ausentes, ignorando.")
            return

        email = email.strip().lower()

        instance = Instance.objects.first()
        if instance is None:
            self.stdout.write(
                self.style.WARNING("bootstrap_instance_admin: instancia nao registrada ainda, ignorando.")
            )
            return

        user = User.objects.filter(email=email).first()

        # Cria o usuario apenas se ainda nao existe (nunca sobrescreve a senha de um
        # usuario existente — evita surpresa se a env mudar depois).
        if user is None:
            results = zxcvbn(password)
            if results["score"] < 3:
                self.stdout.write(
                    self.style.ERROR(
                        "bootstrap_instance_admin: INSTANCE_ADMIN_PASSWORD fraca (zxcvbn < 3), admin NAO criado."
                    )
                )
                return

            user = User.objects.create(
                first_name=first_name,
                last_name=last_name,
                email=email,
                username=uuid.uuid4().hex,
                password=make_password(password),
                is_password_autoset=False,
            )
            user.is_active = True
            user.last_active = timezone.now()
            user.token_updated_at = timezone.now()
            user.save()
            Profile.objects.get_or_create(user=user, defaults={"company_name": company_name})
            self.stdout.write(self.style.SUCCESS(f"bootstrap_instance_admin: usuario admin criado ({email})."))
        else:
            Profile.objects.get_or_create(user=user, defaults={"company_name": company_name})

        # Registra como admin da instancia (idempotente via unique_together instance+user)
        _, created = InstanceAdmin.objects.get_or_create(user=user, instance=instance, role=20)

        # Fecha a janela de setup
        if not instance.is_setup_done:
            instance.is_setup_done = True
            instance.save(update_fields=["is_setup_done"])

        if created:
            self.stdout.write(self.style.SUCCESS(f"bootstrap_instance_admin: {email} agora e admin da instancia."))
        else:
            self.stdout.write(f"bootstrap_instance_admin: {email} ja era admin da instancia (no-op).")
