from django.db import models, transaction
from datetime import datetime
from produto.models import Produto

class Servico(models.Model):
    nome = models.CharField(max_length=50)
    valor_servico = models.FloatField()
    status_servico = models.CharField(max_length=12, choices=[ ('ativo', 'Ativo'), ('desativado', 'Desativado'), ], default='ativo')
    descricao_servico = models.CharField(max_length=100)
    data_modificacao_servico = models.DateTimeField(default=datetime.now)
    historico_valor_servico = models.JSONField(default=list, blank=True)
    historico_data_modificacao = models.JSONField(default=list, blank=True)
    produtos = models.ManyToManyField(Produto, related_name='servicos_utilizados')
    
    def __str__(self):
        return self.nome

    def salvar_valor_servico(self, novo_valor_servico):
        try:
            if novo_valor_servico != self.valor_servico:
                with transaction.atomic():
                    agora = datetime.now()
                    self.historico_valor_servico.append(self.valor_servico)
                    self.historico_data_modificacao.append(agora.isoformat()) 
                    
                    self.valor_servico = novo_valor_servico
                    self.data_modificacao_servico = agora
                    self.save()
        except Exception as e:
            print(f"Erro ao atualizar o histórico: {e}")
            raise e