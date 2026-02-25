import axiosClient from "@configs/axios.config";
import type { PaymentsApiResponse } from "@type/payment.type";

export const PaymentService = {
    getPayments: async (): Promise<PaymentsApiResponse> => {
        const { data } = await axiosClient.get<PaymentsApiResponse>(
            "/university-admin/payments"
        );
        return data;
    },
};
