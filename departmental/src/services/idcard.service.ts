import axiosClient from "@configs/axios.config"

export const IDCardServices = {

    // get the Active Default ID-Card Template
    getDefaultIDCard: async () => {
        const { data } = await axiosClient.get("/university-admin/id-card/default");
        return data;
    },

    // get all ID-Card Templates
    getAllIDCard: async () => {
        const { data } = await axiosClient.get("/university-admin/id-card");
        return data;
    },

    // create ID-Card Template
    createIDCard: async (payload: Record<string, unknown>) => {
        const { data } = await axiosClient.put("/university-admin/id-card", payload);
        return data;
    },

    // delete an ID-Card Template
    deleteIDCard: async (id: string, payload: Record<string, unknown>) => {
        const { data } = await axiosClient.delete(`/university-admin/id-card/${id}`, payload);
        return data;
    },

    // update an ID-Card Template
    updateIDCard: async (id: string, payload: Record<string, unknown>) => {
        const { data } = await axiosClient.put(`/university-admin/id-card/${id}`, payload);
        return data;
    },

    // set an ID-Card Template as default
    activateIDCard: async (id: string, payload: Record<string, unknown>) => {
        const { data } = await axiosClient.patch(`/university-admin/id-card/${id}/set-default`, payload);
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
