export type Produto = {
    id?: number;
    nome: string;
    descricao: string;
    valor_compra: number;
    data_modificacao_compra: string;
    estoque?: {
        id: number;
        valor_produto_venda: number;
        quantidade_atual: number;
    };
}

export interface ProdutoUpdate {
    id?: number;
    nome?: string;
    descricao?: string;
    valor_compra?: number;
    data_modificacao_compra?: string;
}

export type ProdutoDetail = {
    produto: Produto;
}

export type ApiGetProdutos = {
    produto: Produto[];
}

export type ApiGetProduto = ProdutoDetail;

export type Estoque = {
    id?: number;
    produto: Produto; 
    quantidade_min: number;
    quantidade_max: number;
    quantidade_atual: number;
    valor_produto_venda: number;
    data_modificacao_produto: string;
    historico_valor_venda?: number[];
    historico_data_modificacao?: string[];
};

export type EstoqueCreate = {
    produto_id: number;
    quantidade_min: number;
    quantidade_max: number;
    quantidade_atual: number;
    valor_produto_venda: number;
};

export interface EstoqueUpdate {
    id?: number;
    produto_id?: number;    
    quantidade_min?: number;
    quantidade_max?: number;
    quantidade_atual?: number;
    quantidade_entrada?: number;
    valor_produto_venda?: number;
    data_modificacao_produto?: string;
};

export type ApiGetEstoques = {
    estoques: Estoque[];
};

export type ApiGetEstoque = {
    estoque: Estoque;
};

export type Movimentacao = {
    id?: number;
    produto: Produto;
    tipo: 'compra' | 'venda'; 
    quantidade: number;
    valor_unitario: number;
    data: string;
};
export type ApiGetMovimentacoes = {
    movimentacoes: Movimentacao[];
};