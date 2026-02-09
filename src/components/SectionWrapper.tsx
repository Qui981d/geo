"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface SectionWrapperProps {
    children: React.ReactNode;
    className?: string;
    id?: string;
}

export default function SectionWrapper({ children, className = "", id }: SectionWrapperProps) {
    const ref = useRef<HTMLElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <motion.section
            ref={ref}
            id={id}
            className={`relative py-24 px-6 md:px-12 lg:px-20 ${className}`}
            initial={{ opacity: 0, y: 60 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
            {children}
        </motion.section>
    );
}
