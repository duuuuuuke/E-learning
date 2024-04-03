"use server";

import { db } from "@/lib/db";

import { auth } from "@clerk/nextjs";

export const progressActions = async ({
    courseId,
    chapterId,
    isCompleted
}: {
    courseId: string;
    chapterId: string;
    isCompleted: boolean;
}) => {
    try {
        const { userId } = auth();
        if (!userId) {
            return { success: false, error: "Unauthorized" };
        }
        const userProgress = await db.userProgress.upsert({
            where: {
                userId_chapterId: { chapterId: chapterId, userId: userId }
            },
            update: { isCompleted },
            create: {
                userId,
                chapterId,
                isCompleted
            }
        });
        return { success: true, userProgress };
    } catch (error: any) {
        console.log(error.message);
        return { success: false, error: error.message };
    }
};
