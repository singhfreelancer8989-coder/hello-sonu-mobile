import { globalApiRequest } from "../utility/api.utility";

export const createProperty = async (data) => {
    const response = await globalApiRequest(true, "POST", "/property/create", data);
    console.log("Property Created:", response);
    return response;
};

export const fetchProperties = async () => {
    
}