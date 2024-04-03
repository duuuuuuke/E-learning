"use client";

import { ConfirmModal } from "@/components/modals/ConfirmModal";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

import {
    deleteCourse,
    publishCourse,
    unpublishCourse
} from "@/actions/courseActions";

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { useConfettiStore } from "@/hooks/useConfettiStore";

interface ActionsProps {
    disabled: boolean;
    courseId: string;
    isPublished: boolean;
}

const Actions = ({ disabled, courseId, isPublished }: ActionsProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const confetti = useConfettiStore();

    const handleDelete = async () => {
        try {
            setIsLoading(true);
            const res = await deleteCourse(courseId);
            if (res.success) {
                toast.success("Course deleted successfully");
                router.push("/dashboard/teacher/courses");
            } else {
                toast.error(res.error);
            }
        } catch {
            toast.error("Delete course failed");
        } finally {
            setIsLoading(false);
        }
    };

    const handlePublish = async () => {
        try {
            setIsLoading(true);
            if (isPublished) {
                // Unpublish course
                const res = await unpublishCourse(courseId);
                if (res.success) {
                    toast.success("Course unpublished successfully");
                } else {
                    toast.error(res.error);
                }
            } else {
                // Publish course
                const res = await publishCourse(courseId);
                if (res.success) {
                    toast.success("Course published successfully");
                    confetti.onOpen();
                } else {
                    toast.error(res.error);
                }
            }
            router.refresh();
        } catch {
            toast.error("Publish course failed");
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

export default Actions;
