import axiosClient from "@configs/axios.config";

export const DashboardServices = {
    getUsers: async () => {
        const response = await axiosClient.get("/university-admin/users");
        return response.data;
    },

    getAllTransactions: async () => {
        const response = await axiosClient.get("/annual-access-fee/transactions-all");
        return response.data;
    },
};
