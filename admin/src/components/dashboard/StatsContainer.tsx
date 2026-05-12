import { useState, useEffect } from "react";
import { Users, CreditCard, UserCog, GraduationCap } from "lucide-react";
import { StatCard } from "@components/dashboard/StatCard";
import { DashboardServices } from "@services/dashboard.service";
import { Box, Flex, Text, Spinner, Grid, Button } from "@chakra-ui/react";

const StatsContainer = () => {
    const [stats, setStats] = useState({
        totalActiveStudents: 0,
        totalAlumni: 0,
        totalStaffs: 0,
        totalRevenue: 0,
        isLoading: true,
        error: null as string | null,
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const response = await DashboardServices.getDashboardStats();
            const data = response?.data || {};
            
            setStats({
                totalActiveStudents: data.totalActiveStudents || 0,
                totalAlumni: data.totalAlumni || 0,
                totalStaffs: data.totalStaffs || 0,
                totalRevenue: data.totalRevenue || 0,
                isLoading: false,
                error: null
            });
        } catch (err: any) {
            setStats((prev) => ({
                ...prev,
                isLoading: false,
                error: err.response?.data?.message || "Failed to load statistics",
            }));
        }
    };

    const setIsLoading = (loading: boolean) => {
        setStats(prev => ({ ...prev, isLoading: loading }));
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
            <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", xl: "repeat(4, 1fr)" }} gap="6">
                {[1, 2, 3, 4].map((i) => (
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
        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", xl: "repeat(4, 1fr)" }} gap="6">
            <StatCard
                label="Total Revenue"
                value={formatCurrency(stats.totalRevenue)}
                icon={<CreditCard size={24} />}
                bgColor="none"
                description="Aggregated collection"
            />
            <StatCard
                label="Active Students"
                value={stats.totalActiveStudents.toLocaleString()}
                icon={<Users size={24} />}
                bgColor="none"
                description={`${stats.totalActiveStudents} students in session`}
            />
            <StatCard
                label="Alumni"
                value={stats.totalAlumni.toLocaleString()}
                icon={<GraduationCap size={24} />}
                bgColor="none"
                description={`${stats.totalAlumni} total graduates`}
            />
            <StatCard
                label="Total Staff"
                value={stats.totalStaffs.toLocaleString()}
                icon={<UserCog size={24} />}
                bgColor="none"
                description={`${stats.totalStaffs} total staff`}
            />
        </Grid>
    );
};

export default StatsContainer;
