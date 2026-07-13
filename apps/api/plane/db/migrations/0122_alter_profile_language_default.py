# ApolloFlow: idioma padrão do perfil = pt-BR (novos usuários).
# Usuários existentes não são alterados (default só vale na criação).

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("db", "0121_alter_estimate_type"),
    ]

    operations = [
        migrations.AlterField(
            model_name="profile",
            name="language",
            field=models.CharField(default="pt-BR", max_length=255),
        ),
    ]
