"use server";

import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";

import Mux from "@mux/mux-node";

import { revalidatePath } from "next/cache";

const { video } = new Mux({
    tokenId: process.env.MUX_TOKEN_ID,
    tokenSecret: process.env.MUX_TOKEN_SECRET
});

const validateChapterOwnership = async (courseId: string) => {
    const { userId } = auth();
    if (!userId) {
        return false;
    }
    const courseOwner = await db.course.findUnique({
        where: {
            id: courseId,
            userId: userId
        }
    });
    if (!courseOwner) {
        return false;
    }
    return true;
};

export const createChapter = async (
    courseId: string,
    data: { title: string }
) => {
    try {
        const isValidChapterOwner = await validateChapterOwnership(courseId);
        if (!isValidChapterOwner) {
            return { success: false, error: "Unauthorized" };
        }
        const lastChapter = await db.chapter.findFirst({
            where: {
                courseId
            },
            orderBy: {
                position: "desc"
            }
        });
        const { title } = data;
        const newPosition = lastChapter ? lastChapter.position + 1 : 1;
        const chapter = await db.chapter.create({
            data: {
                title,
                courseId,
                position: newPosition
            }
        });
        return { success: true, chapter };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const reorderChapter = async (
    courseId: string,
    updateData: { id: string; position: number }[]
) => {
    try {
        const isValidChapterOwner = await validateChapterOwnership(courseId);
        if (!isValidChapterOwner) {
            return { success: false, error: "Unauthorized" };
        }
        for (let item of updateData) {
            await db.chapter.update({
                where: {
                    id: item.id
                },
                data: {
                    position: item.position
                }
            });
        }
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const updateChapter = async (
    data: {
        title?: string;
        description?: string;
        isFree?: boolean;
        videoUrl?: string;
    },
    courseId: string,
    chapterId: string
) => {
    try {
        const isValidChapterOwner = await validateChapterOwnership(courseId);
        if (!isValidChapterOwner) {
            return { success: false, error: "Unauthorized" };
        }
        const chapter = await db.chapter.update({
            where: {
                id: chapterId,
                courseId: courseId
            },
            data: {
                ...data
            }
        });
        if (data.videoUrl) {
            const existingMuxData = await db.muxData.findFirst({
                where: {
                    chapterId: chapterId
                }
            });
            if (existingMuxData) {
                await video.assets.delete(existingMuxData.assetId);
                await db.muxData.delete({
                    where: {
                        id: existingMuxData.id
                    }
                });
            }
            const asset = await video.assets.create({
                input: [{ url: data.videoUrl }],
                playback_policy: ["public"],
                test: false
            });
            await db.muxData.create({
                data: {
                    chapterId: chapterId,
                    assetId: asset.id,
                    playbackId: asset.playback_ids?.[0]?.id
                }
            });
        }
        return { success: true, chapter };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const deleteChapter = async (courseId: string, chapterId: string) => {
    try {
        const isValidChapterOwner = await validateChapterOwnership(courseId);
        if (!isValidChapterOwner) {
            return { success: false, error: "Unauthorized" };
        }
        const chapter = await db.chapter.findUnique({
            where: {
                id: chapterId,
                courseId: courseId
            }
        });
        if (!chapter) {
            return { success: false, error: "Chapter not found" };
        }
        if (chapter.videoUrl) {
            const existingMuxData = await db.muxData.findFirst({
                where: {
                    chapterId: chapterId
                }
            });
            if (existingMuxData) {
                await video.assets.delete(existingMuxData.assetId);
                await db.muxData.delete({
                    where: {
                        id: existingMuxData.id
                    }
                });
            }
        }
        const deletedChapter = await db.chapter.delete({
            where: {
                id: chapterId
            }
        });
        const publishedChaptersInCourse = await db.chapter.findMany({
            where: {
                courseId: courseId,
                isPublished: true
            }
        });
        if (!publishedChaptersInCourse.length) {
            await db.course.update({
                where: {
                    id: courseId
                },
                data: {
                    isPublished: false
                }
            });
        }
        revalidatePath(`/dashboard/teacher/courses/${courseId}`);
        return { success: true, chapter: deletedChapter };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const publishChapter = async (courseId: string, chapterId: string) => {
    try {
        const isValidChapterOwner = await validateChapterOwnership(courseId);
        if (!isValidChapterOwner) {
            return { success: false, error: "Unauthorized" };
        }
        const chapter = await db.chapter.findUnique({
            where: {
                id: chapterId,
                courseId: courseId
            }
        });
        const muxData = await db.muxData.findUnique({
            where: {
                chapterId: chapterId
            }
        });
        if (
            !chapter ||
            !muxData ||
            !chapter.videoUrl ||
            !chapter.title ||
            !chapter.description
        ) {
            return {
                success: false,
                error: "Chapter not ready for publishing (missing required fields)"
            };
        }
        const publishedChapter = await db.chapter.update({
            where: {
                id: chapterId,
                courseId: courseId
            },
            data: {
                isPublished: true
            }
        });
        return { success: true, chapter: publishedChapter };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const unpublishChapter = async (courseId: string, chapterId: string) => {
    try {
        const isValidChapterOwner = await validateChapterOwnership(courseId);
        if (!isValidChapterOwner) {
            return { success: false, error: "Unauthorized" };
        }
        const unpublishedChapter = await db.chapter.update({
            where: {
                id: chapterId,
                courseId: courseId
            },
            data: {
                isPublished: false
            }
        });
        const publishedChaptersInCourse = await db.chapter.findMany({
            where: {
                courseId: courseId,
                isPublished: true
            }
        });
        if (!publishedChaptersInCourse.length) {
            await db.course.update({
                where: {
                    id: courseId
                },
                data: {
                    isPublished: false
                }
            });
        }
        return { success: true, chapter: unpublishedChapter };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};
