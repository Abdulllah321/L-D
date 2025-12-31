'use client';

import { ITraining } from '@/models/Training';
import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import TrainingCard from './TrainingCard';
import { clsx } from 'clsx';

interface LearningPathProps {
    trainings: ITraining[];
    onSelectTraining: (t: ITraining) => void;
}

const LearningPath = ({ trainings, onSelectTraining }: LearningPathProps) => {
    // We don't use horizontal scroll anymore, we use a vertical stacking list

    return (
        <div className="relative w-full max-w-4xl mx-auto py-12 px-4 md:px-0">
            {/* The "Deck" Container */}
            <div className="space-y-12 relative">
                {/* Continuous Background Line */}
                <div className="absolute left-[42px] md:left-[30px] top-8 bottom-8 w-1 bg-zinc-100 z-0 hidden md:block" />

                {trainings.map((training, index) => {
                    return (
                        <StickyCard
                            key={training._id as string}
                            training={training}
                            index={index}
                            total={trainings.length}
                            onClick={() => onSelectTraining(training)}
                        />
                    );
                })}
            </div>

            {/* Spacer for bottom */}
            <div className="h-24" />
        </div>
    );
};

interface StickyCardProps {
    training: ITraining;
    index: number;
    total: number;
    onClick: () => void;
}

const StickyCard = ({ training, index, total, onClick }: StickyCardProps) => {
    // Sticky header calculation
    // Top offset increases slightly for each card so they stack nicely visible
    const topOffset = 140 + (index * 10);

    return (
        <motion.div

            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            className="sticky"
            style={{
                top: topOffset,
                zIndex: index
            }}
        >
            <div className="relative">
                {/* Connector Line Logic (Removed in favor of global line) */}
                {/* {index !== total - 1 && (
                     <div className="absolute left-8 top-full h-24 w-0.5 bg-gradient-to-b from-teal-500 to-transparent z-[-1]" />
                )} */}

                <div className="flex items-start gap-6">
                    {/* Step Number Bubble */}
                    <div className="hidden md:flex flex-col items-center gap-2 pt-6">
                        <div className="w-16 h-16 rounded-full bg-white border-4 border-zinc-100 shadow-md flex items-center justify-center font-bold text-xl text-teal-600 z-10">
                            {index + 1}
                        </div>
                    </div>

                    {/* Card Container */}
                    <div className="w-full">
                        <TrainingCard training={training} onClick={onClick} />
                    </div>
                </div>
            </div>
        </motion.div>
    )
}


export default LearningPath;
