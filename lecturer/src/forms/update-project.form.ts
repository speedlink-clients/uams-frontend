import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateProjectSchema, type UpdateProjectSchema } from "@schemas/project/update-project.schema";

const useUpdateProjectForm = (defaultValues: UpdateProjectSchema) => {
    return useForm<UpdateProjectSchema>({
        resolver: zodResolver(updateProjectSchema),
        defaultValues,
    });
};

export default useUpdateProjectForm;
