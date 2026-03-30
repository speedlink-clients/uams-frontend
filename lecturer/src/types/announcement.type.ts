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
    isFor: string;
    universityId: string;        
    departmentId: string;         
    title: string;
    body: string;                 
    data: any | null;            
    isRead: boolean;              
    createdAt: string;            
    userIdentityId?: string;      
    isAdmin?: boolean;            
    lastRead?: boolean;           
    type?: string;               
}


export interface AnnouncementWithCompatibility extends Announcement {
    get description(): string;
    get date(): string;
}

// Or create a transformer func
export const transformAnnouncement = (item: Announcement): Announcement => {
    return {
        ...item,
    } as Announcement & { description?: string; date?: string };
};


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