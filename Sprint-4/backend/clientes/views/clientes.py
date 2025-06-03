from rest_framework.response import Response
from rest_framework.exceptions import APIException
from clientes.views.base import BaseView
from clientes.serializers import ClienteSerializer
from clientes.models import Cliente

class Clientes(BaseView):

    def get(self, request):
        clientes = Cliente.objects.all()
        serializer = ClienteSerializer(clientes, many=True)
        return Response({"clientes": serializer.data})

    def post(self, request):
        data = request.data
        serializer = ClienteSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({"success": True})
        
        return Response({"success": False, "errors": serializer.errors}, status=400)
        
class ClienteDetail(BaseView):

    def get(self, request, cliente_id):
        cliente = self.get_cliente(cliente_id)
        serializer = ClienteSerializer(cliente)
        return Response({"cliente": serializer.data})

    def put(self, request, cliente_id):
        cliente = self.get_cliente(cliente_id)
        data = request.data.copy()
        serializer = ClienteSerializer(cliente, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"success": True})
        
        return Response({"success": False, "errors": serializer.errors}, status=400)

    def delete(self, request, cliente_id):
        cliente = self.get_cliente(cliente_id)
        cliente.delete()
        return Response({"success": True, "message": f"Cliente com ID {cliente_id} foi excluído com sucesso."})