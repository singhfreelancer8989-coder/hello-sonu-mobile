import * as SecureStore from 'expo-secure-store';

const getToken = async () => {
    try {
        const token = await SecureStore.getItemAsync('token');
        return token;
    } catch (error) {
        console.log(error);
    }
}

const storeToken = async (token) => {
    try {
        await SecureStore.setItemAsync('token', token);
    } catch (error) {
        console.log(error);
    }
}

const removeToken = async () => {
    try {
        await SecureStore.deleteItemAsync('token');
    } catch (error) {
        console.log(error);
    }
}

export default {
    getToken,
    storeToken,
    removeToken
}