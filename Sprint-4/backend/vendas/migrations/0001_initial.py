# Generated by Django 4.2.4 on 2025-05-21 01:17

import datetime
from decimal import Decimal
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('servicos', '0001_initial'),
        ('clientes', '0001_initial'),
        ('produto', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='VendaServico',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('data_venda', models.DateTimeField(default=datetime.datetime.now)),
                ('data_entrega', models.DateField(blank=True, null=True)),
                ('data_pagamento', models.DateField(blank=True, null=True)),
                ('forma_pagamento', models.CharField(choices=[('DINHEIRO', 'Dinheiro'), ('CARTAO', 'Cartão'), ('PIX', 'PIX')], max_length=20)),
                ('situacao_venda', models.CharField(choices=[('PENDENTE', 'Pendente'), ('CONCLUIDA', 'Concluída'), ('CANCELADA', 'Cancelada')], max_length=20)),
                ('status_pagamento', models.CharField(choices=[('PENDENTE', 'Pendente'), ('PAGO', 'Pago')], max_length=20)),
                ('observacao', models.CharField(blank=True, max_length=100)),
                ('detalhes_pagamento', models.CharField(blank=True, max_length=50)),
                ('valor_total', models.DecimalField(decimal_places=2, default=Decimal('0.00'), max_digits=10)),
                ('cliente', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='vendas_servico', to='clientes.cliente')),
                ('servico', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='vendas', to='servicos.servico')),
            ],
        ),
        migrations.CreateModel(
            name='VendaProduto',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('data_venda', models.DateTimeField(default=datetime.datetime.now)),
                ('data_entrega', models.DateField(blank=True, null=True)),
                ('data_pagamento', models.DateField(blank=True, null=True)),
                ('forma_pagamento', models.CharField(choices=[('DINHEIRO', 'Dinheiro'), ('CARTAO', 'Cartão'), ('PIX', 'PIX')], max_length=20)),
                ('situacao_venda', models.CharField(choices=[('PENDENTE', 'Pendente'), ('CONCLUIDA', 'Concluída'), ('CANCELADA', 'Cancelada')], max_length=20)),
                ('status_pagamento', models.CharField(choices=[('PENDENTE', 'Pendente'), ('PAGO', 'Pago')], max_length=20)),
                ('observacao', models.CharField(blank=True, max_length=100)),
                ('detalhes_pagamento', models.CharField(blank=True, max_length=50)),
                ('quantidade', models.IntegerField(default=1)),
                ('valor_total', models.FloatField()),
                ('cliente', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='vendas_produto', to='clientes.cliente')),
                ('produto', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='vendas', to='produto.produto')),
            ],
        ),
    ]
