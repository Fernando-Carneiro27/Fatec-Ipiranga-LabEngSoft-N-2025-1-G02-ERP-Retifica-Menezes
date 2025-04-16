import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/tcc";

export const useApi = async <TypeDataResponse>(
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
    data?: object
): Promise<{ data?: TypeDataResponse; detail: string }> => {
    try {
        console.log(`Enviando requisição: ${method} ${BASE_URL}/${endpoint}`, data);
        
        const response = await axios({
            url: `${BASE_URL}/${endpoint}`,
            method,
            data: method !== "GET" ? data : undefined,
            params: method === "GET" ? data : undefined,
        });

        console.log("Resposta da API:", response.data);

        return {
            data: response.data,
            detail: "",
        };
    } catch (error) {
        console.error("Erro na API:", error.response?.data || error.message);
        return {
            data: undefined,
            detail: error.response?.data?.detail || error.message,
        };
    }
};

