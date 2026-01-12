import { globalApiRequest } from "../utility/api.utility";
import { broker } from "../constants/endpoint.constant";

export const registerBroker = async (data) => {
    return await globalApiRequest(true, "POST", "/broker/register", data);
};

export const getAllBrokers = async () => {
    const response = await globalApiRequest(true, "GET", broker.list);
    // // console.log(response)
    return response;
};

export const getBrokerById = async (id) => {
    const url = `${broker.details}/${id}`;
    const response = await globalApiRequest(true, "GET", url);
    return response;
};

export const deleteBroker = async (id) => {
    const url = `${broker.delete}/${id}`;
    const response = await globalApiRequest(true, "DELETE", url, {});
    return response;
};

