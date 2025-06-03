from rest_framework.views import APIView
from rest_framework.exceptions import APIException
from clientes.models import Cliente

class BaseView(APIView):

    class NotFoundException(APIException):
        status_code = 404
        default_detail = "A requisição solicitada não foi encontrada."
        default_code = "not_found"

    def get_cliente(self, cliente_id):
      
        try:
            return Cliente.objects.get(id=cliente_id)
        except Cliente.DoesNotExist:
            raise self.NotFoundException(detail="Cliente não encontrado.")