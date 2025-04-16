import {
    ApiGetProduto,
    ApiGetProdutos,
    ApiGetEstoque,
    ApiGetEstoques,
    Estoque,
    EstoqueCreate,
    EstoqueUpdate,
    Produto,
    ProdutoUpdate
} from "src/models/Produto";
import { useApi } from "./api";
import { ApiGetClientes, ApiGetCliente, Cliente, ClienteUpdate } from "src/models/Cliente";

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

export const useRequests = () => ({
    // Clientes
    getClientes,
    getUmCliente,
    addCliente,
    editarCliente,
    deleteCliente,

    // Produtos
    getProdutos,
    getUmProduto,   
    addProduto,
    editarProduto,
    deleteProduto,
    
    // Estoque
    getEstoques,
    getEstoque,
    criarEstoque,
    editarEstoque,
})