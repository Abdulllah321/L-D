import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Plus,
} from "lucide-react";
import { LearningPath } from "../types";

interface LearningPathManagementModalProps {
    showLearningPathModal: boolean;
    setShowLearningPathModal: (show: boolean) => void;
    setShowLPCreationModal: (show: boolean) => void;
    fetchAllTrainings: () => void;
    fetchLearningDecks: () => void;
    learningPaths: LearningPath[];
}



function getTrainingTitle(t: LearningPath['trainings'][0]) {
    if (!t) return 'Untitled';
    if (typeof t !== 'object') {
        // If it's a string ID or something else
        return `Untitled (ID: ${String(t).substring(0, 8)}...)`;
    }

    if ('programTitle' in t) {
        return t.programTitle;
    }
    if (typeof t.trainingId === 'object' && t.trainingId && 'programTitle' in t.trainingId) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (t.trainingId as any).programTitle;
    }
    return t.title || 'Untitled';
}

export function LearningPathManagementModal({
    showLearningPathModal,
    setShowLearningPathModal,
    setShowLPCreationModal,
    fetchAllTrainings,
    fetchLearningDecks,
    learningPaths,
}: LearningPathManagementModalProps) {
    return (
        <AnimatePresence>
            {showLearningPathModal && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                        onClick={() => setShowLearningPathModal(false)}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col">
                            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Learning Paths</h2>
                                    <p className="text-sm text-gray-500">Create and manage bundles of trainings</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => {
                                            setShowLPCreationModal(true);
                                            fetchAllTrainings();
                                            fetchLearningDecks();
                                        }}
                                        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gray-900 rounded-xl hover:bg-gray-800 transition-all"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Create New Path
                                    </button>
                                    <button
                                        onClick={() => setShowLearningPathModal(false)}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <X className="w-5 h-5 text-gray-500" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 overflow-y-auto">
                                {learningPaths.length === 0 ? (
                                    <div className="text-center py-12 text-gray-500">
                                        No Learning Paths created yet.
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-4">
                                        {learningPaths.map(lp => (
                                            <div key={lp._id} className="border border-gray-200 rounded-xl p-4 hover:border-teal-500 transition-colors">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="font-bold text-lg text-gray-900">{lp.title}</h3>
                                                        <p className="text-gray-500 text-sm mt-1">{lp.description}</p>
                                                    </div>
                                                    <span className="bg-teal-50 text-teal-700 px-2 py-1 rounded text-xs font-medium">
                                                        {lp.trainings.length} trainings
                                                    </span>
                                                </div>
                                                <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                                                    {lp.trainings.slice(0, 5).map((t, i) => (
                                                        <div key={i} className="bg-gray-50 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 whitespace-nowrap border border-gray-200">
                                                            {getTrainingTitle(t)}
                                                        </div>
                                                    ))}
                                                    {lp.trainings.length > 5 && (
                                                        <div className="bg-gray-50 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-500 border border-gray-200">
                                                            +{lp.trainings.length - 5} more
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
