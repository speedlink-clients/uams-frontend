import { useState, useMemo } from "react";
import { Box, Flex, Text, Heading } from "@chakra-ui/react";
import { ProjectHook } from "@hooks/project.hook";
import ProjectsTable from "@components/shared/ProjectsTable";
import type { ProjectTopic, Student } from "@type/project.type";
import { Toaster } from "@components/ui/toaster";

const PROGRAM_TYPES = ["All", "Regular", "Part-Time", "Sandwich"];
const LEVELS = ["All", "100", "200", "300", "400", "500"];
const SESSIONS = ["All", "2023/2024", "2024/2025", "2025/2026"];

export interface StudentProjects {
    student: Student;
    projects: ProjectTopic[];
}

const Projects = () => {
    const [programType, setProgramType] = useState("All");
    const [level, setLevel] = useState("All");
    const [session, setSession] = useState("All");

    const { data: response, isLoading } = ProjectHook.useProjects({
        programType, level, session,
    });

    const studentProjects = useMemo(() => {
        if (!response?.data) return [];
        const map = new Map<string, StudentProjects>();
        response.data.forEach(project => {
            if (!map.has(project.student.id)) {
                map.set(project.student.id, { student: project.student, projects: [] });
            }
            map.get(project.student.id)!.projects.push(project);
        });
        return Array.from(map.values());
    }, [response?.data]);

    const totalCount = studentProjects.length;

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
            </Flex>

            {/* Projects Table */}
            <ProjectsTable studentProjects={studentProjects} isLoading={isLoading} />

            <Toaster />
        </Box>
    );
};

export default Projects;
