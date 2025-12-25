import { globalApiRequest } from "../utility/api.utility";

export const registerBroker = async (data) => {
    return await globalApiRequest(true, "POST", "/broker/register", data);
};
