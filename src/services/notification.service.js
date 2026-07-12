import { globalApiRequest } from "../utility/api.utility";
import { notification } from "../constants/endpoint.constant";

/**
 * Register push token with the backend
 * @param {string} token - Expo Push Token
 * @param {string} deviceType - 'ios' | 'android' | 'web'
 */
export const registerDeviceToken = async (token, deviceType) => {
    try {
        const response = await globalApiRequest(
            true, 
            "POST", 
            notification.registerToken, 
            { token, deviceType }
        );
        return response;
    } catch (error) {
        console.error("[NotificationService] Failed to register token:", error);
        throw error;
    }
};

/**
 * Remove push token from backend (on logout)
 * @param {string} token - Expo Push Token
 */
export const removeDeviceToken = async (token) => {
    try {
        const response = await globalApiRequest(
            true, 
            "DELETE", 
            notification.removeToken, 
            { token }
        );
        return response;
    } catch (error) {
        console.error("[NotificationService] Failed to remove token:", error);
        throw error;
    }
};
