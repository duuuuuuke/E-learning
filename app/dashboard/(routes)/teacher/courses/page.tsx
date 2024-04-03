import { Button } from "@/components/ui/button";

import { redirect } from "next/navigation";
import Link from "next/link";

import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";

import { auth } from "@clerk/nextjs";

import { db } from "@/lib/db";

const Courses = async () => {
    const { userId } = auth();
    if (!userId) return redirect("/dashboard");
    const courses = await db.course.findMany({
        where: {
            userId
        },
        orderBy: {
            createdAt: "desc"
        }
    });
    return (
        <div className="p-6">
            <DataTable columns={columns} data={courses} />
        </div>
    );
};

export default Courses;
