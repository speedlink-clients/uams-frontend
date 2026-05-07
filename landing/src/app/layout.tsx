    import { Toaster } from "@components/ui/toaster";
import { Outlet } from "react-router";

const RootLayout = () => {
    return <>
        <Outlet />
        <Toaster /> {/* global toast notifications */}
    </>


}

export default RootLayout;