from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import APIException
from rest_framework.views import APIView
from servicos.models import Servico
from servicos.serializers import ServicoSerializer

class Servicos(APIView):
    def get(self, request):
        servicos = Servico.objects.all()
        serializer = ServicoSerializer(servicos, many=True)
        return Response({"servicos": serializer.data, "success": True})
    
    def post(self, request):
        serializer = ServicoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"success": True, "servico": serializer.data})
        return Response({"success": False, "errors": serializer.errors})
    
class ServicoDetail(APIView):
    def get(self, request, servico_id):
        servico = get_object_or_404(Servico, id=servico_id)
        serializer = ServicoSerializer(servico)
        return Response({"servico": serializer.data, "success": True})
    
    def put(self, request, servico_id):
        servico = get_object_or_404(Servico, id=servico_id)
        serializer = ServicoSerializer(servico, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"success": True, "servico": serializer.data})
        return Response({"success": False, "errors": serializer.errors})

    def delete(self, request, servico_id):
        servico = get_object_or_404(Servico, id=servico_id)
        servico.delete()
        return Response({"success": True, "message": "Serviço deletado com êxito."})