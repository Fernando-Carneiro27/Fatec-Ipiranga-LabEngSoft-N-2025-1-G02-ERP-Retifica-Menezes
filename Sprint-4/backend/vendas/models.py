from django.db import models
from produto.models import Estoque
from clientes.models import Cliente
from produto.models import Produto
from servicos.models import Servico
from datetime import datetime
from decimal import Decimal

class VendaProduto(models.Model):
    cliente = models.ForeignKey(Cliente, on_delete=models.PROTECT, related_name="vendas")
    data_venda = models.DateTimeField(default=datetime.now)
    data_entrega = models.DateField(null=True, blank=True)
    data_pagamento = models.DateField(null=True, blank=True)
    forma_pagamento = models.CharField(max_length=20)
    situacao_venda = models.CharField(max_length=20)
    status_pagamento = models.CharField(max_length=20)
    detalhes_pagamento = models.CharField(max_length=50, blank=True)
    valor_total = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))

    def __str__(self):
        return f"Venda para {self.cliente.nome}"

class VendaItem(models.Model):
    venda = models.ForeignKey(VendaProduto, on_delete=models.CASCADE, related_name="itens")
    produto = models.ForeignKey(Produto, on_delete=models.PROTECT)
    quantidade = models.IntegerField(default=1)
    valor_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    descricao = models.CharField(max_length=100, blank=True, null=True)
    
    def save(self, *args, **kwargs):
        if not self.valor_unitario and self.produto:
            try:
                self.valor_unitario = self.produto.estoque.valor_produto_venda
            except Estoque.DoesNotExist:
                raise ValueError("Produto não possui estoque cadastrado.")
        if not self.descricao and self.produto:
            self.descricao = self.produto.descricao
        super().save(*args, **kwargs) 
        
    def __str__(self):
        return f"{self.quantidade} x {self.produto.nome}"

class VendaServico(models.Model):
    cliente = models.ForeignKey(Cliente, on_delete=models.PROTECT, related_name="vendas_cliente_servico")
    data_venda = models.DateTimeField(default=datetime.now)
    data_entrega = models.DateField(null=True, blank=True)
    data_pagamento = models.DateField(null=True, blank=True)
    forma_pagamento = models.CharField(max_length=20)
    situacao_venda = models.CharField(max_length=20)
    status_pagamento = models.CharField(max_length=20)
    detalhes_pagamento = models.CharField(max_length=50, blank=True, null=True)
    valor_total = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))

    def __str__(self):
        return f"Venda de serviço para {self.cliente.nome}"

class VendaServicoItem(models.Model):
    venda = models.ForeignKey(VendaServico, on_delete=models.CASCADE, related_name="itens")
    servico = models.ForeignKey(Servico, on_delete=models.PROTECT)
    quantidade = models.IntegerField(default=1)
    valor_servico = models.DecimalField(max_digits=10, decimal_places=2)
    descricao = models.CharField(max_length=100, blank=True, null=True)

    def save(self, *args, **kwargs):
        if not self.valor_servico and self.servico:
            self.valor_servico = self.servico.valor_servico
        
        if not self.descricao and self.servico:
            self.descricao = self.servico.descricao_servico
        
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.quantidade} x {self.servico.nome}"