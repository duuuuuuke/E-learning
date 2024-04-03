import Image from "next/image";
import Link from "next/link";

import { IconBadge } from "@/components/iconBadge";
import { BookOpen } from "lucide-react";
import { formatPrice } from "@/lib/formatPrice";
import CourseProgress from "@/components/CourseProgress";

interface CourseCardProps {
    id: string;
    title: string;
    imageUrl: string;
    progress: number | null;
    price: number;
    category: string;
    chaptersLength: number;
}

const CourseCard = ({
    id,
    title,
    imageUrl,
    price,
    progress,
    category,
    chaptersLength
}: CourseCardProps) => {
    return (
        <Link href={`/courses/${id}`}>
            <div className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full">
                <div className="relative w-full aspect-video rounded-md overflow-hidden">
                    <Image
                        fill
                        className="object-cover"
                        alt={title}
                        src={imageUrl}
                    />
                </div>
                <div className="flex flex-col pt-2">
                    <div className="text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2">
                        {title}
                    </div>
                    <p className="text-xs text-muted-foreground">{category}</p>
                    <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
                        <div className="flex items-center gap-x-1 text-slate-500">
                            <IconBadge size="small" icon={BookOpen} />
                            <span>
                                {chaptersLength}{" "}
                                {chaptersLength === 1 ? "Chapter" : "Chapters"}
                            </span>
                        </div>
                    </div>
                    {progress !== null ? (
                        <CourseProgress
                            size="sm"
                            value={progress}
                            variant={progress === 100 ? "success" : "default"}
                        />
                    ) : (
                        <p className="text-md md:text-sm font-medium text-slate-700">
                            {formatPrice(price)}
                        </p>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default CourseCard;
