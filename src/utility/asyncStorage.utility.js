import AsyncStorage from "@react-native-async-storage/async-storage";



async function setDataToAsyncStorage(isSingleValue, data) {
    try {
        if (isSingleValue) {
            await AsyncStorage.setItem(data.key, data.value);
        }
        else {
            await AsyncStorage.multiSet(data);
        }
    } catch (error) {
        console.log(error);
    }
}

async function getDataFromAsyncStorage(key) {
    try {
        const value = await AsyncStorage.getItem(key);
        if (value !== null) {
            return value;
        }
    } catch (error) {
        console.log(error);
    }
}


async function removeDataFromAsyncStorage(key) {
    try {
        await AsyncStorage.removeItem(key);
    } catch (error) {
        console.log(error);
    }
}

async function clearAllDataFromAsyncStorage() {
    try {
        await AsyncStorage.clear();
    } catch (error) {
        console.log(error);
    }
}

async function getToken() {
    try {
        const token = await AsyncStorage.getItem('token');
        if (token !== null) {
            return token;
        }
    } catch (error) {
        console.log(error);
    }
}

export default {
    setDataToAsyncStorage,
    getDataFromAsyncStorage,
    removeDataFromAsyncStorage,
    clearAllDataFromAsyncStorage,
    getToken
}