import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Layers,
    Star,
    Book,
    Sparkles,
    Plus,
    GraduationCap,
    FileText
} from "lucide-react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Designation, TrackType, AnnualType, Training } from "../types";
import { SortableTrainingItem } from "./SortableTrainingItem";

interface TrainingAssignmentModalProps {
    showTrainingAssignment: boolean;
    setShowTrainingAssignment: (show: boolean) => void;
    selectedDesignation: Designation | null;
    setSelectedDesignation: (d: Designation | null) => void;
    selectedTrack: TrackType;
    setSelectedTrack: (track: TrackType) => void;
    selectedAnnualType: AnnualType;
    setSelectedAnnualType: (type: AnnualType) => void;
    selectedSubDesignation: string | null;
    setSelectedSubDesignation: (id: string | null) => void;
    trainings: Training[];
    handleTrainingDragEnd: (event: DragEndEvent) => void;
    handleRemoveTraining: (id: string) => void;
    setShowSearchModal: (show: boolean) => void;
    handleAddCustomTraining: (customTrainingName: string) => void;
}

export function TrainingAssignmentModal({
    showTrainingAssignment,
    setShowTrainingAssignment,
    selectedDesignation,
    setSelectedDesignation,
    selectedTrack,
    setSelectedTrack,
    selectedAnnualType,
    setSelectedAnnualType,
    selectedSubDesignation,
    setSelectedSubDesignation,
    trainings,
    handleTrainingDragEnd,
    handleRemoveTraining,
    setShowSearchModal,
    handleAddCustomTraining,
}: TrainingAssignmentModalProps) {
    const [customTrainingName, setCustomTrainingName] = useState("");
    const [isAddingCustom, setIsAddingCustom] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    return (
        <AnimatePresence>
            {showTrainingAssignment && selectedDesignation && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                        onClick={() => {
                            setShowTrainingAssignment(false);
                            setSelectedDesignation(null);
                            setSelectedTrack('normal');
                            setSelectedAnnualType(null);
                        }}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
                            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">
                                        Learning Tracks
                                    </h2>
                                    <p className="text-sm text-gray-500 mt-0.5">
                                        {selectedDesignation.title}
                                    </p>
                                </div>
                                <button
                                    onClick={() => {
                                        setShowTrainingAssignment(false);
                                        setSelectedDesignation(null);
                                        setSelectedTrack('normal');
                                    }}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>

                            <div className="p-6">
                                {selectedDesignation.subDesignations && selectedDesignation.subDesignations.length > 0 && (
                                    <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                                        <button
                                            onClick={() => setSelectedSubDesignation(null)}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${!selectedSubDesignation
                                                ? 'bg-gray-900 text-white'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
                                        >
                                            Main Track
                                        </button>
                                        {selectedDesignation.subDesignations.map(sub => (
                                            <button
                                                key={sub.id}
                                                onClick={() => setSelectedSubDesignation(sub.id)}
                                                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${selectedSubDesignation === sub.id
                                                    ? 'bg-gray-900 text-white'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                    }`}
                                            >
                                                {sub.title}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Track Selection Tabs (Main Track Type) */}
                                <div className="mb-4">
                                    <div className="flex gap-2 border-b border-gray-200 overflow-x-auto">
                                        {[
                                            { id: 'normal', label: 'Normal Track', color: 'teal', icon: Layers },
                                            { id: 'hi-po', label: 'Hi-Po Track', color: 'purple', icon: Star },
                                        ].map((track) => (
                                            <button
                                                key={track.id}
                                                onClick={() => {
                                                    setSelectedTrack(track.id as TrackType);
                                                    setSelectedAnnualType(null); // Reset annual type when switching track
                                                }}
                                                className={`px-6 py-3 text-sm font-semibold transition-all relative whitespace-nowrap ${selectedTrack === track.id
                                                    ? `text-${track.color}-700`
                                                    : 'text-gray-500 hover:text-gray-700'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <track.icon className="w-4 h-4" />
                                                    {track.label}
                                                </div>
                                                {selectedTrack === track.id && (
                                                    <motion.div
                                                        layoutId="trackIndicator"
                                                        className={`absolute bottom-0 left-0 right-0 h-0.5 bg-${track.color}-600`}
                                                    />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                    
                                    {/* Annual Type Selection Tabs (Sub-tabs under selected track) */}
                                    <div className="flex gap-2 mt-4 overflow-x-auto">
                                        {[
                                            { id: null, label: 'Regular', color: 'gray' },
                                            { id: 'annual-regular', label: 'Annual Regular', color: 'blue', icon: Book },
                                            { id: 'annual-ecourse', label: 'Annual E-Course', color: 'indigo', icon: Sparkles },
                                        ].map((annual) => (
                                            <button
                                                key={annual.id || 'regular'}
                                                onClick={() => setSelectedAnnualType(annual.id as AnnualType)}
                                                className={`px-4 py-2 text-sm font-medium transition-all rounded-lg whitespace-nowrap ${selectedAnnualType === annual.id
                                                    ? `bg-${annual.color === 'gray' ? 'gray' : annual.color}-100 text-${annual.color === 'gray' ? 'gray' : annual.color}-700 border-2 border-${annual.color === 'gray' ? 'gray' : annual.color}-600`
                                                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-2 border-transparent'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    {annual.icon && <annual.icon className="w-3.5 h-3.5" />}
                                                    {annual.label}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Add Training Section */}
                                <div className="mb-6 space-y-3">
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => {
                                                setShowSearchModal(true);
                                            }}
                                            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gray-900 rounded-xl hover:bg-gray-800 transition-all shadow-sm hover:shadow-md active:scale-95"
                                        >
                                            <Plus className="w-4 h-4" />
                                            Add Training
                                        </button>
                                        <button
                                            onClick={() => setIsAddingCustom(!isAddingCustom)}
                                            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all border border-gray-200"
                                        >
                                            <FileText className="w-4 h-4" />
                                            Add Custom Training
                                        </button>
                                    </div>
                                    
                                    {/* Custom Training Name Input */}
                                    {isAddingCustom && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="bg-gray-50 border border-gray-200 rounded-xl p-4"
                                        >
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={customTrainingName}
                                                    onChange={(e) => setCustomTrainingName(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' && customTrainingName.trim()) {
                                                            handleAddCustomTraining(customTrainingName);
                                                            setCustomTrainingName("");
                                                            setIsAddingCustom(false);
                                                        }
                                                    }}
                                                    placeholder="Enter custom training name (e.g., BSO Readiness Program (E-Learning))"
                                                    className="flex-1 px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                                                    autoFocus
                                                />
                                                <button
                                                    onClick={() => {
                                                        if (customTrainingName.trim()) {
                                                            handleAddCustomTraining(customTrainingName);
                                                            setCustomTrainingName("");
                                                            setIsAddingCustom(false);
                                                        }
                                                    }}
                                                    disabled={!customTrainingName.trim()}
                                                    className="px-4 py-2.5 text-sm font-semibold text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
                                                >
                                                    Add
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setCustomTrainingName("");
                                                        setIsAddingCustom(false);
                                                    }}
                                                    className="px-4 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-2">
                                                Add a training that's not in our database (e.g., "BSO Readiness Program (E-Learning)" or "Faysal Way Forward (to be discussed)")
                                            </p>
                                        </motion.div>
                                    )}
                                </div>

                                {/* Trainings List */}
                                {trainings.length > 0 ? (
                                    <div className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
                                        <div className={`px-6 py-4 border-b border-gray-200 ${selectedTrack === 'normal'
                                            ? 'bg-linear-to-r from-teal-50 to-blue-50'
                                            : 'bg-linear-to-r from-purple-50 to-pink-50'
                                            }`}>
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedTrack === 'normal'
                                                    ? 'bg-linear-to-br from-teal-500 to-blue-600'
                                                    : 'bg-linear-to-br from-purple-500 to-pink-600'
                                                    }`}>
                                                    <Layers className="w-5 h-5 text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-gray-900">
                                                        {selectedTrack === 'normal' ? 'Normal' : 'Hi-Po'} Track {selectedAnnualType ? `• ${selectedAnnualType === 'annual-regular' ? 'Annual Regular' : 'Annual E-Course'}` : '• Regular'} {selectedSubDesignation ? `(${selectedDesignation.subDesignations?.find(s => s.id === selectedSubDesignation)?.title})` : ''}
                                                    </h3>
                                                    <p className="text-xs text-gray-500">
                                                        {trainings.length} training{trainings.length !== 1 ? "s" : ""} • Drag to reorder
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <DndContext
                                            sensors={sensors}
                                            collisionDetection={closestCenter}
                                            onDragEnd={handleTrainingDragEnd}
                                        >
                                            <SortableContext
                                                items={trainings.map(t => t.assignmentId || t._id || '')}
                                                strategy={verticalListSortingStrategy}
                                            >
                                                <div className="p-4 space-y-2">
                                                    {trainings.map((training, index) => (
                                                        <SortableTrainingItem
                                                            key={training.assignmentId || training._id || index}
                                                            training={{ ...training, order: index }}
                                                            onRemove={handleRemoveTraining}
                                                        />
                                                    ))}
                                                </div>
                                            </SortableContext>
                                        </DndContext>
                                    </div>
                                ) : (
                                    <div className="text-center py-12 bg-gray-50 border border-gray-200 rounded-xl">
                                        <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-500 text-lg mb-2">No trainings assigned yet</p>
                                        <p className="text-gray-400 text-sm mb-4">
                                            Click "Add Training" to assign trainings to this {selectedTrack === 'normal' ? 'Normal' : 'Hi-Po'} {selectedAnnualType ? `(${selectedAnnualType === 'annual-regular' ? 'Annual Regular' : 'Annual E-Course'})` : '(Regular)'} track
                                        </p>
                                        <button
                                            onClick={() => {
                                                setShowSearchModal(true);
                                            }}
                                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gray-900 rounded-xl hover:bg-gray-800 transition-all"
                                        >
                                            <Plus className="w-4 h-4" />
                                            Add First Training
                                        </button>
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
