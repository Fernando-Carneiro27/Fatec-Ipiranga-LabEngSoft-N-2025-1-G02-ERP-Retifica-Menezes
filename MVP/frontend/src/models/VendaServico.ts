import { Servico } from "./Servico";
import { Cliente } from "./Cliente";
import { Produto } from "./Produto";

export type ProdutoServico = {
    produto_id: number;
    quantidade_utilizada: number;
}
export type VendaServicoItem = {
    id?: number;
    servico: Servico;
    servico_id?: number;
    quantidade: number;
    valor_unitario: number;
    descricao?: string;
    valor_total_itens?: number;
    produtos_servico?: ProdutoServico[];
};
export type VendaServico = {
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
    itens?: VendaServicoItem[];
    itens_data?: Omit<VendaServicoItem, 'id' | 'servico'>[];
};

export interface VendaServicoUpdate {
    cliente?: Cliente;
    servico?: Servico;
    data_venda?: string;
    data_entrega?: string;
    data_pagamento?: string;
    forma_pagamento?: string;
    situacao_venda?: string;
    status_pagamento?: string;
    detalhes_pagamento?: string;
    valor_total?: number;
}

export type VendaServicoDetail = {
    venda_servico: VendaServico;
};

export type ApiGetVendasServico = {
    vendas_servico: VendaServico[];
};

export type ApiGetVendaServico = VendaServicoDetail;
