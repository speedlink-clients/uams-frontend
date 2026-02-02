import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router";
import Navbar from "../pages/landing/components/Navbar";
import Footer from "../pages/landing/components/Footer";

const LandingLayout = () => {
    return (
        <Box bg="white">
            <Navbar />
            <Box as="main">
                <Outlet />
            </Box>
            <Footer />
        </Box>
    );
};

export default LandingLayout;
