from datetime import datetime, date, timedelta
from decimal import Decimal
from clientes.models import Cliente
from produto.models import Produto, Estoque, MovimentacaoEstoque
from servicos.models import Servico, ProdutoServico
from vendas.models import VendaProduto, VendaItem, VendaServico, VendaServicoItem

# Criar clientes
clientes = []
for i in range(1, 6):
    cliente, _ = Cliente.objects.get_or_create(
        cpf_cnpj=f"0000000000{i}",
        defaults={
            "nome": f"Cliente {i}",
            "email": f"cliente{i}@teste.com",
            "telefone": f"1199999000{i}",
            "tipo": "Pessoa Física" if i % 2 == 0 else "Pessoa Jurídica",
            "bairro": "Centro",
            "cep": "01000-000",
            "endereco": f"Rua Teste {i}, 123",
            "status_cliente": "Ativo",
            "observacao": ""
        }
    )
    clientes.append(cliente)

# Criar produtos e estoques
produtos = []
for i in range(1, 6):
    produto, _ = Produto.objects.get_or_create(
        nome=f"Produto {i}",
        defaults={
            "descricao": f"Descrição do produto {i}",
            "valor_compra": 10.0 * i,
            "data_modificacao_compra": date.today() - timedelta(days=i)
        }
    )
    produtos.append(produto)

    Estoque.objects.get_or_create(
        produto=produto,
        defaults={
            "quantidade_min": 5,
            "quantidade_max": 50,
            "quantidade_atual": 20 + i,
            "valor_produto_venda": 15.0 * i,
            "data_modificacao_produto": datetime.now(),
            "historico_valor_venda": [],
            "historico_data_modificacao": []
        }
    )

# Criar serviços
servicos = []
for i in range(1, 6):
    servico, _ = Servico.objects.get_or_create(
        nome=f"Serviço {i}",
        defaults={
            "valor_servico": 100.0 + i * 10,
            "status_servico": "ativo",
            "descricao_servico": f"Descrição do serviço {i}",
            "data_modificacao_servico": datetime.now(),
            "historico_valor_servico": [],
            "historico_data_modificacao": []
        }
    )
    servicos.append(servico)

    # Associar um produto aleatório a cada serviço
    ProdutoServico.objects.get_or_create(
        servico=servico,
        produto=produtos[i % len(produtos)],
        defaults={
            "quantidade_utilizada": i
        }
    )

# Criar vendas de produtos
for i in range(1, 6):
    venda = VendaProduto.objects.create(
        cliente=clientes[i % len(clientes)],
        data_venda=datetime.now() - timedelta(days=i),
        forma_pagamento="Pix",
        situacao_venda="Finalizada",
        status_pagamento="Pago",
        valor_total=Decimal(f"{i * 100:.2f}")
    )
    VendaItem.objects.create(
        venda=venda,
        produto=produtos[i % len(produtos)],
        quantidade=1 + i,
        valor_unitario=Decimal(f"{15.0 * i:.2f}"),
        descricao=f"Item da venda {i}"
    )

# Criar vendas de serviços
for i in range(1, 6):
    venda_servico = VendaServico.objects.create(
        cliente=clientes[i % len(clientes)],
        data_venda=datetime.now() - timedelta(days=i),
        forma_pagamento="Cartão de débito",
        situacao_venda="Finalizada",
        status_pagamento="Pago",
        valor_total=Decimal(f"{i * 150:.2f}")
    )
    VendaServicoItem.objects.create(
        venda=venda_servico,
        servico=servicos[i % len(servicos)],
        quantidade=1,
        valor_servico=Decimal(f"{100 + i * 10:.2f}"),
        descricao=f"Item de serviço {i}"
    )

print("Registros inseridos em cada tabela com sucesso!")