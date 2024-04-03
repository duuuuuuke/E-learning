"use server";

import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";

import Mux from "@mux/mux-node";

import { revalidatePath } from "next/cache";

const { video } = new Mux({
    tokenId: process.env.MUX_TOKEN_ID,
    tokenSecret: process.env.MUX_TOKEN_SECRET
});

type CourseData = {
    title?: string;
    description?: string;
    imageUrl?: string;
    price?: number;
    categoryId?: string;
};

export const createCourse = async (data: { title: string }) => {
    try {
        const { userId } = auth();
        const { title } = data;
        if (!userId) {
            return { success: false, error: "Unauthorized" };
        }
        const course = await db.course.create({
            data: {
                title,
                userId
            }
        });
        revalidatePath("/dashboard/teacher/courses");
        return { success: true, course };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const updateCourse = async (data: CourseData, id: string) => {
    try {
        const { userId } = auth();
        if (!userId) {
            return { success: false, error: "Unauthorized" };
        }
        const courseId = id;
        const course = await db.course.update({
            where: {
                id: courseId,
                userId
            },
            data: { ...data }
        });
        return { success: true, course };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const deleteCourse = async (courseId: string) => {
    try {
        const { userId } = auth();
        if (!userId) {
            return { success: false, error: "Unauthorized" };
        }
        const course = await db.course.findUnique({
            where: {
                id: courseId,
                userId: userId
            },
            include: {
                chapters: {
                    include: {
                        muxData: true
                    }
                }
            }
        });
        if (!course) {
            return { success: false, error: "Course not found" };
        }
        for (let chapter of course.chapters) {
            if (chapter.muxData?.assetId) {
                await video.assets.delete(chapter.muxData.assetId);
            }
        }
        const deletedCourse = await db.course.delete({
            where: {
                id: courseId
            }
        });
        revalidatePath("/dashboard/teacher/courses");
        return { success: true, course: deletedCourse };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const publishCourse = async (courseId: string) => {
    try {
        const { userId } = auth();
        if (!userId) {
            return { success: false, error: "Unauthorized" };
        }
        const course = await db.course.findUnique({
            where: {
                id: courseId,
                userId: userId
            },
            include: {
                chapters: {
                    include: {
                        muxData: true
                    }
                }
            }
        });
        if (!course) {
            return { success: false, error: "Course not found" };
        }
        const hasPublishedChapters = course.chapters.some(
            (chapter) => chapter.isPublished
        );
        if (
            !hasPublishedChapters ||
            !course.categoryId ||
            !course.title ||
            !course.description ||
            !course.imageUrl
        ) {
            return {
                success: false,
                error: "Course is missing required fields"
            };
        }
        const publishedCourse = await db.course.update({
            where: {
                id: courseId,
                userId: userId
            },
            data: {
                isPublished: true
            }
        });
        return { success: true, course: publishedCourse };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const unpublishCourse = async (courseId: string) => {
    try {
        const { userId } = auth();
        if (!userId) {
            return { success: false, error: "Unauthorized" };
        }
        const course = await db.course.findUnique({
            where: {
                id: courseId,
                userId: userId
            }
        });
        if (!course) {
            return { success: false, error: "Course not found" };
        }
        const unPublishedCourse = await db.course.update({
            where: {
                id: courseId
            },
            data: {
                isPublished: false
            }
        });
        return { success: true, course: unPublishedCourse };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};
