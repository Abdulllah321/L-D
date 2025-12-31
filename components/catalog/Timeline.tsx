'use client';

import { IDesignation } from '@/models/Designation';
import { ITraining } from '@/models/Training';
import { motion, useScroll, useSpring } from 'motion/react';
import { useRef } from 'react';
import { IconChevronRight } from '@tabler/icons-react';
import { clsx } from 'clsx';
import { useRouter } from 'next/navigation';

interface TimelineProps {
    designations: IDesignation[];
    trainingsMap: Map<string, ITraining[]>;
}

const Timeline = ({ designations, trainingsMap }: TimelineProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const scaleY = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const handleSelect = (id: string) => {
        router.push(`/catalog/${id}`);
    };

    return (
        <div ref={containerRef} className="relative w-full max-w-5xl mx-auto py-20 px-4">

            {/* Vertical Line Container */}
            <div className="absolute left-[28px] md:left-1/2 top-0 bottom-0 w-1 md:-ml-0.5 z-0">
                <div className="absolute inset-0 bg-zinc-200 w-0.5 mx-auto rounded-full" />
                <motion.div
                    style={{ scaleY, originY: 0 }}
                    className="absolute inset-0 bg-gradient-to-b from-teal-400 via-blue-500 to-violet-500 w-0.5 mx-auto rounded-full"
                />
            </div>

            <div className="space-y-24">
                {designations.map((designation, index) => {
                    const trainings = trainingsMap.get(designation.id) || [];
                    const isEven = index % 2 === 0;

                    return (
                        <div key={designation.id} className={clsx(
                            "relative flex flex-col md:flex-row items-center",
                            isEven ? "md:flex-row-reverse" : ""
                        )}>

                            {/* Node Point */}
                            <div className="absolute left-[28px] md:left-1/2 top-0 w-4 h-4 -ml-2 rounded-full border-2 border-zinc-100 bg-white z-10 flex items-center justify-center shadow-lg">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    whileInView={{ scale: 1 }}
                                    viewport={{ once: true }}
                                    className="w-full h-full rounded-full bg-teal-500"
                                />
                            </div>

                            {/* Content */}
                            <div className={clsx(
                                "w-full md:w-1/2 pl-16 md:pl-0",
                                isEven ? "md:pr-16 md:text-right" : "md:pl-16"
                            )}>
                                <motion.div
                                    initial={{ opacity: 0, x: isEven ? 50 : -50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <div
                                        onClick={() => handleSelect(designation.id)}
                                        className={clsx(
                                            "cursor-pointer group inline-block p-6 rounded-2xl bg-white border border-zinc-100 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-teal-100 hover:bg-teal-50/30",
                                            isEven ? "items-end" : "items-start"
                                        )}
                                    >
                                        <h2 className="text-3xl font-bold text-zinc-900 group-hover:text-teal-600 transition-colors duration-300">
                                            {designation.title}
                                        </h2>
                                        <p className="mt-2 text-zinc-500 text-sm font-medium">{designation.summary}</p>

                                        <div className={clsx(
                                            "mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-100 text-zinc-600 text-sm font-semibold transition-all group-hover:bg-teal-500 group-hover:text-white",
                                        )}>
                                            <span>View Learning Journey</span>
                                            <IconChevronRight size={16} />
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Spacer */}
                            <div className="hidden md:block w-1/2" />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Timeline;
