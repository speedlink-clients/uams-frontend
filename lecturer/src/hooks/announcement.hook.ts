import { useQuery, useMutation, type UseQueryOptions, useQueryClient } from "@tanstack/react-query";
import type { Announcement, CreateAnnouncementPayload } from "@type/announcement.type";
import { AnnouncementService } from "@services/announcement.service";

// ── Hooks ────────────────────────────────────────────────────────────

export const AnnouncementHook = {
    useAnnouncements: (
        from?: string,
        to?: string,
        options?: Partial<UseQueryOptions<Announcement[]>>
    ) =>
        useQuery<Announcement[]>({
            queryKey: ["announcements", from, to],
            queryFn: () => AnnouncementService.getAnnouncements(from, to),
            staleTime: 5 * 60 * 1000,
            ...options,
        }),

    useCreateAnnouncement: () => {
        const queryClient = useQueryClient();
        
        return useMutation({
            mutationFn: (payload: CreateAnnouncementPayload) => 
                AnnouncementService.createAnnouncement(payload),
            onSuccess: () => {
                // Invalidate all announcements queries to trigger refetch
                queryClient.invalidateQueries({ queryKey: ["announcements"] });
            },
        });
    },
};