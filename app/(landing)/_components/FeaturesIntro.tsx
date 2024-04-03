"use client";

import FeatureCard from "./FeatureCard";

import { PiStudent } from "react-icons/pi";
import { LiaChalkboardTeacherSolid } from "react-icons/lia";

import { motion, stagger } from "framer-motion";

const features = [
    {
        title: "For Students",
        description:
            "Whether you're brushing up on programming skills, delving into digital marketing, or exploring the astrophysics, our platform has something for everyone. Say goodbye to rigid schedules and geographical limitations - learn at your own pace, from anywhere in the world.",
        Icon: <PiStudent />
    },
    {
        title: "For Educators",
        description:
            "Are you an expert in your field with a passion for teaching? Whether you're a seasoned educator, industry professional, or passionate hobbyist, our platform provides the tools and support you need to create and sell high-quality courses to a global audience.",
        Icon: <LiaChalkboardTeacherSolid />
    }
];

const FeaturesIntro = () => {
    return (
        <motion.section
            className="w-full md:w-11/12 lg:w-4/5 flex flex-col md:flex-row items-center gap-8 md:p-6 p-0"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{
                opacity: 1,
                y: 0,
                transition: { delay: 0.5 }
            }}
            viewport={{ once: true }}>
            {features.map((feature) => (
                <FeatureCard
                    key={feature.title}
                    title={feature.title}
                    Icon={feature.Icon}
                    description={feature.description}
                />
            ))}
        </motion.section>
    );
};

export default FeaturesIntro;
