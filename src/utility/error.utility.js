import { Alert } from 'react-native';

/**
 * Parses an error object to extract a user-friendly message.
 * Prioritizes backend error messages (response.data.message) over generic ones.
 * @param {Error} error - The error object to parse.
 * @returns {string} - A user-friendly error message.
 */
export const getErrorMessage = (error) => {
    if (error?.response?.data?.message) {
        return error.response.data.message;
    }
    if (error?.response?.status === 413) {
        return "The file is too large to upload. Please choose a smaller image.";
    }
    if (error?.message) {
        return error.message;
    }
    return "An unexpected error occurred. Please try again.";
};

/**
 * Displays a standardized error alert.
 * @param {string} title - The title of the alert (e.g., "Login Failed").
 * @param {Error|string} error - The error object or string to display.
 */
export const showErrorAlert = (title, error) => {
    const message = typeof error === 'string' ? error : getErrorMessage(error);
    Alert.alert(title, message, [{ text: "OK" }]);
};
