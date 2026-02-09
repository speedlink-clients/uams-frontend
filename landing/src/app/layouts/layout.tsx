import ToasterReseter from "@components/shared/ToasterReseter";
import { Toaster } from "@components/ui/toaster";
import { Outlet } from "react-router";
import { Suspense } from "react";

const RootLayout = () => {
    return <>
        <Suspense fallback={<div>Loading...</div>}>
            <Outlet />
        </Suspense>
        <Toaster /> {/* Toast notifications at the root level */}
        <ToasterReseter /> {/* Reset toast notifications on route change */}
    </>


}

export default RootLayout;