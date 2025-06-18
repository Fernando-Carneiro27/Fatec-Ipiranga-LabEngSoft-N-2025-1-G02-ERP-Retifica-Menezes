import { Produto } from "./Produto";
import { Cliente } from "./Cliente";

export type VendaItem = {
    id?: number;
    produto: Produto;
    produto_id?: number;
    quantidade: number;
    valor_unitario: number;
    descricao?: string;
};
export type VendaProduto = {
    id?: number;
    cliente: Cliente;
    cliente_id: number;
    data_venda: string;
    data_entrega?: string;
    data_pagamento?: string;
    forma_pagamento: string;
    situacao_venda: string;
    status_pagamento: string;
    detalhes_pagamento?: string;
    valor_total: number;
    itens?: VendaItem[];
    itens_data?: Omit<VendaItem, 'id' | 'produto'>[];
};

export interface VendaProdutoUpdate {
    cliente?: Cliente;
    produto?: Produto;
    data_venda?: string;
    data_entrega?: string;
    data_pagamento?: string;
    forma_pagamento?: string;
    situacao_venda?: string;
    status_pagamento?: string;
    detalhes_pagamento?: string;
    quantidade?: number;
    valor_total?: number;
    itens?: VendaItem[];
}

export type VendaProdutoDetail = {
    venda_produto: VendaProduto;
};

export type ApiGetVendasProduto = {
    vendas_produto: VendaProduto[];
};

export type ApiGetVendaProduto = VendaProdutoDetail;
