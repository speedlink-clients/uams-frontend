import axiosClient from "@configs/axios.config"

export const IDCardServices = {
    getDefaultIDCard: async () => {
        const { data } = await axiosClient.get("/university-admin/id-card");
        return data;
    },

    getSettings: async () => {
        const { data } = await axiosClient.get("/university-admin/id-card/settings");
        return data;
    },

    updateSettings: async (payload: Record<string, unknown>) => {
        const { data } = await axiosClient.put("/university-admin/id-card", payload);
        return data;
    },

    updateIDCard: async (id: string, payload: Record<string, unknown>) => {
        const { data } = await axiosClient.put(`/university-admin/id-card/${id}`, payload);
        return data;
    },

    bulkDownloadIDCards: async (studentIds: string[], templateId: string) => {
        const { data } = await axiosClient.post(
            "/university-admin/id-card/bulk-download",
            { studentIds, templateId, format: "pdf" },
            { responseType: "blob" }
        );
        return data;
    },

    bulkDownloadBanner: async (studentIds: string[]) => {
        const { data } = await axiosClient.post(
            "/university-admin/id-card/student-banner",
            { studentIds, format: "pdf" },
            { responseType: "blob" }
        );
        return data;
    },
}
