import { IDesignation } from '@/models/Designation';
import { ITraining } from '@/models/Training';
import { useState, useMemo } from 'react';
import TrainingModal from './TrainingModal';
import { motion, AnimatePresence } from 'motion/react';
import Timeline from './Timeline';
import Footer from '@/app/components/landing/Footer';
import Header from '@/app/components/Header';
import { IconSearch, IconSparkles } from '@tabler/icons-react';
import Logo from '../ui/sparkles-logo';

interface CatalogViewProps {
    designations: IDesignation[];
    allTrainings: ITraining[];
}

export default function CatalogView({ designations, allTrainings }: CatalogViewProps) {
    const [selectedTraining, setSelectedTraining] = useState<ITraining | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Filter Helper
    const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '');

    // Filter Designations based on search
    const filteredDesignations = useMemo(() => {
        if (!searchQuery.trim()) return designations;
        const query = normalize(searchQuery);
        return designations.filter(d =>
            normalize(d.title).includes(query) ||
            normalize(d.summary || '').includes(query)
        );
    }, [designations, searchQuery]);

    const designationTrainingsMap = useMemo(() => {
        const map = new Map<string, ITraining[]>();
        designations.forEach(d => {
            const dTitle = normalize(d.title);
            const matchedTrainings = allTrainings.filter(t => {
                const tAudience = normalize(t.targetAudience);
                return tAudience.includes(dTitle) || dTitle.includes(tAudience) || tAudience.includes('all');
            });
            map.set(d.id, matchedTrainings);
        });
        return map;
    }, [designations, allTrainings]);

    return (
        <div className="min-h-screen bg-zinc-50 selection:bg-teal-500/30 text-zinc-900 font-sans">

            <Header />

            {/* Background Patterns - Light Mode */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-teal-50/50 via-white to-transparent" />
                <div className="absolute -top-[20%] right-0 w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-[120px]" />
                <div className="absolute top-[40%] left-[-10%] w-[500px] h-[500px] bg-violet-100/40 rounded-full blur-[100px]" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />
            </div>

            <main className="relative z-10">

                {/* Hero Section */}
                <section className="relative pt-32 pb-8 overflow-hidden text-center">
                    <div className="container mx-auto px-6">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                            className="inline-flex items-center gap-2 p-2 px-4 rounded-full bg-white border border-zinc-200 shadow-sm mb-6"
                        >
                            <IconSparkles size={16} className="text-amber-500" />
                            <span className="text-sm font-medium bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                                Enhanced Learning Pathways
                            </span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1, duration: 0.8 }}
                            className="text-5xl md:text-7xl font-bold tracking-tighter text-zinc-900 mb-6"
                        >
                            Explore Your <br className="hidden md:block" />
                            <span className="bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-500 bg-clip-text text-transparent">
                                Growth Journey
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="max-w-2xl mx-auto text-lg text-zinc-600 leading-relaxed mb-10"
                        >
                            Navigate through our role-based learning catalog. Connect with the skills required to excel at every stage of your career.
                        </motion.p>

                        {/* Search Input */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                            className="max-w-md mx-auto relative group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-blue-500 rounded-2xl opacity-20 group-hover:opacity-30 blur transition-opacity" />
                            <div className="relative bg-white rounded-2xl shadow-xl flex items-center p-2 border border-zinc-100">
                                <IconSearch className="text-zinc-400 ml-3" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search for a designation..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full p-3 bg-transparent border-none outline-none text-zinc-800 placeholder:text-zinc-400 font-medium"
                                />
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Timeline Content */}
                <section className="py-12 min-h-[500px]">
                    <AnimatePresence mode='wait'>
                        {filteredDesignations.length > 0 ? (
                            <Timeline
                                key="timeline"
                                designations={filteredDesignations}
                                trainingsMap={designationTrainingsMap}
                            />
                        ) : (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-center py-20"
                            >
                                <p className="text-zinc-500 text-lg">No designations found matching "{searchQuery}"</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </section>
            </main>
<Logo/>
            <Footer />

            <TrainingModal
                isOpen={!!selectedTraining}
                training={selectedTraining}
                onClose={() => setSelectedTraining(null)}
            />
        </div>
    );
}
