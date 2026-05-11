import axiosClient from "@configs/axios.config";

export const SystemServices = {
    getSystemSettings: async () => {
        const { data } = await axiosClient.get("/system-settings");
        return data;
    },
    updateSystemSettings: async (payload: any) => {
        const { data } = await axiosClient.patch("/system-settings", payload);
        return data;
    },
};
