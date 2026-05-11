import { useState, useEffect, useMemo } from "react";
import { Search, History } from "lucide-react";
import { toaster } from "@components/ui/toaster";
import {
  Box, Flex, Text, Input, Spinner,
  InputGroup,
  EmptyState
} from "@chakra-ui/react";
import {
  TimelineConnector,
  TimelineContent,
  TimelineDescription,
  TimelineItem,
  TimelineRoot,
  TimelineTitle,
} from "@components/ui/timeline";
import { AuditLogServices } from "@services/auditLog.service";
import type { AuditLog } from "@type/audit.type";

const ITEMS_PER_PAGE = 10;

const AuditLogsPage = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await AuditLogServices.getAuditLogs();
      const data = response?.data?.data || [];
      setLogs(data);
    } catch (err) {
      console.error("Failed to fetch audit logs", err);
      toaster.error({ title: "Failed to load audit logs" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = useMemo(() => {
    let result = logs;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (log) =>
          log.action.toLowerCase().includes(q) ||
          log.entity.toLowerCase().includes(q) ||
          log.userId.toLowerCase().includes(q)
      );
    }
    return result;
  }, [logs, searchQuery]);

  const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE);
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <Box>
      <Flex direction={{ base: "column", md: "row" }} justifyContent="space-between" alignItems={{ base: "flex-start", md: "center" }} mb="6" gap="4">
        <Box>
          <Text fontSize="2xl" fontWeight="bold" color="slate.800">Audit Logs</Text>
          <Text fontSize="sm" color="slate.500">Monitor system activity and user actions</Text>
        </Box>
        <Flex gap="3" flexWrap="nowrap" alignItems="center" w={{ base: "full", md: "auto" }}>
          <InputGroup startElement={<Search size={18} color="#94a3b8" />} flex="1">
            <Input
              placeholder="Search by action, entity or user ID"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              bg="white"
              border="xs"
              borderColor="border.muted"
              borderRadius="xl"
              py="2.5"
              pl="10"
              pr="4"
              fontSize="sm"
              w="full"
              maxW={{ base: "full", md: "320px" }}
              _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px #3b82f6" }}
            />
          </InputGroup>
        </Flex>
      </Flex>

      {/* Timeline */}
      <Box bg="white" borderRadius="2xl" border="xs" borderColor="border.muted" boxShadow="sm" overflow="hidden">
        <Box p={{ base: "4", md: "8" }}>
        {loading ? (
          <Flex direction="column" alignItems="center" justify="center" py="12" gap="4">
            <Spinner size="xl" color="blue.500" borderWidth="3px" />
            <Text color="slate.500">Loading audit logs...</Text>
          </Flex>
        ) : paginatedLogs.length === 0 ? (
          <Flex justify="center" py="12">
            <EmptyState.Root>
                <EmptyState.Content>
                    <EmptyState.Indicator>
                        <History />
                    </EmptyState.Indicator>
                    <EmptyState.Title>No Logs Found</EmptyState.Title>
                    <EmptyState.Description>
                        {searchQuery ? "Try adjusting your search criteria" : "No activity has been logged yet"}
                    </EmptyState.Description>
                </EmptyState.Content>
            </EmptyState.Root>
          </Flex>
        ) : (
          <TimelineRoot maxW="3xl" mx="auto">
            {paginatedLogs.map((log) => (
              <TimelineItem key={log.id}>
                <TimelineContent width="auto" minW="140px" textAlign="right" pr="4">
                  <Text fontSize="sm" fontWeight="semibold" color="slate.500">
                    {formatDate(log.createdAt).split(",")[0]}
                  </Text>
                  <Text fontSize="xs" color="slate.400">
                    {formatDate(log.createdAt).split(",")[1]?.trim()}
                  </Text>
                </TimelineContent>
                <TimelineConnector bg="white" color="blue.500">
                  <History size={14} />
                </TimelineConnector>
                <TimelineContent pl="4" pb="8">
                  <TimelineTitle>
                    <Flex gap="2" align="center" flexWrap="wrap">
                      <Text as="span" px="2" py="0.5" bg="blue.50" color="blue.600" borderRadius="md" fontSize="xs" fontWeight="bold">
                        {log.action}
                      </Text>
                      <Text as="span" fontWeight="bold" color="slate.700">
                        {log.entity}
                      </Text>
                      {log.entityId && (
                        <Text as="span" fontSize="xs" color="slate.400">
                          #{log.entityId}
                        </Text>
                      )}
                    </Flex>
                  </TimelineTitle>
                  <TimelineDescription mt="2" color="slate.500" fontSize="sm">
                    <Flex gap="4" mt="1" flexWrap="wrap">
                      <Text><strong>User:</strong> {log.userId}</Text>
                      <Text><strong>IP:</strong> {log.ipAddress || "Unknown"}</Text>
                    </Flex>
                  </TimelineDescription>
                </TimelineContent>
              </TimelineItem>
            ))}
          </TimelineRoot>
        )}
        </Box>

        {totalPages > 0 && (
            <Flex alignItems="center" justifyContent="space-between" bg="white" p="4" borderTop="xs" borderColor="border.muted">
              <Text fontSize="sm" color="slate.500">
                Showing{" "}
                <Text as="span" fontWeight="semibold">{(currentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredLogs.length)}</Text>
                {" "}of <Text as="span" fontWeight="semibold">{filteredLogs.length}</Text> logs
                (Total: {logs.length})
              </Text>
              <Flex alignItems="center" gap="2">
                <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} style={{ padding: "8px 12px", background: "white", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "14px", fontWeight: 500, color: "#334155", cursor: currentPage === 1 ? "not-allowed" : "pointer", opacity: currentPage === 1 ? 0.5 : 1 }}>
                  Previous
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <Box as="button" key={pageNum} onClick={() => setCurrentPage(pageNum)} px="3" py="2" borderRadius="lg" fontSize="sm" fontWeight="medium" cursor="pointer" border={currentPage === pageNum ? "none" : "1px solid"} borderColor="border.muted" bg={currentPage === pageNum ? "#1D7AD9" : "white"} color={currentPage === pageNum ? "white" : "slate.700"} _hover={{ bg: currentPage === pageNum ? "#1D7AD9" : "slate.50" }}>
                      {pageNum}
                    </Box>
                  );
                })}
                <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} style={{ padding: "8px 12px", background: "white", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "14px", fontWeight: 500, color: "#334155", cursor: currentPage === totalPages ? "not-allowed" : "pointer", opacity: currentPage === totalPages ? 0.5 : 1 }}>
                  Next
                </button>
              </Flex>
            </Flex>
          )}
        </Box>
    </Box>
  );
};

export default AuditLogsPage;
