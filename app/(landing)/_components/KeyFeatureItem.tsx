"use client";

import { cn } from "@/lib/utils";

import { motion } from "framer-motion";

interface KeyFeatureItemProps {
    title: string;
    features: { title: string; description: string }[];
    isReversed: boolean;
}

const KeyFeatureItem = ({
    title,
    features,
    isReversed
}: KeyFeatureItemProps) => {
    const xValue = isReversed ? -100 : 100;
    return (
        <motion.div
            className={cn(
                "w-full flex flex-col items-center gap-6 md:gap-x-10 border-2 p-6 rounded-lg shadow-md",
                isReversed ? "md:flex-row-reverse" : "md:flex-row"
            )}
            initial={{ opacity: 0, x: xValue }}
            whileInView={{
                opacity: 1,
                x: 0,
                transition: { delay: 0.25, duration: 0.5 }
            }}
            viewport={{ amount: 0.8, once: true }}>
            <h1 className="text-slate-700 text-xl md:text-3xl font-bold">
                {title}
            </h1>
            <ul className="w-full flex flex-col gap-6">
                {features.map((feature) => (
                    <li
                        className="text-slate-500 text-xs md:text-base"
                        key={feature.title}>
                        <span className="text-slate-700 font-semibold">
                            {feature.title}
                        </span>{" "}
                        {feature.description}
                    </li>
                ))}
            </ul>
        </motion.div>
    );
};

export default KeyFeatureItem;
