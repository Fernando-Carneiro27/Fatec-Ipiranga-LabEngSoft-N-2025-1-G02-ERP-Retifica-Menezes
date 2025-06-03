from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import APIException
from rest_framework.views import APIView
from vendas.models import VendaProduto
from vendas.serializers import VendaProdutoSerializer
from django.db import transaction

class VendasProduto(APIView):
    def get(self, request):
        vendas = VendaProduto.objects.all()
        serializer = VendaProdutoSerializer(vendas, many=True)
        return Response({"vendas_produto": serializer.data, "success":True})
    
    @transaction.atomic
    def post(self, request):
        serializer = VendaProdutoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"success": True, "venda_produto": serializer.data})
        return Response({"success": False, "errors": serializer.errors})
    
class VendaProdutoDetail(APIView):
    def get(self, request, venda_produto_id):
        venda_produto = get_object_or_404(VendaProduto, id=venda_produto_id)
        serializer = VendaProdutoSerializer(venda_produto)
        return Response({"venda_produto": serializer.data, "success": True})
    
    @transaction.atomic
    def put(self, request, venda_produto_id):
        venda_produto = get_object_or_404(VendaProduto, id=venda_produto_id)
        serializer = VendaProdutoSerializer(venda_produto, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"success": True, "venda_produto": serializer.data})
        return Response({"success": False, "errors": serializer.errors})
    
    @transaction.atomic
    def delete(self, request, venda_produto_id):
        venda_produto = get_object_or_404(VendaProduto, id=venda_produto_id)
        venda_produto.delete()
        return Response({"success": True, "message": "Venda de produto deletada com êxito."})