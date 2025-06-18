from django.urls import path
from clientes.views.clientes  import Clientes, ClienteDetail

urlpatterns = [
    path('clientes', Clientes.as_view()),
    path('clientes/<int:cliente_id>', ClienteDetail.as_view()),
]
