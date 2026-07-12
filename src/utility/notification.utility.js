import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { Platform } from "react-native";

/**
 * Configure default foreground notification behavior
 */
Notifications.setNotificationHandler({
    handleNotification: async (notification) => {
        const data = notification.request.content.data;
        const hasProperty = !!data?.propertyId;
        const isLocal = !!data?.isLocal;
        return {
            shouldShowAlert: isLocal || !hasProperty,
            shouldPlaySound: true,
            shouldSetBadge: false,
        };
    },
});

/**
 * Request notification permissions and fetch the Expo Push Token
 * @returns {Promise<{token: string, deviceType: string} | null>}
 */
export async function registerForPushNotificationsAsync() {
    try {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== "granted") {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== "granted") {
            console.warn("[NotificationUtility] Permission to receive push notifications denied");
            return null;
        }

        // Check if we are running in Expo Go. We request permissions first so local notifications
        // can still run, but we return null here to avoid fetching the remote push token in Expo Go.
        // Temporarily commented out for testing inside Expo Go on physical device
        // if (Constants.appOwnership === "expo") {
        //     console.warn("[NotificationUtility] Push notifications (remote) are not supported in Expo Go on SDK 53+. Local notifications are still supported.");
        //     return null;
        // }

        if (!Device.isDevice) {
            console.warn("[NotificationUtility] Must use physical device for Push Notifications");
            return null;
        }

        // Get the Expo Project ID
        const projectId = 
            Constants.expoConfig?.extra?.eas?.projectId || 
            Constants.easConfig?.projectId;

        const tokenData = await Notifications.getExpoPushTokenAsync({
            projectId,
        });

        const token = tokenData.data;
        const deviceType = Platform.OS === "ios" ? "ios" : Platform.OS === "android" ? "android" : "unknown";

        console.log("[NotificationUtility] Generated Token:", token, "Device Type:", deviceType);
        return { token, deviceType };
    } catch (error) {
        console.error("[NotificationUtility] Error generating push token:", error);
        return null;
    }
}
