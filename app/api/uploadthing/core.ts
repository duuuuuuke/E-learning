import { isTeacher } from "@/lib/teacher";
import { auth } from "@clerk/nextjs";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

const handleAuth = () => {
    const { userId } = auth();
    if (!userId || !isTeacher(userId)) {
        throw new UploadThingError("Unauthorized");
    }
    return { userId };
};

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
    // Define as many FileRoutes as you like, each with a unique routeSlug
    courseImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
        // Set permissions and file types for this FileRoute
        .middleware(() => handleAuth())
        .onUploadComplete(async ({ metadata, file }) => {
            // This code RUNS ON YOUR SERVER after upload
            console.log("Upload complete for userId:", metadata.userId);

            console.log("file url", file.url);
        }),
    courseAttachment: f(["text", "image", "video", "audio", "pdf"])
        .middleware(() => handleAuth())
        .onUploadComplete(async ({ metadata, file }) => {
            // This code RUNS ON YOUR SERVER after upload
            console.log("Upload complete for userId:", metadata.userId);

            console.log("file url", file.url);
        }),
    chapterVideo: f({ video: { maxFileSize: "256MB", maxFileCount: 1 } })
        .middleware(() => handleAuth())
        .onUploadComplete(async ({ metadata, file }) => {
            // This code RUNS ON YOUR SERVER after upload
            console.log("Upload complete for userId:", metadata.userId);

            console.log("file url", file.url);
        })
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
