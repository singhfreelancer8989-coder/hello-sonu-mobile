import { globalApiRequest } from "../utility/api.utility";
import { adminUsers } from "../constants/endpoint.constant";

export const getUsersByRole = async (role) => {
    // role should be 'customer' or 'admin'
    const url = `${adminUsers.base}/${role}`;
    const response = await globalApiRequest(true, "GET", url);
    return response;
};

export const deleteUser = async (role, id) => {
    const url = `${adminUsers.base}/${role}/${id}`;
    const response = await globalApiRequest(true, "DELETE", url, {});
    return response;
};
