'use client';

import CatalogView from '@/components/catalog/CatalogView';
import { useCatalog } from '@/context/CatalogContext';
import { motion } from 'motion/react';

export default function CatalogPage() {
    const { designations, trainings, loading } = useCatalog();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full"
                />
            </div>
        );
    }

    return (
        <CatalogView
            designations={designations}
            allTrainings={trainings}
        />
    );
}
