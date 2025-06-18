from rest_framework import serializers
from produto.models import Produto, Estoque, MovimentacaoEstoque
from datetime import datetime, time, date

class EstoqueSimplesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Estoque
        fields = ['id', 'valor_produto_venda', 'quantidade_atual']

class ProdutoSerializer(serializers.ModelSerializer):
    estoque = EstoqueSimplesSerializer(read_only=True)

    def validate_valor_compra(self, value):
        if value <= 0:
            raise serializers.ValidationError("O preço do produto tem que ser maior que zero.")
        return value
    
    def create(self, validated_data):
        return Produto.objects.create(**validated_data)
    
    def update(self, instance, validated_data):
        instance.nome = validated_data.get('nome', instance.nome)
        novo_valor = validated_data.get('valor_compra')
        if novo_valor is not None and novo_valor > 0:
            instance.valor_compra = novo_valor
        instance.descricao = validated_data.get('descricao', instance.descricao)
        instance.save()

        return instance
    
    class Meta: 
        model = Produto
        fields = ['id', 'nome', 'valor_compra', 'descricao', 'estoque']
        
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

        nova_qtd = validated_data.pop("quantidade_atual", None)
        if nova_qtd is not None:
            instance.quantidade_atual += nova_qtd

            data_atualizacao = datetime.now()

            produto = instance.produto
            produto.data_modificacao_compra = data_atualizacao
            produto.save()

            MovimentacaoEstoque.objects.create(
                produto=instance.produto,
                tipo='compra',
                quantidade=nova_qtd,
                valor_unitario=produto.valor_compra,
                data=data_atualizacao
            )

        novo_valor_venda = validated_data.pop('valor_produto_venda', None)
        if novo_valor_venda is not None and novo_valor_venda > 0:
            if instance.valor_produto_venda != novo_valor_venda:
                if instance.historico_valor_venda is None:
                    instance.historico_valor_venda = []
                if instance.historico_data_modificacao is None:
                    instance.historico_data_modificacao = []

                agora = datetime.now()
                agora_iso = agora.isoformat()

                instance.historico_valor_venda.append(instance.valor_produto_venda)
                instance.historico_data_modificacao.append(agora_iso)
                instance.data_modificacao_produto = agora

            instance.valor_produto_venda = novo_valor_venda

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.historico_data_modificacao = [
            d.isoformat() if isinstance(d, datetime) else d
            for d in instance.historico_data_modificacao
        ]

        instance.save()
        return instance
    
    def validate_estoque(self, value):
        if value < 0:
            raise serializers.ValidationError("O estoque tem que ser maior que zero.")
        return value
        
# MovimentacaoEstoque
class MovimentacaoEstoqueSerializer(serializers.ModelSerializer):
    produto = serializers.StringRelatedField()
    produto_id = serializers.PrimaryKeyRelatedField(source='produto', read_only=True)
    data = serializers.DateTimeField(format="%d/%m/%Y", read_only=True)

    class Meta:
        model = MovimentacaoEstoque
        fields = [
            'id',
            'produto',
            'produto_id',
            'tipo',
            'quantidade',
            'valor_unitario',
            'data',  
        ]