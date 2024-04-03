"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Chapter } from "@prisma/client";
import { updateChapter } from "@/actions/chapterActions";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
    isFree: z.boolean().default(false)
});

interface ChapterAccessFormProps {
    initialData: Chapter;
    courseId: string;
    chapterId: string;
}

const ChapterAccessForm = ({
    initialData,
    courseId,
    chapterId
}: ChapterAccessFormProps) => {
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            isFree: !!initialData.isFree
        }
    });
    const { isSubmitting, isValid } = form.formState;
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
                Chapter access
                <Button variant="ghost" onClick={toggleEdit}>
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit access
                        </>
                    )}
                </Button>
            </div>
            {!isEditing ? (
                <p
                    className={cn(
                        "mt-2 text-sm",
                        !initialData.isFree && "text-slate-500 italic"
                    )}>
                    {initialData.isFree
                        ? "This chapter is free for preview"
                        : "This chapter is not free"}
                </p>
            ) : (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-2">
                        <FormField
                            control={form.control}
                            name="isFree"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Check this if you want to make this
                                        chapter free for preview
                                    </FormDescription>
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

export default ChapterAccessForm;
