from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import APIException
from rest_framework.views import APIView
from produto.models import Estoque, Produto
from produto.serializers import EstoqueSerializer

class Estoques(APIView):
    def get(self, request):
        estoques = Estoque.objects.all()
        serializer = EstoqueSerializer(estoques, many=True)
        return Response({"estoques": serializer.data, "success": True})

    def post(self, request):
        serializer = EstoqueSerializer(data=request.data)
        
        if serializer.is_valid():
            produto_id = request.data.get('produto_id')
            if produto_id and not Produto.objects.filter(id=produto_id).exists():
                return Response({"success": False, "errors": "Produto não encontrado."}, status=400)
            
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