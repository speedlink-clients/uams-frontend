import axiosClient from "@configs/axios.config"

export const AuditLogServices = {
    getAuditLogs: async () => {
        const { data } = await axiosClient.get("/audit-logs");
        return data;
    },
}
