"use client";

import * as z from "zod";

import { Button } from "@/components/ui/button";
import { ImageIcon, Pencil, PlusCircle } from "lucide-react";

import { useState } from "react";
import toast from "react-hot-toast";
import { updateCourse } from "@/actions/courseActions";
import { useRouter } from "next/navigation";
import { Course } from "@prisma/client";
import Image from "next/image";
import FileUpload from "@/components/FileUpload";

const formSchema = z.object({
    imageUrl: z.string().min(1, { message: "Image is required" })
});

interface ImageFormProps {
    initialData: Course;
}

const ImageForm = ({ initialData }: ImageFormProps) => {
    const courseId = initialData.id;
    const router = useRouter();

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            const res = await updateCourse(data, courseId);
            if (res.success && res.course) {
                toast.success("Course image updated successfully");
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
                Course image
                <Button variant="ghost" onClick={toggleEdit}>
                    {isEditing && <>Cancel</>}
                    {!isEditing && !initialData.imageUrl && (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add image
                        </>
                    )}
                    {!isEditing && initialData.imageUrl && (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit image
                        </>
                    )}
                </Button>
            </div>
            {!isEditing &&
                (!initialData.imageUrl ? (
                    <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                        <ImageIcon className="h-10 w-10 text-slate-500" />
                    </div>
                ) : (
                    <div className="relative aspect-video mt-2">
                        <Image
                            alt="Upload"
                            fill
                            className="object-cover rounded-md"
                            src={initialData.imageUrl}
                        />
                    </div>
                ))}
            {isEditing && (
                <div>
                    <FileUpload
                        endpoint="courseImage"
                        onChange={(url) => {
                            if (url) {
                                onSubmit({ imageUrl: url });
                            }
                        }}
                    />
                    <div className="text-xs text-muted-foreground mt-4">
                        16:9 aspect ratio recommended
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageForm;
