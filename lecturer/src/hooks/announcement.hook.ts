import { useQuery, useMutation, type UseQueryOptions } from "@tanstack/react-query";
import type { Announcement, CreateAnnouncementPayload } from "@type/announcement.type";

// ── Mock Data ────────────────────────────────────────────────────────

const MOCK_ANNOUNCEMENTS: Announcement[] = [
    { id: "1", title: "Matriculation Date Released", description: "The Math tast scheduled for 2nd January has been cancelled. A new date will be announced soon", date: "2025-01-02" },
    { id: "2", title: "Field Trip Rescheduled", description: "The field trip to London has been rescheduled. Please check back for the new date and further instructions", date: "2025-01-02" },
    { id: "3", title: "Field Trip Rescheduled", description: "The field trip to London has been rescheduled. Please check back for the new date and further instructions", date: "2025-01-02" },
    { id: "4", title: "About Mth 110 Test", description: "The Math tast scheduled for 2nd January has been cancelled. A new date will be announced soon", date: "2025-01-02" },
    { id: "5", title: "Matriculation Date Released", description: "The Math tast scheduled for 2nd January has been cancelled. A new date will be announced soon", date: "2025-01-02" },
    { id: "6", title: "Field Trip Rescheduled", description: "The field trip to London has been rescheduled. Please check back for the new date and further instructions", date: "2025-01-02" },
    { id: "7", title: "Field Trip Rescheduled", description: "The field trip to London has been rescheduled. Please check back for the new date and further instructions", date: "2025-01-02" },
    { id: "8", title: "About Mth 110 Test", description: "The Math tast scheduled for 2nd January has been cancelled. A new date will be announced soon", date: "2025-01-02" },
    { id: "9", title: "Matriculation Date Released", description: "The Math tast scheduled for 2nd January has been cancelled. A new date will be announced soon", date: "2025-01-02" },
];

// ── Hooks ────────────────────────────────────────────────────────────

export const AnnouncementHook = {
    useAnnouncements: (
        from?: string,
        to?: string,
        options?: Partial<UseQueryOptions<Announcement[]>>
    ) =>
        useQuery<Announcement[]>({
            queryKey: ["announcements", from, to],
            // TODO: swap with AnnouncementService.getAnnouncements(from, to)
            queryFn: async () => MOCK_ANNOUNCEMENTS,
            staleTime: 5 * 60 * 1000,
            ...options,
        }),

    useCreateAnnouncement: () =>
        useMutation({
            // TODO: swap with AnnouncementService.createAnnouncement
            mutationFn: async (payload: CreateAnnouncementPayload) => {
                console.log("Creating announcement:", payload);
                return { id: Date.now().toString(), ...payload, date: new Date().toISOString().slice(0, 10) } as Announcement;
            },
        }),
};
