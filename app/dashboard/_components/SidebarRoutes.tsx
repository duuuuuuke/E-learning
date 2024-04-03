"use client";

import { BarChart, Compass, Layout, List } from "lucide-react";
import SidebarItem from "./SidebarItem";
import { usePathname } from "next/navigation";

const guestRoutes = [
    {
        icon: Layout,
        label: "Dashboard",
        href: "/dashboard"
    },
    {
        icon: Compass,
        label: "Browse",
        href: "/dashboard/search"
    }
];

const teachRoutes = [
    {
        icon: List,
        label: "Courses",
        href: "/dashboard/teacher/courses"
    },
    {
        icon: BarChart,
        label: "Analytics",
        href: "/dashboard/teacher/analytics"
    }
];

const SidebarRoutes = () => {
    const pathname = usePathname();
    const isTeacherPage = pathname?.startsWith("/dashboard/teacher");
    const routes = isTeacherPage ? teachRoutes : guestRoutes;

    return (
        <div className="flex flex-col w-full">
            {routes.map((route) => (
                <SidebarItem
                    key={route.label}
                    icon={route.icon}
                    label={route.label}
                    href={route.href}
                />
            ))}
        </div>
    );
};

export default SidebarRoutes;
