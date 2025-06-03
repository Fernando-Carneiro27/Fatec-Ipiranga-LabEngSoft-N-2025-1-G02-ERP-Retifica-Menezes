from django.urls import path
from produto.views.produto import Produtos, ProdutoDetail
from produto.views.estoque import Estoques, EstoqueDetail

urlpatterns = [
    # Rotas de Produto
    path('produtos', Produtos.as_view()),
    path('produtos/<int:produto_id>', ProdutoDetail.as_view()),

    # Rotas de Estoque
    path('estoques', Estoques.as_view()),
    path('estoques/<int:estoque_id>', EstoqueDetail.as_view()),
]
