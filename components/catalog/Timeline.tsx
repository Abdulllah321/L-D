'use client';

import { ITraining } from '@/models/Training';
import TrainingCard from './TrainingCard';
import { useRef } from 'react';
import { motion } from 'motion/react';

interface TimelineProps {
    trainings: ITraining[];
    onSelectTraining: (training: ITraining) => void;
    label?: string;
    icon?: React.ReactNode;
}

export default function Timeline({ trainings, onSelectTraining, label, icon }: TimelineProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    if (trainings.length === 0) return null;

    return (
        <div className="w-full py-4">
            {label && (
                <div className="flex items-center gap-2 mb-4 px-4 sticky left-0">
                    {icon}
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">{label}</span>
                    <div className="h-[1px] bg-zinc-100 dark:bg-zinc-800 flex-grow" />
                </div>
            )}

            <div
                ref={containerRef}
                className="flex gap-6 overflow-x-auto pb-8 pt-2 px-4 snap-x custom-scrollbar"
                style={{ scrollBehavior: 'smooth' }}
            >
                {trainings.map((training, index) => (
                    <TrainingCard
                        key={training._id as string}
                        index={index}
                        training={training}
                        onClick={onSelectTraining}
                    />
                ))}
                {/* Spacer for end of list */}
                <div className="w-4 shrink-0" />
            </div>
        </div>
    );
}
