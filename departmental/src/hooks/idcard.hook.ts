import { IDCardServices } from "@services/idcard.service"
import { useQuery, useMutation, type UseQueryOptions, type UseMutationOptions } from "@tanstack/react-query"

export const IDCardHooks = {
    useIDCard: (options?: Partial<UseQueryOptions<unknown>>) => useQuery<unknown>({
        queryKey: ["idcard-default"],
        queryFn: IDCardServices.getDefaultIDCard,
        ...options,
    }),

    useUpdateIDCard: (options?: UseMutationOptions<unknown, Error, { id: string; data: Record<string, unknown> }>) =>
        useMutation({ mutationFn: ({ id, data }) => IDCardServices.updateIDCard(id, data), ...options }),

    useBulkDownloadIDCards: (options?: UseMutationOptions<unknown, Error, { studentIds: string[]; templateId: string }>) =>
        useMutation({ mutationFn: ({ studentIds, templateId }) => IDCardServices.bulkDownloadIDCards(studentIds, templateId), ...options }),

    useBulkDownloadBanner: (options?: UseMutationOptions<unknown, Error, string[]>) =>
        useMutation({ mutationFn: IDCardServices.bulkDownloadBanner, ...options }),
}
