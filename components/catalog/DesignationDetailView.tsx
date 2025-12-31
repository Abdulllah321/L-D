'use client';

import { IDesignation } from '@/models/Designation';
import { ITraining } from '@/models/Training';
import { useState, useMemo } from 'react';
import Header from '@/app/components/Header';
import Footer from '@/app/components/landing/Footer';
import LearningPath from './LearningPath';
import TrainingModal from './TrainingModal';
import { motion } from 'motion/react';
import { IconArrowLeft, IconBolt, IconBriefcase } from '@tabler/icons-react';
import Link from 'next/link';
import { clsx } from 'clsx';

interface DesignationDetailViewProps {
    designation: IDesignation;
    trainings: ITraining[];
}

export default function DesignationDetailView({ designation, trainings }: DesignationDetailViewProps) {
    const [selectedTraining, setSelectedTraining] = useState<ITraining | null>(null);

    // Track Splitting Logic
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

    return (
        <div className="min-h-screen bg-zinc-50 selection:bg-teal-500/30 text-zinc-900 font-sans">
            <Header />

            {/* Background Patterns - Light Mode */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 right-0 w-[60%] h-[600px] bg-gradient-to-b from-blue-50/50 via-teal-50/20 to-transparent" />
                <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-violet-100/30 rounded-full blur-[100px]" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />
            </div>

            <main className="relative z-10 pt-32 pb-12">
                <div className="container mx-auto px-6">

                    {/* Breadcrumb / Back */}
                    <Link href="/catalog" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-teal-600 transition-colors mb-8 group">
                        <IconArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Catalog
                    </Link>

                    {/* Header */}
                    <div className="max-w-4xl">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-6xl font-bold tracking-tight text-zinc-900 mb-6"
                        >
                            {designation.title}
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-xl text-zinc-600 leading-relaxed max-w-2xl"
                        >
                            {designation.summary}
                        </motion.p>
                    </div>

                    {/* Stats / Info Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-12 flex flex-wrap gap-6 border-y border-zinc-200 py-8"
                    >
                        <div>
                            <span className="block text-sm font-semibold text-zinc-400 uppercase tracking-wider">Total Trainings</span>
                            <span className="text-3xl font-bold text-zinc-900">{trainings.length}</span>
                        </div>
                        <div className="h-auto w-px bg-zinc-200 hidden md:block" />
                        <div>
                            <span className="block text-sm font-semibold text-zinc-400 uppercase tracking-wider">Standard</span>
                            <span className="text-3xl font-bold text-blue-600">{normalTrack.length}</span>
                        </div>
                        {hiPoTrack.length > 0 && (
                            <>
                                <div className="h-auto w-px bg-zinc-200 hidden md:block" />
                                <div>
                                    <span className="block text-sm font-semibold text-zinc-400 uppercase tracking-wider">Hi-Po</span>
                                    <span className="text-3xl font-bold text-amber-500">{hiPoTrack.length}</span>
                                </div>
                            </>
                        )}
                    </motion.div>

                    {/* Learning Path Sections */}
                    <div className="space-y-20 mt-16">

                        {/* Standard Track */}
                        {normalTrack.length > 0 && (
                            <section>
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="p-2.5 rounded-xl bg-blue-100 text-blue-600">
                                        <IconBriefcase size={28} />
                                    </div>
                                    <h2 className="text-3xl font-bold text-zinc-900">Standard Learning Track</h2>
                                </div>
                                <LearningPath trainings={normalTrack} onSelectTraining={setSelectedTraining} />
                            </section>
                        )}

                        {/* Hi-Po Track */}
                        {hiPoTrack.length > 0 && (
                            <section>
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="p-2.5 rounded-xl bg-amber-100 text-amber-600">
                                        <IconBolt size={28} />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-bold text-zinc-900">High Potential (Hi-Po) Track</h2>
                                        <p className="text-zinc-500 text-lg">Advanced development for future leaders.</p>
                                    </div>
                                </div>
                                <div className="p-1 rounded-3xl bg-gradient-to-br from-amber-200 via-orange-100 to-transparent">
                                    <div className="bg-amber-50/50 rounded-[1.4rem] p-4 md:p-8">
                                        <LearningPath trainings={hiPoTrack} onSelectTraining={setSelectedTraining} />
                                    </div>
                                </div>
                            </section>
                        )}
                    </div>

                </div>
            </main>

            <Footer />

            <TrainingModal
                isOpen={!!selectedTraining}
                training={selectedTraining}
                onClose={() => setSelectedTraining(null)}
            />
        </div>
    )
}
