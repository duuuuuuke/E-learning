"use client";

import { UserButton, useAuth } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";
import SearchInput from "./SearchInput";
import { isTeacher } from "@/lib/teacher";

const NavbarRoutes = () => {
    const { userId } = useAuth();
    const pathname = usePathname();
    const isTeacherPage = pathname?.startsWith("/dashboard/teacher");
    const isStudentPage = pathname?.includes("/courses");
    const isSearchPage = pathname === "/dashboard/search";

    return (
        <>
            {isSearchPage && (
                <div className="hidden md:block">
                    <SearchInput />
                </div>
            )}
            <div className="flex gap-x-2 ml-auto">
                {isTeacherPage || isStudentPage ? (
                    <Link href="/dashboard">
                        <Button size="sm" variant="ghost">
                            <LogOut className="h-4 w-4 mr-2" />
                            Exit
                        </Button>
                    </Link>
                ) : isTeacher(userId) ? (
                    <Link href="/dashboard/teacher/courses">
                        <Button size="sm" variant="ghost">
                            As a Teacher
                        </Button>
                    </Link>
                ) : null}
                <UserButton afterSignOutUrl="/" />
            </div>
        </>
    );
};

export default NavbarRoutes;
