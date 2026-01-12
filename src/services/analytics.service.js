import { globalApiRequest } from "../utility/api.utility";
import { admin } from "../constants/endpoint.constant";

export const fetchDashboardAnalytics = async () => {
    const response = await globalApiRequest(true, "GET", admin.dashboard);
    // // console.log(response)
    return response;
};
