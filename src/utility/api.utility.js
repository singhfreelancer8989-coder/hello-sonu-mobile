import axios from "axios";
import secureStorage from "./secureStorage.utility";
import authEvents from "./authEvents";

// Configure default instance
// Configure default instance
const api = axios.create({
    baseURL: "http://13.233.250.225/api/v1",
    headers: {
        "Content-Type": "application/json",
        "x-api-key": "hello-sonu-582ef09-4f-8b0b-31124e-593e5ca",
    },
});

// console.log('DEBUG: API_URL (Hardcoded):', "http://13.233.250.225/api/v1");


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
    // console.log(requestConfig);

    if (useToken) {
        const sessionToken = await secureStorage.getToken();
        if (sessionToken) {
            requestConfig.headers.Authorization = `Bearer ${sessionToken}`;
        }
    }

    try {
        const response = await api.request(requestConfig);
        // console.log(`[API Response] ${method} ${api.defaults.baseURL}${url}:`, response.data);
        return response.data;    
    } catch (error) {
        console.log(`[API Response] ${method} ${api.defaults.baseURL}/${url}:`, error);
        // Log more specific error details
        const errorMsg = error.response?.data?.message || error.message || "API Request Failed";

        // Handle Token Expiry / Unauthorized Access
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            console.warn(`[API] Triggering Auto-Logout due to ${error.response.status}`);
            authEvents.emitLogout();
        }

        console.error(`[API Error] ${method.toUpperCase()} ${url}:`, errorMsg);
        throw error;
    }
};
