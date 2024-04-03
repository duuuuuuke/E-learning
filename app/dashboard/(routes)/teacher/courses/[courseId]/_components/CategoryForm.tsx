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
import { Combobox } from "@/components/ui/combobox";

import { useState } from "react";
import toast from "react-hot-toast";
import { updateCourse } from "@/actions/courseActions";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Course } from "@prisma/client";

const formSchema = z.object({
    categoryId: z.string().min(1)
});

interface CategoryFormProps {
    initialData: Course;
    options: { label: string; value: string }[];
}

const CategoryForm = ({ initialData, options }: CategoryFormProps) => {
    const courseId = initialData.id;
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            categoryId: initialData.categoryId || ""
        }
    });
    const { isSubmitting, isValid } = form.formState;
    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            const res = await updateCourse(data, courseId);
            if (res.success && res.course) {
                toast.success("Course category updated successfully");
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

    const selectedOption = options.find(
        (option) => option.value === initialData.categoryId
    );

    return (
        <div className="mt-6 border bg-slate-100 p-4 rounded-md">
            <div className="flex items-center justify-between font-medium">
                Course category
                <Button variant="ghost" onClick={toggleEdit}>
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit category
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <p
                    className={cn(
                        "mt-2 text-sm",
                        !initialData.categoryId && "text-slate-500 italic"
                    )}>
                    {selectedOption?.label || "No category selected"}
                </p>
            )}
            {isEditing && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-2">
                        <FormField
                            control={form.control}
                            name="categoryId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Combobox
                                            options={options}
                                            value={field.value}
                                            onChange={field.onChange}
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

export default CategoryForm;
