import { useApi } from "./api";
import { ApiGetClientes, ApiGetCliente, Cliente, ClienteUpdate } from "src/models/Cliente";

// Clientes
const getClientes = async () => {
    try {
        const response = await useApi<ApiGetClientes>('clientes/clientes');
        return response;
    } catch (error) {
        console.error("Erro ao buscar clientes: ", error);
        throw error;
    }
};

const getAnCliente = async (id: number) => {
    try{
        const response = await useApi<ApiGetCliente>(`clientes/clientes/${id}`);
        return response;
    } catch (error) {
        console.error("Erro ao buscar cliente: ", error);
        throw error;
    }
        
    }

const addCliente = async (data: Cliente) => {
    const response = await useApi('clientes/clientes', 'POST', data);
    return response;
};

const editCliente = async (data: ClienteUpdate) => {
    const response = await useApi('clientes/clientes', 'PUT', data);
    return response;
}

const deleteCliente = async (id: number) => {
    const response = await useApi(`clientes/clientes/${id}`, 'DELETE');
    return response;
}

export const useRequests = () => ({
    // Clientes
    getClientes,
    getAnCliente,
    addCliente,
    editCliente,
    deleteCliente
})