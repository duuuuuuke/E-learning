"use client";

import { progressActions } from "@/actions/progressActions";
import { Button } from "@/components/ui/button";

import { useConfettiStore } from "@/hooks/useConfettiStore";

import { CheckCircle, XCircle } from "lucide-react";

import { useRouter } from "next/navigation";

import { useState } from "react";
import toast from "react-hot-toast";

interface CourseProgressButtonProps {
    chapterId: string;
    courseId: string;
    isCompleted?: boolean;
    nextChapterId?: string;
}

const CourseProgressButton = ({
    chapterId,
    courseId,
    isCompleted,
    nextChapterId
}: CourseProgressButtonProps) => {
    const router = useRouter();
    const confetti = useConfettiStore();
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = async () => {
        try {
            setIsLoading(true);

            const res = await progressActions({
                chapterId,
                courseId,
                isCompleted: !isCompleted
            });
            if (!res.success) {
                toast.error(res.error);
                return;
            }
            if (!isCompleted && !nextChapterId) {
                confetti.onOpen();
            }
            if (!isCompleted && nextChapterId) {
                router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
            }
            toast.success("Progress updated!");
            router.refresh();
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const Icon = isCompleted ? XCircle : CheckCircle;
    return (
        <Button
            onClick={handleClick}
            disabled={isLoading}
            type="button"
            variant={isCompleted ? "outline" : "success"}
            className="w-full md:w-auto">
            {isCompleted ? "Mark as incomplete" : "Mark as complete"}
            <Icon className="ml-2 h-4 w-4" />
        </Button>
    );
};

export default CourseProgressButton;
