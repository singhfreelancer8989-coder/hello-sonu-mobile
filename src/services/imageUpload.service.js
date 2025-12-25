import { globalApiRequest } from "../utility/api.utility";

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

    return globalApiRequest(true, "POST", "/media/upload-image", formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

/**
 * Delete Image
 */
export const deleteImage = async (publicId) => {
    return globalApiRequest(true, "DELETE", "/media/delete-image", { publicId });
};