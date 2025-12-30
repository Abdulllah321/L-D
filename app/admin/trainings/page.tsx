"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Search,
  Edit2,
  Trash2,
  X,
  Check,
  Book,
  Menu,
  X as XIcon,
  LogOut,
  LayoutDashboard,
  GraduationCap,
  ChevronRight,
  Sparkles,
  ArrowLeft,
  Layers,
  GripVertical,
  Calendar,
  Users,
  Clock,
  Target,
  Link as LinkIcon,
  XCircle
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Sortable from "sortablejs";
import { Suspense } from "react";

interface Designation {
  _id?: string;
  id: string;
  title: string;
}

interface TrainingDay {
  day: number;
  topic: string;
  time: string;
  isBreak?: boolean;
  breakType?: 'lunch' | 'tea' | 'other';
  presenters: {
    north?: string;
    centralI?: string;
    centralII?: string;
    south?: string;
  };
  notes?: string;
  order?: number;
}

interface Training {
  _id?: string;
  programTitle: string;
  programObjective: string;
  trainingPartner: string;
  targetAudience: string;
  durationFormat: string;
  competencies: {
    functional?: string[];
    core?: string[];
    leadership?: string[];
  };
  outcomesBenefits: string;
  frequency: string;
  assessmentFollowUp: string;
  reviewDate?: string;
  level?: number;
  designationId?: string;
  order?: number;
  schedule: TrainingDay[];
}

interface AssignTrainingSectionProps {
  designation: Designation | undefined;
  trainings: Training[];
  onAssign: (trainingId: string, level: number, order: number) => Promise<void>;
}

function AssignTrainingSection({ designation, trainings, onAssign }: AssignTrainingSectionProps) {
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState<Training | null>(null);
  const [assignLevel, setAssignLevel] = useState<number>(1);
  const [assignOrder, setAssignOrder] = useState<number>(0);
  const [isAssigning, setIsAssigning] = useState(false);

  const handleAssignClick = (training: Training) => {
    setSelectedTraining(training);
    setAssignLevel(1);
    setAssignOrder(0);
    setShowAssignModal(true);
  };

  const handleConfirmAssign = async () => {
    if (!selectedTraining) return;
    setIsAssigning(true);
    try {
      await onAssign(selectedTraining._id || "", assignLevel, assignOrder);
      setShowAssignModal(false);
      setSelectedTraining(null);
    } catch (error) {
      console.error("Assignment error:", error);
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white border border-gray-200 rounded-xl p-12 text-center"
      >
        <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg mb-2">No trainings assigned</p>
        <p className="text-gray-400 text-sm mb-6">
          Assign trainings to <span className="font-semibold text-gray-700">{designation?.title} - {designation?.id}</span> to get started
        </p>
        
        {trainings.length > 0 ? (
          <div className="mt-8">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Available Trainings to Assign</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
              {trainings.map((training) => (
                <motion.div
                  key={training._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:border-teal-300 hover:bg-teal-50/30 transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-900 truncate mb-1">
                        {training.programTitle}
                      </h4>
                      {training.programObjective && (
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {training.programObjective}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleAssignClick(training)}
                      className="flex-shrink-0 p-2 text-teal-600 hover:bg-teal-100 rounded-lg transition-colors"
                      title="Assign training"
                    >
                      <LinkIcon className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <Link
            href="/admin/trainings/create"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-teal-600 rounded-xl hover:bg-teal-700 transition-all mt-4"
          >
            <Plus className="w-4 h-4" />
            Create Training
          </Link>
        )}
      </motion.div>

      {/* Assign Modal */}
      <AnimatePresence>
        {showAssignModal && selectedTraining && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
              onClick={() => setShowAssignModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Assign Training</h3>
                  <button
                    onClick={() => setShowAssignModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <p className="text-sm font-semibold text-gray-700 mb-1">Training</p>
                    <p className="text-base font-bold text-gray-900">{selectedTraining.programTitle}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Designation
                    </label>
                    <div className="px-4 py-3 bg-teal-50 border border-teal-200 rounded-xl">
                      <p className="text-sm font-semibold text-teal-900">{designation?.title}</p>
                      <p className="text-xs text-teal-700">{designation?.id}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Level *
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={assignLevel}
                        onChange={(e) => setAssignLevel(parseInt(e.target.value) || 1)}
                        className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Order *
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={assignOrder}
                        onChange={(e) => setAssignOrder(parseInt(e.target.value) || 0)}
                        className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleConfirmAssign}
                    disabled={isAssigning}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-teal-600 rounded-xl hover:bg-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <LinkIcon className="w-4 h-4" />
                    {isAssigning ? "Assigning..." : "Assign Training"}
                  </button>
                  <button
                    onClick={() => setShowAssignModal(false)}
                    className="px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TrainingsPage />
    </Suspense>
  );
}

function TrainingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [selectedDesignation, setSelectedDesignation] = useState<string>("");
  const [filteredTrainings, setFilteredTrainings] = useState<Training[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedTrainingForAssign, setSelectedTrainingForAssign] = useState<Training | null>(null);
  const [assignLevel, setAssignLevel] = useState<number>(1);
  const [assignOrder, setAssignOrder] = useState<number>(0);
  const [isAssigning, setIsAssigning] = useState(false);

  useEffect(() => {
    checkAuthAndFetch();
  }, []);

  useEffect(() => {
    // Check for designation in URL params
    const designationParam = searchParams.get('designation');
    if (designationParam && designations.length > 0) {
      const found = designations.find(d => d.id === designationParam);
      if (found) {
        setSelectedDesignation(designationParam);
      } else {
        // If designation param doesn't match, clear selection to show all trainings
        setSelectedDesignation("");
      }
    } else if (!designationParam) {
      // If no designation param, clear selection to show all trainings
      setSelectedDesignation("");
    }
  }, [searchParams, designations]);

  useEffect(() => {
    if (selectedDesignation) {
      // When a designation is selected, show trainings assigned to that designation
      const filtered = trainings.filter(
        (t) => t.designationId === selectedDesignation && t.level
      );
      setFilteredTrainings(filtered);
    } else {
      // When no designation selected, show ALL trainings
      setFilteredTrainings(trainings);
    }
  }, [selectedDesignation, trainings]);

  useEffect(() => {
    // Base: all trainings when no designation selected, assigned trainings when designation selected
    const baseTrainings = selectedDesignation
      ? trainings.filter((t) => t.designationId === selectedDesignation && t.level)
      : trainings;
    
    if (searchQuery.trim() === "") {
      setFilteredTrainings(baseTrainings);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredTrainings(
        baseTrainings.filter((t) => t.programTitle.toLowerCase().includes(query))
      );
    }
  }, [searchQuery, selectedDesignation, trainings]);

  const checkAuthAndFetch = async () => {
    try {
      const response = await fetch("/api/auth/me", {
        credentials: "include",
      });
      if (response.ok) {
        await Promise.all([fetchDesignations(), fetchTrainings()]);
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

  const fetchDesignations = async () => {
    try {
      const response = await fetch("/api/designations", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        const desigs = data.designations || data || [];
        setDesignations(desigs);
        // Only auto-select designation if there's a search param
        const designationParam = searchParams.get('designation');
        if (desigs.length > 0 && designationParam) {
          const found = desigs.find((d: Designation) => d.id === designationParam);
          if (found && !selectedDesignation) {
            setSelectedDesignation(designationParam);
          }
        }
        // If no designation param, don't auto-select - show all trainings
      }
    } catch (error) {
      console.error("Error fetching designations:", error);
    }
  };

  const fetchTrainings = async () => {
    try {
      const response = await fetch("/api/trainings", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setTrainings(data.trainings || []);
      }
    } catch (error) {
      console.error("Error fetching trainings:", error);
    }
  };


  const handleEdit = (training: Training) => {
    router.push(`/admin/trainings/create?id=${training._id}`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this training?")) return;

    try {
      const response = await fetch(`/api/trainings/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        await fetchTrainings();
      } else {
        const data = await response.json();
        alert(data.error || "Delete failed");
      }
    } catch (error) {
      console.error("Error deleting training:", error);
      alert("Failed to delete training");
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      router.push("/admin");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleAssignTraining = async (trainingId: string, level: number, order: number) => {
    try {
      const response = await fetch(`/api/trainings/${trainingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          designationId: selectedDesignation,
          level: level,
          order: order,
        }),
      });

      if (response.ok) {
        await fetchTrainings();
        setShowAssignModal(false);
        setSelectedTrainingForAssign(null);
        alert("Training assigned successfully");
      } else {
        const data = await response.json();
        alert(data.error || "Assignment failed");
      }
    } catch (error) {
      console.error("Error assigning training:", error);
      alert("Failed to assign training");
    }
  };

  const handleAssignClick = (training: Training) => {
    setSelectedTrainingForAssign(training);
    setAssignLevel(1);
    setAssignOrder(0);
    setShowAssignModal(true);
  };

  const handleUnassignTraining = async (trainingId: string) => {
    if (!confirm("Are you sure you want to unassign this training?")) return;
    
    try {
      const response = await fetch(`/api/trainings/${trainingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          designationId: null,
          level: null,
          order: null,
        }),
      });

      if (response.ok) {
        await fetchTrainings();
        alert("Training unassigned successfully");
      } else {
        const data = await response.json();
        alert(data.error || "Unassignment failed");
      }
    } catch (error) {
      console.error("Error unassigning training:", error);
      alert("Failed to unassign training");
    }
  };


  const getTrainingsByLevel = (designationId: string) => {
    const desigTrainings = filteredTrainings.filter(
      (t) => t.designationId === designationId && t.level
    );
    const levels: { [key: number]: Training[] } = {};
    desigTrainings.forEach((training) => {
      if (training.level) {
        if (!levels[training.level]) {
          levels[training.level] = [];
        }
        levels[training.level].push(training);
      }
    });
    return levels;
  };

  const selectedDesig = designations.find((d) => d.id === selectedDesignation);
  const trainingsByLevel = selectedDesignation
    ? getTrainingsByLevel(selectedDesignation)
    : {};
  
  // Get unassigned trainings for assignment section
  const unassignedTrainings = trainings.filter(
    (t) => !t.designationId || t.designationId !== selectedDesignation
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: sidebarOpen ? 0 : -280 }}
        animate={{ x: sidebarOpen ? 0 : -280 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="fixed lg:static inset-y-0 left-0 z-40 w-72 bg-white border-r border-gray-200 flex flex-col shadow-sm"
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                <Book className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Admin Panel</h1>
                <p className="text-xs text-gray-500">Learning Portal</p>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XIcon className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">
              Navigation
            </h3>
            <Link
              href="/admin"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-100 text-gray-700 transition-all group"
            >
              <LayoutDashboard className="w-5 h-5 text-gray-400 group-hover:text-teal-600 transition-colors" />
              <span className="font-medium">Dashboard</span>
            </Link>
            <Link
              href="/admin/designations"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-100 text-gray-700 transition-all group mt-1"
            >
              <Book className="w-5 h-5 text-gray-400 group-hover:text-teal-600 transition-colors" />
              <span className="font-medium">Designations</span>
            </Link>
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gradient-to-r from-teal-50 to-blue-50 text-teal-700 mt-1">
              <GraduationCap className="w-5 h-5" />
              <span className="font-semibold">Total Trainings</span>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">
              Designations
            </h3>
            <div className="space-y-1 max-h-[300px] overflow-y-auto">
              {designations.map((designation) => (
                <button
                  key={designation._id || designation.id}
                  onClick={() => setSelectedDesignation(designation.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all ${
                    selectedDesignation === designation.id
                      ? "bg-teal-50 text-teal-700 font-medium"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full transition-opacity ${
                      selectedDesignation === designation.id
                        ? "bg-teal-500 opacity-100"
                        : "bg-gray-300 opacity-0 group-hover:opacity-100"
                    }`}
                  />
                  <span className="text-sm truncate flex-1">{designation.title}</span>
                  {selectedDesignation === designation.id && (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 text-red-600 transition-all group"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </motion.aside>

      {/* Sidebar Overlay (Mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-20">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Menu className="w-6 h-6 text-gray-600" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    Total Trainings
                    <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full">
                      {selectedDesignation 
                        ? filteredTrainings.length 
                        : filteredTrainings.length}
                    </span>
                  </h1>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {selectedDesig
                      ? `Training pathways for ${selectedDesig.title} - ${selectedDesig.id}`
                      : "View and manage all trainings"}
                  </p>
                </div>
              </div>
              <Link
                href="/admin/trainings/create"
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gray-900 rounded-xl hover:bg-gray-800 transition-all shadow-sm hover:shadow-md active:scale-95"
              >
                <Plus className="w-4 h-4" />
                Add Training
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Search */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search trainings..."
                className="w-full pl-12 pr-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white transition-all"
              />
            </div>
          </div>

          {/* Training Display */}
          {selectedDesignation ? (
            // Show assigned trainings grouped by level
            Object.keys(trainingsByLevel).length === 0 ? (
              <AssignTrainingSection
                designation={selectedDesig}
                trainings={unassignedTrainings}
                onAssign={handleAssignTraining}
              />
            ) : (
              <div className="space-y-6">
                {Object.keys(trainingsByLevel)
                  .sort((a, b) => parseInt(a) - parseInt(b))
                  .map((level) => {
                    const levelTrainings = trainingsByLevel[parseInt(level)].sort(
                      (a, b) => (a.order || 0) - (b.order || 0)
                    );
                    return (
                      <motion.div
                        key={level}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white border border-gray-200 rounded-xl overflow-hidden"
                      >
                        <div className="bg-gradient-to-r from-teal-50 to-blue-50 px-6 py-4 border-b border-gray-200">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center">
                              <Layers className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-gray-900">
                                Level {level}
                              </h3>
                              <p className="text-xs text-gray-500">
                                {levelTrainings.length} training
                                {levelTrainings.length !== 1 ? "s" : ""}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="p-6">
                          <div className="space-y-3">
                            {levelTrainings.map((training, index) => (
                              <motion.div
                                key={training._id || index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all group"
                              >
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-semibold text-gray-500 bg-white px-2 py-0.5 rounded">
                                      #{(training.order || 0) + 1}
                                    </span>
                                    <h4 className="text-base font-semibold text-gray-900">
                                      {training.programTitle}
                                    </h4>
                                  </div>
                                  {training.programObjective && (
                                    <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                                      {training.programObjective}
                                    </p>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handleEdit(training)}
                                    className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                                    title="Edit training"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleUnassignTraining(training._id || "")}
                                    className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                                    title="Unassign from designation"
                                  >
                                    <XCircle className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(training._id || "")}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Delete training"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                
                {/* Show unassigned trainings section for assignment */}
                {unassignedTrainings.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-gray-200 rounded-xl overflow-hidden"
                  >
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                          <LinkIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">
                            Available to Assign
                          </h3>
                          <p className="text-xs text-gray-500">
                            {unassignedTrainings.length} training{unassignedTrainings.length !== 1 ? "s" : ""} available
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {unassignedTrainings.map((training) => (
                          <motion.div
                            key={training._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:border-teal-300 hover:bg-teal-50/30 transition-all"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-semibold text-gray-900 truncate mb-1">
                                  {training.programTitle}
                                </h4>
                                {training.programObjective && (
                                  <p className="text-xs text-gray-600 line-clamp-2">
                                    {training.programObjective}
                                  </p>
                                )}
                              </div>
                              <button
                                onClick={() => handleAssignClick(training)}
                                className="shrink-0 p-2 text-teal-600 hover:bg-teal-100 rounded-lg transition-colors"
                                title="Assign training"
                              >
                                <LinkIcon className="w-4 h-4" />
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            )
          ) : (
            // Show all trainings when no designation selected
            filteredTrainings.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white border border-gray-200 rounded-xl p-12 text-center"
              >
                <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-2">No trainings found</p>
                <p className="text-gray-400 text-sm mb-4">
                  Create trainings to get started
                </p>
                <Link
                  href="/admin/trainings/create"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-teal-600 rounded-xl hover:bg-teal-700 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Create Training
                </Link>
              </motion.div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  {filteredTrainings.map((training, index) => {
                    const isAssigned = training.designationId && training.level;
                    return (
                      <motion.div
                        key={training._id || index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`bg-white border rounded-xl p-5 hover:shadow-md transition-all ${
                          isAssigned ? "border-teal-200 bg-teal-50/30" : "border-gray-200"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-bold text-gray-900">
                                {training.programTitle}
                              </h3>
                              {isAssigned && (
                                <span className="text-xs font-semibold text-teal-700 bg-teal-100 px-2 py-0.5 rounded">
                                  Assigned to {training.designationId} - Level {training.level}
                                </span>
                              )}
                            </div>
                            {training.programObjective && (
                              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                {training.programObjective}
                              </p>
                            )}
                            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                              {training.trainingPartner && (
                                <span className="flex items-center gap-1.5">
                                  <Users className="w-3.5 h-3.5" />
                                  {training.trainingPartner}
                                </span>
                              )}
                              {training.durationFormat && (
                                <span className="flex items-center gap-1.5">
                                  <Clock className="w-3.5 h-3.5" />
                                  {training.durationFormat}
                                </span>
                              )}
                              {training.targetAudience && (
                                <span className="flex items-center gap-1.5">
                                  <Target className="w-3.5 h-3.5" />
                                  {training.targetAudience}
                                </span>
                              )}
                              {training.schedule && training.schedule.length > 0 && (
                                <span className="flex items-center gap-1.5">
                                  <Calendar className="w-3.5 h-3.5" />
                                  {training.schedule.length} schedule item{training.schedule.length !== 1 ? 's' : ''}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEdit(training)}
                              className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                              title="Edit training"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(training._id || "")}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete training"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )
          )}
        </main>
      </div>
    </div>
  );
}
