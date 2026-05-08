import { useState, useEffect } from "react";
import { Users, CreditCard, UserCheck } from "lucide-react";
import { StatCard } from "@components/dashboard/StatCard";
import axiosClient from "@configs/axios.config";
import { Box, Flex, Text, Spinner, Grid, Button } from "@chakra-ui/react";

const StatsContainer = () => {
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalRevenue: 0,
        academicStaff: 0,
        isLoading: true,
        error: null as string | null,
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [studentsRes, usersRes, transactionsRes] = await Promise.all([
                axiosClient.get("/university-admin/students", { params: { limit: 1, page: 1 } }),
                axiosClient.get("/university-admin/users"),
                axiosClient.get("/annual-access-fee/transactions-all"),
            ]);

            const users = usersRes.data.users || [];
            const transactions = transactionsRes.data;
            const studentCount = studentsRes.data.pagination?.total || 0;

            const academicStaffCount = users.filter(
                (user: any) =>
                    user.role === "LECTURER" ||
                    user.role === "FACULTY_ADMIN" ||
                    user.role === "DEPARTMENT_ADMIN" ||
                    user.role === "UNIVERSITYADMIN"
            ).length;

            const totalRevenue = transactions.success ? transactions.statistics.totalAmount : 0;

            setStats({ totalStudents: studentCount, totalRevenue, academicStaff: academicStaffCount, isLoading: false, error: null });
        } catch (err: any) {
            setStats((prev) => ({
                ...prev,
                isLoading: false,
                error: err.response?.data?.message || "Failed to load statistics",
            }));
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    if (stats.isLoading) {
        return (
            <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap="6">
                {[1, 2, 3].map((i) => (
                    <Box key={i} bg="bg" p="6" borderRadius="md" border="xs" borderColor="border.muted">
                        <Flex alignItems="center" justifyContent="center" h="20">
                            <Spinner size="md" color="blue.500" />
                        </Flex>
                    </Box>
                ))}
            </Grid>
        );
    }

    if (stats.error) {
        return (
            <Box bg="red.50" border="xs" borderColor="red.200" borderRadius="md" p="6" textAlign="center">
                <Text color="red.600" fontWeight="medium">{stats.error}</Text>
                <Button
                    onClick={fetchData}
                    mt="3"
                    px="4"
                    py="2"
                    bg="red.100"
                    color="red.700"
                    borderRadius="sm"
                    _hover={{ bg: "red.200" }}
                    transition="all 0.2s"
                    fontSize="sm"
                    fontWeight="medium"
                    cursor="pointer"
                    size="sm"
                >
                    Retry
                </Button>
            </Box>
        );
    }

    return (
        <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap="6">
            <StatCard
                label="Total Students"
                value={stats.totalStudents.toLocaleString()}
                icon={<Users size={24} />}
                bgColor="orange.50"
                description={`${stats.totalStudents} registered students`}
            />
            <StatCard
                label="Total Revenue (Dept)"
                value={formatCurrency(stats.totalRevenue)}
                icon={<CreditCard size={24} />}
                bgColor="green.50"
                description="Total annual revenue"
            />
            <StatCard
                label="Academic Staff"
                value={stats.academicStaff.toString()}
                icon={<UserCheck size={24} />}
                bgColor="blue.50"
                description={`${stats.academicStaff} academic personnel`}
            />
        </Grid>
    );
};

export default StatsContainer;
