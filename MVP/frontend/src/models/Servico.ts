import { Produto } from "./Produto";

export type ProdutoServicoItem = {
  produto_id: number;
  quantidade_utilizada: number;
};
export type ProdutoServicoDetalhado = {
  produto_id: number;
  quantidade_utilizada: number;
  nome: string;
  valor: number;
};
export type Servico = {
    id?: number;
    nome: string;
    valor_servico: number;
    status_servico: string;
    descricao_servico: string;
    data_modificacao_servico: string;
    historico_valor_servico?: number[];
    historico_data_modificacao?: string[];
    produtos?: Produto[];
    itens_detalhados?: ProdutoServicoDetalhado[];
};
export interface ServicoCreate {
  nome: string;
  valor_servico: number;
  status_servico: string;
  descricao_servico: string;
  data_modificacao_servico: string;
  itens: ProdutoServicoItem[]; 
}
export interface ServicoUpdate {
    nome?: string;
    valor_servico?: number;
    status_servico?: string;
    descricao_servico?: string;
    data_modificacao_servico?: string;
    itens?: ProdutoServicoItem[];
}

export type ServicoDetail = {
    servico: Servico;
}

export type ApiGetServicos = {
    servicos: Servico[];
}

export type ApiGetServico = ServicoDetail;