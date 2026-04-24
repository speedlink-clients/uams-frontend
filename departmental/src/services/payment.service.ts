import axiosClient from "@configs/axios.config"

export const PaymentServices = {
    getPaymentsSummary: async () => {
        const { data } = await axiosClient.get("/university-admin/payments");
        return data;
    },

    getPaymentConfig: async (sessionId: string, programTypeId: string) => {
        const { data } = await axiosClient.get(`/university-admin/payment-config?academic_session_id=${sessionId}&program_type_id=${programTypeId}`);
        return data;
    },

    patchPaymentConfig: async (payload: any) => {
        const { data } = await axiosClient.patch("/university-admin/payment-config", payload);
        return data;
    },

    getPaymentReceipt: async (paymentId: string) => {
        const { data } = await axiosClient.get(`/university-admin/payments/${paymentId}/receipt`, { responseType: "blob" });
        return data;
    },

    getTranscriptApplications: async (programTypeId?: string) => {
        const params = programTypeId ? { program_type_id: programTypeId } : {};
        const { data } = await axiosClient.get("/university-admin/transcripts/applications", { params });
        return data;
    }
}