import { Box, Flex } from "@chakra-ui/react";
import { Outlet } from "react-router";
import Sidebar from "@components/shared/Sidebar";
import Navbar from "@components/shared/Navbar";
import ToasterReseter from "@components/shared/ToasterReseter";

const SIDEBAR_WIDTH = "255px";

const DashboardLayout = () => {
    return (
        <Flex minH="100vh">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <Box
                ml={SIDEBAR_WIDTH}
                flex="1"
                bg="#f8fafc"
                h="100vh"
                display="flex"
                flexDirection="column"
                position="relative"
                overflow="hidden"
            >
                {/* Top Navbar — sticky */}
                <Box
                    position="sticky"
                    top="0"
                    zIndex="10"
                    flexShrink={0}
                >
                    <Navbar />
                </Box>

                {/* Page Content */}
                <Box flex="1" px="10" py="8" overflow="auto" minW="0">
                    <Outlet />
                    <ToasterReseter />
                </Box>
            </Box>
        </Flex>
    );
};

export default DashboardLayout;
