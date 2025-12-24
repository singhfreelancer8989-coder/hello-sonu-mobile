import axios from "axios";
import secureStorage from "./secureStorage.utility";
import { API_URL, API_KEY } from "@env";

// Configure default instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
    },
});

/**
 * Core requester for all API calls
 */
export const globalApiRequest = async (useToken, method, url, data = null, config = {}) => {
    const requestConfig = {
        method: method.toLowerCase(),
        url,
        data,
        ...config,
        headers: { ...config.headers },
    };

    if (useToken) {
        const sessionToken = await secureStorage.getToken();
        if (sessionToken) {
            requestConfig.headers.Authorization = `Bearer ${sessionToken}`;
        }
    }

    try {
        const response = await api.request(requestConfig);
        return response.data;
    } catch (error) {
        // Log more specific error details
        const errorMsg = error.response?.data?.message || error.message || "API Request Failed";
        console.error(`[API Error] ${method.toUpperCase()} ${url}:`, errorMsg);
        throw error;
    }
};
