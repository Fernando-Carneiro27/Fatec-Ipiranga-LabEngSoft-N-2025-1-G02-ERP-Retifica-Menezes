# Generated by Django 4.2.4 on 2025-05-30 19:23

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('servicos', '0002_alter_servico_descricao_servico'),
        ('vendas', '0004_vendaitem_descricao'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='vendaservico',
            name='servico',
        ),
        migrations.CreateModel(
            name='VendaServicoItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantidade', models.IntegerField(default=1)),
                ('valor_unitario', models.DecimalField(decimal_places=2, max_digits=10)),
                ('descricao', models.CharField(blank=True, max_length=100, null=True)),
                ('servico', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='servicos.servico')),
                ('venda', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='itens', to='vendas.vendaservico')),
            ],
        ),
    ]
