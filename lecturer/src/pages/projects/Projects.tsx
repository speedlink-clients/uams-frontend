import { useState } from "react";
import { Box, Flex, Text, Heading } from "@chakra-ui/react";
import { ProjectHook } from "@hooks/project.hook";
import ProjectsTable from "@components/shared/ProjectsTable";

const PROGRAM_TYPES = ["All", "Regular", "Part-Time", "Sandwich"];
const LEVELS = ["All", "100", "200", "300", "400", "500"];
const SESSIONS = ["All", "2023/2024", "2024/2025", "2025/2026"];

const Projects = () => {
    const [programType, setProgramType] = useState("All");
    const [level, setLevel] = useState("All");
    const [session, setSession] = useState("All");

    const { data: projects, isLoading } = ProjectHook.useProjects({
        programType, level, session,
    });

    const totalCount = projects?.length ?? 0;

    return (
        <Box>
            {/* Header + Filters */}
            <Flex align="center" justify="space-between" mb="5">
                <Heading size="lg" fontWeight="600" color="#000000" fontSize="24px">
                    Projects{" "}
                    <Text as="span" fontWeight="400" color="gray.400" fontSize="lg">
                        ({totalCount})
                    </Text>
                </Heading>

                <Flex gap="3">
                    <select
                        value={programType}
                        onChange={(e) => setProgramType(e.target.value)}
                        style={{
                            fontSize: "12px",
                            fontWeight: 500,
                            color: "#4A5568",
                            border: "1px solid #E2E8F0",
                            borderRadius: "6px",
                            padding: "8px 12px",
                            cursor: "pointer",
                            outline: "none",
                            background: "white",
                        }}
                    >
                        {PROGRAM_TYPES.map((t) => (
                            <option key={t} value={t}>
                                {t === "All" ? "Program Type" : t}
                            </option>
                        ))}
                    </select>

                    <select
                        value={level}
                        onChange={(e) => setLevel(e.target.value)}
                        style={{
                            fontSize: "12px",
                            fontWeight: 500,
                            color: "#4A5568",
                            border: "1px solid #E2E8F0",
                            borderRadius: "6px",
                            padding: "8px 12px",
                            cursor: "pointer",
                            outline: "none",
                            background: "white",
                        }}
                    >
                        {LEVELS.map((l) => (
                            <option key={l} value={l}>
                                {l === "All" ? "Level" : `${l} Level`}
                            </option>
                        ))}
                    </select>

                    <select
                        value={session}
                        onChange={(e) => setSession(e.target.value)}
                        style={{
                            fontSize: "12px",
                            fontWeight: 500,
                            color: "#4A5568",
                            border: "1px solid #E2E8F0",
                            borderRadius: "6px",
                            padding: "8px 12px",
                            cursor: "pointer",
                            outline: "none",
                            background: "white",
                        }}
                    >
                        {SESSIONS.map((s) => (
                            <option key={s} value={s}>
                                {s === "All" ? "Session" : s}
                            </option>
                        ))}
                    </select>
                </Flex>
            </Flex>

            {/* Projects Table */}
            <ProjectsTable projects={projects ?? []} isLoading={isLoading} />
        </Box>
    );
};

export default Projects;
