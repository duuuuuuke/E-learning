"use client";

import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Pencil, PlusCircle, Video } from "lucide-react";

import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Chapter, MuxData } from "@prisma/client";
import FileUpload from "@/components/FileUpload";
import { updateChapter } from "@/actions/chapterActions";
import MuxPlayer from "@mux/mux-player-react";

const formSchema = z.object({
    videoUrl: z.string().min(1)
});

interface ChapterVideoFormProps {
    initialData: Chapter & { muxData?: MuxData | null };
    courseId: string;
    chapterId: string;
}

const ChapterVideoForm = ({
    initialData,
    courseId,
    chapterId
}: ChapterVideoFormProps) => {
    const router = useRouter();

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            const res = await updateChapter(data, courseId, chapterId);
            if (res.success && res.chapter) {
                toast.success("Chapter updated successfully");
                toggleEdit();
                router.refresh();
            } else {
                toast.error(res.error || "An error occurred");
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const [isEditing, setIsEditing] = useState(false);
    const toggleEdit = () => {
        setIsEditing((prev) => !prev);
    };

    return (
        <div className="mt-6 border bg-slate-100 p-4 rounded-md">
            <div className="flex items-center justify-between font-medium">
                Chapter video
                <Button variant="ghost" onClick={toggleEdit}>
                    {isEditing && <>Cancel</>}
                    {!isEditing && !initialData.videoUrl && (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add a video
                        </>
                    )}
                    {!isEditing && initialData.videoUrl && (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit video
                        </>
                    )}
                </Button>
            </div>
            {!isEditing &&
                (!initialData.videoUrl ? (
                    <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                        <Video className="h-10 w-10 text-slate-500" />
                    </div>
                ) : (
                    <div className="relative aspect-video mt-2">
                        <MuxPlayer
                            playbackId={initialData?.muxData?.playbackId || ""}
                        />
                    </div>
                ))}
            {isEditing && (
                <div>
                    <FileUpload
                        endpoint="chapterVideo"
                        onChange={(url) => {
                            if (url) {
                                onSubmit({ videoUrl: url });
                            }
                        }}
                    />
                    <div className="text-xs text-muted-foreground mt-4">
                        Upload this chapter&apos;s video.
                    </div>
                </div>
            )}
            {initialData.videoUrl && !isEditing && (
                <div className="text-xs text-muted-foreground mt-2">
                    Video can take a few minutes to process. Refresh the page if
                    it doesn&apos;t show up.
                </div>
            )}
        </div>
    );
};

export default ChapterVideoForm;
