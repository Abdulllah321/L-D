import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Check,
    Plus
} from "lucide-react";
import { AllTraining, SelectedTraining, LearningDeck } from "../types";
import { useState } from "react";

interface LearningPathCreationModalProps {
    showLPCreationModal: boolean;
    setShowLPCreationModal: (show: boolean) => void;
    newLPData: { title: string; description: string; frequency?: string; deckId?: string; categoryId?: string };
    setNewLPData: (data: { title: string; description: string; frequency?: string; deckId?: string; categoryId?: string }) => void;
    allTrainings: AllTraining[];
    lpSelectedTrainings: SelectedTraining[];
    setLpSelectedTrainings: React.Dispatch<React.SetStateAction<SelectedTraining[]>>;
    handleCreateLearningPath: () => void;
    learningDecks: LearningDeck[];
    editingLearningPathId?: string | null;
}

export function LearningPathCreationModal({
    showLPCreationModal,
    setShowLPCreationModal,
    newLPData,
    setNewLPData,
    allTrainings,
    lpSelectedTrainings,
    setLpSelectedTrainings,
    handleCreateLearningPath,
    learningDecks,
    editingLearningPathId,
}: LearningPathCreationModalProps) {

    const [customItemText, setCustomItemText] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredTrainings = allTrainings.filter(t =>
        t.programTitle.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleTraining = (training: AllTraining) => {
        const existingIndex = lpSelectedTrainings.findIndex(t => t.trainingId === training._id);

        if (existingIndex >= 0) {
            setLpSelectedTrainings(prev => prev.filter((_, idx) => idx !== existingIndex));
        } else {
            setLpSelectedTrainings(prev => [...prev, {
                id: training._id!,
                trainingId: training._id!,
                title: training.programTitle,
                courseOverview: '',
                frequency: ''
            }]);
        }
    };

    const addCustomItem = () => {
        if (!customItemText.trim()) return;

        const newItem: SelectedTraining = {
            id: `custom-${Date.now()}`,
            title: customItemText,
            isPlaceholder: true,
            courseOverview: '',
            frequency: ''
        };

        setLpSelectedTrainings(prev => [...prev, newItem]);
        setCustomItemText("");
    };

    const removeSelected = (id: string) => {
        setLpSelectedTrainings(prev => prev.filter(t => t.id !== id));
    };

    const updateTrainingDetails = (id: string, field: 'courseOverview' | 'frequency', value: string) => {
        setLpSelectedTrainings(prev => prev.map(t =>
            t.id === id ? { ...t, [field]: value } : t
        ));
    };

    // Get selected deck's categories
    const selectedDeck = learningDecks?.find(d => d._id === newLPData.deckId);
    const categories = selectedDeck?.categories || [];

    return (
        <AnimatePresence>
            {showLPCreationModal && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
                        onClick={() => setShowLPCreationModal(false)}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 z-[60] flex items-center justify-center p-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
                            {/* Header */}
                            <div className="sticky top-0 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 px-8 py-5 flex items-center justify-between rounded-t-2xl z-10">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        {editingLearningPathId ? 'Edit Learning Path' : 'Create Learning Path'}
                                    </h2>
                                    <p className="text-sm text-gray-500 mt-0.5">
                                        {editingLearningPathId ? 'Update your learning path details' : 'Build a curated collection of training modules'}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowLPCreationModal(false)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-8 space-y-6 overflow-y-auto bg-gray-50 flex-1">
                                {/* Path Information Card */}
                                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                                    <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4">Path Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                                        <div className="md:col-span-3">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Deck (Optional)</label>
                                            <select
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none transition-all"
                                                value={newLPData.deckId || ''}
                                                onChange={(e) => setNewLPData({ ...newLPData, deckId: e.target.value, categoryId: undefined })}
                                            >
                                                <option value="">Standalone Path</option>
                                                {learningDecks?.map(deck => (
                                                    <option key={deck._id} value={deck._id}>{deck.title}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {newLPData.deckId && (
                                            <div className="md:col-span-3">
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                                                <select
                                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none transition-all"
                                                    value={newLPData.categoryId || ''}
                                                    onChange={(e) => setNewLPData({ ...newLPData, categoryId: e.target.value })}
                                                >
                                                    <option value="">Select Category</option>
                                                    {categories.map(cat => (
                                                        <option key={cat.id} value={cat.id}>{cat.title}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}

                                        <div className={newLPData.deckId ? "md:col-span-3" : "md:col-span-4"}>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Path Title *</label>
                                            <input
                                                type="text"
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none transition-all"
                                                placeholder="e.g. SA Regulatory Deck"
                                                value={newLPData.title}
                                                onChange={(e) => setNewLPData({ ...newLPData, title: e.target.value })}
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Frequency</label>
                                            <input
                                                type="text"
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none transition-all"
                                                placeholder="e.g. Annual"
                                                value={newLPData.frequency || ''}
                                                onChange={(e) => setNewLPData({ ...newLPData, frequency: e.target.value })}
                                            />
                                        </div>

                                        <div className="md:col-span-12">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                                            <textarea
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none transition-all"
                                                placeholder="Brief description of this learning path"
                                                rows={2}
                                                value={newLPData.description}
                                                onChange={(e) => setNewLPData({ ...newLPData, description: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Training Selection */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[450px]">
                                    {/* Selection List */}
                                    <div className="lg:col-span-1 flex flex-col gap-4">
                                        <div className="border border-gray-200 rounded-xl flex flex-col overflow-hidden bg-white shadow-sm flex-1">
                                            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 font-medium text-sm text-gray-700 sticky top-0 z-10 space-y-2 max-h-[100px] overflow-auto">
                                                <div>Available Trainings</div>
                                                <input
                                                    type="text"
                                                    placeholder="Search..."
                                                    className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-md focus:ring-1 focus:ring-black focus:border-black"
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                />
                                            </div>
                                            <div className="overflow-y-auto p-2 space-y-1 flex-1">
                                                {filteredTrainings.length === 0 ? (
                                                    <div className="text-center py-8 text-gray-400 text-xs italic">No trainings found</div>
                                                ) : (
                                                    filteredTrainings.map(training => {
                                                        const isSelected = lpSelectedTrainings.some(t => t.trainingId === training._id);
                                                        return (
                                                            <div
                                                                key={training._id}
                                                                className={`flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors ${isSelected ? 'bg-teal-50 hover:bg-teal-100' : ''}`}
                                                                onClick={() => toggleTraining(training)}
                                                            >
                                                                <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${isSelected ? 'bg-teal-500 border-teal-500' : 'border-gray-300'}`}>
                                                                    {isSelected && <Check className="w-3 h-3 text-white" />}
                                                                </div>
                                                                <span className="text-sm text-gray-700 line-clamp-2">{training.programTitle}</span>
                                                            </div>
                                                        );
                                                    })
                                                )}
                                            </div>
                                        </div>

                                        <div className="border border-gray-200 rounded-xl p-3 bg-gray-50 flex flex-col gap-2 shadow-sm">
                                            <span className="text-xs font-semibold text-gray-500 uppercase">Add Custom Item</span>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={customItemText}
                                                    onChange={(e) => setCustomItemText(e.target.value)}
                                                    placeholder="e.g. Faysal Way Forward..."
                                                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                                                    onKeyDown={(e) => e.key === 'Enter' && addCustomItem()}
                                                />
                                                <button
                                                    onClick={addCustomItem}
                                                    disabled={!customItemText.trim()}
                                                    className="p-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
                                                >
                                                    <Plus className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Selected Details Form */}
                                    <div className="lg:col-span-2 border border-gray-200 rounded-xl flex flex-col overflow-hidden bg-white shadow-sm">
                                        <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 font-medium text-sm text-gray-700 flex justify-between items-center">
                                            <span>Selected Trainings & Items ({lpSelectedTrainings.length})</span>
                                            <span className="text-xs text-gray-500 font-normal">Drag to reorder (coming soon)</span>
                                        </div>
                                        <div className="overflow-y-auto p-4 space-y-4 flex-1 bg-gray-50/30">
                                            {lpSelectedTrainings.length === 0 ? (
                                                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                                    <p>Select trainings or add custom items to configure details</p>
                                                </div>
                                            ) : (
                                                lpSelectedTrainings.map(item => {
                                                    // Resolve title: either explicitly set (custom) or found in allTrainings
                                                    let displayTitle = item.title;
                                                    if (!displayTitle && item.trainingId) {
                                                        const found = allTrainings.find(t => t._id === item.trainingId);
                                                        if (found) displayTitle = found.programTitle;
                                                    }

                                                    return (
                                                        <div key={item.id} className={`border rounded-lg p-4 shadow-sm relative ${item.isPlaceholder ? 'bg-amber-50/50 border-amber-200' : 'bg-white border-gray-200'}`}>
                                                            {item.isPlaceholder && (
                                                                <span className="absolute top-2 right-12 px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wider rounded-full">Custom Item</span>
                                                            )}
                                                            <div className="flex items-center justify-between mb-3">
                                                                <h4 className="font-medium text-gray-900 pr-8">{displayTitle || "Unknown Item"}</h4>
                                                                <button onClick={() => removeSelected(item.id)} className="text-red-500 hover:text-red-700 text-xs font-medium absolute top-4 right-4 bg-white/50 px-2 py-1 rounded hover:bg-red-50 transition-colors">Remove</button>
                                                            </div>
                                                            <div className="space-y-4">
                                                                <div>
                                                                    <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Overview / Description</label>
                                                                    <textarea
                                                                        rows={3}
                                                                        className="w-full text-sm border-gray-300 rounded-md focus:ring-black focus:border-black bg-white"
                                                                        placeholder={item.isPlaceholder ? "Description for this item..." : "Override default overview..."}
                                                                        value={item.courseOverview || ''}
                                                                        onChange={(e) => updateTrainingDetails(item.id, 'courseOverview', e.target.value)}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Item Frequency</label>
                                                                    <input
                                                                        type="text"
                                                                        className="w-full text-sm border-gray-300 rounded-md focus:ring-black focus:border-black bg-white"
                                                                        placeholder="e.g. Annually"
                                                                        value={item.frequency || ''}
                                                                        onChange={(e) => updateTrainingDetails(item.id, 'frequency', e.target.value)}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="sticky bottom-0 bg-gradient-to-t from-gray-50 via-gray-50 to-transparent border-t border-gray-200 px-8 py-4 flex justify-end gap-3">
                                <button
                                    onClick={() => setShowLPCreationModal(false)}
                                    className="px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreateLearningPath}
                                    disabled={!newLPData.title || lpSelectedTrainings.length === 0}
                                    className="px-8 py-3 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-xl font-semibold hover:from-teal-700 hover:to-teal-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                                >
                                    {editingLearningPathId ? 'Update Learning Path' : 'Create Learning Path'}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
