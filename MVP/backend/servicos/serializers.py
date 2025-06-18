from rest_framework import serializers
from produto.models import Produto
from servicos.models import Servico
from datetime import datetime, date

class ProdutoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Produto
        fields = ['id', 'nome', 'valor']

class ServicoSerializer(serializers.ModelSerializer):
    produtos = ProdutoSerializer(many=True, read_only=True)  
    produtos_ids = serializers.PrimaryKeyRelatedField(        
        source='produtos', queryset=Produto.objects.all(), many=True, write_only=True, required=False
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
        produtos = validated_data.pop('produtos', [])
        servico = Servico.objects.create(**validated_data)
        servico.produtos.set(produtos)
        return servico

    def update(self, instance, validated_data):
        produtos = validated_data.pop('produtos', None)

        instance.nome = validated_data.get('nome', instance.nome)
        instance.status_servico = validated_data.get('status_servico', instance.status_servico)
        instance.descricao_servico = validated_data.get('descricao_servico', instance.descricao_servico)

        if 'valor_servico' in validated_data:
            novo_valor = validated_data['valor_servico']
            if novo_valor != instance.valor_servico:
                instance.salvar_valor_servico(novo_valor)

                instance.valor_servico = novo_valor
                instance.data_modificacao_servico = datetime.now()
        
        if produtos is not None:
            instance.produtos.set(produtos)

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
            'produtos_ids'
        ]