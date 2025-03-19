from rest_framework import serializers
from clientes.models import Cliente

class ClienteSerializer(serializers.ModelSerializer):
    observacao = serializers.CharField(required=False, allow_blank=True, allow_null=True, default='')

    class Meta:
        model = Cliente 
        fields = (
            'nome', 
            'cpf_cnpj', 
            'email', 
            'telefone', 
            'tipo', 
            'bairro', 
            'cep', 
            'endereco', 
            'status_cliente',
            'observacao'
        )

        def create(self, validated_data):
            return Cliente.objects.create(**validated_data)
        
        def update(self, instance, validated_data):
            instance.nome = validated_data.get('nome', instance.nome)
            instance.cpf_cnpj = validated_data.get('cpf_cnpj', instance.cpf_cnpj)
            instance.email = validated_data.get('email', instance.email)
            instance.telefone = validated_data.get('telefone', instance.telefone)
            instance.cep = validated_data.get('cep', instance.cep)
            instance.endereco = validated_data.get('endereco', instance.endereco)
            instance.bairro = validated_data.get('bairro', instance.bairro)
            instance.tipo = validated_data.get('tipo', instance.tipo)
            instance.status = validated_data.get('status', instance.status) 
            instance.observacao = validated_data.get('observacao', instance.observacao)

            instance.save()

            return instance
            