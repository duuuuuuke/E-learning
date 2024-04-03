"use client";

import * as z from "zod";

import { Button } from "@/components/ui/button";
import { File, Loader2, PlusCircle, X } from "lucide-react";

import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Attachment, Course } from "@prisma/client";
import FileUpload from "@/components/FileUpload";
import {
    createAttachments,
    deleteAttachment
} from "@/actions/attachmentActions";

const formSchema = z.object({
    url: z.string().min(1)
});

interface AttachmentFormProps {
    initialData: Course & { attachments: Attachment[] };
}

const AttachmentForm = ({ initialData }: AttachmentFormProps) => {
    const courseId = initialData.id;
    const router = useRouter();

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            const res = await createAttachments(data, courseId);
            if (res.success && res.attachment) {
                toast.success("Course attachments updated successfully");
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
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const toggleEdit = () => {
        setIsEditing((prev) => !prev);
    };
    const handleDelete = async (id: string) => {
        try {
            setDeletingId(id);
            await deleteAttachment(id, courseId);
            toast.success("Attachment deleted successfully");
            router.refresh();
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="mt-6 border bg-slate-100 p-4 rounded-md">
            <div className="flex items-center justify-between font-medium">
                Course attachments
                <Button variant="ghost" onClick={toggleEdit}>
                    {isEditing && <>Cancel</>}
                    {!isEditing && (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add a file
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <>
                    {initialData.attachments.length === 0 && (
                        <p className="text-sm mt-2 text-slate-500 italic">
                            No attachments yet
                        </p>
                    )}
                    {initialData.attachments.length > 0 && (
                        <div className="space-y-2">
                            {initialData.attachments.map((attachment) => (
                                <div
                                    key={attachment.id}
                                    className="flex items-center p-3 w-full bg-sky-100 border border-sky-200 text-sky-700 rounded-md">
                                    <File className="h-4 w-4 mr-2 flex-shrink-0" />
                                    <p className="line-clamp-1 text-xs">
                                        {attachment.name}
                                    </p>
                                    {deletingId === attachment.id ? (
                                        <div>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        </div>
                                    ) : (
                                        <button
                                            className="ml-auto hover:opacity-75 transition"
                                            onClick={() =>
                                                handleDelete(attachment.id)
                                            }>
                                            <X className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
            {isEditing && (
                <div>
                    <FileUpload
                        endpoint="courseAttachment"
                        onChange={(url) => {
                            if (url) {
                                onSubmit({ url: url });
                            }
                        }}
                    />
                    <div className="text-xs text-muted-foreground mt-4">
                        Add course materials, resources, or any other files
                    </div>
                </div>
            )}
        </div>
    );
};

export default AttachmentForm;
