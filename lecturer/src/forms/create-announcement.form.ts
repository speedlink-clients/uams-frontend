import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createAnnouncementSchema, type CreateAnnouncementSchema } from "@schemas/announcement/create-announcement.schema";

const useCreateAnnouncementForm = () => {
    return useForm<CreateAnnouncementSchema>({
        resolver: zodResolver(createAnnouncementSchema),
        defaultValues: {
            title: "",
            recipients: [],
            description: "",
        },
    });
};

export default useCreateAnnouncementForm;
