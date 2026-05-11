import axiosClient from "@configs/axios.config";

export const SystemServices = {
    getSystemSettings: async () => {
        const { data } = await axiosClient.get("/settings");
        return data;
    },
    updateSystemSettings: async (payload: any) => {
        const { data } = await axiosClient.patch("/settings", payload);
        return data;
    },
};
