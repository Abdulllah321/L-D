"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Head from "next/head";
import {
  Plus,
  Search,
  X,
  Check,
  Book,
  Menu,
  X as XIcon,
  LogOut,
  LayoutDashboard,
  GraduationCap,
  ChevronRight,
  Layers,
  GripVertical,
  Sparkles,
  Star,
  Filter
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import {
  CSS,
} from '@dnd-kit/utilities';

interface Designation {
  _id?: string;
  id: string;
  title: string;
  order?: number;
}

interface Training {
  _id?: string;
  assignmentId?: string;
  programTitle: string;
  order?: number;
  designationId?: string;
  trackType?: 'normal' | 'hi-po';
}

// Update Interface
interface AllTraining {
  _id: string;
  programTitle: string;
  order?: number;
  designationId?: string;
  trackType?: 'normal' | 'hi-po';
  trainingPartner?: string;
  competencies?: {
    functional?: string[];
    core?: string[];
    leadership?: string[];
  };
}

// ... (Inside Component)
const [hideAssigned, setHideAssigned] = useState(true);
const [filterPartner, setFilterPartner] = useState("all");

const uniquePartners = [...new Set(allTrainings.map(t => t.trainingPartner).filter(Boolean))].sort();

useEffect(() => {
  checkAuthAndFetch();
}, []);

// Removed useEffect for fetching all trainings on showTrainingAssignment

const checkAuthAndFetch = async () => {
  try {
    const response = await fetch("/api/auth/me", {
      credentials: "include",
    });
    if (response.ok) {
      await Promise.all([fetchDesignations(), fetchAllTrainings()]);
    } else {
      router.push("/admin");
    }
  } catch (error) {
    console.error("Auth check failed:", error);
    router.push("/admin");
  } finally {
    setIsLoading(false);
  }
};

// ... (existing fetch functions)

const filteredAllTrainings = allTrainings.filter((training) => {
  const query = searchTrainingQuery.toLowerCase();
  const matchesSearch = training.programTitle.toLowerCase().includes(query) ||
    (training.trainingPartner && training.trainingPartner.toLowerCase().includes(query));

  // Hide Assigned Filter
  if (hideAssigned) {
    const isAssigned = trainings.some(t =>
      String(t._id) === String(training._id) ||
      // Also check assignmentId references if mixing types, but usually _id checks match the original training ID
      (t as any).trainingId === training._id
    );
    // Note: `trainings` state contains items with `_id` being the TRAINING ID (based on handleAssignTraining logic: `_id: training._id`).
    // So checking _id match should work.
    if (trainings.some(t => t._id === training._id)) return false;
  }

  // Partner Filter
  if (filterPartner !== "all" && training.trainingPartner !== filterPartner) {
    return false;
  }

  return matchesSearch;
});

// ... (UI Update in Modal)
{
  showSearchModal && selectedDesignation && (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
        onClick={() => {
          setShowSearchModal(false);
          setSearchTrainingQuery("");
          setFilterPartner("all");
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
                setFilterPartner("all");
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="p-6 flex-1 overflow-y-auto">
            {/* Filter Controls */}
            <div className="mb-6 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchTrainingQuery}
                    onChange={(e) => setSearchTrainingQuery(e.target.value)}
                    placeholder="Search by title or partner..."
                    className="w-full pl-12 pr-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white"
                    autoFocus
                  />
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={filterPartner}
                    onChange={(e) => setFilterPartner(e.target.value)}
                    className="px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
                  >
                    <option value="all">All Partners</option>
                    {uniquePartners.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${hideAssigned ? 'bg-teal-600 border-teal-600' : 'border-gray-300 bg-white'}`}>
                    {hideAssigned && <Check className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <input
                    type="checkbox"
                    checked={hideAssigned}
                    onChange={(e) => setHideAssigned(e.target.checked)}
                    className="hidden"
                  />
                  <span className="text-sm font-medium text-gray-700">Hide assigned trainings</span>
                </label>
              </div>
            </div>

            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {filteredAllTrainings.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {searchTrainingQuery || filterPartner !== "all" ? "No matches found" : "No available trainings"}
                </div>
              ) : (
                filteredAllTrainings.map((training) => (
                  <div
                    key={training._id}
                    className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl hover:border-gray-300 transition-all group"
                  >
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-900 mb-1">
                        {training.programTitle}
                      </h4>
                      <div className="flex items-center gap-2">
                        {training.trainingPartner && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            {training.trainingPartner}
                          </span>
                        )}
                        {/* Display competency dots/badges if desired, or just count */}
                      </div>
                    </div>
                    <button
                      onClick={() => handleAssignTraining(training)}
                      className="px-4 py-2 text-sm font-semibold text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-all shadow-sm group-hover:shadow-md"
                    >
                      Assign
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )
}
