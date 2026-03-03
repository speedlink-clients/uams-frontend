import { Box, Button, EmptyState, Flex, Stack, Text } from "@chakra-ui/react";
import CreateProjectTopicDialog from "./_components/CreateProjectTopicDialog";
import { TextAlignCenter } from "lucide-react";

const Projects = () => {
    return (
        <Box p="6">
            <Flex justify="space-between" align="center">
                <Text fontSize="2xl" fontWeight="bold">
                    Projects
                </Text>

                {/* <CreateProjectTopicDialog /> */}
            </Flex>

            <EmptyState.Root>
                <EmptyState.Content>
                    <EmptyState.Indicator>
                        <TextAlignCenter />
                    </EmptyState.Indicator>
                    <Stack textAlign="center">
                        <EmptyState.Title>
                            No project topics found
                        </EmptyState.Title>
                        <EmptyState.Description>
                            Add a new project topic to get started
                        </EmptyState.Description>
                    </Stack>
                    <CreateProjectTopicDialog />
                </EmptyState.Content>
            </EmptyState.Root>
        </Box>
    );
};

export default Projects;
