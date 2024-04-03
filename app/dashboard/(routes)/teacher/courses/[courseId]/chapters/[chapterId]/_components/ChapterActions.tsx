"use client";

import { ConfirmModal } from "@/components/modals/ConfirmModal";
import { Button } from "@/components/ui/button";
import {
    deleteChapter,
    publishChapter,
    unpublishChapter
} from "@/actions/chapterActions";
import { Trash } from "lucide-react";

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface ChapterActionsProps {
    disabled: boolean;
    courseId: string;
    chapterId: string;
    isPublished: boolean;
}

const ChapterActions = ({
    disabled,
    courseId,
    chapterId,
    isPublished
}: ChapterActionsProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        try {
            setIsLoading(true);
            const res = await deleteChapter(courseId, chapterId);
            if (res.success) {
                toast.success("Chapter deleted successfully");
                router.push(`/dashboard/teacher/courses/${courseId}`);
            } else {
                toast.error(res.error);
            }
        } catch {
            toast.error("Delete chapter failed");
        } finally {
            setIsLoading(false);
        }
    };

    const handlePublish = async () => {
        try {
            setIsLoading(true);
            if (isPublished) {
                // Unpublish chapter
                const res = await unpublishChapter(courseId, chapterId);
                if (res.success) {
                    toast.success("Chapter unpublished successfully");
                } else {
                    toast.error(res.error);
                }
            } else {
                // Publish chapter
                const res = await publishChapter(courseId, chapterId);
                if (res.success) {
                    toast.success("Chapter published successfully");
                } else {
                    toast.error(res.error);
                }
            }
            router.refresh();
        } catch {
            toast.error("Publish chapter failed");
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="flex items-center gap-x-2">
            <Button
                onClick={handlePublish}
                disabled={disabled || isLoading}
                variant="outline"
                size="sm">
                {isPublished ? "Unpublish" : "Publish"}
            </Button>
            <ConfirmModal onConfirm={handleDelete}>
                <Button size="sm" disabled={isLoading}>
                    <Trash className="h-4 w-4" />
                </Button>
            </ConfirmModal>
        </div>
    );
};

export default ChapterActions;
