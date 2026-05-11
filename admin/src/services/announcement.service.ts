import axiosClient from "@configs/axios.config";

export const AnnouncementServices = {
    getAnnouncements: async () => {
        const response = await axiosClient.get("/notifications");
        return response.data;
    },

    createAnnouncement: async (data: { title: string; body: string; isFor: string }) => {
        const response = await axiosClient.post("/notifications", data);
        return response.data;
    },
};
