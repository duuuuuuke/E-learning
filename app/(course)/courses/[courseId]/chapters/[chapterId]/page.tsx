import { getChapter } from "@/actions/getChapter";
import { Banner } from "@/components/banner";
import { Separator } from "@/components/ui/separator";
import { File } from "lucide-react";

import { auth } from "@clerk/nextjs";

import { redirect } from "next/navigation";

import VideoPlayer from "./_components/VideoPlayer";
import CourseEnrollButton from "./_components/CourseEnrollButton";
import Preview from "@/components/Preview";
import CourseProgressButton from "./_components/CourseProgressButton";

const ChapterIdPage = async ({
    params
}: {
    params: { courseId: string; chapterId: string };
}) => {
    const { userId } = auth();
    if (!userId) {
        return redirect("/dashboard");
    }
    const {
        chapter,
        course,
        attachments,
        muxData,
        nextChapter,
        purchase,
        userProgress
    } = await getChapter({
        userId,
        chapterId: params.chapterId,
        courseId: params.courseId
    });
    if (!chapter || !course) {
        return redirect("/dashboard");
    }
    const isLocked = !chapter.isFree && !purchase;
    const completeOnEnd = !!purchase && !userProgress?.isCompleted;

    return (
        <div>
            {userProgress?.isCompleted && (
                <Banner
                    variant="success"
                    label="You have already completed this chapter"
                />
            )}
            {isLocked && (
                <Banner
                    variant="warning"
                    label="You need to purchase this course to access this chapter"
                />
            )}
            <div className="flex flex-col max-w-4xl mx-auto pb-20">
                <div className="p-4">
                    <VideoPlayer
                        chapterId={params.chapterId}
                        completeOnEnd={completeOnEnd}
                        courseId={params.courseId}
                        title={chapter.title}
                        nextChapterId={nextChapter?.id}
                        isLocked={isLocked}
                        playbackId={muxData?.playbackId!}
                    />
                </div>
                <div>
                    <div className="p-4 flex flex-col md:flex-row items-center justify-between">
                        <h2 className="text-2xl font-semibold mb-2">
                            {chapter.title}
                        </h2>
                        {purchase ? (
                            <CourseProgressButton
                                courseId={params.courseId}
                                chapterId={params.chapterId}
                                isCompleted={!!userProgress?.isCompleted}
                                nextChapterId={nextChapter?.id}
                            />
                        ) : (
                            <CourseEnrollButton
                                courseId={params.courseId}
                                price={course.price!}
                            />
                        )}
                    </div>
                    <Separator />
                    <div>
                        <Preview value={chapter.description!} />
                    </div>
                    {!!attachments.length && (
                        <>
                            <Separator />
                            <div className="p-4">
                                {attachments.map((attachment) => (
                                    <a
                                        href={attachment.url}
                                        target="_blank"
                                        key={attachment.id}
                                        className="bg-sky-200 flex items-center p-3 w-full border text-sky-700 rounded-md hover:underline">
                                        <File />
                                        <p className="line-clamp-1">
                                            {attachment.name}
                                        </p>
                                    </a>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChapterIdPage;
