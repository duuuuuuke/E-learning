"use client";

import { checkOut } from "@/actions/checkOutActions";
import { Button } from "@/components/ui/button";

import { formatPrice } from "@/lib/formatPrice";

import { useState } from "react";

import toast from "react-hot-toast";

interface CourseEnrollButtonProps {
    price: number;
    courseId: string;
}

const CourseEnrollButton = ({ price, courseId }: CourseEnrollButtonProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const handleClick = async () => {
        try {
            setIsLoading(true);
            const res = await checkOut({ courseId });
            if (!res.success) {
                toast.error(res.error);
                return;
            }
            window.location.assign(res.url!);
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <Button
            size="sm"
            className="w-full md:w-auto"
            onClick={handleClick}
            disabled={isLoading}>
            Enroll for {formatPrice(price)}
        </Button>
    );
};

export default CourseEnrollButton;
