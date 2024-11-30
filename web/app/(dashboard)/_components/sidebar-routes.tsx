"use client";

import { Layout, Compass, List, BarChart, PlusCircle, FileQuestion, ClipboardList } from "lucide-react";
import { usePathname } from "next/navigation";

import SidebarItem from "./sidebar-item";

const guestRoutes = [
    {
        icon: Layout,
        label: "Dashboard",
        href: "/dashboard",
    },
    {
        icon: Compass,
        label: "Browse",
        href: "/search",
    },
    {
        icon: FileQuestion,
        label: "Quizzes",
        href: "/view-quiz",
    },
    {
        icon: ClipboardList,
        label: "Assignments",
        href: "/submitassignment",
    }
];

const teacherRoutes = [
    {
        icon: List,
        label: "Courses",
        href: "/teacher/courses",
    },
    {
        icon: BarChart,
        label: "Analytics",
        href: "/teacher/analytics",
    },
    {
        icon: PlusCircle,
        label: "Create Assignment",
        href: "/teacher/createassignment",
    },
    {
        icon: PlusCircle,
        label: "Create Quiz",
        href: "/teacher/createquiz",
    },
    {
        icon: PlusCircle,
        label: "Go live",
        href: "/meet",
    }
];

const SidebarRoutes = () => {
    const pathname = usePathname();

    const isTeacherPage = pathname?.includes("/teacher");
    const routes = isTeacherPage ? teacherRoutes : guestRoutes;

    return (
        <div className="flex flex-col w-full">
            {routes.map((route) => (
                <SidebarItem
                    key={route.href}
                    icon={route.icon}
                    label={route.label}
                    href={route.href}
                />
            ))}
        </div>
    );
};

export default SidebarRoutes;