'use client';

import DesignationDetailView, { SubDesignationContent, CatalogItem, TrackContent } from '@/components/catalog/DesignationDetailView';
import { useCatalog } from '@/context/CatalogContext';
import { motion } from 'motion/react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { ITraining } from '@/models/Training';
import { ILearningPath } from '@/models/LearningPath';

export default function DesignationPage() {
    const params = useParams();
    const router = useRouter();
    const { designationId } = params as { designationId: string };

    // Explicitly destructure from hook
    const catalogData = useCatalog();
    const designations = catalogData.designations;
    const trainings = catalogData.trainings;
    const assignments = catalogData.assignments;
    const learningPaths = catalogData.learningPaths;
    const loading = catalogData.loading;

    // Fetch details for designation and navigation (Context)
    const data = useMemo(() => {
        if (loading || !designations || !designations.length) return null;

        const designation = designations.find(d => d.id === designationId);
        if (!designation) return 'not-found';

        const currentIndex = designations.findIndex(d => d.id === designationId);
        const prevDesignation = currentIndex > 0 ? designations[currentIndex - 1] : null;
        const nextDesignation = currentIndex < designations.length - 1 ? designations[currentIndex + 1] : null;

        // Helper to process assignments into TrackContent
        const getTrackContent = (trackType: 'normal' | 'hi-po', annualType: 'annual-regular' | 'annual-ecourse' | null, subDesignationId?: string): TrackContent => {
            const relevantAssignments = assignments.filter(a => {
                const matchesDesignation = a.designationId === designationId;
                const matchesTrackType = a.trackType === trackType;
                const matchesAnnualType = (annualType === null && (!a.annualType || a.annualType === null)) || 
                                         (annualType !== null && a.annualType === annualType);
                const matchesSubDesignation = subDesignationId 
                    ? a.subDesignationId === subDesignationId 
                    : (!a.subDesignationId || a.subDesignationId === null);
                
                return matchesDesignation && matchesTrackType && matchesAnnualType && matchesSubDesignation;
            });

            // Sort by order
            relevantAssignments.sort((a, b) => (a.order || 0) - (b.order || 0));

            const items: CatalogItem[] = relevantAssignments.map(assignment => {
                // Handle custom training names
                if (assignment.customTrainingName) {
                    return {
                        type: 'training',
                        data: {
                            _id: assignment._id.toString(),
                            programTitle: assignment.customTrainingName,
                            programObjective: '',
                            outcomesBenefits: '',
                            frequency: '',
                            code: 'CUSTOM',
                            duration: '-',
                            trainingProvider: 'Internal',
                            costPerPax: 0
                        } as unknown as ITraining
                    };
                }

                if (assignment.trainingId) {
                    const training = trainings.find(t => t._id === assignment.trainingId ||
                        t._id === (assignment.trainingId as any).toString());
                    if (!training) return null;
                    return { type: 'training', data: training };
                }

                if (assignment.learningPathId) {
                    const lp = learningPaths.find(l => l._id === assignment.learningPathId ||
                        l._id === (assignment.learningPathId as any).toString());
                    if (!lp) return null;

                    // Resolve trainings within LP
                    // Assuming lp.trainings contains ObjectIds
                    const lpTrainings = (lp.trainings || []).map((lpItem: any) => {
                        // Case 1: Custom Placeholder Item or Copy-Text
                        if (lpItem.isPlaceholder || !lpItem.trainingId) {
                            return {
                                _id: lpItem._id || `custom-${Math.random()}`,
                                programTitle: lpItem.title || "Custom Item",
                                outcomesBenefits: lpItem.courseOverview,
                                programObjective: lpItem.courseOverview, // Fallback
                                frequency: lpItem.frequency,
                                // Default/Empty values for required fields to satisfy ITraining
                                code: "CUSTOM",
                                duration: "-",
                                trainingProvider: "Internal",
                                costPerPax: 0
                            } as unknown as ITraining;
                        }

                        // Case 2: Linked Training
                        const tId = lpItem.trainingId;
                        const training = trainings.find(t => t._id === tId || t._id === tId.toString());

                        if (!training) return null;

                        // Case 3: Linked Training with Overrides
                        return {
                            ...training,
                            outcomesBenefits: lpItem.courseOverview || training.outcomesBenefits,
                            programObjective: lpItem.courseOverview || training.programObjective,
                            frequency: lpItem.frequency || training.frequency
                        };
                    }).filter(Boolean) as ITraining[];

                    return { type: 'learning-path', data: lp, trainings: lpTrainings };
                }
                return null;
            }).filter(Boolean) as CatalogItem[];

            return { items };
        };

        const subDesignationsContent: SubDesignationContent[] = [];

        // 1. Main Content (No Sub-Designation)
        // Check if there are assignments for main category
        // Or if there are no sub-designations, this is the default view
        const hasMainAssignments = assignments.some(a => a.designationId === designationId && !a.subDesignationId);

        // Always add Main/General tab if there are no sub-designations OR if there are assignments for it
        if (!designation.subDesignations?.length || hasMainAssignments) {
            subDesignationsContent.push({
                id: 'main',
                title: designation.subDesignations?.length ? 'General' : 'Main',
                tracks: {
                    normal: {
                        regular: getTrackContent('normal', null),
                        annualRegular: getTrackContent('normal', 'annual-regular'),
                        annualEcourse: getTrackContent('normal', 'annual-ecourse')
                    },
                    hiPo: {
                        regular: getTrackContent('hi-po', null),
                        annualRegular: getTrackContent('hi-po', 'annual-regular'),
                        annualEcourse: getTrackContent('hi-po', 'annual-ecourse')
                    }
                }
            });
        }

        // 2. Sub-Designations Content
        if (designation.subDesignations) {
            designation.subDesignations.forEach(sub => {
                subDesignationsContent.push({
                    id: sub.id,
                    title: sub.title,
                    tracks: {
                        normal: {
                            regular: getTrackContent('normal', null, sub.id),
                            annualRegular: getTrackContent('normal', 'annual-regular', sub.id),
                            annualEcourse: getTrackContent('normal', 'annual-ecourse', sub.id)
                        },
                        hiPo: {
                            regular: getTrackContent('hi-po', null, sub.id),
                            annualRegular: getTrackContent('hi-po', 'annual-regular', sub.id),
                            annualEcourse: getTrackContent('hi-po', 'annual-ecourse', sub.id)
                        }
                    }
                });
            });
        }

        return {
            designation,
            subDesignationsContent,
            navData: {
                prev: prevDesignation ? { id: prevDesignation.id, title: prevDesignation.title } : null,
                next: nextDesignation ? { id: nextDesignation.id, title: nextDesignation.title } : null
            }
        };
    }, [designationId, designations, trainings, assignments, learningPaths, loading]);

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
            subDesignationsContent={data.subDesignationsContent}
            navigation={data.navData}
        />
    );
}
