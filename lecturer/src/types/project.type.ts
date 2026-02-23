export interface Project {
    id: string;
    topic: string;
    projectType: "Individual" | "Group";
    studentNames: string[];
    status: "Pending" | "Approved";
}
