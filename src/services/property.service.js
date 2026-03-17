import { globalApiRequest } from "../utility/api.utility";
import { property, user, admin, location } from "../constants/endpoint.constant"
import { extractCoordinates } from "../utility/location.utility";

export const createProperty = async (data) => {
    console.log("Property Data before extraction:", data);
    const coordinates = await extractCoordinates(data.googleMapLink);
    
    if (coordinates) {
        console.log("Extracted coordinates:", coordinates);
        data.latitude = coordinates.latitude;
        data.longitude = coordinates.longitude;
        console.log("Property Data after processing:", data);
        const response = await globalApiRequest(true, "POST", property.create, data);
        return response;
    } else {
        console.error("Coordinate extraction failed for link:", data.googleMapLink);
        // Throwing or returning error so handleSubmit can catch it
        return { 
            success: false, 
            message: "Could not extract location from the Google Map link. Please ensure it is a valid link." 
        };
    }
};

export const fetchProperties = async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const url = queryParams ? `${property.list}?${queryParams}` : property.list;
    const response = await globalApiRequest(true, "GET", url);
    // console.log("Properties:", response.data);
    return response;
};

export const fetchMyProperties = async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const url = queryParams ? `${property.myProperties}?${queryParams}` : property.myProperties;
    const response = await globalApiRequest(true, "GET", url);
    return response;
};

export const getPropertyById = async (id) => {
    const url = `${property.list}/${id}`;
    const response = await globalApiRequest(true, "GET", url);
    // // console.log("Property's cover Image:", response);
    return response;
};

export const saveProperty = async (data) => {
    const response = await globalApiRequest(true, "POST", property.save, data);
    return response;
};

export const removeSavedProperty = async (data) => {
    const response = await globalApiRequest(true, "DELETE", property.removeSaved, data);
    return response;
};

export const getSavedProperties = async (userId) => {
    const response = await globalApiRequest(true, "GET", `${user.savedProperties}/${userId}`);
    return response;
};

// --- PROPERTY MANAGEMENT ---

export const getDeletedUserProperties = async () => {
    const response = await globalApiRequest(true, "GET", admin.deletedProperties);
    return response;
};

export const updateProperty = async (id, data) => {
    const response = await globalApiRequest(true, "PUT", `${property.update}/${id}`, data);
    // console.log(response);
    return response;
};

export const deleteProperty = async (id) => {
    const response = await globalApiRequest(true, "DELETE", `${property.delete}/${id}`, {});
    // console.log(response);
    return response;
};

// --- MEDIA MANAGEMENT ---

export const addPropertyMedia = async (data) => {
    // data = { propertyId, imageUrl, videoUrl, isPrimary }
    const response = await globalApiRequest(true, "POST", property.media, data);
    // console.log(response);
    return response;
};

export const deletePropertyMedia = async (mediaId) => {
    const response = await globalApiRequest(true, "DELETE", `${property.media}/${mediaId}`, {});
    // console.log(response);
    return response;
};

export const updatePropertyMedia = async (mediaId, data) => {
    const response = await globalApiRequest(true, "PUT", `${property.media}/${mediaId}`, data);
    // console.log(response);
    return response;
};

export const updatePropertyCoverImage = async (propertyId, data) => {
    // data = { imageUrl, imageKey }
    const response = await globalApiRequest(true, "PUT", `${property.coverImage}/${propertyId}/cover-image`, data);
    // // console.log("Cover Image Updated:", response);
    return response;
};

export const getNearbyProperties = async (data) => {
    const response = await globalApiRequest(true, "GET", `${location.nearby}/${data.longitude}/${data.latitude}`);
    return response;
};

