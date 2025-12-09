import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Utility class for handling AsyncStorage operations with automatic JSON parsing/stringifying
 * and centralized error handling.
 */
class AsyncStorageUtility {
    /**
     * Save data to AsyncStorage
     * @param {string} key - The storage key
     * @param {any} value - The value to store (will be stringified if object/array)
     * @returns {Promise<boolean>} - Returns true if successful, false otherwise
     */
    static async setItem(key, value) {
        try {
            const jsonValue = JSON.stringify(value);
            await AsyncStorage.setItem(key, jsonValue);
            return true;
        } catch (e) {
            console.error(`[AsyncStorage] Error saving key "${key}":`, e);
            return false;
        }
    }

    /**
     * Retrieve data from AsyncStorage
     * @param {string} key - The storage key
     * @returns {Promise<any | null>} - Returns parsed data or null if not found/error
     */
    static async getItem(key) {
        try {
            const jsonValue = await AsyncStorage.getItem(key);
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (e) {
            console.error(`[AsyncStorage] Error reading key "${key}":`, e);
            return null;
        }
    }

    /**
     * Remove item from AsyncStorage
     * @param {string} key - The storage key
     * @returns {Promise<boolean>} - Returns true if successful, false otherwise
     */
    static async removeItem(key) {
        try {
            await AsyncStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error(`[AsyncStorage] Error removing key "${key}":`, e);
            return false;
        }
    }

    /**
     * Clear all app data from AsyncStorage
     * @returns {Promise<boolean>} - Returns true if successful, false otherwise
     */
    static async clearAll() {
        try {
            await AsyncStorage.clear();
            return true;
        } catch (e) {
            console.error('[AsyncStorage] Error clearing storage:', e);
            return false;
        }
    }
}

/**
 * Constants for Storage Keys to prevent typo errors
 */
export const STORAGE_KEYS = {
    USER_TOKEN: 'user_token',
    USER_PROFILE: 'user_profile',
    // Add more keys here as needed
};

export default AsyncStorageUtility;
