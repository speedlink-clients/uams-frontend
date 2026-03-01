import axiosClient from "@configs/axios.config";
import type { ResultResponse } from "@type/result.type";

export const ResultService = {
    getResults: async (courseId: string): Promise<ResultResponse[]> => {
        const { data } = await axiosClient.get<{ data: ResultResponse[] }>(`/results/?courseId=${courseId}`)
        return data.data;
    },

    uploadResult: async (formData: FormData): Promise<void> => {
        await axiosClient.put(`/results`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },
};
