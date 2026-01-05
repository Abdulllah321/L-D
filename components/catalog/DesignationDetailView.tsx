'use client';

import { IDesignation } from '@/models/Designation';
import { ITraining } from '@/models/Training';
import { ILearningPath } from '@/models/LearningPath';
import { useState, useMemo } from 'react';
import Header from '@/app/components/Header';
import Footer from '@/app/components/landing/Footer';
import TrainingModal from './TrainingModal';
import { motion, AnimatePresence, LayoutGroup } from 'motion/react';
import { IconArrowLeft, IconBolt, IconBriefcase, IconCalendar, IconDeviceLaptop, IconSchool, IconChevronDown, IconChevronRight } from '@tabler/icons-react';
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
    const [expandedTracks, setExpandedTracks] = useState<Set<string>>(new Set(['normal-regular']));
    const [expandedAnnualTypes, setExpandedAnnualTypes] = useState<Set<string>>(new Set());

    const activeContent = useMemo(() =>
        subDesignationsContent.find(c => c.id === activeSubDesignationId) || subDesignationsContent[0],
        [subDesignationsContent, activeSubDesignationId]
    );

    const toggleTrack = (trackKey: string) => {
        const newSet = new Set(expandedTracks);
        if (newSet.has(trackKey)) {
            newSet.delete(trackKey);
        } else {
            newSet.add(trackKey);
        }
        setExpandedTracks(newSet);
    };

    const toggleAnnualType = (annualKey: string) => {
        const newSet = new Set(expandedAnnualTypes);
        if (newSet.has(annualKey)) {
            newSet.delete(annualKey);
        } else {
            newSet.add(annualKey);
        }
        setExpandedAnnualTypes(newSet);
    };

    // Render Training Card
    const renderTrainingCard = (training: ITraining, index: number) => {
        // Check if this is a custom training (no valid training data - empty programObjective and outcomesBenefits)
        const isCustomTraining = !training.programObjective || (!training.programObjective && !training.outcomesBenefits);
        const canOpenModal = !isCustomTraining && training._id && training.programObjective;

        return (
            <motion.div
                key={String(training._id) || `custom-${index}`}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                layout
                className={clsx(
                    "group",
                    canOpenModal ? "cursor-pointer" : "cursor-default"
                )}
                onClick={(e) => {
                    e.stopPropagation();
                    if (canOpenModal) {
                        setSelectedTraining(training);
                    }
                }}
            >
                <div className={clsx(
                    "bg-white rounded-xl border-2 p-5 transition-all duration-300",
                    canOpenModal 
                        ? "border-zinc-200 hover:border-teal-400 hover:shadow-lg" 
                        : "border-zinc-200 opacity-90"
                )}>
                    <h4 className={clsx(
                        "font-bold mb-2 transition-colors",
                        canOpenModal 
                            ? "text-zinc-900 group-hover:text-teal-600" 
                            : "text-zinc-700"
                    )}>
                        {training.programTitle}
                    </h4>
                    <p className="text-sm text-zinc-600 line-clamp-2 mb-3">
                        {training.outcomesBenefits || training.programObjective || 'No description available'}
                    </p>
                    {training.frequency && (
                        <div className="flex items-center gap-2 text-xs text-zinc-500">
                            <IconCalendar size={14} />
                            <span>{training.frequency}</span>
                        </div>
                    )}
                    {isCustomTraining && (
                        <div className="mt-2 text-xs text-zinc-400 italic">
                            Custom training - No detailed information available
                        </div>
                    )}
                </div>
            </motion.div>
        );
    };

    // Render Learning Path Card
    const renderLearningPathCard = (item: CatalogItem & { type: 'learning-path' }, index: number) => {
        const getInitials = (str: string) => str.split(' ').map(n => n[0]).join('').toUpperCase();
        const prefix = designation.title ? getInitials(designation.title) : 'LP';
        // const titleCode = designation.id.length <= 4 ? designation.id : prefix;
        const title = `${item.data.title}`;

        return (
            <motion.div
                key={String(item.data._id)}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                layout
                className="bg-white rounded-xl border-2 border-teal-200 overflow-hidden hover:border-teal-400 hover:shadow-xl transition-all duration-300"
            >
                {/* Learning Path Header - Not clickable, just displays info */}
                <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="font-bold text-white text-lg">{title}</h4>
                            {item.data.frequency && (
                                <p className="text-teal-100 text-sm mt-1">{item.data.frequency}</p>
                            )}
                        </div>
                        <IconSchool className="text-white/80" size={24} />
                    </div>
                </div>

                {/* Trainings List */}
                <div className="p-4 space-y-3">
                    {item.trainings.map((training, trainingIndex) => {
                        // Check if this is a custom training (no valid training data - empty programObjective and outcomesBenefits)
                        const isCustomTraining = !training.programObjective || (!training.programObjective && !training.outcomesBenefits);
                        const canOpenModal = !isCustomTraining && training._id && training.programObjective;

                        return (
                            <motion.div
                                key={String(training._id) || `custom-${trainingIndex}`}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: trainingIndex * 0.03 }}
                                className={clsx(
                                    "group",
                                    canOpenModal ? "cursor-pointer" : "cursor-default"
                                )}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    // if (canOpenModal) {
                                    //     setSelectedTraining(training);
                                    // }
                                }}
                            >
                                <div className={clsx(
                                    "flex items-start gap-3 p-3 rounded-lg transition-colors border",
                                    canOpenModal
                                        ? "border-zinc-100 hover:bg-teal-50 hover:border-teal-200"
                                        : "border-zinc-100 opacity-90"
                                )}>
                                    <div className="w-2 h-2 rounded-full bg-teal-400 mt-2 shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <h5 className={clsx(
                                            "font-semibold transition-colors",
                                            canOpenModal
                                                ? "text-zinc-900 group-hover:text-teal-600"
                                                : "text-zinc-700"
                                        )}>
                                            {training.programTitle}
                                        </h5>
                                        <p className="text-sm text-zinc-600 mt-1 line-clamp-2">
                                            {training.outcomesBenefits || training.programObjective || '-'}
                                        </p>
                                        {training.frequency && (
                                            <div className="flex items-center gap-1 text-xs text-zinc-500 mt-2">
                                                <IconCalendar size={12} />
                                                <span>{training.frequency}</span>
                                            </div>
                                        )}
                                        {isCustomTraining && (
                                            <div className="mt-2 text-xs text-zinc-400 italic">
                                                Custom training - No detailed information available
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>
        );
    };

    // Render Annual Type Section
    const renderAnnualTypeSection = (
        trackKey: string,
        annualKey: string,
        label: string,
        icon: React.ReactNode,
        colorClass: { bg: string; border: string; hoverBorder: string; iconBg: string; iconText: string },
        items: CatalogItem[]
    ) => {
        const fullKey = `${trackKey}-${annualKey}`;
        const isExpanded = expandedAnnualTypes.has(fullKey);
        const hasItems = items.length > 0;

        if (!hasItems) return null;

        return (
            <motion.div
                layout
                initial={false}
                className="relative"
            >
                {/* Connection Line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-zinc-300 to-zinc-200" />
                
                <div className="ml-8 mb-6">
                    <motion.button
                        onClick={() => toggleAnnualType(fullKey)}
                        className={clsx(
                            "w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-md",
                            colorClass.bg,
                            colorClass.border,
                            colorClass.hoverBorder
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <div className={clsx("p-2 rounded-lg", colorClass.iconBg, colorClass.iconText)}>
                                {icon}
                            </div>
                            <div className="text-left">
                                <h3 className="font-bold text-zinc-900">{label}</h3>
                                <p className="text-sm text-zinc-500">{items.length} {annualKey === 'regular' ? 'training' : annualKey === 'annual-regular' ? 'refresher' : 'course'}{items.length !== 1 ? 's' : ''}</p>
                            </div>
                        </div>
                        <motion.div
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <IconChevronDown size={20} className="text-zinc-600" />
                        </motion.div>
                    </motion.button>

                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="mt-4"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {items.map((item, index) => {
                                        if (item.type === 'training') {
                                            return renderTrainingCard(item.data, index);
                                        } else {
                                            return renderLearningPathCard(item, index);
                                        }
                                    })}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        );
    };

    // Render Track Section
    const renderTrackSection = (
        trackType: 'normal' | 'hi-po',
        trackLabel: string,
        trackIcon: React.ReactNode,
        trackColorClass: { gradient: string; border: string; hoverBorder: string; iconBg: string; iconText: string },
        trackData: {
            regular: TrackContent;
            annualRegular: TrackContent;
            annualEcourse: TrackContent;
        }
    ) => {
        const trackKey = trackType;
        const isExpanded = expandedTracks.has(trackKey);
        const hasContent = 
            trackData.regular.items.length > 0 ||
            trackData.annualRegular.items.length > 0 ||
            trackData.annualEcourse.items.length > 0;

        if (!hasContent) return null;

        return (
            <motion.section
                layout
                initial={false}
                className="mb-12"
            >
                {/* Track Header */}
                <motion.button
                    onClick={() => toggleTrack(trackKey)}
                    className={clsx(
                        "w-full flex items-center justify-between p-6 rounded-2xl border-2 transition-all duration-300 mb-6 hover:shadow-lg",
                        trackColorClass.gradient,
                        trackColorClass.border,
                        trackColorClass.hoverBorder
                    )}
                >
                    <div className="flex items-center gap-4">
                        <div className={clsx("p-3 rounded-xl", trackColorClass.iconBg, trackColorClass.iconText)}>
                            {trackIcon}
                        </div>
                        <div className="text-left">
                            <h2 className="text-2xl font-bold text-zinc-900">{trackLabel}</h2>
                            <p className="text-sm text-zinc-600 mt-1">
                                {trackData.regular.items.length + trackData.annualRegular.items.length + trackData.annualEcourse.items.length} total trainings
                            </p>
                        </div>
                    </div>
                    <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <IconChevronDown size={24} className="text-zinc-600" />
                    </motion.div>
                </motion.button>

                {/* Annual Type Sections */}
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-4"
                        >
                            {renderAnnualTypeSection(
                                trackKey,
                                'regular',
                                'Standard Learning Track',
                                <IconBriefcase size={20} />,
                                {
                                    bg: 'bg-blue-50',
                                    border: 'border-blue-200',
                                    hoverBorder: 'hover:border-blue-400',
                                    iconBg: 'bg-blue-100',
                                    iconText: 'text-blue-600'
                                },
                                trackData.regular.items
                            )}
                            {renderAnnualTypeSection(
                                trackKey,
                                'annual-regular',
                                'Annual/Bi-Annual Refreshers',
                                <IconCalendar size={20} />,
                                {
                                    bg: 'bg-green-50',
                                    border: 'border-green-200',
                                    hoverBorder: 'hover:border-green-400',
                                    iconBg: 'bg-green-100',
                                    iconText: 'text-green-600'
                                },
                                trackData.annualRegular.items
                            )}
                            {renderAnnualTypeSection(
                                trackKey,
                                'annual-ecourse',
                                'E-Learning Track',
                                <IconDeviceLaptop size={20} />,
                                {
                                    bg: 'bg-purple-50',
                                    border: 'border-purple-200',
                                    hoverBorder: 'hover:border-purple-400',
                                    iconBg: 'bg-purple-100',
                                    iconText: 'text-purple-600'
                                },
                                trackData.annualEcourse.items
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.section>
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
                <div className="container mx-auto px-6 max-w-7xl">
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
                    <div className="max-w-4xl mb-12">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-6xl font-bold tracking-tight text-zinc-900 mb-6"
                        >
                            {designation.title}
                        </motion.h1>
                    </div>

                    {/* Sub-Designation Tabs */}
                    {subDesignationsContent.length > 1 && (
                        <div className="mt-12 mb-8 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                            {subDesignationsContent.map((sub) => (
                                <motion.button
                                    key={sub.id}
                                    onClick={() => setActiveSubDesignationId(sub.id)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={clsx(
                                        "px-6 py-3 rounded-full text-sm font-semibold whitespace-nowrap transition-all",
                                        activeSubDesignationId === sub.id
                                            ? "bg-zinc-900 text-white shadow-lg shadow-zinc-900/10"
                                            : "bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200"
                                    )}
                                >
                                    {sub.title}
                                </motion.button>
                            ))}
                        </div>
                    )}

                    {/* Hierarchical Track Structure */}
                    <LayoutGroup>
                        <AnimatePresence mode='wait'>
                            <motion.div
                                key={activeSubDesignationId}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-8"
                            >
                                {/* Normal Track */}
                                {renderTrackSection(
                                    'normal',
                                    'Development Plan',
                                    <IconBriefcase size={28} />,
                                    {
                                        gradient: 'bg-gradient-to-r from-blue-50 to-blue-100/50',
                                        border: 'border-blue-200',
                                        hoverBorder: 'hover:border-blue-400',
                                        iconBg: 'bg-blue-100',
                                        iconText: 'text-blue-600'
                                    },
                                    activeContent.tracks.normal
                                )}

                                {/* Hi-Po Track */}
                                {renderTrackSection(
                                    'hi-po',
                                    'High Potential (Hi-Po) Track',
                                    <IconBolt size={28} />,
                                    {
                                        gradient: 'bg-gradient-to-r from-amber-50 to-amber-100/50',
                                        border: 'border-amber-200',
                                        hoverBorder: 'hover:border-amber-400',
                                        iconBg: 'bg-amber-100',
                                        iconText: 'text-amber-600'
                                    },
                                    activeContent.tracks.hiPo
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </LayoutGroup>
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
