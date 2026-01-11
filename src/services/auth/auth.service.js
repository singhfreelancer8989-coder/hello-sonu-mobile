import { Alert } from "react-native";
import { globalApiRequest } from "../../utility/api.utility";
import { user } from "../../constants/endpoint.constant";

export const registerUser = async (userData) => {
    try {
        const response = await globalApiRequest(false, "POST", user.register, userData);
        return response;
    } catch (error) {
        throw error;
    }
};

export const handleLogout = (logout) => {
    Alert.alert(
        "Logout",
        "Are you sure you want to logout?",
        [
            {
                text: "Cancel",
                style: "cancel"
            },
            {
                text: "Logout",
                onPress: () => {
                    logout();
                },
                style: "destructive"
            }
        ]
    );
};