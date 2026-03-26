export interface NotificationResponse {
    id: string;
    isFor: string;
    userIdentityId: string;
    isAdmin: boolean;
    createdAt: string;
    lastRead: boolean;
    type: string;
}

export interface ApiResponse<T> {
    count: number;
    data: T[];
}

export interface Announcement {
    id: string;
    title: string;          
    description: string;   
    date: string;         
    isFor: string;
    userIdentityId: string;
    isAdmin: boolean;
    lastRead: boolean;
    type: string;
}

export interface CreateAnnouncementPayload {
    title: string;          
    recipients: string[];   
    description: string;   
}

export interface UpdateAnnouncementPayload {
    title?: string;         
    description?: string;   
    recipients?: string[];  
    lastRead?: boolean;
    isAdmin?: boolean;
}

export interface AnnouncementFilters {
    from?: string;
    to?: string;
    type?: string;
    userId?: string;
    isAdmin?: boolean;
    lastRead?: boolean;
    limit?: number;
    offset?: number;
    sortBy?: "createdAt" | "type";
    sortOrder?: "asc" | "desc";
}