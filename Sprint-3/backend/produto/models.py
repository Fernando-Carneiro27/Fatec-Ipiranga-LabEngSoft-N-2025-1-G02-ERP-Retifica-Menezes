from django.db import models, transaction
from datetime import date, datetime

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
    data_modificacao_produto = models.DateTimeField(default=datetime.now)
    historico_valor_venda = models.JSONField(default=list, blank=True)
    historico_data_modificacao = models.JSONField(default=list, blank=True)

    def __str__(self):
        return f"Estoque de {self.produto.nome}"

    def notificar_estoque(self):
        if self.quantidade_atual < self.quantidade_min:
            return f"Estoque baixo para {self.produto.nome}!"
        elif self.quantidade_atual > self.quantidade_max:
            return f"Estoque acima do limite máximo para {self.produto.nome}!"
        return "Estoque ok"
    
    from django.utils import timezone

    def salvar_valor_venda(self, novo_valor_venda):
        try:
            if novo_valor_venda != self.valor_produto_venda:
                with transaction.atomic():
                    
                    self.historico_valor_venda.append(self.valor_produto_venda)
                    self.historico_data_modificacao.append(self.data_modificacao_produto.isoformat()) 
                    
                    self.valor_produto_venda = novo_valor_venda
                    self.data_modificacao_produto = datetime.now()  

                    self.save()
        except Exception as e:
            print(f"Erro ao atualizar o histórico: {e}")
            raise e