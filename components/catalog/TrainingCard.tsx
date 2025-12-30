'use client';

import { ITraining } from '@/models/Training';
import { motion } from 'motion/react';
import { Clock } from 'lucide-react';

interface TrainingCardProps {
    training: ITraining;
    onClick: (training: ITraining) => void;
    index: number;
}

export default function TrainingCard({ training, onClick, index }: TrainingCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            whileHover={{ y: -5, scale: 1.02 }}
            onClick={() => onClick(training)}
            className="min-w-[280px] w-[280px] bg-white dark:bg-zinc-800 rounded-xl shadow-sm hover:shadow-xl border border-zinc-100 dark:border-zinc-700 transition-all cursor-pointer p-5 flex flex-col justify-between h-[180px] group relative overflow-hidden shrink-0 snap-start"
        >
            <div className="absolute top-0 left-0 w-1 h-full bg-violet-500/50 group-hover:bg-violet-500 transition-colors" />

            <div>
                <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">{training.trainingPartner}</span>
                </div>
                <h3 className="font-semibold text-zinc-800 dark:text-zinc-100 line-clamp-2 leading-tight group-hover:text-violet-600 transition-colors">
                    {training.programTitle}
                </h3>
            </div>

            <div className="mt-4">
                <div className="flex items-center gap-1.5 text-xs text-zinc-500 mb-3">
                    <Clock size={14} />
                    <span>{training.durationFormat}</span>
                </div>

                <div className="flex flex-wrap gap-1">
                    {training.competencies.functional?.slice(0, 2).map((c, i) => (
                        <span key={i} className="text-[10px] bg-zinc-100 dark:bg-zinc-700 px-1.5 py-0.5 rounded text-zinc-600 dark:text-zinc-300 truncate max-w-[120px]">
                            {c}
                        </span>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
