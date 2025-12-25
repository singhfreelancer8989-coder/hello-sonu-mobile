import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

export const pickImage = async () => {
    // 1. Request Permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permission Denied", "We need access to your gallery to pick an image.");
      return;   
    }

    // 2. Launch Picker
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const selectedAsset = result.assets[0];
      
      // 3. Check File Size
      // Note: result.assets[0].fileSize is available in newer Expo versions
      let fileSize = selectedAsset.fileSize;

      // Fallback: If fileSize is missing, use expo-file-system to get it
      if (!fileSize) {
        const fileInfo = await FileSystem.getInfoAsync(selectedAsset.uri);
        if (fileInfo.exists) {
          fileSize = fileInfo.size;
        }
      }

      if (fileSize && fileSize > MAX_FILE_SIZE) {
        Alert.alert(
          "File Too Large",
          `The selected image is ${(fileSize / (1024 * 1024)).toFixed(2)}MB. Please choose an image under 5MB.`
        );
        return;
      }
      return selectedAsset.uri;
    }
  }