import ToasterReseter from "@components/shared/ToasterReseter";
import { Toaster } from "@components/ui/toaster";
import { Outlet } from "react-router";
import { Suspense } from "react";

import { Spinner, Center } from "@chakra-ui/react";

const RootLayout = () => {
    return <>
        <Suspense fallback={
            <Center h="100vh">
                <Spinner size="xl" color="blue.500" />
            </Center>
        }>
            <Outlet />
        </Suspense>
        <Toaster /> {/* Toast notifications at the root level */}
        <ToasterReseter /> {/* Reset toast notifications on route change */}
    </>


}

export default RootLayout;