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
import { Pencil } from "lucide-react";

import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Chapter } from "@prisma/client";
import { updateChapter } from "@/actions/chapterActions";
import Editor from "@/components/Editor";
import Preview from "@/components/Preview";

const formSchema = z.object({
    description: z.string().trim().min(1)
});

interface ChapterDescriptionFormProps {
    initialData: Chapter;
    courseId: string;
    chapterId: string;
}

const ChapterDescriptionForm = ({
    initialData,
    courseId,
    chapterId
}: ChapterDescriptionFormProps) => {
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            description: initialData.description || ""
        }
    });
    const { isSubmitting, isValid } = form.formState;
    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            const res = await updateChapter(data, courseId, chapterId);
            if (res.success && res.chapter) {
                toast.success("Chapter description updated successfully");
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
                Chapter description
                <Button variant="ghost" onClick={toggleEdit}>
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit description
                        </>
                    )}
                </Button>
            </div>
            {!isEditing ? (
                <div
                    className={cn(
                        "mt-2 text-sm",
                        !initialData.description && "text-slate-500 italic"
                    )}>
                    {!initialData.description ? (
                        "No description"
                    ) : (
                        <Preview value={initialData.description} />
                    )}
                </div>
            ) : (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-2">
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Editor
                                            onChange={field.onChange}
                                            value={field.value}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            disabled={isSubmitting || !isValid}
                            type="submit">
                            Save
                        </Button>
                    </form>
                </Form>
            )}
        </div>
    );
};

export default ChapterDescriptionForm;
