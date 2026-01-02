'use client';

import { ITraining } from '@/models/Training';
import { motion } from 'motion/react';
import { IconClock, IconUsers, IconBook, IconStar } from '@tabler/icons-react';
import { clsx } from "clsx";

interface TrainingCardProps {
    training: ITraining;
    onClick?: () => void;
    // We can derive layoutId from training._id, but passing unique prefix if needed is good practice
    layoutId?: string;
}

const TrainingCard = ({ training, onClick, layoutId }: TrainingCardProps) => {
    // If no specific layoutId provided, use training id
    const id = layoutId || training._id;

    return (
        <motion.div
            layoutId={`card-${id}`}
            onClick={onClick}
            whileHover={{ y: -5, scale: 1.02 }}
            className={clsx(
                "group relative overflow-hidden rounded-2xl cursor-pointer",
                "bg-white/95 backdrop-blur-md border border-zinc-200", // Increased opacity
                "shadow-lg hover:shadow-xl hover:shadow-teal-500/10 hover:border-teal-500/50",
                "transition-all duration-300"
            )}
            transition={{ ease: "easeInOut", duration: 0.3 }}
        >
            {/* Gradient Glow */}
            <div className="absolute -inset-1 bg-linear-to-r from-teal-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />

            <div className="relative p-6 space-y-4">
                <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1 w-full">
                        {/* Partner Badge */}
                        <div className="inline-block">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-50 text-teal-700 border border-teal-200">
                                {training.isHalfDay ? 'Half Day' : training.durationFormat}
                            </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-bold text-zinc-900 group-hover:text-teal-600 transition-colors mt-1">
                            {training.programTitle}
                        </h3>
                    </div>
                </div>

                {/* Description - Fade out on expand usually, but we keep it static for card */}
                <p className="text-zinc-600 text-sm line-clamp-2">
                    {training.programObjective}
                </p>

                <div className="grid grid-cols-2 gap-3 pt-2 text-sm text-zinc-500">
                    <div className="flex items-center gap-2">
                        <IconUsers size={16} className="text-blue-600 stroke-[1.5]" />
                        <span className="truncate">{training.targetAudience}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <IconClock size={16} className="text-teal-600 stroke-[1.5]" />
                        <span>{training.isHalfDay ? 'Half Day' : 'Full Day'}</span>
                    </div>
                    <div className="col-span-2 flex items-center gap-2">
                        <IconBook size={16} className="text-violet-600 stroke-[1.5]" />
                        {/* This will match the trainingPartner badge in modal header */}
                        <span className="truncate">
                            {training.trainingPartner}
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default TrainingCard;
