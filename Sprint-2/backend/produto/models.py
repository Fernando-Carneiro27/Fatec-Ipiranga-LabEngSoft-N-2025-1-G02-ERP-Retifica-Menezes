from django.db import models
from datetime import date

class Produto(models.Model):
    nome = models.CharField(max_length=100)
    descricao = models.CharField(max_length=100)
    valor = models.FloatField()
    data_modificacao_compra = models.DateField()

    def save(self, *args, **kwargs):
        if not self.data_modificacao_compra:
            self.data_modificacao_compra = date.today()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.nome

class Estoque(models.Model):
    produto = models.OneToOneField(Produto, on_delete=models.CASCADE, related_name='estoque')
    quantidade_min = models.IntegerField()
    quantidade_max = models.IntegerField()
    quantidade_atual = models.IntegerField()
    valor_produto_venda = models.FloatField()
    data_modificacao_produto = models.DateField(default=date.today)

    def __str__(self):
        return f"Estoque de {self.produto.nome}"

    def notificar_estoque(self):
        if self.quantidade_atual < self.quantidade_min:
            return f"Estoque baixo para {self.produto.nome}!"
        return "Estoque ok"