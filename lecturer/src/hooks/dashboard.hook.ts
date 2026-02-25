import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { DashboardService } from "@services/dashboard.service";
import type { DashboardResponse } from "@type/dashboard.type";

export const DashboardHook = {
    useDashboardData: (options?: Partial<UseQueryOptions<DashboardResponse["data"]>>) =>
        useQuery<DashboardResponse["data"]>({
            queryKey: ["dashboard", "data"],
            queryFn: DashboardService.getDashboardData,
            staleTime: 5 * 60 * 1000,
            ...options,
        }),
};
