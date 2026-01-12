import * as SecureStore from 'expo-secure-store';

const storeData = async (key, value) => {
    try {
        await SecureStore.setItemAsync(key, value);
    } catch (error) {
        // console.log(error);
    }
}

const getData = async (key) => {
    try {
        const value = await SecureStore.getItemAsync(key);
        return value;
    } catch (error) {
        // console.log(error);
    }
}

const removeData = async (key) => {
    try {
        await SecureStore.deleteItemAsync(key);
    } catch (error) {
        // console.log(error);
    }
}

const getToken = async () => {
    try {
        const token = await SecureStore.getItemAsync('token');
        return token;
    } catch (error) {
        // console.log(error);
    }
}

const storeToken = async (token) => {
    try {
        await SecureStore.setItemAsync('token', token);
    } catch (error) {
        // console.log(error);
    }
}

const removeToken = async () => {
    try {
        await SecureStore.deleteItemAsync('token');
    } catch (error) {
        // console.log(error);
    }
}

export default {
    getToken,
    storeToken,
    removeToken,
    getData,
    storeData,
    removeData
}