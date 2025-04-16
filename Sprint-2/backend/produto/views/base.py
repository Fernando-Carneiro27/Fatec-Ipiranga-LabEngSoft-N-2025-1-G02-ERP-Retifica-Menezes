from rest_framework.views import APIView
from rest_framework.exceptions import APIException
from produto.models import Produto

class BaseView(APIView):
    
        class NotFoundException(APIException):
            status_code = 404
            default_detail = "A requisição solicitada não foi encontrada."
            default_code = "not_found"
    
        def get_produto(self, produto_id):
            try:
                return Produto.objects.get(id=produto_id)
            except Produto.DoesNotExist:
                raise self.NotFoundException(detail="Produto não encontrado.")