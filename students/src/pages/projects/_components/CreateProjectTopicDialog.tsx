import { Button, CloseButton, Dialog, Field, Input, Portal, Stack, Textarea } from "@chakra-ui/react"
import { Plus, Loader2 } from "lucide-react";
import { useProjectTopicForm } from "@/forms/projects.forms";
import ProjectHooks from "@/hooks/projects.hooks";
import { useState } from "react";
import { toaster } from "@/components/ui/toaster";
    

const CreateProjectTopicDialog = () => {
    const [open, setOpen] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useProjectTopicForm();

    const { mutate: createTopic, isPending } = ProjectHooks.useCreateProjectTopic();

    const onSubmit = handleSubmit((data) => {
        createTopic(data, {
            onSuccess: (res) => {
                if (res.success) {
                    toaster.create({
                        title: "Project topic created successfully",
                        type: "success",
                    });
                    reset();
                    setOpen(false);
                } else {
                    toaster.create({
                        title: res.message || "Failed to create project topic",
                        type: "error",
                    });
                }
            },
            onError: (error: any) => {
                toaster.create({
                    title: error?.response?.data?.message || "Something went wrong",
                    type: "error",
                });
            }
        });
    });

    return (
        <Dialog.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
            <Dialog.Trigger asChild>
                <Button size="sm">
                    <Plus /> Create Project Topic
                </Button>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>Create Project Topic</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            <form id="create-project-topic-form" onSubmit={onSubmit}>
                                <Stack gap="4">
                                    <Field.Root invalid={!!errors.title}>
                                        <Field.Label>Title</Field.Label>
                                        <Input
                                            {...register("title")}
                                            placeholder="Enter project topic title"
                                        />
                                        <Field.ErrorText>{errors.title?.message}</Field.ErrorText>
                                    </Field.Root>
                                    <Field.Root invalid={!!errors.description}>
                                        <Field.Label>Description</Field.Label>
                                        <Textarea
                                            {...register("description")}
                                            rows={10}
                                            placeholder="Enter project topic description"
                                        />
                                        <Field.ErrorText>{errors.description?.message}</Field.ErrorText>
                                    </Field.Root>
                                </Stack>
                            </form>
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Dialog.ActionTrigger asChild>
                                <Button variant="outline" disabled={isPending}>Cancel</Button>
                            </Dialog.ActionTrigger>
                            <Button
                                w="40"
                                form="create-project-topic-form"
                                type="submit"
                                loading={isPending}
                                loadingText="Creating..."
                            >
                                Create
                            </Button>
                        </Dialog.Footer>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    )
}

export default CreateProjectTopicDialog;
