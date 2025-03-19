export type Cliente = {
    nome: string;
    cpf_cnpj: string;
    email: string;
    telefone: string;
    tipo: string;
    bairro: string;
    cep: string;
    endereco: string;
    status_cliente: string;
    observacao: string;
}

export interface ClienteUpdate {
    nome?: string;
    cpf_cnpj: string;
    email?: string;
    telefone?: string;
    tipo: string;
    bairro?: string;
    cep?: string;
    endereco?: string;
    status_cliente?: string;
    observacao?: string;
}

export type ClienteDetail = {
    id: number;
    nome: string;
    cpf_cnpj: string;
    email: string;
    telefone: string;
    tipo: string;
    bairro: string;
    cep: string;
    endereco: string;
    status_cliente: string;
    observacao: string;
}

export type ApiGetClientes = {
    clientes: Cliente[];
}

export type ApiGetCliente = ClienteDetail;