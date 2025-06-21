from rest_framework import serializers
from .models import VendaProduto, VendaItem, VendaServicoItem, VendaServico, Produto, Cliente, Servico
from servicos.models import ProdutoServico
from produto.models import Estoque, MovimentacaoEstoque
from django.db import transaction
from decimal import Decimal

class ProdutoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Produto
        fields = ['id', 'nome', 'valor_compra']

class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = ['id', 'nome']

class ServicoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Servico
        fields = ['id', 'nome', 'valor_servico']

class ProdutoServicoSerializer(serializers.ModelSerializer):
    produto = ProdutoSerializer(read_only=True)

    class Meta:
        model = ProdutoServico
        fields = ['produto', 'quantidade_utilizada']

class VendaItemSerializer(serializers.ModelSerializer):
    produto = ProdutoSerializer(read_only=True)
    produto_id = serializers.PrimaryKeyRelatedField(queryset=Produto.objects.all(), source='produto', write_only=True)
    valor_unitario = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    valor_total_itens = serializers.DecimalField(max_digits=10, decimal_places=2)
    venda = serializers.PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model = VendaItem
        fields = '__all__'
class VendaProdutoSerializer(serializers.ModelSerializer):
    cliente = ClienteSerializer(read_only=True)
    cliente_id = serializers.PrimaryKeyRelatedField(queryset=Cliente.objects.all(), source='cliente', write_only=True)
    itens = serializers.SerializerMethodField(read_only=True)
    itens_data = VendaItemSerializer(many=True, write_only=True)
    valor_total = serializers.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        model = VendaProduto
        fields = '__all__'

    def get_itens(self, obj):
        return VendaItemSerializer(obj.itens.all(), many=True).data
    def create(self, validated_data):
        itens_data = validated_data.pop('itens_data')
        data_venda = validated_data.get('data_venda')
        if not data_venda:
            raise serializers.ValidationError("A data da venda é obrigatória.")
        
        with transaction.atomic():
            venda_produto = VendaProduto.objects.create(**validated_data)

            for item_data in itens_data:
                produto = item_data['produto']
                quantidade = item_data['quantidade']
                valor_total_item = item_data['valor_total_itens']

                estoque = produto.estoque
                valor_unitario = estoque.valor_produto_venda
                if estoque.quantidade_atual < quantidade:
                    raise serializers.ValidationError(
                        f"Estoque insuficiente para o produto '{produto.nome}'."
                    )

                estoque.quantidade_atual -= quantidade
                estoque.save()

                VendaItem.objects.create(
                    venda=venda_produto,
                    produto=produto,
                    quantidade=quantidade,
                    valor_unitario=valor_unitario,
                    valor_total_itens=valor_total_item
                )

                MovimentacaoEstoque.objects.create(
                    produto=produto,
                    tipo='venda',
                    quantidade=quantidade,
                    valor_unitario=valor_unitario,
                    data=data_venda
                )
        return venda_produto
    
class VendaServicoItemSerializer(serializers.ModelSerializer):
    servico = ServicoSerializer(read_only=True)
    servico_id = serializers.PrimaryKeyRelatedField(queryset=Servico.objects.all(), source='servico', write_only=True)
    valor_servico = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    valor_total_itens = serializers.DecimalField(max_digits=10, decimal_places=2
    )
    produtos_servico = serializers.SerializerMethodField()
    descricao = serializers.CharField(read_only=True)
    venda = serializers.PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model = VendaServicoItem
        fields = [
            'id',
            'servico',
            'servico_id',
            'descricao',
            'quantidade',
            'valor_total_itens',
            'valor_servico',  
            'produtos_servico',
            'venda'
        ]

    def get_produtos_servico(self, obj):
        produtos_servico_es = ProdutoServico.objects.filter(servico=obj.servico)
        return ProdutoServicoSerializer(produtos_servico_es, many=True).data

class VendaServicoSerializer(serializers.ModelSerializer):
    cliente = ClienteSerializer(read_only=True)
    cliente_id = serializers.PrimaryKeyRelatedField(queryset=Cliente.objects.all(), source='cliente', write_only=True)
    itens = serializers.SerializerMethodField(read_only=True)
    itens_data = VendaServicoItemSerializer(many=True, write_only=True)
    valor_total = serializers.DecimalField(max_digits=10, decimal_places=2)
    class Meta:
        model = VendaServico
        fields = '__all__'

    def get_itens(self, obj):
        return VendaServicoItemSerializer(obj.itens.all(), many=True).data

    def create(self, validated_data):
        itens_data = validated_data.pop('itens_data')
        data_venda = validated_data.get('data_venda')
        if not data_venda:
            raise serializers.ValidationError("A data da venda é obrigatória.")
        
        with transaction.atomic():
            venda_servico = VendaServico.objects.create(**validated_data)

            for item in itens_data:
                servico = item['servico']
                quantidade = item['quantidade']
                valor_total_item = item['valor_total_itens']
                valor_unitario = servico.valor_servico

                produtos_servico = ProdutoServico.objects.filter(servico=servico)
                for ps in produtos_servico:
                    estoque = ps.produto.estoque
                    total_utilizado = ps.quantidade_utilizada * quantidade
                    valor_estoque_unit = estoque.valor_produto_venda

                    if estoque.quantidade_atual < total_utilizado:
                        raise serializers.ValidationError(
                            f"Estoque insuficiente para o produto '{ps.produto.nome}' utilizado no serviço '{servico.nome}'."
                        )

                    estoque.quantidade_atual -= total_utilizado
                    estoque.save()

                    MovimentacaoEstoque.objects.create(
                        produto=ps.produto,
                        tipo='venda',
                        quantidade=total_utilizado,
                        valor_unitario=valor_estoque_unit,
                        data=data_venda
                    )

                VendaServicoItem.objects.create(
                    venda=venda_servico,
                    servico=servico,
                    quantidade=quantidade,
                    valor_servico=valor_unitario,
                    valor_total_itens=valor_total_item,
                    descricao=item.get('descricao', servico.descricao_servico or '')
                )
        return venda_servico