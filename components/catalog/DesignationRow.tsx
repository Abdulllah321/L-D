'use client';

import { IDesignation } from '@/models/Designation';
import { ITraining } from '@/models/Training';
import Timeline from './Timeline';
import { motion } from 'motion/react';
import * as SolarIcons from '@solar-icons/react'; // Import all to dynamically render
import { Zap, Briefcase } from 'lucide-react';
import { useMemo } from 'react';

interface DesignationRowProps {
    designation: IDesignation;
    trainings: ITraining[];
    onSelectTraining: (training: ITraining) => void;
}

export default function DesignationRow({ designation, trainings, onSelectTraining }: DesignationRowProps) {

    // Dynamically get icon
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const IconComponent = (SolarIcons as any)[designation.iconName] || SolarIcons.UserIcon;

    // memoized filtering for tracks
    const { normalTrack, hiPoTrack } = useMemo(() => {
        const normal: ITraining[] = [];
        const hiPo: ITraining[] = [];

        trainings.forEach(t => {
            const isHiPo = /Leadership|Strategic|Advanced|Management|Director|Executive|Head/i.test(t.programTitle) ||
                /Leadership|Strategic/i.test(t.targetAudience);

            if (isHiPo) {
                hiPo.push(t);
            } else {
                normal.push(t);
            }
        });

        return { normalTrack: normal, hiPoTrack: hiPo };
    }, [trainings]);

    if (trainings.length === 0) return null;

    return (
        <section className="py-12 border-b border-zinc-100 dark:border-zinc-800 last:border-0">
            <div className="container mx-auto px-4 mb-8">
                <div className="flex items-start gap-4">
                    <div className="mt-1 p-3 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded-2xl">
                        <IconComponent size={32} iconStyle="BoldDuotone" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-zinc-800 dark:text-zinc-100 mb-2">{designation.title}</h2>
                        <p className="text-zinc-500 dark:text-zinc-400 max-w-2xl text-lg leading-relaxed">{designation.summary}</p>

                        <div className="flex gap-4 mt-4 text-sm font-medium text-zinc-400">
                            <span>{trainings.length} Trainings Available</span>
                            <span>•</span>
                            <span>{designation.coreTrainings} Core</span>
                            <span>•</span>
                            <span>{designation.refreshers} Refreshers</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {normalTrack.length > 0 && (
                    <Timeline
                        trainings={normalTrack}
                        onSelectTraining={onSelectTraining}
                        label="Standard Track"
                        icon={<Briefcase size={16} className="text-blue-500" />}
                    />
                )}

                {hiPoTrack.length > 0 && (
                    <Timeline
                        trainings={hiPoTrack}
                        onSelectTraining={onSelectTraining}
                        label="High Potential (Hi-Po) Track"
                        icon={<Zap size={16} className="text-amber-500" />}
                    />
                )}
            </div>

        </section>
    );
}
