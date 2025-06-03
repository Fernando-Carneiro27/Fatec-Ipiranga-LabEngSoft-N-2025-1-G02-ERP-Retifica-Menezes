from django.urls import path
from vendas.views.venda_servico import VendasServico, VendaServicoDetail
from vendas.views.venda_produto import VendasProduto, VendaProdutoDetail

urlpatterns = [
    path('vendas/servicos', VendasServico.as_view()),
    path('vendas/servicos/<int:venda_servico_id>', VendaServicoDetail.as_view()),
    path('vendas/produtos', VendasProduto.as_view()),
    path('vendas/produtos/<int:venda_produto_id>', VendaProdutoDetail.as_view()),
]