import axiosClient from "@configs/axios.config";

export const UserServices = {
    changePassword: async (payload: { currentPassword: string; newPassword: string }) => {
        const { data } = await axiosClient.patch("/user/update-password", payload);
        return data;
    },
};
