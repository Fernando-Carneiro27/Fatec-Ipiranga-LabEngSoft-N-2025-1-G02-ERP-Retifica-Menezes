from rest_framework import serializers
from produto.models import Produto, Estoque
from datetime import datetime, time, date

class EstoqueSimplesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Estoque
        fields = ['id', 'valor_produto_venda']

class ProdutoSerializer(serializers.ModelSerializer):
    estoque = EstoqueSimplesSerializer(read_only=True)

    def validate_valor(self, value):
        if value <= 0:
            raise serializers.ValidationError("O preço do produto tem que ser maior que zero.")
        return value
    
    def validate_estoque(self, value):
        if value < 0:
            raise serializers.ValidationError("O estoque tem que ser maior que zero.")
        return value
    
    def create(self, validated_data):
        return Produto.objects.create(**validated_data)
    
    def update(self, instance, validated_data):
        instance.nome = validated_data.get('nome', instance.nome)
        instance.valor = validated_data.get('valor', instance.valor)
        instance.descricao = validated_data.get('descricao', instance.descricao)
        instance.save()

        return instance
    
    class Meta: 
        model = Produto
        fields = ['id', 'nome', 'valor', 'descricao', 'estoque']
        
# Estoque    
class EstoqueSerializer(serializers.ModelSerializer):
    produto_id = serializers.PrimaryKeyRelatedField(
        queryset=Produto.objects.all(),
        write_only=True
    )
    produto = ProdutoSerializer(read_only=True) 

    historico_data_modificacao = serializers.ListField(
        child=serializers.DateTimeField(format="%Y-%m-%dT%H:%M:%S"),
        required=False
    )
    data_modificacao_produto = serializers.DateTimeField(format="%Y-%m-%dT%H:%M:%S", read_only=True)

    class Meta:
        model = Estoque
        fields = [
            'id',
            'produto_id',
            'produto',    
            'quantidade_min',
            'quantidade_max',
            'quantidade_atual',
            'valor_produto_venda', 
            'data_modificacao_produto',
            'historico_valor_venda',
            'historico_data_modificacao',
        ]

    def create(self, validated_data):
        produto = validated_data.pop('produto_id')
        data_modificacao = validated_data.get('data_modificacao_produto', datetime.now())

        if isinstance(data_modificacao, date) and not isinstance(data_modificacao, datetime):
            data_modificacao = datetime.combine(data_modificacao, time.min)

        data_modificacao_iso = data_modificacao.isoformat()

        estoque = Estoque.objects.create(
            produto=produto,
            data_modificacao_produto=data_modificacao,
            **validated_data
        )
        estoque.historico_valor_venda.append(estoque.valor_produto_venda)
        estoque.historico_data_modificacao.append(data_modificacao_iso)
        estoque.save()

        return estoque
    
    def update(self, instance, validated_data):
        produto = validated_data.pop('produto_id', None)
        if produto:
            instance.produto = produto

        valor_antigo = instance.valor_produto_venda

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if 'valor_produto_venda' in validated_data and valor_antigo != validated_data['valor_produto_venda']:
            if instance.historico_valor_venda is None:
                instance.historico_valor_venda = []
            if instance.historico_data_modificacao is None:
                instance.historico_data_modificacao = []

            agora = datetime.now()  
            agora_iso = agora.isoformat()
            instance.historico_valor_venda.append(valor_antigo)
            instance.historico_data_modificacao.append(agora_iso)  
            instance.data_modificacao_produto = agora

        instance.historico_data_modificacao = [
            d.isoformat() if isinstance(d, datetime) else d
            for d in instance.historico_data_modificacao
    ]   

        instance.save()
        return instance