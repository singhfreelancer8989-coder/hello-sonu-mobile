import { globalApiRequest } from "../utility/api.utility";
import { admin } from "../constants/endpoint.constant";

export const fetchDashboardAnalytics = async () => {
    const response = await globalApiRequest(true, "GET", admin.dashboard);
    // // console.log(response)
    return response;
};

export const fetchPropertyAnalytics = async (propertyId) => {
    const response = await globalApiRequest(true, "GET", `/admin${admin.propertyAnalytics}/${propertyId}`);
    // console.log(response.data);
    return response;
};

export const sendPropertyViewAnalytics = async (propertyId, durationSeconds) => {
    const response = await globalApiRequest(true, "POST", `/admin${admin.propertyView}`, {
        propertyId,
        durationSeconds
    });
    // console.log(response);
    return response;
};

// {
//   "success": true,
//   "message": "Property analytics fetched successfully",
//   "data": {
//     "totalViews": 128,
//     "uniqueVisitors": 92,
//     "todayViews": 14,
//     "last7DaysViews": 63,
//     "averageDurationSeconds": 47.6,
//     "maxDurationSeconds": 312,
//     "visitors": [
//       {
//         "id": "b7c4e9a1-7f0d-4f8a-9c21-11d5a6a9e001",
//         "propertyId": "a3f8d1c2-9e44-4b9e-81c0-221fbd1a0001",
//         "userId": "u001",
//         "viewedAt": "2026-02-23T10:12:45.000Z",
//         "durationSeconds": 75,
//         "User": {
//           "id": "u001",
//           "fullName": "Rahul Sharma",
//           "mobileNumber": "9876543210",
//           "email": "rahul.sharma@example.com"
//         }
//       },
//       {
//         "id": "b7c4e9a1-7f0d-4f8a-9c21-11d5a6a9e002",
//         "propertyId": "a3f8d1c2-9e44-4b9e-81c0-221fbd1a0001",
//         "userId": "u002",
//         "viewedAt": "2026-02-23T09:48:10.000Z",
//         "durationSeconds": 32,
//         "User": {
//           "id": "u002",
//           "fullName": "Priya Verma",
//           "mobileNumber": "9123456780",
//           "email": "priya.verma@example.com"
//         }
//       },
//       {
//         "id": "b7c4e9a1-7f0d-4f8a-9c21-11d5a6a9e003",
//         "propertyId": "a3f8d1c2-9e44-4b9e-81c0-221fbd1a0001",
//         "userId": "u003",
//         "viewedAt": "2026-02-22T18:21:03.000Z",
//         "durationSeconds": 312,
//         "User": {
//           "id": "u003",
//           "fullName": "Amit Singh",
//           "mobileNumber": "9988776655",
//           "email": "amit.singh@example.com"
//         }
//       }
//     ]
//   }
// };
