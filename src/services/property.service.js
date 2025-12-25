import { globalApiRequest } from "../utility/api.utility";
import { property, user } from "../constants/endpoint.constant"

export const createProperty = async (data) => {
    const response = await globalApiRequest(true, "POST", property.create, data);
    // console.log("Property Created:", response);
    return response;
};

export const fetchProperties = async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const url = queryParams ? `${property.list}?${queryParams}` : property.list;
    const response = await globalApiRequest(true, "GET", url);
    // console.log("Properties:", response.data.properties);
    return response;
};

export const getPropertyById = async (id) => {
    const url = `${property.list}/${id}`;
    const response = await globalApiRequest(true, "GET", url);
    // console.log("Property by ID:", response);
    return response;
};

export const saveProperty = async (data) => {
    const response = await globalApiRequest(true, "POST", property.save, data);
    return response;
};

export const removeSavedProperty = async (data) => {
    // Assuming globalApiRequest handles DELETE body if passed as data
    const response = await globalApiRequest(true, "DELETE", property.removeSaved, data);
    return response;
};

export const getSavedProperties = async (userId) => {
    const response = await globalApiRequest(true, "GET", `${user.savedProperties}/${userId}`);
    return response;
};

