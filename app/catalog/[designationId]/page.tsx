'use client';

import DesignationDetailView from '@/components/catalog/DesignationDetailView';
import { useCatalog } from '@/context/CatalogContext';
import { motion } from 'motion/react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

export default function DesignationPage() {
    const params = useParams();
    const router = useRouter();
    const { designationId } = params as { designationId: string };

    // Explicitly destructure from hook
    const catalogData = useCatalog();
    const designations = catalogData.designations;
    const trainings = catalogData.trainings;
    const assignments = catalogData.assignments;
    const loading = catalogData.loading;

    // Fetch details for designation and navigation (Context)
    const data = useMemo(() => {
        if (loading || !designations || !designations.length) return null;

        const designation = designations.find(d => d.id === designationId);
        if (!designation) return 'not-found';

        const currentIndex = designations.findIndex(d => d.id === designationId);
        const prevDesignation = currentIndex > 0 ? designations[currentIndex - 1] : null;
        const nextDesignation = currentIndex < designations.length - 1 ? designations[currentIndex + 1] : null;

        // Filter and Hydrate Assignments
        const relevantAssignments = assignments.filter(a => a.designationId === designationId);

        const getTrackTrainings = (trackType: 'normal' | 'hi-po') => {
            return relevantAssignments
                .filter(a => a.trackType === trackType)
                // Sort by order if available
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .map(a => trainings.find(t => t._id === a.trainingId || t._id === (a.trainingId as any).toString()))
                .filter(Boolean) as any[];
        };

        return {
            designation,
            normalTrack: getTrackTrainings('normal'),
            hiPoTrack: getTrackTrainings('hi-po'),
            navData: {
                prev: prevDesignation ? { id: prevDesignation.id, title: prevDesignation.title } : null,
                next: nextDesignation ? { id: nextDesignation.id, title: nextDesignation.title } : null
            }
        };
    }, [designationId, designations, trainings, assignments, loading]);

    // Handle Not Found
    useEffect(() => {
        if (!loading && data === 'not-found') {
            router.push('/404');
        }
    }, [loading, data, router]);

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

    if (data === 'not-found' || !data) return null;

    return (
        <DesignationDetailView
            designation={data.designation}
            normalTrack={data.normalTrack}
            hiPoTrack={data.hiPoTrack}
            navigation={data.navData}
        />
    );
}
