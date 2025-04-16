from rest_framework import serializers
from clientes.models import Cliente

class ClienteSerializer(serializers.ModelSerializer):
    observacao = serializers.CharField(required=False, allow_blank=True, allow_null=True, default='')
    cpf_cnpj = serializers.CharField(
        max_length=14,
        error_messages={
            'max_length': 'O CPF/CNPJ deve ter no máximo 14 caracteres.',
            'min_length': 'O CPF/CNPJ deve ter no mínimo 11 caracteres.'
        }
    )

    class Meta:
        model = Cliente 
        fields = '__all__' 

    def validate_email(self, value):
        cliente_id = self.instance.id if self.instance else None
        if Cliente.objects.filter(email=value).exclude(id=cliente_id).exists():
            raise serializers.ValidationError("Esse email já está em uso.")
        return value

    def validate_cpf_cnpj(self, value):
        if len(value) not in [11, 14]:
            raise serializers.ValidationError("O CPF/CNPJ deve conter exatamente 11 ou 14 caracteres.")

        cliente_id = self.instance.id if self.instance else None
        if Cliente.objects.filter(cpf_cnpj=value).exclude(id=cliente_id).exists():
            raise serializers.ValidationError("Esse CPF/CNPJ já está em uso.")
        return value

    def validate_telefone(self, value):
        cliente_id = self.instance.id if self.instance else None
        if Cliente.objects.filter(telefone=value).exclude(id=cliente_id).exists():
            raise serializers.ValidationError("Esse telefone já está em uso.")
        return value

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
            