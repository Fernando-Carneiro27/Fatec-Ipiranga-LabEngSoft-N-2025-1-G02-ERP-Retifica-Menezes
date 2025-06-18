from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import APIException
from rest_framework.views import APIView
from vendas.models import VendaServico
from vendas.serializers import VendaServicoSerializer
from django.db import transaction

class VendasServico(APIView):
    def get(self, request):
        vendas = VendaServico.objects.all()
        serializer = VendaServicoSerializer(vendas, many=True)
        return Response({"vendas_servico": serializer.data, "success":True})
    
    @transaction.atomic
    def post(self, request):
        serializer = VendaServicoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"success": True, "venda_servico": serializer.data})
        return Response({"success": False, "errors": serializer.errors})
    
class VendaServicoDetail(APIView):
    def get(self, request, venda_servico_id):
        venda_servico = get_object_or_404(VendaServico, id=venda_servico_id)
        serializer = VendaServicoSerializer(venda_servico)
        return Response({"venda_servico": serializer.data, "success": True})
    
    @transaction.atomic
    def put(self, request, venda_servico_id):
        venda_servico = get_object_or_404(VendaServico, id=venda_servico_id)
        serializer = VendaServicoSerializer(venda_servico, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"success": True, "venda_servico": serializer.data})
        return Response({"success": False, "errors": serializer.errors})
    
    @transaction.atomic
    def delete(self, request, venda_servico_id):
        venda_servico = get_object_or_404(VendaServico, id=venda_servico_id)
        venda_servico.delete()
        return Response({"success": True, "message": "Venda de serviço deletada com êxito."})