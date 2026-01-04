'use client';

import { IDesignation } from '@/models/Designation';
import { ITraining } from '@/models/Training';
import { ILearningPath } from '@/models/LearningPath';
import { useState, useMemo } from 'react';
import Header from '@/app/components/Header';
import Footer from '@/app/components/landing/Footer';
import LearningPathView from './LearningPath'; // Renamed import to avoid confusion with model
import TrainingModal from './TrainingModal';
import { motion, AnimatePresence } from 'motion/react';
import { IconArrowLeft, IconBolt, IconBriefcase, IconCalendar, IconDeviceLaptop, IconSchool } from '@tabler/icons-react';
import Link from 'next/link';
import { clsx } from 'clsx';
import Logo from '../ui/sparkles-logo';

// Types for the new structure
export type CatalogItem =
    | { type: 'training'; data: ITraining }
    | { type: 'learning-path'; data: ILearningPath; trainings: ITraining[] };

export interface TrackContent {
    items: CatalogItem[];
}

export interface SubDesignationContent {
    id: string; // 'main' for default
    title: string;
    tracks: {
        normal: {
            regular: TrackContent;
            annualRegular: TrackContent;
            annualEcourse: TrackContent;
        };
        hiPo: {
            regular: TrackContent;
            annualRegular: TrackContent;
            annualEcourse: TrackContent;
        };
    };
}

interface DesignationDetailViewProps {
    designation: IDesignation;
    subDesignationsContent: SubDesignationContent[];
    navigation?: {
        prev: { id: string; title: string } | null;
        next: { id: string; title: string } | null;
    };
}

export default function DesignationDetailView({
    designation,
    subDesignationsContent,
    navigation
}: DesignationDetailViewProps) {
    const [selectedTraining, setSelectedTraining] = useState<ITraining | null>(null);
    const [activeSubDesignationId, setActiveSubDesignationId] = useState<string>(
        subDesignationsContent.length > 0 ? subDesignationsContent[0].id : 'main'
    );

    const activeContent = useMemo(() =>
        subDesignationsContent.find(c => c.id === activeSubDesignationId) || subDesignationsContent[0],
        [subDesignationsContent, activeSubDesignationId]
    );

    // Helpers to render items (Trainings or Learning Paths)
    const renderTrackItems = (items: CatalogItem[]) => {
        return (
            <div className="space-y-12">
                {items.map((item, index) => {
                    if (item.type === 'training') {
                        // Treat individual trainings as a "General" path or similar
                        return (
                            <LearningPathView
                                key={item.data._id as string || index}
                                title="Individual Modules"
                                trainings={[item.data]}
                                onSelectTraining={setSelectedTraining}
                            />
                        );
                    } else {
                        // It's a Learning Path
                        // Construct the title: Designation Code/Initials + Path Title
                        const getInitials = (str: string) => str.split(' ').map(n => n[0]).join('').toUpperCase();
                        const prefix = designation.title ? getInitials(designation.title) : 'LP';
                        // User requested format: "SA Islamic Skill Deck" where SA is designation code
                        // We can try to use ID if it's short, or initials of title
                        const titleCode = designation.id.length <= 4 ? designation.id : prefix;
                        const title = `${titleCode} ${item.data.title}`;

                        return (
                            <LearningPathView
                                key={item.data._id as string || index}
                                title={title}
                                frequency={item.data.frequency}
                                trainings={item.trainings}
                                onSelectTraining={setSelectedTraining}
                            />
                        );
                    }
                })}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-zinc-50 selection:bg-teal-500/30 text-zinc-900 font-sans">
            <Header />

            {/* Background Patterns */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 right-0 w-[60%] h-[600px] bg-gradient-to-b from-blue-50/50 via-teal-50/20 to-transparent" />
                <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-violet-100/30 rounded-full blur-[100px]" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />
            </div>

            <main className="relative z-10 pt-32 pb-12">
                <div className="container mx-auto px-6">

                    {/* Navigation Bar */}
                    <div className="flex items-center justify-between mb-8">
                        <Link href="/catalog" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-teal-600 transition-colors group">
                            <IconArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            Back to Catalog
                        </Link>

                        {navigation && (
                            <div className="flex items-center gap-4 text-sm font-medium">
                                {navigation.prev ? (
                                    <Link href={`/catalog/${navigation.prev.id}`} className="text-zinc-500 hover:text-zinc-900 transition-colors">
                                        &larr; {navigation.prev.title}
                                    </Link>
                                ) : <span className="text-zinc-300 cursor-not-allowed">&larr; Previous</span>}
                                <span className="text-zinc-300">|</span>
                                {navigation.next ? (
                                    <Link href={`/catalog/${navigation.next.id}`} className="text-zinc-500 hover:text-zinc-900 transition-colors">
                                        {navigation.next.title} &rarr;
                                    </Link>
                                ) : <span className="text-zinc-300 cursor-not-allowed">Next &rarr;</span>}
                            </div>
                        )}
                    </div>

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

                    {/* Sub-Designation Tabs */}
                    {subDesignationsContent.length > 1 && (
                        <div className="mt-12 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                            {subDesignationsContent.map((sub) => (
                                <button
                                    key={sub.id}
                                    onClick={() => setActiveSubDesignationId(sub.id)}
                                    className={clsx(
                                        "px-6 py-3 rounded-full text-sm font-semibold whitespace-nowrap transition-all",
                                        activeSubDesignationId === sub.id
                                            ? "bg-zinc-900 text-white shadow-lg shadow-zinc-900/10"
                                            : "bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200"
                                    )}
                                >
                                    {sub.title}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Tracks Content */}
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={activeSubDesignationId}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-20 mt-12"
                        >
                            {/* Normal Track */}
                            {(activeContent?.tracks.normal.regular.items.length > 0 || 
                              activeContent?.tracks.normal.annualRegular.items.length > 0 || 
                              activeContent?.tracks.normal.annualEcourse.items.length > 0) && (
                                <section>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-2.5 rounded-xl bg-blue-100 text-blue-600">
                                            <IconBriefcase size={28} />
                                        </div>
                                        <h2 className="text-3xl font-bold text-zinc-900">Normal Track</h2>
                                    </div>
                                    
                                    {/* Regular */}
                                    {activeContent.tracks.normal.regular.items.length > 0 && (
                                        <div className="mb-12">
                                            <h3 className="text-xl font-semibold text-zinc-700 mb-6">Regular</h3>
                                            {renderTrackItems(activeContent.tracks.normal.regular.items)}
                                        </div>
                                    )}
                                    
                                    {/* Annual Regular */}
                                    {activeContent.tracks.normal.annualRegular.items.length > 0 && (
                                        <div className="mb-12">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="p-2 rounded-lg bg-green-100 text-green-600">
                                                    <IconCalendar size={20} />
                                                </div>
                                                <h3 className="text-xl font-semibold text-zinc-700">Annual Regular</h3>
                                            </div>
                                            {renderTrackItems(activeContent.tracks.normal.annualRegular.items)}
                                        </div>
                                    )}
                                    
                                    {/* Annual E-Course */}
                                    {activeContent.tracks.normal.annualEcourse.items.length > 0 && (
                                        <div className="mb-12">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                                                    <IconDeviceLaptop size={20} />
                                                </div>
                                                <h3 className="text-xl font-semibold text-zinc-700">Annual E-Course</h3>
                                            </div>
                                            {renderTrackItems(activeContent.tracks.normal.annualEcourse.items)}
                                        </div>
                                    )}
                                </section>
                            )}

                            {/* Hi-Po Track */}
                            {(activeContent?.tracks.hiPo.regular.items.length > 0 || 
                              activeContent?.tracks.hiPo.annualRegular.items.length > 0 || 
                              activeContent?.tracks.hiPo.annualEcourse.items.length > 0) && (
                                <section>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-2.5 rounded-xl bg-amber-100 text-amber-600">
                                            <IconBolt size={28} />
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-bold text-zinc-900">High Potential (Hi-Po) Track</h2>
                                            <p className="text-zinc-500 text-sm mt-1">Advanced development for future leaders.</p>
                                        </div>
                                    </div>
                                    <div className="p-1 rounded-3xl bg-gradient-to-br from-amber-200 via-orange-100 to-transparent">
                                        <div className="bg-amber-50/50 rounded-[1.4rem] p-6 md:p-8">
                                            {/* Regular */}
                                            {activeContent.tracks.hiPo.regular.items.length > 0 && (
                                                <div className="mb-12">
                                                    <h3 className="text-xl font-semibold text-zinc-700 mb-6">Regular</h3>
                                                    {renderTrackItems(activeContent.tracks.hiPo.regular.items)}
                                                </div>
                                            )}
                                            
                                            {/* Annual Regular */}
                                            {activeContent.tracks.hiPo.annualRegular.items.length > 0 && (
                                                <div className="mb-12">
                                                    <div className="flex items-center gap-3 mb-6">
                                                        <div className="p-2 rounded-lg bg-green-100 text-green-600">
                                                            <IconCalendar size={20} />
                                                        </div>
                                                        <h3 className="text-xl font-semibold text-zinc-700">Annual Regular</h3>
                                                    </div>
                                                    {renderTrackItems(activeContent.tracks.hiPo.annualRegular.items)}
                                                </div>
                                            )}
                                            
                                            {/* Annual E-Course */}
                                            {activeContent.tracks.hiPo.annualEcourse.items.length > 0 && (
                                                <div className="mb-12">
                                                    <div className="flex items-center gap-3 mb-6">
                                                        <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                                                            <IconDeviceLaptop size={20} />
                                                        </div>
                                                        <h3 className="text-xl font-semibold text-zinc-700">Annual E-Course</h3>
                                                    </div>
                                                    {renderTrackItems(activeContent.tracks.hiPo.annualEcourse.items)}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </section>
                            )}
                        </motion.div>
                    </AnimatePresence>

                </div>
            </main>
            <Logo />
            <Footer />

            <TrainingModal
                isOpen={!!selectedTraining}
                training={selectedTraining}
                onClose={() => setSelectedTraining(null)}
            />
        </div>
    )
}
