import {
    ApiGetProduto, ApiGetProdutos, ApiGetEstoque, ApiGetEstoques, ApiGetMovimentacoes,
    Estoque, EstoqueCreate, EstoqueUpdate,
    Produto, ProdutoUpdate, Movimentacao
} from "src/models/Produto";
import { ApiGetServico, ApiGetServicos, Servico, ServicoCreate, ServicoUpdate } from "src/models/Servico"
import { useApi } from "./api";
import { ApiGetClientes, ApiGetCliente, Cliente, ClienteUpdate } from "src/models/Cliente";
import { ApiGetVendaProduto, ApiGetVendasProduto, VendaProduto, VendaProdutoUpdate } from "src/models/VendaProduto";
import { ApiGetVendaServico, ApiGetVendasServico, VendaServico, VendaServicoUpdate } from "src/models/VendaServico";

// Clientes
const getClientes = async () => {
    try {
        const response = await useApi<ApiGetClientes>('clientes');
        return response;
    } catch (error) {
        console.error("Erro ao buscar clientes: ", error);
        throw error;
    }
};

const getUmCliente = async (id: number) => {
    try{
        const response = await useApi<ApiGetCliente>(`clientes/${id}`);
        return response;
    } catch (error) {
        console.error("Erro ao buscar cliente: ", error);
        throw error;
    }     
}

const addCliente = async (data: Cliente) => {
    const response = await useApi('clientes', 'POST', data);
    return response;
};

const editarCliente = async (id: number, data: ClienteUpdate) => {
    const response = await useApi(`clientes/${id}`, 'PUT', data);
    return response;
}

const deleteCliente = async (id: number) => {
    const response = await useApi(`clientes/${id}`, 'DELETE');
    return response;
}

// Produtos
const getProdutos = async () => {
    try {
        const response = await useApi<ApiGetProdutos>('produtos');
        return response;
    } catch (error) {
        console.error("Erro ao buscar produtos: ", error);
        throw error;
    }
};

const getUmProduto = async (id: number) => {
    try{
        const response = await useApi<ApiGetProduto>(`produtos/${id}`);
        return response;
    } catch (error) {
        console.error("Erro ao buscar cliente: ", error);
        throw error;
    }     
}

const addProduto = async (data: Produto) => {
    const response = await useApi('produtos', 'POST', data);
    return response;
};

const editarProduto = async (id: number, data: ProdutoUpdate) => {
    const response = await useApi(`produtos/${id}`, 'PUT', data);
    return response;
}

const deleteProduto = async (id: number) => {
    const response = await useApi(`produtos/${id}`, 'DELETE');
    return response;
}

// Estoque
    const getEstoques = async () => {
        const response = await useApi<ApiGetEstoques>('estoques');
        return response;
    };

const getEstoque = async (id: number) => {
    const response = await useApi<ApiGetEstoque>(`estoques/${id}`);
    return response;
};

const criarEstoque = async (data: EstoqueCreate) => {
    const response = await useApi('estoques', 'POST', data);
    return response;
};

const editarEstoque = async (id: number, data: EstoqueUpdate) => {
    const response = await useApi(`estoques/${id}`, 'PUT', data);
    return response;
};

const getMovimentacoes = async () => {
    const response = await useApi<ApiGetMovimentacoes>('estoque/movimentacoes');
    return response;
};

// Servicos
const getServicos = async () => {
    const response = await useApi<ApiGetServicos>('servicos');
    return response
}

const getUmServico = async (id: number) => {
    const response = await useApi<ApiGetServico>(`servicos/${id}`)
    return response
}

const addServico = async (data: ServicoCreate) => {
    const response = await useApi('servicos', 'POST', data)
    return response
}

const editarServico = async (id: number, data: ServicoUpdate) => {
    const response = await useApi(`servicos/${id}`, 'PUT', data)
    return response
}

const deleteServico = async (id: number) => {
    const response = await useApi(`servicos/${id}`, 'DELETE')
    return response
}

// Vendas Produto
export const getVendasProduto = async () => {
    const response = await useApi<ApiGetVendasProduto>('vendas/produtos');
    return response;
};

export const getUmaVendaProduto = async (id: number) => {
    const response = await useApi<ApiGetVendaProduto>(`vendas/produtos/${id}`);
    return response;
};

export const addVendaProduto = async (data: VendaProduto) => {
    const response = await useApi('vendas/produtos', 'POST', data);
    return response;
};

export const editarVendaProduto = async (id: number, data: VendaProdutoUpdate) => {
    const response = await useApi(`vendas/produtos/${id}`, 'PUT', data);
    return response;
};

export const deleteVendaProduto = async (id: number) => {
    const response = await useApi(`vendas/produtos/${id}`, 'DELETE');
    return response;
};

// Vendas Servico
export const getVendasServico = async () => {
    const response = await useApi<ApiGetVendasServico>('vendas/servicos');
    return response;
};

export const getUmaVendaServico = async (id: number) => {
    const response = await useApi<ApiGetVendaServico>(`vendas/servicos/${id}`);
    return response;
};

export const addVendaServico = async (data: VendaServico) => {
    const response = await useApi('vendas/servicos', 'POST', data);
    return response;
};

export const editarVendaServico = async (id: number, data: VendaServicoUpdate) => {
    const response = await useApi(`vendas/servicos/${id}`, 'PUT', data);
    return response;
};

export const deleteVendaServico = async (id: number) => {
    const response = await useApi(`vendas/servicos/${id}`, 'DELETE');
    return response;
};

export const useRequests = () => ({
    // Clientes
    getClientes, getUmCliente, addCliente, editarCliente, deleteCliente,

    // Produtos
    getProdutos, getUmProduto, addProduto, editarProduto, deleteProduto,
    
    // Estoque
    getEstoques, getEstoque, criarEstoque, editarEstoque, getMovimentacoes,

    // Serviços
    getServicos, getUmServico, addServico, editarServico, deleteServico,

    // Vendas Produto
    getVendasProduto, getUmaVendaProduto, addVendaProduto, editarVendaProduto, deleteVendaProduto,

    // Vendas Serviço
    getVendasServico, getUmaVendaServico, addVendaServico, editarVendaServico, deleteVendaServico,
})