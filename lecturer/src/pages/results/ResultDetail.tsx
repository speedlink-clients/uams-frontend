import { useCallback, useMemo, useState } from "react";
import { Box, Text, Heading, Button, Stack, Table, DownloadTrigger, FileUpload, Dialog, Portal, CloseButton, Badge, For, Flex } from "@chakra-ui/react";
import { Download, ArrowLeft, UploadCloud, FileUp, } from "lucide-react";
import { Link, useParams } from "react-router";
import { ResultHook } from "@hooks/result.hook";
import { CourseHook } from "@hooks/course.hook";
import axios from "axios";
import axiosClient from "@configs/axios.config";
import { toaster, Toaster } from "@components/ui/toaster";
import useUserStore from "@stores/user.store";

const ResultDetail = () => {
    const { courseId } = useParams();
    const { user } = useUserStore();
    const isERO = useMemo(() => user?.role === "ERO", [user]);

    const { data: results, isLoading } = ResultHook.useResults(courseId || "");
    const { data: courseData } = CourseHook.useCourse(courseId!);
    const { data: courseOwnership } = CourseHook.useCheckCourseOwnership(courseId!);

    const isResultUploadedForActiveSession = useMemo(() => {
        return courseOwnership?.isAssigned && results?.find(r => r.session?.isActive) !== undefined
    }, [courseOwnership, results])

    const handleResultDownload = useCallback(async (fileUrl: string, type: string) => {
        const response = await axiosClient.get(fileUrl, {
            params: {
                type: type,
            },
            responseType: "blob"
        });
        return response.data as Promise<Blob> // This returns the blob
    }, []);

    // const uploadMutation = ResultHook.useUploadResult();

    const tableItems = useMemo(() => {
        return results?.map((result) => ({
            id: result.id,
            session: result?.session?.name || "",
            level: result?.level?.name || "",
            semester: result?.semester?.name || "",
            isApproved: result?.isApproved || false,
            fileDownloadUrl: result?.file?.downloadUrl || "",
            fileName: result?.file?.filename || "",
            fileMimeType: result?.file?.mimeType || "",
            finalResultDownloadUrl: result?.finalResult?.downloadUrl || "",
            finalResultFileName: result?.finalResult?.filename || "",
            finalResultMimeType: result?.finalResult?.mimeType || "",
        })) || [];
    }, [results])

    if (isLoading) return <Text>Loading results...</Text>


    return (
        <Stack gap="4">
            <Link to="/results">
                <Button size="xs" variant="ghost">
                    <ArrowLeft /> Back
                </Button>
            </Link>

            <Heading>{courseData?.title} ({courseData?.code})</Heading>

            <Box p="4" bg="bg" rounded="md" spaceY="4">
                <Flex justify="space-between">
                    <Heading>Results</Heading>
                    {(courseOwnership?.isAssigned && !isResultUploadedForActiveSession) && <ResultUploadDialog type={"RESULT"} courseId={courseId!} />}
                </Flex>

                <Table.ScrollArea w="full">
                    <Table.Root size="sm" variant="outline">
                        <Table.Header bg="bg">
                            <Table.Row>
                                <Table.ColumnHeader minW="100px">Session</Table.ColumnHeader>
                                <Table.ColumnHeader minW="100px">Level</Table.ColumnHeader>
                                <Table.ColumnHeader minW="100px">Semester</Table.ColumnHeader>
                                <Table.ColumnHeader minW="100px">Status</Table.ColumnHeader>
                                <Table.ColumnHeader minW="100px">Draft</Table.ColumnHeader>
                                <Table.ColumnHeader minW="100px">Final</Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            <For
                                fallback={
                                    <Table.Row columnSpan={"5"}>
                                        <Table.Cell textAlign="center" colSpan={5}>No results found</Table.Cell>
                                    </Table.Row>
                                }
                                each={tableItems}>
                                {(item) => (
                                    <Table.Row key={item.id}>
                                        <Table.Cell>{item.session}</Table.Cell>
                                        <Table.Cell>{item.level}</Table.Cell>
                                        <Table.Cell>{item.semester}</Table.Cell>
                                        <Table.Cell>
                                            <Badge colorPalette={item.isApproved ? "green" : "orange"}>
                                                {item.isApproved ? "Approved" : "Pending"}
                                            </Badge>
                                        </Table.Cell>
                                        <Table.Cell>
                                            {courseOwnership?.isAssigned ?
                                                item.fileDownloadUrl ? (
                                                    <DownloadTrigger
                                                        data={() => handleResultDownload(item.fileDownloadUrl, "RESULT")}
                                                        fileName={item.fileName}
                                                        mimeType={item.fileMimeType || ""}
                                                        asChild
                                                    >
                                                        <Button size="xs" variant="surface">
                                                            <Download /> Download Result
                                                        </Button>
                                                    </DownloadTrigger>
                                                ) : (
                                                    <ResultUploadDialog type={"RESULT"} courseId={courseId!} />
                                                ) :
                                                item.fileDownloadUrl ? (
                                                    <DownloadTrigger
                                                        data={() => handleResultDownload(item.fileDownloadUrl, "RESULT")}
                                                        fileName={item.fileName}
                                                        mimeType={item.fileMimeType || ""}
                                                        asChild
                                                    >
                                                        <Button size="xs" variant="surface">
                                                            <Download /> Download Result
                                                        </Button>
                                                    </DownloadTrigger>
                                                ) : (
                                                    <Text color="fg.subtle">N/A</Text>
                                                )
                                            }
                                        </Table.Cell>
                                        <Table.Cell>
                                            {isERO ?
                                                item.finalResultDownloadUrl ? (
                                                    <DownloadTrigger
                                                        data={() => handleResultDownload(item.finalResultDownloadUrl, "FINAL")}
                                                        fileName={item.finalResultFileName}
                                                        mimeType={item.finalResultMimeType || ""}
                                                        asChild
                                                    >
                                                        <Button size="xs" variant="surface">
                                                            <Download /> Download Final Result
                                                        </Button>
                                                    </DownloadTrigger>
                                                ) : (
                                                    <ResultUploadDialog type={"FINAL"} courseId={courseId!} />
                                                ) : item.finalResultDownloadUrl ? (
                                                    <DownloadTrigger
                                                        data={() => handleResultDownload(item.finalResultDownloadUrl, "FINAL")}
                                                        fileName={item.finalResultFileName}
                                                        mimeType={item.finalResultMimeType || ""}
                                                        asChild
                                                    >
                                                        <Button size="xs" variant="surface">
                                                            <Download /> Download Final Result
                                                        </Button>
                                                    </DownloadTrigger>
                                                ) : (
                                                    <Text color="fg.subtle">N/A</Text>
                                                )
                                            }

                                        </Table.Cell>
                                    </Table.Row>
                                )}
                            </For>
                        </Table.Body>
                    </Table.Root>
                </Table.ScrollArea>

            </Box>
            <Toaster />
        </Stack >
    );
};

export default ResultDetail;


const ResultUploadDialog = ({ courseId, type }: { type: string, courseId: string }) => {
    const { mutate: uploadResult, isPending } = ResultHook.useUploadResult();
    const [file, setFile] = useState<File | null>(null);

    const handleUpload = useCallback(async () => {
        if (!file) return;
        const formData = new FormData();
        formData.append("file", file);
        formData.append("courseId", courseId);
        formData.append("type", type);

        uploadResult(formData, {
            onSuccess() {
                toaster.success({ description: "Result uploaded successfully" });
            },
            onError() {
                toaster.error({ description: "Failed to upload result" });
            }
        });
    }, [file, uploadResult, courseId, type]);

    const handleDownloadTemplateFile = useCallback(async () => {
        const response = await axios.get("/lecturer/result_template_file.xlsx", {
            responseType: "blob"
        });
        return response.data; // This returns the blob
    }, []);


    return (
        <Dialog.Root>
            <Dialog.Trigger asChild>
                <Button size="xs" variant="surface">
                    <UploadCloud /> Upload {type === "RESULT" ? "Result" : "Final Result"}
                </Button>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>Upload {type === "RESULT" ? "Result" : "Final Result"}</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body spaceY="4">
                            <DownloadTrigger
                                data={() => handleDownloadTemplateFile()}
                                fileName={`result_sample_${courseId}.xlsx`}
                                mimeType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                asChild
                            >
                                <Button variant="outline">
                                    <Download /> Download Sample File
                                </Button>
                            </DownloadTrigger>

                            <FileUpload.Root onFileAccept={async (file) => {
                                setFile(file.files[0]);
                            }}>
                                <FileUpload.HiddenInput />
                                <FileUpload.Trigger asChild>
                                    <Button w="full" variant="outline" justifyContent={"start"} size="sm">
                                        <FileUp /> Select file
                                    </Button>
                                </FileUpload.Trigger>
                                <FileUpload.List showSize clearable />
                            </FileUpload.Root>
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Dialog.ActionTrigger asChild>
                                <Button flex="1" variant="outline">Cancel</Button>
                            </Dialog.ActionTrigger>
                            <Button flex="2" onClick={handleUpload} disabled={isPending} loading={isPending} loadingText="Uploading...">Upload</Button>
                        </Dialog.Footer>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>)
}

