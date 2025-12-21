import axios from "axios";
import secureStorage from "./secureStorage.utility";


import { API_URL, API_KEY } from "@env";

axios.defaults.baseURL = API_URL;
axios.defaults.headers.common["x-api-key"] = API_KEY;


export const globalApiRequest = async (token, method, data = null, url, config = {}) => {
    const requestConfig = { ...config };

    if (token) {
        const sessionToken = await secureStorage.getToken();
        if (sessionToken) {
            requestConfig.headers = {
                ...requestConfig.headers,
                Authorization: `Bearer ${sessionToken}`,
            };
        }
    }

    try {
        let response;
        const lowerCaseMethod = method.toLowerCase();

        if (lowerCaseMethod === "get" || lowerCaseMethod === "delete") {
            response = await axios[lowerCaseMethod](url, requestConfig);
        } else if (lowerCaseMethod === "post" || lowerCaseMethod === "put" || lowerCaseMethod === "patch") {
            response = await axios[lowerCaseMethod](url, data, requestConfig);
        } else {
            throw new Error(`Unsupported HTTP method: ${method}`);
        }
        return response.data;
    } catch (error) {
        console.error("API Request Failed:", error.response?.data || error.message);
        throw error;
    }
};