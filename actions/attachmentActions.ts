"use server";

import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";

export const createAttachments = async (
    data: { url: string },
    courseId: string
) => {
    try {
        const { userId } = auth();
        const { url } = data;
        if (!userId) {
            return { success: false, error: "Unauthorized" };
        }
        const courseOwner = await db.course.findUnique({
            where: {
                id: courseId,
                userId: userId
            }
        });
        if (!courseOwner) {
            return { success: false, error: "Unauthorized" };
        }
        const attachment = await db.attachment.create({
            data: {
                url: url,
                name: url.split("/").pop() as string,
                courseId: courseId
            }
        });
        return { success: true, attachment };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const deleteAttachment = async (id: string, courseId: string) => {
    try {
        const { userId } = auth();
        if (!userId) {
            return { success: false, error: "Unauthorized" };
        }
        const courseOwner = await db.course.findUnique({
            where: {
                id: courseId,
                userId: userId
            }
        });
        if (!courseOwner) {
            return { success: false, error: "Unauthorized" };
        }
        const attachment = await db.attachment.delete({
            where: {
                id: id,
                courseId: courseId
            }
        });
        return { success: true, attachment };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};
