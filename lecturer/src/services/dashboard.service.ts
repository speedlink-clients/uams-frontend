import axiosClient from "@configs/axios.config";
import type { DashboardResponse } from "@type/dashboard.type";

export const DashboardService = {
    getDashboardData: async (): Promise<DashboardResponse["data"]> => {
        const { data } = await axiosClient.get<DashboardResponse>("/lecturers/dashboard");
        return data.data;
    },
};
