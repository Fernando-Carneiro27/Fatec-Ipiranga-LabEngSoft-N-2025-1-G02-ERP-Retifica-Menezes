from rest_framework import serializers
from produto.models import Produto, Estoque

class EstoqueSimplesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Estoque
        fields = ['id']

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

    class Meta:
        model = Estoque
        fields = [
            'id',
            'produto_id',
            'produto',    
            'quantidade_min',
            'quantidade_max',
            'quantidade_atual',
            'valor_produto_venda'
        ]

    def create(self, validated_data):
        produto = validated_data.pop('produto_id')
        return Estoque.objects.create(produto=produto, **validated_data)
