# Generated by Django 4.2.4 on 2025-05-07 00:12

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('servicos', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='servico',
            old_name='nome_servico',
            new_name='nome',
        ),
        migrations.AddField(
            model_name='servico',
            name='data_modificacao_servico',
            field=models.DateTimeField(default=datetime.datetime.now),
        ),
        migrations.AddField(
            model_name='servico',
            name='historico_data_modificacao',
            field=models.JSONField(blank=True, default=list),
        ),
        migrations.AddField(
            model_name='servico',
            name='historico_valor_servico',
            field=models.JSONField(blank=True, default=list),
        ),
        migrations.DeleteModel(
            name='ServicoValores',
        ),
    ]
