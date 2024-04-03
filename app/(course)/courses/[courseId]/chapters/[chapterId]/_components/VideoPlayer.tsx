"use client";

import MuxPlayer from "@mux/mux-player-react";

import { cn } from "@/lib/utils";
import { Loader2, Lock } from "lucide-react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useConfettiStore } from "@/hooks/useConfettiStore";

import toast from "react-hot-toast";

import { progressActions } from "@/actions/progressActions";

interface VideoPlayerProps {
    playbackId: string;
    courseId: string;
    chapterId: string;
    nextChapterId?: string;
    isLocked: boolean;
    completeOnEnd: boolean;
    title: string;
}

const VideoPlayer = ({
    playbackId,
    chapterId,
    completeOnEnd,
    courseId,
    isLocked,
    nextChapterId,
    title
}: VideoPlayerProps) => {
    const [isReady, setIsReady] = useState(false);
    const router = useRouter();
    const confetti = useConfettiStore();

    const handleVideoEnd = async () => {
        try {
            if (completeOnEnd) {
                const res = await progressActions({
                    chapterId,
                    courseId,
                    isCompleted: true
                });
                if (!res.success) {
                    toast.error(res.error);
                    return;
                }
                if (!nextChapterId) {
                    confetti.onOpen();
                }
                if (nextChapterId) {
                    router.push(
                        `/courses/${courseId}/chapters/${nextChapterId}`
                    );
                }
                toast.success("Progress updated!");
                router.refresh();
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    return (
        <div className="relative aspect-video">
            {!isReady && !isLocked && (
                <div className="absolute bg-slate-800 inset-0 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-secondary" />
                </div>
            )}
            {isLocked && (
                <div className="absolute bg-slate-800 inset-0 flex justify-center items-center flex-col gap-y-2 text-secondary">
                    <Lock className="h-8 w-8" />
                    <p className="text-sm">This chapter is locked</p>
                </div>
            )}
            {!isLocked && (
                <MuxPlayer
                    title={title}
                    className={cn(!isReady && "hidden")}
                    onCanPlay={() => setIsReady(true)}
                    onEnded={handleVideoEnd}
                    autoPlay={false}
                    playbackId={playbackId}
                />
            )}
        </div>
    );
};

export default VideoPlayer;
