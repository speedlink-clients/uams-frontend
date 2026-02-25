import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { PaymentService } from "@services/payment.service";
import type { PaymentsApiResponse } from "@type/payment.type";

export const PaymentHook = {
    usePayments: (options?: Partial<UseQueryOptions<PaymentsApiResponse>>) =>
        useQuery<PaymentsApiResponse>({
            queryKey: ["payments"],
            queryFn: () => PaymentService.getPayments(),
            staleTime: 5 * 60 * 1000,
            ...options,
        }),
};
