export type Produto = {
    id?: number;
    nome: string;
    descricao: string;
    valor: number;
    data_modificacao_compra: string;
    estoque?: {
        id: number;
    };
}

export interface ProdutoUpdate {
    id?: number;
    nome?: string;
    descricao?: string;
    valor?: number;
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
    valor_produto_venda?: number;
    data_modificacao_produto?: string;
};

export type ApiGetEstoques = {
    estoques: Estoque[];
};

export type ApiGetEstoque = {
    estoque: Estoque;
};
