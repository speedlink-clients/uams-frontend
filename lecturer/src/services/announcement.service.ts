import axiosClient from "@configs/axios.config";
import type { Announcement, CreateAnnouncementPayload } from "@type/announcement.type";

export const AnnouncementService = {
    getAnnouncements: async (from?: string, to?: string): Promise<Announcement[]> => {
        const { data } = await axiosClient.get<Announcement[]>("/lecturer/announcements", {
            params: { from, to },
        });
        return data;
    },

    createAnnouncement: async (payload: CreateAnnouncementPayload): Promise<Announcement> => {
        const { data } = await axiosClient.post<Announcement>("/lecturer/announcements", payload);
        return data;
    },
};
