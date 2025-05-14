from django.urls import path
from servicos.views.servico import Servicos, ServicoDetail

urlpatterns = [
    path('servicos', Servicos.as_view()),
    path('servicos/<int:servico_id>', ServicoDetail.as_view()),
]