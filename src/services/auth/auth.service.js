import { Alert } from "react-native";

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