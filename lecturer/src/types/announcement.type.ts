export interface Announcement {
    id: string;
    title: string;
    description: string;
    date: string;
}

export interface CreateAnnouncementPayload {
    title: string;
    recipients: string[];
    description: string;
}
