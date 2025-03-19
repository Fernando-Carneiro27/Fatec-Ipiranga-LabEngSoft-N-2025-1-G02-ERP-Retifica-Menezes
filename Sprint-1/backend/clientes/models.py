from django.db import models
from django.core.validators import RegexValidator

class Cliente(models.Model):
    nome = models.CharField(max_length=80) 
    cpf_cnpj = models.CharField(
        max_length=14,  
        unique=True,  
    )  
    email = models.CharField(max_length=80)  
    telefone = models.CharField(max_length=15) 
    tipo = models.CharField(max_length=30)  
    bairro = models.CharField(max_length=50)  
    cep = models.CharField(max_length=10)  
    endereco = models.CharField(max_length=50)  
    status_cliente = models.CharField(max_length=20) 
    observacao = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.nome   