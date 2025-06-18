from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import APIException
from rest_framework.views import APIView
from produto.models import Estoque, Produto, MovimentacaoEstoque
from produto.serializers import EstoqueSerializer
from produto.serializers import MovimentacaoEstoqueSerializer

class Estoques(APIView):
    def get(self, request):
        estoques = Estoque.objects.all()
        serializer = EstoqueSerializer(estoques, many=True)
        return Response({"estoques": serializer.data, "success": True})

    def post(self, request):
        serializer = EstoqueSerializer(data=request.data)
        
        if serializer.is_valid():
            produto_id = request.data.get('produto_id')
            try:
                Produto.objects.get(id=produto_id)  
            except Produto.DoesNotExist:
                return Response({"success": False, "error": "Produto não encontrado."}, status=400)
        
            serializer.save()
            return Response({"success": True, "estoque": serializer.data}, status=201)
        return Response({"success": False, "errors": serializer.errors}, status=400)

class EstoqueDetail(APIView):
    def get(self, request, estoque_id):
        estoque = get_object_or_404(Estoque, id=estoque_id)
        serializer = EstoqueSerializer(estoque)
        return Response({"estoque": serializer.data})

    def put(self, request, estoque_id):
        estoque = get_object_or_404(Estoque, id=estoque_id)
        serializer = EstoqueSerializer(estoque, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"success": True, "estoque": serializer.data})
        return Response({"success": False, "errors": serializer.errors}, status=400)
    
class MovimentacoesEstoque(APIView):
    def get(self, request):
        movimentacoes = MovimentacaoEstoque.objects.all().order_by('-data')
        serializer = MovimentacaoEstoqueSerializer(movimentacoes, many=True)
        return Response({"movimentacoes": serializer.data, "success": True})