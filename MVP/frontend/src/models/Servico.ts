import { Produto } from "./Produto";

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
    produtos_ids?: number[];
};
export interface ServicoUpdate {
    nome?: string;
    valor_servico?: number;
    status_servico?: string;
    descricao_servico?: string;
    data_modificacao_servico?: string;
    produtos?: Produto[];
    produtos_ids?: number[];
}

export type ServicoDetail = {
    servico: Servico;
}

export type ApiGetServicos = {
    servicos: Servico[];
}

export type ApiGetServico = ServicoDetail;