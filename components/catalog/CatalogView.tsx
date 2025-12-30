'use client';

import { IDesignation } from '@/models/Designation';
import { ITraining } from '@/models/Training';
import { useState, useMemo } from 'react';
import DesignationRow from './DesignationRow';
import TrainingModal from './TrainingModal';
import { motion } from 'motion/react';

interface CatalogViewProps {
    designations: IDesignation[];
    allTrainings: ITraining[];
}

export default function CatalogView({ designations, allTrainings }: CatalogViewProps) {
    const [selectedTraining, setSelectedTraining] = useState<ITraining | null>(null);

    // Helper to normalize strings for comparison
    const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '');

    // Map trainings to designations based on targetAudience matching designation title
    const designationTrainingsMap = useMemo(() => {
        const map = new Map<string, ITraining[]>();

        designations.forEach(d => {
            const dTitle = normalize(d.title);

            const matchedTrainings = allTrainings.filter(t => {
                const tAudience = normalize(t.targetAudience);
                // Simple heuristic: if audience includes title words or is "All"
                // Also checks if Designation Title is included in Target Audience string
                return tAudience.includes(dTitle) || dTitle.includes(tAudience) || tAudience.includes('all');
            });

            // Remove duplicates if any logic causes them (filter handles unique checks per iteration but we might refine)
            map.set(d.id, matchedTrainings);
        });

        return map;
    }, [designations, allTrainings]);

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 pb-20">

            {/* Hero Section */}
            <div className="relative overflow-hidden bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
                <div className="absolute inset-0 bg-grid-zinc-200/50 dark:bg-grid-zinc-800/50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
                <div className="container mx-auto px-4 py-24 relative z-10">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-6"
                    >
                        Learning <span className="text-violet-600">Catalog</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl"
                    >
                        Explore our comprehensive training programs tailored for your professional growth.
                        Navigate through designations to find the perfect path for you.
                    </motion.p>
                </div>
            </div>

            {/* Main Content */}
            <div className="space-y-4">
                {designations.map((designation) => (
                    <DesignationRow
                        key={designation.id}
                        designation={designation}
                        trainings={designationTrainingsMap.get(designation.id) || []}
                        onSelectTraining={setSelectedTraining}
                    />
                ))}
            </div>

            <TrainingModal
                isOpen={!!selectedTraining}
                training={selectedTraining}
                onClose={() => setSelectedTraining(null)}
            />
        </div>
    );
}
