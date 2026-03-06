import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import { AnnouncementServices } from "@services/announcement.service";
import { toaster } from "@components/ui/toaster";
import { Box, Flex, Text, Spinner, Input } from "@chakra-ui/react";
import CreateAnnouncementModal from "@components/announcements/CreateAnnouncementModal";

interface Announcement {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    isFor: string;
    isRead: boolean;
}

const AnnouncementsPage = () => {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [showCreate, setShowCreate] = useState(false);

    const fetchAnnouncements = async () => {
        try {
            setLoading(true);
            const response = await AnnouncementServices.getAnnouncements();
            const data = response?.data || [];

            const transformed = data.map((item: any) => ({
                id: item.id,
                title: item.title,
                content: item.body,
                createdAt: item.createdAt,
                isFor: item.isFor,
                isRead: item.isRead,
            }));

            setAnnouncements(transformed);
        } catch (err) {
            console.error("Failed to fetch announcements", err);
            toaster.error({ title: "Failed to load announcements" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const formatDate = (dateString: string) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleDateString("en-CA");
    };

    const filteredAnnouncements = announcements.filter((item) => {
        if (!dateFrom && !dateTo) return true;
        const itemDate = new Date(item.createdAt).setHours(0, 0, 0, 0);
        const from = dateFrom ? new Date(dateFrom).setHours(0, 0, 0, 0) : null;
        const to = dateTo ? new Date(dateTo).setHours(0, 0, 0, 0) : null;
        if (from && itemDate < from) return false;
        if (to && itemDate > to) return false;
        return true;
    });

    const handleClearFilters = () => {
        setDateFrom("");
        setDateTo("");
    };

    return (
        <Box maxW="1400px" mx="auto" pb="20">
            {/* Header */}
            <Flex justifyContent="space-between" alignItems="center" mb="6">
                <Text fontSize="2xl" fontWeight="bold" color="slate.900">Announcement</Text>
                <Flex
                    as="button"
                    onClick={() => setShowCreate(true)}
                    bg="#1D7AD9"
                    color="white"
                    px="5"
                    py="2.5"
                    borderRadius="lg"
                    cursor="pointer"
                    alignItems="center"
                    gap="2"
                    fontSize="sm"
                    fontWeight="bold"
                    boxShadow="lg"
                    _hover={{ bg: "blue.700" }}
                    transition="all 0.2s"
                    border="none"
                >
                    <Plus size={18} />
                    Create New Announcement
                </Flex>
            </Flex>

            {/* Date Filters */}
            <Flex justifyContent="flex-end" alignItems="center" mb="8" gap="3">
                <Text fontSize="sm" fontWeight="medium" color="slate.700">From</Text>
                <Box bg="#eff3f6" borderRadius="xl" px="4" py="2.5">
                    <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} bg="transparent" fontSize="sm" fontWeight="medium" color="slate.700" border="none" outline="none" cursor="pointer" p="0" />
                </Box>
                <Text fontSize="sm" fontWeight="medium" color="slate.700" ml="2">To</Text>
                <Box bg="#eff3f6" borderRadius="xl" px="4" py="2.5">
                    <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} bg="transparent" fontSize="sm" fontWeight="medium" color="slate.700" border="none" outline="none" cursor="pointer" p="0" />
                </Box>
                {(dateFrom || dateTo) && (
                    <Box as="button" onClick={handleClearFilters} bg="#eff3f6" _hover={{ bg: "slate.200" }} p="2.5" borderRadius="xl" transition="all 0.2s" color="slate.700" ml="2" border="none" cursor="pointer">
                        <X size={18} />
                    </Box>
                )}
            </Flex>

            {/* Announcements List */}
            <Flex direction="column" gap="4">
                {loading ? (
                    <Flex justifyContent="center" py="20" gap="3">
                        <Spinner size="md" color="#1D7AD9" />
                        <Text color="slate.500" fontWeight="medium">Loading Announcements...</Text>
                    </Flex>
                ) : filteredAnnouncements.length === 0 ? (
                    <Box textAlign="center" py="20" bg="slate.50" borderRadius="2xl" border="1px dashed" borderColor="slate.200">
                        <Text color="slate.500" fontWeight="medium">No announcements found</Text>
                    </Box>
                ) : (
                    filteredAnnouncements.map((item) => (
                        <Box key={item.id} bg="white" borderRadius="xl" p="6" boxShadow="sm" border="1px solid" borderColor="slate.100" _hover={{ boxShadow: "md" }} transition="all 0.2s">
                            <Flex justifyContent="space-between" alignItems="flex-start" mb="2">
                                <Text fontSize="sm" fontWeight="bold" color="slate.800">{item.title}</Text>
                                <Text fontSize="10px" fontWeight="medium" color="slate.400">{formatDate(item.createdAt)}</Text>
                            </Flex>
                            <Text fontSize="xs" color="slate.500" lineHeight="relaxed" lineClamp={2}>{item.content}</Text>
                        </Box>
                    ))
                )}
            </Flex>

            <CreateAnnouncementModal isOpen={showCreate} onClose={() => setShowCreate(false)} onCreated={fetchAnnouncements} />
        </Box>
    );
};

export default AnnouncementsPage;
