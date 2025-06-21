from rest_framework import serializers
from produto.models import Produto
from servicos.models import Servico, ProdutoServico
from datetime import datetime
from django.db import transaction

class ProdutoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Produto
        fields = ['id', 'nome', 'valor_compra']
    
class ProdutoServicoSerializer(serializers.ModelSerializer):
    produto_id = serializers.PrimaryKeyRelatedField(queryset=Produto.objects.all(), source='produto')
    nome = serializers.CharField(source='produto.nome', read_only=True)
    valor_compra = serializers.FloatField(source='produto.valor_compra', read_only=True)
    quantidade_utilizada = serializers.IntegerField()

    class Meta:
        model = ProdutoServico
        fields = ['produto_id', 'nome', 'valor_compra', 'quantidade_utilizada']

class ServicoSerializer(serializers.ModelSerializer):
    produtos = ProdutoSerializer(many=True, read_only=True)  
    itens = ProdutoServicoSerializer(many=True, write_only=True)
    itens_detalhados = ProdutoServicoSerializer(
        many=True,
        read_only=True,
        source='itens'
    )
    historico_data_modificacao = serializers.ListField(
        child=serializers.DateTimeField(format="%Y-%m-%dT%H:%M:%S"),
        required=False
    )
    data_modificacao_servico = serializers.DateTimeField(format="%Y-%m-%dT%H:%M:%S", read_only=True)
    def validate_valor_servico(self, value):
        if value <= 0:
            raise serializers.ValidationError("O preço do serviço tem que ser maior que zero.")
        return value

    def create(self, validated_data):
        itens_data = validated_data.pop('itens', [])
        servico = Servico.objects.create(**validated_data)
        for item in itens_data:
            ProdutoServico.objects.create(
                servico=servico,
                produto=item['produto'],
                quantidade_utilizada=item['quantidade_utilizada'],
            )
        return servico

    def update(self, instance, validated_data):
        itens_data = validated_data.pop('itens', None)

        instance.nome = validated_data.get('nome', instance.nome)
        instance.status_servico = validated_data.get(
            'status_servico', instance.status_servico
        )
        instance.descricao_servico = validated_data.get(
            'descricao_servico', instance.descricao_servico
        )

        if 'valor_servico' in validated_data:
            novo_valor = validated_data['valor_servico']
            if novo_valor != instance.valor_servico:
                instance.salvar_valor_servico(novo_valor)
                instance.valor_servico = novo_valor
                instance.data_modificacao_servico = datetime.now()

        if itens_data is not None:
            with transaction.atomic():
                instance.itens.all().delete()
                bulk_objs = [
                    ProdutoServico(
                        servico=instance,
                        produto=item['produto'],
                        quantidade_utilizada=item['quantidade_utilizada'],
                    )
                    for item in itens_data
                ]
                ProdutoServico.objects.bulk_create(bulk_objs)

        instance.save()
        return instance

    class Meta:
        model = Servico
        fields = [
            'id',
            'nome',
            'valor_servico',
            'status_servico',
            'descricao_servico',
            'data_modificacao_servico',
            'historico_valor_servico',
            'historico_data_modificacao',
            'produtos',            
            'itens',              
            'itens_detalhados'
        ]