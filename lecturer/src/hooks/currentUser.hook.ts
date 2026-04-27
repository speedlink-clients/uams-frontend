import useUserStore from "@stores/user.store";
import type { AuthUser } from "@type/auth.type";

export const useCurrentUser = () => {
    const user = useUserStore((state) => state.user) as AuthUser | null;
    const isHOD = user?.role === "HOD";
    return { user, isHOD };
};