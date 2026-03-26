import axiosClient from "@configs/axios.config";
import type { 
    Announcement, 
    CreateAnnouncementPayload,
    UpdateAnnouncementPayload,
    ApiResponse,
    NotificationResponse
} from "@type/announcement.type";

export const AnnouncementService = {
    // Get all announcements/notifications
    getAnnouncements: async (from?: string, to?: string): Promise<Announcement[]> => {
        const { data } = await axiosClient.get<ApiResponse<NotificationResponse>>("/notifications", {
            params: { from, to },
        });
        
        // Transform the API response to match your Announcement type
        return data.data.map(notification => ({
            id: notification.id,
            title: notification.type, // Map type to title
            description: notification.isFor, // Map isFor to description
            date: notification.createdAt.split('T')[0], 
            isFor: notification.isFor,
            userIdentityId: notification.userIdentityId,
            isAdmin: notification.isAdmin,
            lastRead: notification.lastRead,
            type: notification.type
        }));
    },

    // Get single announcement by ID
    getAnnouncementById: async (id: string): Promise<Announcement> => {
        const { data } = await axiosClient.get<{ data: NotificationResponse }>(`/notifications/${id}`);
        
        return {
            id: data.data.id,
            title: data.data.type,
            description: data.data.isFor,
            date: data.data.createdAt.split('T')[0],
            isFor: data.data.isFor,
            userIdentityId: data.data.userIdentityId,
            isAdmin: data.data.isAdmin,
            lastRead: data.data.lastRead,
            type: data.data.type
        };
    },

    // Create new announcement/notification
    createAnnouncement: async (payload: CreateAnnouncementPayload): Promise<Announcement> => {
        const { data } = await axiosClient.post<{ data: NotificationResponse }>("/notifications", {
            isFor: payload.description, // Map description to isFor
            type: payload.title, // Map title to type
            userIdentityId: payload.recipients[0], // Handle recipients
            isAdmin: false,
            lastRead: false
        });
        
        return {
            id: data.data.id,
            title: data.data.type,
            description: data.data.isFor,
            date: data.data.createdAt.split('T')[0],
            isFor: data.data.isFor,
            userIdentityId: data.data.userIdentityId,
            isAdmin: data.data.isAdmin,
            lastRead: data.data.lastRead,
            type: data.data.type
        };
    },

    // Update announcement
    updateAnnouncement: async (id: string, payload: UpdateAnnouncementPayload): Promise<Announcement> => {
        const { data } = await axiosClient.put<{ data: NotificationResponse }>(`/notifications/${id}`, {
            ...(payload.title && { type: payload.title }),
            ...(payload.description && { isFor: payload.description }),
            ...(payload.lastRead !== undefined && { lastRead: payload.lastRead })
        });
        
        return {
            id: data.data.id,
            title: data.data.type,
            description: data.data.isFor,
            date: data.data.createdAt.split('T')[0],
            isFor: data.data.isFor,
            userIdentityId: data.data.userIdentityId,
            isAdmin: data.data.isAdmin,
            lastRead: data.data.lastRead,
            type: data.data.type
        };
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
        const { data } = await axiosClient.patch<{ data: NotificationResponse }>(`/notifications/${id}/read`, {
            lastRead: true
        });
        
        return {
            id: data.data.id,
            title: data.data.type,
            description: data.data.isFor,
            date: data.data.createdAt.split('T')[0],
            isFor: data.data.isFor,
            userIdentityId: data.data.userIdentityId,
            isAdmin: data.data.isAdmin,
            lastRead: data.data.lastRead,
            type: data.data.type
        };
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
        const { data } = await axiosClient.get<ApiResponse<NotificationResponse>>(`/notifications/user/${userId}`);
        
        return data.data.map(notification => ({
            id: notification.id,
            title: notification.type,
            description: notification.isFor,
            date: notification.createdAt.split('T')[0],
            isFor: notification.isFor,
            userIdentityId: notification.userIdentityId,
            isAdmin: notification.isAdmin,
            lastRead: notification.lastRead,
            type: notification.type
        }));
    },

    // Get announcements by type
    getAnnouncementsByType: async (type: string): Promise<Announcement[]> => {
        const { data } = await axiosClient.get<ApiResponse<NotificationResponse>>("/notifications", {
            params: { type }
        });
        
        return data.data.map(notification => ({
            id: notification.id,
            title: notification.type,
            description: notification.isFor,
            date: notification.createdAt.split('T')[0],
            isFor: notification.isFor,
            userIdentityId: notification.userIdentityId,
            isAdmin: notification.isAdmin,
            lastRead: notification.lastRead,
            type: notification.type
        }));
    },

    // Search announcements
    searchAnnouncements: async (query: string): Promise<Announcement[]> => {
        const { data } = await axiosClient.get<ApiResponse<NotificationResponse>>("/notifications/search", {
            params: { q: query }
        });
        
        return data.data.map(notification => ({
            id: notification.id,
            title: notification.type,
            description: notification.isFor,
            date: notification.createdAt.split('T')[0],
            isFor: notification.isFor,
            userIdentityId: notification.userIdentityId,
            isAdmin: notification.isAdmin,
            lastRead: notification.lastRead,
            type: notification.type
        }));
    },

    // Get announcements by date range
    getAnnouncementsByDateRange: async (from: string, to: string): Promise<Announcement[]> => {
        const { data } = await axiosClient.get<ApiResponse<NotificationResponse>>("/notifications", {
            params: { from, to }
        });
        
        return data.data.map(notification => ({
            id: notification.id,
            title: notification.type,
            description: notification.isFor,
            date: notification.createdAt.split('T')[0],
            isFor: notification.isFor,
            userIdentityId: notification.userIdentityId,
            isAdmin: notification.isAdmin,
            lastRead: notification.lastRead,
            type: notification.type
        }));
    },

    // Get recent announcements
    getRecentAnnouncements: async (days: number = 7): Promise<Announcement[]> => {
        const to = new Date().toISOString();
        const from = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
        return AnnouncementService.getAnnouncementsByDateRange(from, to);
    }
};