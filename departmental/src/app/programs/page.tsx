import { useNavigate, useLocation, Routes, Route } from "react-router";
import { BookOpen, Layers, Calendar, CreditCard } from "lucide-react";
import { Box, Flex, Text } from "@chakra-ui/react";
import StructureTab from "@components/programs/StructureTab";
import ProgramsTab from "@components/programs/ProgramsTab";
import CoursesTab from "@components/programs/CoursesTab";
import ProgramTypeTab from "@components/programs/ProgramTypeTab";
import CreditLimitTab from "@components/programs/CreditLimitTab";

interface TabButtonProps {
    active: boolean;
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
}

const TabButton = ({ active, onClick, icon, label }: TabButtonProps) => (
    <Box
        as="button"
        onClick={onClick}
        display="flex"
        alignItems="center"
        gap="2"
        px="4"
        py="2"
        borderRadius="lg"
        fontSize="sm"
        fontWeight={active ? "bold" : "medium"}
        bg={active ? "white" : "transparent"}
        color={active ? "#1D7AD9" : "slate.500"}
        boxShadow={active ? "sm" : "none"}
        border={active ? "1px solid" : "1px solid transparent"}
        borderColor={active ? "slate.200" : "transparent"}
        transition="all 0.2s"
        cursor="pointer"
        _hover={{ color: active ? "#1D7AD9" : "slate.700", bg: active ? "white" : "slate.100" }}
    >
        {icon}
        {label}
    </Box>
);

const ProgramCoursesPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const getActiveTab = (pathname: string) => {
        if (pathname.includes("/program-types")) return "Program Types";
        if (pathname.includes("/credit-limits")) return "Credit Limits";
        if (pathname.includes("/programs")) return "Programs";
        if (pathname.includes("/courses")) return "Courses";
        return "Structure";
    };

    const activeTab = getActiveTab(location.pathname);

    return (
        <Flex direction="column" gap="6">
            <Flex alignItems="center" justifyContent="space-between" flexWrap="wrap" gap="4">
                <Text fontSize="2xl" fontWeight="bold" color="slate.800">Programs & Courses</Text>
                <Flex bg="slate.100" p="1" borderRadius="xl" overflowX="auto">
                    <TabButton active={activeTab === "Structure"} onClick={() => navigate("/program-courses")} icon={<Calendar size={16} />} label="Setup & Sessions" />
                    <TabButton active={activeTab === "Programs"} onClick={() => navigate("/program-courses/programs")} icon={<Layers size={16} />} label="Programs" />
                    <TabButton active={activeTab === "Courses"} onClick={() => navigate("/program-courses/courses")} icon={<BookOpen size={16} />} label="Course Catalog" />
                    <TabButton active={activeTab === "Credit Limits"} onClick={() => navigate("/program-courses/credit-limits")} icon={<CreditCard size={16} />} label="Credit Limits" />
                    <TabButton active={activeTab === "Program Types"} onClick={() => navigate("/program-courses/program-types")} icon={<Layers size={16} />} label="Program Types" />
                </Flex>
            </Flex>

            <Routes>
                <Route index element={<StructureTab />} />
                <Route path="sessions" element={<StructureTab />} />
                <Route path="sessions/new" element={<StructureTab isCreatingRoute />} />
                <Route path="sessions/edit/:id" element={<StructureTab isEditingRoute />} />
                <Route path="programs" element={<ProgramsTab />} />
                <Route path="programs/new" element={<ProgramsTab isCreatingRoute />} />
                <Route path="programs/edit/:id" element={<ProgramsTab isEditingRoute />} />
                <Route path="courses" element={<CoursesTab />} />
                <Route path="courses/new" element={<CoursesTab isCreatingRoute />} />
                <Route path="courses/edit/:id" element={<CoursesTab isEditingRoute />} />
                <Route path="credit-limits" element={<CreditLimitTab />} />
                <Route path="program-types" element={<ProgramTypeTab />} />
            </Routes>
        </Flex>
    );
};

export default ProgramCoursesPage;
