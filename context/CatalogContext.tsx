'use client';

import { IDesignation } from '@/models/Designation';
import { ITraining } from '@/models/Training';
import { ITrainingAssignment } from '@/models/TrainingAssignment';
import { ILearningPath } from '@/models/LearningPath';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface CatalogData {
    designations: IDesignation[];
    trainings: ITraining[];
    assignments: ITrainingAssignment[];
    learningPaths: ILearningPath[];
    loading: boolean;
    error: string | null;
}

const CatalogContext = createContext<CatalogData | undefined>(undefined);

export function CatalogProvider({ children }: { children: ReactNode }) {
    const [data, setData] = useState<{ designations: IDesignation[]; trainings: ITraining[]; assignments: ITrainingAssignment[]; learningPaths: ILearningPath[] }>({
        designations: [],
        trainings: [],
        assignments: [],
        learningPaths: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/catalog');
                if (!response.ok) {
                    throw new Error('Failed to fetch catalog data');
                }
                const result = await response.json();
                setData({
                    designations: result.designations,
                    trainings: result.trainings,
                    assignments: result.assignments,
                    learningPaths: result.learningPaths || []
                });
            } catch (err) {
                console.error(err);
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <CatalogContext.Provider value={{ ...data, loading, error }}>
            {children}
        </CatalogContext.Provider>
    );
}

export function useCatalog() {
    const context = useContext(CatalogContext);
    if (context === undefined) {
        throw new Error('useCatalog must be used within a CatalogProvider');
    }
    return context;
}
