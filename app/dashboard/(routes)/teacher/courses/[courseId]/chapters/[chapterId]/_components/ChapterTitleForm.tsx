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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { updateChapter } from "@/actions/chapterActions";

const formSchema = z.object({
    title: z.string().trim().min(1)
});

interface ChapterTitleFormProps {
    initialData: { title: string };
    courseId: string;
    chapterId: string;
}

const ChapterTitleForm = ({
    initialData,
    courseId,
    chapterId
}: ChapterTitleFormProps) => {
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: initialData.title
        }
    });
    const { isSubmitting, isValid } = form.formState;
    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            const res = await updateChapter(data, courseId, chapterId);
            if (res.success && res.chapter) {
                toast.success("Chapter title updated successfully");
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
                Chapter title
                <Button variant="ghost" onClick={toggleEdit}>
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit title
                        </>
                    )}
                </Button>
            </div>
            {!isEditing ? (
                <p className="mt-2 text-sm">{initialData.title}</p>
            ) : (
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
                                            placeholder="e.g. Introduction"
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
                            Save
                        </Button>
                    </form>
                </Form>
            )}
        </div>
    );
};

export default ChapterTitleForm;
