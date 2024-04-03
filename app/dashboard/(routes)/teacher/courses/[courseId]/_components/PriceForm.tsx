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
import { Input } from "@/components/ui/input";

import { useState } from "react";
import toast from "react-hot-toast";
import { updateCourse } from "@/actions/courseActions";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Course } from "@prisma/client";

import { formatPrice } from "@/lib/formatPrice";

const formSchema = z.object({
    price: z.coerce.number()
});

interface PriceFormProps {
    initialData: Course;
}

const PriceForm = ({ initialData }: PriceFormProps) => {
    const courseId = initialData.id;
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            price: initialData.price || undefined
        }
    });
    const { isSubmitting, isValid } = form.formState;
    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            const res = await updateCourse(data, courseId);
            if (res.success && res.course) {
                toast.success("Course price updated successfully");
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
                Course price
                <Button variant="ghost" onClick={toggleEdit}>
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit price
                        </>
                    )}
                </Button>
            </div>
            {!isEditing ? (
                <p
                    className={cn(
                        "mt-2 text-sm",
                        !initialData.price && "text-slate-500 italic"
                    )}>
                    {initialData.price
                        ? formatPrice(initialData.price)
                        : "No price"}
                </p>
            ) : (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-2">
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            disabled={isSubmitting}
                                            placeholder="Set a price for your course"
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

export default PriceForm;
