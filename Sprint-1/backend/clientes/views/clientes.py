from rest_framework.response import Response
from rest_framework.exceptions import APIException
from clientes.views.base import BaseView
from clientes.serializers import ClienteSerializer
from clientes.models import Cliente

class Clientes(BaseView):

    def get(self, request):
        clientes = Cliente.objects.all()

        serializer = ClienteSerializer(clientes, many=True)

        return Response(serializer.data)

    def post(self, request):
        serializer = ClienteSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response({"success": True})
        
        return Response({"success": False, "errors": serializer.errors})


class ClienteDetail(BaseView):

    def get(self, request, cliente_id):
        cliente = self.get_cliente(cliente_id)

        serializer = ClienteSerializer(cliente)

        return Response(serializer.data)

    def put(self, request, cliente_id):
        cliente = self.get_cliente(cliente_id)

        data = request.data.copy()

        novo_email = data.get('email')
        if novo_email and novo_email != cliente.email:
            if Cliente.objects.filter(email=novo_email).exclude(id=cliente_id).exists():
                raise APIException("Esse email já está em uso", code="email_already_use")
            
        novo_cpf_cnpj = data.get('cpf_cnpj')
        if novo_cpf_cnpj and novo_cpf_cnpj != cliente.cpf_cnpj:
            if Cliente.objects.filter(cpf_cnpj=novo_cpf_cnpj).exclude(id=cliente_id).exists():
                raise APIException("Esse CPF/CNPJ já está em uso", code="cpf_already_use")

        serializer = ClienteSerializer(cliente, data=data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response({"success": True})
        
        return Response(serializer.errors)

    def delete(self, request, cliente_id):
        cliente = self.get_cliente(cliente_id)

        cliente.delete()

        return Response({"success": True})