import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router";
import Navbar from "../../components/shared/Navbar";
import Footer from "../../components/shared/Footer";

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
