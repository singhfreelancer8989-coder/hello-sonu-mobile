import { globalApiRequest } from "../utility/api.utility";
import { adminUsers, admin, user as userEndpoints } from "../constants/endpoint.constant";

export const getUsersByRole = async (role) => {
    const url = `${adminUsers.base}/${role}`;
    const response = await globalApiRequest(true, "GET", url);
    return response;
};

export const deleteUser = async (role, id) => {
    const url = `${adminUsers.base}/${role}/${id}`;
    const response = await globalApiRequest(true, "DELETE", url, {});
    return response;
};

export const getPropertyAccessSummary = async () => {
    const url = admin.propertyAccess;
    const response = await globalApiRequest(true, "GET", url);
    return response;
};

export const updatePropertyAccess = async (userId, canCreateProperty) => {
    const url = admin.propertyAccess;
    const response = await globalApiRequest(true, "PUT", url, { userId, canCreateProperty });
    return response;
};

export const forgotPassword = async (email) => {
    const response = await globalApiRequest(false, "POST", userEndpoints.forgotPassword, { email });
    return response;
};

