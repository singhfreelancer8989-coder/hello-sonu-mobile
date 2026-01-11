import { globalApiRequest } from "../utility/api.utility";
import { image } from "../constants/endpoint.constant";

/**
 * Upload Image using FormData
 */
export const uploadImage = async (uri) => {
    const filename = uri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image`;

    const formData = new FormData();
    // React Native requires this specific object structure for files
    formData.append('image', {
        uri: uri,
        name: filename,
        type: type,
    });
    formData.append("type", "PROPERTY_IMAGE");
    console.log(formData._parts);

    return globalApiRequest(true, "POST", image.upload, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

/**
 * Delete Image
 */
export const deleteImage = async (key) => {
    return globalApiRequest(true, "DELETE", image.delete, { key, type: "PROPERTY_IMAGE" });
};