import { useQuery, useMutation, type UseQueryOptions, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";
import type { Announcement, CreateAnnouncementPayload, UpdateAnnouncementPayload } from "@type/announcement.type";
import { AnnouncementService } from "@services/announcement.service";

export const AnnouncementHook = {
  // Get all announcements with optional date filters
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

  // Get single announcement by ID
  useAnnouncement: (
    id: string,
    options?: Partial<UseQueryOptions<Announcement>>
  ) =>
    useQuery<Announcement>({
      queryKey: ["announcement", id],
      queryFn: () => AnnouncementService.getAnnouncementById(id),
      enabled: !!id,
      staleTime: 5 * 60 * 1000,
      ...options,
    }),

  // Create announcement
  useCreateAnnouncement: (
    options?: UseMutationOptions<Announcement, Error, CreateAnnouncementPayload>
  ) => {
    const queryClient = useQueryClient();
    
    return useMutation<Announcement, Error, CreateAnnouncementPayload>({
      mutationFn: (payload: CreateAnnouncementPayload) => 
        AnnouncementService.createAnnouncement(payload),
      onSuccess: (data, variables, onMutateResult, context) => {
        queryClient.invalidateQueries({ queryKey: ["announcements"] });
        options?.onSuccess?.(data, variables, onMutateResult, context);
      },
      ...options,
    });
  },

  // Update announcement
  useUpdateAnnouncement: (
    options?: UseMutationOptions<Announcement, Error, { id: string; payload: UpdateAnnouncementPayload }>
  ) => {
    const queryClient = useQueryClient();
    
    return useMutation<Announcement, Error, { id: string; payload: UpdateAnnouncementPayload }>({
      mutationFn: ({ id, payload }) => 
        AnnouncementService.updateAnnouncement(id, payload),
      onSuccess: (data, variables, onMutateResult, context) => {
        queryClient.invalidateQueries({ queryKey: ["announcements"] });
        queryClient.invalidateQueries({ queryKey: ["announcement", variables.id] });
        options?.onSuccess?.(data, variables, onMutateResult, context);
      },
      ...options,
    });
  },

  // Delete announcement
  useDeleteAnnouncement: (
    options?: UseMutationOptions<void, Error, string>
  ) => {
    const queryClient = useQueryClient();
    
    return useMutation<void, Error, string>({
      mutationFn: (id: string) => AnnouncementService.deleteAnnouncement(id),
      onSuccess: (data, variables, onMutateResult, context) => {
        queryClient.invalidateQueries({ queryKey: ["announcements"] });
        queryClient.removeQueries({ queryKey: ["announcement", variables] });
        options?.onSuccess?.(data, variables, onMutateResult, context);
      },
      ...options,
    });
  },

  // Delete multiple announcements
  useDeleteMultipleAnnouncements: (
    options?: UseMutationOptions<void, Error, string[]>
  ) => {
    const queryClient = useQueryClient();
    
    return useMutation<void, Error, string[]>({
      mutationFn: (ids: string[]) => AnnouncementService.deleteMultipleAnnouncements(ids),
      onSuccess: (data, variables, onMutateResult, context) => {
        queryClient.invalidateQueries({ queryKey: ["announcements"] });
        variables.forEach(id => {
          queryClient.removeQueries({ queryKey: ["announcement", id] });
        });
        options?.onSuccess?.(data, variables, onMutateResult, context);
      },
      ...options,
    });
  },

  // Mark announcement as read
  useMarkAsRead: (
    options?: UseMutationOptions<Announcement, Error, string>
  ) => {
    const queryClient = useQueryClient();
    
    return useMutation<Announcement, Error, string>({
      mutationFn: (id: string) => AnnouncementService.markAsRead(id),
      onSuccess: (data, variables, onMutateResult, context) => {
        queryClient.invalidateQueries({ queryKey: ["announcements"] });
        queryClient.invalidateQueries({ queryKey: ["announcement", variables] });
        queryClient.invalidateQueries({ queryKey: ["unread-count"] });
        options?.onSuccess?.(data, variables, onMutateResult, context);
      },
      ...options,
    });
  },

  // Mark multiple announcements as read
  useMarkMultipleAsRead: (
    options?: UseMutationOptions<void, Error, string[]>
  ) => {
    const queryClient = useQueryClient();
    
    return useMutation<void, Error, string[]>({
      mutationFn: (ids: string[]) => AnnouncementService.markMultipleAsRead(ids),
      onSuccess: (data, variables, onMutateResult, context) => {
        queryClient.invalidateQueries({ queryKey: ["announcements"] });
        queryClient.invalidateQueries({ queryKey: ["unread-count"] });
        options?.onSuccess?.(data, variables, onMutateResult, context);
      },
      ...options,
    });
  },

  // Get unread announcements count
  useUnreadCount: (
    options?: Partial<UseQueryOptions<number>>
  ) =>
    useQuery<number>({
      queryKey: ["unread-count"],
      queryFn: () => AnnouncementService.getUnreadCount(),
      staleTime: 1 * 60 * 1000,
      refetchInterval: 5 * 60 * 1000,
      ...options,
    }),

  // Get announcements by user
  useAnnouncementsByUser: (
    userId: string,
    options?: Partial<UseQueryOptions<Announcement[]>>
  ) =>
    useQuery<Announcement[]>({
      queryKey: ["announcements", "user", userId],
      queryFn: () => AnnouncementService.getAnnouncementsByUser(userId),
      enabled: !!userId,
      staleTime: 5 * 60 * 1000,
      ...options,
    }),

  // Get announcements by type
  useAnnouncementsByType: (
    type: string,
    options?: Partial<UseQueryOptions<Announcement[]>>
  ) =>
    useQuery<Announcement[]>({
      queryKey: ["announcements", "type", type],
      queryFn: () => AnnouncementService.getAnnouncementsByType(type),
      enabled: !!type,
      staleTime: 5 * 60 * 1000,
      ...options,
    }),

  // Search announcements
  useSearchAnnouncements: (
    query: string,
    options?: Partial<UseQueryOptions<Announcement[]>>
  ) =>
    useQuery<Announcement[]>({
      queryKey: ["announcements", "search", query],
      queryFn: () => AnnouncementService.searchAnnouncements(query),
      enabled: !!query && query.length >= 2,
      staleTime: 2 * 60 * 1000,
      ...options,
    }),

  // Get announcements by date range
  useAnnouncementsByDateRange: (
    from: string,
    to: string,
    options?: Partial<UseQueryOptions<Announcement[]>>
  ) =>
    useQuery<Announcement[]>({
      queryKey: ["announcements", "dateRange", from, to],
      queryFn: () => AnnouncementService.getAnnouncementsByDateRange(from, to),
      enabled: !!from && !!to,
      staleTime: 5 * 60 * 1000,
      ...options,
    }),

  // Get recent announcements
  useRecentAnnouncements: (
    days: number = 7,
    options?: Partial<UseQueryOptions<Announcement[]>>
  ) =>
    useQuery<Announcement[]>({
      queryKey: ["announcements", "recent", days],
      queryFn: () => AnnouncementService.getRecentAnnouncements(days),
      staleTime: 3 * 60 * 1000,
      ...options,
    }),
};