from rest_framework.response import Response
from rest_framework.exceptions import APIException
from produto.views.base import BaseView
from produto.serializers import ProdutoSerializer, EstoqueSerializer
from produto.models import Produto
class Produtos(BaseView):

    def get(self, request):
        produtos = Produto.objects.all()
        serializer = ProdutoSerializer(produtos, many=True)
        return Response({"produto": serializer.data})
    
    def post(self, request):
        data = request.data
        estoque_data = data.pop('estoque', None)
        serializer = ProdutoSerializer(data=data)
        if serializer.is_valid():
            produto = serializer.save()
            
            if estoque_data:
                estoque_data['produto_id'] = produto.id
                estoque_serializer = EstoqueSerializer(data=estoque_data)
                
                if estoque_serializer.is_valid():
                    estoque_serializer.save()
                    return Response({"success": True, **ProdutoSerializer(produto).data}, status=201)
                else:
                    return Response({"success": False, "errors": estoque_serializer.errors}, status=400)
            
            return Response({"success": True, **ProdutoSerializer(produto).data}, status=201)
        
        return Response({"success": False, "errors": serializer.errors}, status=400)

class ProdutoDetail(BaseView):

    def get(self, request, produto_id):
        produto = self.get_produto(produto_id)
        serializer = ProdutoSerializer(produto)
        return Response({"produto": serializer.data})
    
    def put(self, request, produto_id):
        produto = self.get_produto(produto_id)
        data = request.data.copy()
        serializer = ProdutoSerializer(produto, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"success": True})
        
        return Response({"success": False, "errors": serializer.errors}, status=400)

    def delete(self, request, produto_id):
        produto = self.get_produto(produto_id)
        produto.delete()
        return Response({"success": True, "message": f"Produto com ID {produto_id} foi excluído com sucesso."})
