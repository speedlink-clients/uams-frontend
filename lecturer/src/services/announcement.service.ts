import axiosClient from "@configs/axios.config";
import type { 
    Announcement, 
    CreateAnnouncementPayload,
    UpdateAnnouncementPayload,
    ApiResponse,
} from "@type/announcement.type";

export const AnnouncementService = {
    // Get all announcements/notifications
    getAnnouncements: async (from?: string, to?: string): Promise<Announcement[]> => {
        const { data } = await axiosClient.get<ApiResponse<Announcement>>("/notifications", {
            params: { from, to },
        });
        return data.data;
    },

    // Get single announcement by ID
    getAnnouncementById: async (id: string): Promise<Announcement> => {
        const { data } = await axiosClient.get<{ data: Announcement }>(`/notifications/${id}`);
        return data.data;
    },

    // Create new announcement/notification
    createAnnouncement: async (payload: CreateAnnouncementPayload): Promise<Announcement> => {
        const { data } = await axiosClient.post<{ data: Announcement }>("/notifications", {
            title: payload.title,
            body: payload.description,
            isFor: payload.recipients?.join(',') || 'OTHERS', 
            isRead: false,
            data: null
        });
        
        return data.data;
    },

    // Update announcement
    updateAnnouncement: async (id: string, payload: UpdateAnnouncementPayload): Promise<Announcement> => {
        const updateData: any = {};
        
        if (payload.title) updateData.title = payload.title;
        if (payload.description) updateData.body = payload.description;
        if (payload.lastRead !== undefined) updateData.isRead = payload.lastRead;
        if (payload.recipients) updateData.isFor = payload.recipients.join(',');
        
        const { data } = await axiosClient.put<{ data: Announcement }>(`/notifications/${id}`, updateData);
        return data.data;
    },

    // Delete announcement
    deleteAnnouncement: async (id: string): Promise<void> => {
        await axiosClient.delete(`/notifications/${id}`);
    },

    // Delete multiple announcements
    deleteMultipleAnnouncements: async (ids: string[]): Promise<void> => {
        await axiosClient.delete("/notifications/bulk", {
            data: { ids }
        });
    },

    // Mark announcement as read
    markAsRead: async (id: string): Promise<Announcement> => {
        const { data } = await axiosClient.patch<{ data: Announcement }>(`/notifications/${id}/read`, {
            isRead: true
        });
        return data.data;
    },

    // Mark multiple announcements as read
    markMultipleAsRead: async (ids: string[]): Promise<void> => {
        await axiosClient.patch("/notifications/read-bulk", { ids });
    },

    // Get unread announcements count
    getUnreadCount: async (): Promise<number> => {
        const { data } = await axiosClient.get<{ count: number }>("/notifications/unread/count");
        return data.count;
    },

    // Get announcements by user
    getAnnouncementsByUser: async (userId: string): Promise<Announcement[]> => {
        const { data } = await axiosClient.get<ApiResponse<Announcement>>(`/notifications/user/${userId}`);
        return data.data;
    },

    // Get announcements by type/for
    getAnnouncementsByType: async (isFor: string): Promise<Announcement[]> => {
        const { data } = await axiosClient.get<ApiResponse<Announcement>>("/notifications", {
            params: { isFor }
        });
        return data.data;
    },

    // Search announcements
    searchAnnouncements: async (query: string): Promise<Announcement[]> => {
        const { data } = await axiosClient.get<ApiResponse<Announcement>>("/notifications/search", {
            params: { q: query }
        });
        return data.data;
    },

    // Get announcements by date range
    getAnnouncementsByDateRange: async (from: string, to: string): Promise<Announcement[]> => {
        const { data } = await axiosClient.get<ApiResponse<Announcement>>("/notifications", {
            params: { from, to }
        });
        return data.data;
    },

    // Get recent announcements
    getRecentAnnouncements: async (days: number = 7): Promise<Announcement[]> => {
        const to = new Date().toISOString();
        const from = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
        return AnnouncementService.getAnnouncementsByDateRange(from, to);
    }
};