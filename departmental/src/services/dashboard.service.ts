import axiosClient from "@configs/axios.config";

export const DashboardServices = {
    getDashboardStats: async () => {
        const { data } = await axiosClient.get("/stats/totals");
        return data;
    },

    getAnnualRevenueStats: async () => {
        const { data } = await axiosClient.get("/stats/annual-revenue");
        return data;
    },

    getRegistrationGrowthStats: async () => {
        const { data } = await axiosClient.get("/stats/registration-growth");
        return data;
    },
};
