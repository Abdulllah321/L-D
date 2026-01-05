import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Plus,
    Edit,
    Trash2,
    Search,
} from "lucide-react";
import { LearningPath } from "../types";
import { useState, useMemo } from "react";

interface LearningPathManagementModalProps {
    showLearningPathModal: boolean;
    setShowLearningPathModal: (show: boolean) => void;
    setShowLPCreationModal: (show: boolean) => void;
    fetchAllTrainings: () => void;
    fetchLearningDecks: () => void;
    learningPaths: LearningPath[];
    onEdit: (learningPath: LearningPath) => void;
    onDelete: (id: string) => void;
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
    onEdit,
    onDelete,
}: LearningPathManagementModalProps) {
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    // Filter learning paths based on search query
    const filteredLearningPaths = useMemo(() => {
        if (!searchQuery.trim()) {
            return learningPaths;
        }

        const query = searchQuery.toLowerCase();
        return learningPaths.filter(lp => {
            const titleMatch = lp.title?.toLowerCase().includes(query);
            const descriptionMatch = lp.description?.toLowerCase().includes(query);
            // Also search in training titles
            const trainingMatch = lp.trainings.some(t => {
                const trainingTitle = getTrainingTitle(t).toLowerCase();
                return trainingTitle.includes(query);
            });
            return titleMatch || descriptionMatch || trainingMatch;
        });
    }, [learningPaths, searchQuery]);

    const handleDeleteClick = (id: string) => {
        setShowDeleteConfirm(id);
    };

    const handleConfirmDelete = async (id: string) => {
        setDeletingId(id);
        try {
            await onDelete(id);
            setShowDeleteConfirm(null);
        } catch (error) {
            console.error("Error deleting learning path:", error);
        } finally {
            setDeletingId(null);
        }
    };

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

                            {/* Search Bar */}
                            <div className="px-6 py-4 border-b border-gray-200">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search learning paths by title, description, or training..."
                                        className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white"
                                        autoFocus
                                    />
                                    {searchQuery && (
                                        <button
                                            onClick={() => setSearchQuery("")}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                                        >
                                            <X className="w-4 h-4 text-gray-400" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="p-6 overflow-y-auto">
                                {learningPaths.length === 0 ? (
                                    <div className="text-center py-12 text-gray-500">
                                        No Learning Paths created yet.
                                    </div>
                                ) : filteredLearningPaths.length === 0 ? (
                                    <div className="text-center py-12 text-gray-500">
                                        No learning paths found matching "{searchQuery}".
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-4">
                                        {filteredLearningPaths.map(lp => (
                                            <div key={lp._id} className="border border-gray-200 rounded-xl p-4 hover:border-teal-500 transition-colors group">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <h3 className="font-bold text-lg text-gray-900">{lp.title}</h3>
                                                        <p className="text-gray-500 text-sm mt-1">{lp.description}</p>
                                                    </div>
                                                    <div className="flex items-center gap-2 ml-4">
                                                        <span className="bg-teal-50 text-teal-700 px-2 py-1 rounded text-xs font-medium">
                                                            {lp.trainings.length} trainings
                                                        </span>
                                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button
                                                                onClick={() => {
                                                                    fetchAllTrainings();
                                                                    fetchLearningDecks();
                                                                    onEdit(lp);
                                                                }}
                                                                className="p-1.5 hover:bg-blue-50 rounded-lg transition-colors"
                                                                title="Edit Learning Path"
                                                            >
                                                                <Edit className="w-4 h-4 text-blue-600" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteClick(lp._id)}
                                                                disabled={deletingId === lp._id}
                                                                className="p-1.5 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                                                title="Delete Learning Path"
                                                            >
                                                                <Trash2 className="w-4 h-4 text-red-600" />
                                                            </button>
                                                        </div>
                                                    </div>
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

                    {/* Delete Confirmation Modal */}
                    <AnimatePresence>
                        {showDeleteConfirm && (
                            <>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
                                    onClick={() => setShowDeleteConfirm(null)}
                                />
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="fixed inset-0 z-[60] flex items-center justify-center p-4"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Learning Path</h3>
                                        <p className="text-gray-600 mb-6">
                                            Are you sure you want to delete this learning path? This action cannot be undone.
                                        </p>
                                        <div className="flex gap-3 justify-end">
                                            <button
                                                onClick={() => setShowDeleteConfirm(null)}
                                                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={() => handleConfirmDelete(showDeleteConfirm)}
                                                disabled={deletingId === showDeleteConfirm}
                                                className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {deletingId === showDeleteConfirm ? 'Deleting...' : 'Delete'}
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </>
            )}
        </AnimatePresence>
    );
}
