"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader2, PlusCircle } from "lucide-react";
import { Input } from "@/components/ui/input";

import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Chapter, Course } from "@prisma/client";
import { createChapter, reorderChapter } from "@/actions/chapterActions";
import ChaptersList from "./ChaptersList";

const formSchema = z.object({
    title: z.string().min(1)
});

interface ChaptersFormProps {
    initialData: Course & { chapters: Chapter[] };
}

const ChaptersForm = ({ initialData }: ChaptersFormProps) => {
    const courseId = initialData.id;
    const router = useRouter();
    const [isCreating, setIsCreating] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const toggleCreating = () => {
        setIsCreating((prev) => !prev);
    };

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: ""
        }
    });

    const { isSubmitting, isValid } = form.formState;
    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            const res = await createChapter(courseId, data);
            if (res.success && res.chapter) {
                toast.success("Chapter created successfully");
                toggleCreating();
                router.refresh();
            } else {
                toast.error(res.error || "An error occurred");
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };
    const handleReorder = async (
        updateData: { id: string; position: number }[]
    ) => {
        try {
            setIsUpdating(true);
            await reorderChapter(courseId, updateData);
            toast.success("Chapter reordered successfully");
            router.refresh();
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsUpdating(false);
        }
    };
    const handleEdit = (id: string) => {
        router.push(`/dashboard/teacher/courses/${courseId}/chapters/${id}`);
    };

    return (
        <div className="relative mt-6 border bg-slate-100 p-4 rounded-md">
            {isUpdating && (
                <div className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-md flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-sky-700" />
                </div>
            )}
            <div className="flex items-center justify-between font-medium">
                Course chapters
                <Button variant="ghost" onClick={toggleCreating}>
                    {isCreating ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add a chapter
                        </>
                    )}
                </Button>
            </div>
            {isCreating && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-2">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder="Chapter title"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            disabled={isSubmitting || !isValid}
                            type="submit">
                            Create
                        </Button>
                    </form>
                </Form>
            )}
            {!isCreating && (
                <div
                    className={cn(
                        "text-sm mt-2",
                        !initialData.chapters.length && "text-slate-500 italic"
                    )}>
                    {!initialData.chapters.length && "No chapter"}
                    <ChaptersList
                        onEdit={handleEdit}
                        onReorder={handleReorder}
                        items={initialData.chapters || []}
                    />
                </div>
            )}
            {!isCreating && (
                <p className="text-xs text-muted-foreground mt-4">
                    Drag and drop to reorder the chapters
                </p>
            )}
        </div>
    );
};

export default ChaptersForm;
