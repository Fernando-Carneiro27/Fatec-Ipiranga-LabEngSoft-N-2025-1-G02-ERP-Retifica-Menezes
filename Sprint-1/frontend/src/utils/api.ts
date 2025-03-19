import axios from "axios";

const BASE_URL = "http://localhost:8000/tcc";

export const useApi = async <TypeDataResponse>(
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
    data?: object
): Promise<{ data?: TypeDataResponse; detail: string }> => {
    try {
        const response = await axios({
            url: `${BASE_URL}/${endpoint}`,
            method,
            data: method !== "GET" ? data : undefined,
            params: method === "GET" ? data : undefined,
        });

        return {
            data: response.data,
            detail: "",
        };
    } catch (error) {
        return {
            data: undefined,
            detail: error.response?.data?.detail || error.message,
        };
    }
};
