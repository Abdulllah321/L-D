import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Search,
} from "lucide-react";
import { AllTraining, Designation, LearningPath, TrackType } from "../types";

interface SearchTrainingModalProps {
    showSearchModal: boolean;
    setShowSearchModal: (show: boolean) => void;
    selectedDesignation: Designation | null;
    selectedTrack: TrackType;
    assignMode: 'training' | 'learning-path';
    setAssignMode: (mode: 'training' | 'learning-path') => void;
    searchTrainingQuery: string;
    setSearchTrainingQuery: (query: string) => void;
    filteredAllTrainings: AllTraining[];
    learningPaths: LearningPath[];
    handleAssignTraining: (items: (AllTraining | LearningPath)[], type: 'training' | 'learning-path') => void;
}

export function SearchTrainingModal({
    showSearchModal,
    setShowSearchModal,
    selectedDesignation,
    selectedTrack,
    assignMode,
    setAssignMode,
    searchTrainingQuery,
    setSearchTrainingQuery,
    filteredAllTrainings,
    learningPaths,
    handleAssignTraining,
}: SearchTrainingModalProps) {
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    // Clear selection when mode or visibility changes
    useEffect(() => {
        setSelectedIds(new Set());
    }, [assignMode, showSearchModal]);

    // Force learning-path mode ONLY for annual-ecourse track
    // Force training mode for all other tracks
    useEffect(() => {
        if (selectedTrack === 'annual-ecourse' && assignMode === 'training') {
            setAssignMode('learning-path');
        } else if (selectedTrack !== 'annual-ecourse' && assignMode === 'learning-path') {
            setAssignMode('training');
        }
    }, [selectedTrack, assignMode, setAssignMode]);

    const toggleSelection = (id: string) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedIds(newSelected);
    };

    const handleBulkAssign = () => {
        const itemsToAssign: (AllTraining | LearningPath)[] = [];
        if (assignMode === 'training') {
            filteredAllTrainings.forEach(t => {
                if (t._id && selectedIds.has(t._id)) itemsToAssign.push(t);
            });
        } else {
            learningPaths.forEach(lp => {
                if (selectedIds.has(lp._id)) itemsToAssign.push(lp);
            });
        }
        handleAssignTraining(itemsToAssign, assignMode);
        setSelectedIds(new Set());
    };

    return (
        <AnimatePresence>
            {showSearchModal && selectedDesignation && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                        onClick={() => {
                            setShowSearchModal(false);
                            setSearchTrainingQuery("");
                        }}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
                            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Search & Assign Training</h3>
                                    <p className="text-sm text-gray-500 mt-0.5">
                                        {selectedTrack === 'normal' ? 'Normal' : 'Hi-Po'} Track • Training will be added at the end
                                    </p>
                                </div>
                                <button
                                    onClick={() => {
                                        setShowSearchModal(false);
                                        setSearchTrainingQuery("");
                                    }}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>

                            <div className="p-6 flex-1 overflow-y-auto">
                                {/* Mode Toggle */}
                                <div className="flex gap-4 mb-4">
                                    <button
                                        onClick={() => setAssignMode('training')}
                                        disabled={selectedTrack === 'annual-ecourse'}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedTrack === 'annual-ecourse'
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                                            : assignMode === 'training'
                                                ? 'bg-gray-900 text-white'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                        title={selectedTrack === 'annual-ecourse' ? 'Annual E-Course track only supports Learning Paths' : ''}
                                    >
                                        Single Training
                                    </button>
                                    <button
                                        onClick={() => setAssignMode('learning-path')}
                                        disabled={selectedTrack !== 'annual-ecourse'}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedTrack !== 'annual-ecourse'
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                                                : assignMode === 'learning-path'
                                                    ? 'bg-gray-900 text-white'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                        title={selectedTrack !== 'annual-ecourse' ? 'Learning Paths are only available for Annual E-Course track' : ''}
                                    >
                                        Learning Path
                                    </button>
                                </div>

                                <div className="mb-4">
                                    <div className="relative">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            value={searchTrainingQuery}
                                            onChange={(e) => setSearchTrainingQuery(e.target.value)}
                                            placeholder={assignMode === 'training' ? "Search trainings..." : "Search learning paths..."}
                                            className="w-full pl-12 pr-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white"
                                            autoFocus
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                                    {assignMode === 'training' ? (
                                        filteredAllTrainings.length === 0 ? (
                                            <div className="text-center py-8 text-gray-500">
                                                {searchTrainingQuery ? "No trainings found" : "No available trainings"}
                                            </div>
                                        ) : (
                                            filteredAllTrainings.map((training) => (
                                                <div
                                                    key={training._id}
                                                    onClick={() => toggleSelection(training._id!)}
                                                    className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all ${selectedIds.has(training._id!)
                                                        ? 'bg-gray-900 border-gray-900 text-white'
                                                        : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                                                        }`}
                                                >
                                                    <div className="flex-1">
                                                        <h4 className={`text-sm font-semibold ${selectedIds.has(training._id!) ? 'text-white' : 'text-gray-900'}`}>
                                                            {training.programTitle}
                                                        </h4>
                                                    </div>
                                                    <div className={`w-5 h-5 rounded border flex items-center justify-center ${selectedIds.has(training._id!) ? 'bg-white border-white' : 'border-gray-400'
                                                        }`}>
                                                        {selectedIds.has(training._id!) && <div className="w-2.5 h-2.5 bg-gray-900 rounded-sm" />}
                                                    </div>
                                                </div>
                                            ))
                                        )
                                    ) : (
                                        // Learning Path List
                                        learningPaths.filter(lp => lp.title.toLowerCase().includes(searchTrainingQuery.toLowerCase())).length === 0 ? (
                                            <div className="text-center py-8 text-gray-500">
                                                {searchTrainingQuery ? "No learning paths found" : "No available learning paths"}
                                            </div>
                                        ) : (
                                            learningPaths.filter(lp => lp.title.toLowerCase().includes(searchTrainingQuery.toLowerCase())).map((lp) => (
                                                <div
                                                    key={lp._id}
                                                    onClick={() => toggleSelection(lp._id)}
                                                    className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all ${selectedIds.has(lp._id)
                                                        ? 'bg-gray-900 border-gray-900 text-white'
                                                        : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                                                        }`}
                                                >
                                                    <div className="flex-1">
                                                        <h4 className={`text-sm font-semibold ${selectedIds.has(lp._id) ? 'text-white' : 'text-gray-900'}`}>
                                                            {lp.title}
                                                        </h4>
                                                        <p className={`text-xs ${selectedIds.has(lp._id) ? 'text-gray-300' : 'text-gray-500'}`}>
                                                            {lp.trainings.length} trainings
                                                        </p>
                                                    </div>
                                                    <div className={`w-5 h-5 rounded border flex items-center justify-center ${selectedIds.has(lp._id) ? 'bg-white border-white' : 'border-gray-400'
                                                        }`}>
                                                        {selectedIds.has(lp._id) && <div className="w-2.5 h-2.5 bg-gray-900 rounded-sm" />}
                                                    </div>
                                                </div>
                                            ))
                                        )
                                    )}
                                </div>
                            </div>

                            {/* Sticky Footer for Bulk Action */}
                            <div className="p-4 border-t border-gray-200 bg-white">
                                <button
                                    onClick={handleBulkAssign}
                                    disabled={selectedIds.size === 0}
                                    className={`w-full py-3 rounded-xl text-sm font-bold transition-all ${selectedIds.size > 0
                                        ? 'bg-gray-900 text-white hover:bg-gray-800 shadow-lg'
                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        }`}
                                >
                                    {selectedIds.size > 0
                                        ? `Add ${selectedIds.size} Selected Item${selectedIds.size > 1 ? 's' : ''}`
                                        : 'Select items to add'
                                    }
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
