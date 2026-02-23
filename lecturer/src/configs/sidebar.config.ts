import {
    LayoutDashboard,
    GraduationCap,
    Users,
    BookOpen,
    ClipboardList,
    Ship,
    CalendarDays,
    CreditCard,
    Megaphone,
    type LucideIcon,
} from "lucide-react";

export interface SidebarItem {
    label: string;
    icon: LucideIcon;
    path: string;
}

const sidebarItems: SidebarItem[] = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { label: "Students", icon: GraduationCap, path: "/students" },
    { label: "Lecturers", icon: Users, path: "/lecturers" },
    { label: "Courses", icon: BookOpen, path: "/courses" },
    { label: "Results", icon: ClipboardList, path: "/results" },
    { label: "Projects", icon: Ship, path: "/projects" },
    { label: "Timetable", icon: CalendarDays, path: "/timetable" },
    { label: "Payments", icon: CreditCard, path: "/payments" },
    { label: "Announcement", icon: Megaphone, path: "/announcement" },
];

export default sidebarItems;
