"use client";

import { Button } from "@/components/ui/button";

import { motion } from "framer-motion";

const Hero = () => {
    return (
        <motion.section
            className="w-4/5 flex flex-col items-center p-6 gap-y-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}>
            <h1 className="text-slate-700 text-5xl md:text-6xl font-bold text-center">
                The Ultimate E-Learning Marketplace
            </h1>
            <div className="w-1/2 flex flex-col items-center gap-y-5">
                <p className="text-slate-500 text-sm sm:text-xl text-center">
                    The innovative e-learning platform where students become
                    scholars and teachers become entrepreneurs.
                </p>
                <Button>
                    <a href="/dashboard">Get Started</a>
                </Button>
            </div>
        </motion.section>
    );
};

export default Hero;
