"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import Sortable from "sortablejs";

interface Designation {
  _id?: string;
  id: string;
  title: string;
}

interface Training {
  _id?: string;
  assignmentId?: string;
  programTitle: string;
  order?: number;
  designationId?: string;
  trackType?: 'normal' | 'hi-po';
}

interface AllTraining {
  _id?: string;
  programTitle: string;
  order?: number;
  designationId?: string;
  trackType?: 'normal' | 'hi-po';
}

type TrackType = 'normal' | 'hi-po';

export default function DesignationsPage() {
  const router = useRouter();
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [filteredDesignations, setFilteredDesignations] = useState<Designation[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showTrainingAssignment, setShowTrainingAssignment] = useState(false);
  const [selectedDesignation, setSelectedDesignation] = useState<Designation | null>(null);
  const [selectedTrack, setSelectedTrack] = useState<TrackType>('normal');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Designation>>({
    id: "",
    title: "",
  });
  const [designationNames, setDesignationNames] = useState("");
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [allTrainings, setAllTrainings] = useState<AllTraining[]>([]);
  const [searchTrainingQuery, setSearchTrainingQuery] = useState("");
  const [showSearchModal, setShowSearchModal] = useState(false);

  useEffect(() => {
    checkAuthAndFetch();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredDesignations(designations);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredDesignations(
        designations.filter(
          (d) =>
            d.id.toLowerCase().includes(query) ||
            d.title.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, designations]);

  useEffect(() => {
    if (selectedDesignation) {
      fetchTrainingsForDesignation(selectedDesignation.id, selectedTrack);
    }
  }, [selectedDesignation, selectedTrack]);

  useEffect(() => {
    if (showTrainingAssignment && selectedDesignation) {
      fetchAllTrainings();
    }
  }, [showTrainingAssignment, selectedDesignation]);

  const checkAuthAndFetch = async () => {
    try {
      const response = await fetch("/api/auth/me", {
        credentials: "include",
      });
      if (response.ok) {
        await fetchDesignations();
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
        setFilteredDesignations(desigs);
      }
    } catch (error) {
      console.error("Error fetching designations:", error);
    }
  };

  const fetchAllTrainings = async () => {
    try {
      const response = await fetch(`/api/trainings`, {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        const trainingsData = data.trainings || [];
        setAllTrainings(trainingsData);
      }
    } catch (error) {
      console.error("Error fetching all trainings:", error);
    }
  };

  const fetchTrainingsForDesignation = async (designationId: string, trackType: TrackType) => {
    try {
      const response = await fetch(`/api/training-assignments?designationId=${designationId}&trackType=${trackType}`, {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        const trainingsData = data.trainings || [];
        
        // Sort by order
        const sortedTrainings = trainingsData.sort((a: Training, b: Training) => (a.order || 0) - (b.order || 0));
        
        setTrainings(sortedTrainings);
      }
    } catch (error) {
      console.error("Error fetching trainings:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      try {
        const response = await fetch(`/api/designations/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          await fetchDesignations();
          resetForm();
          setShowForm(false);
        } else {
          const data = await response.json();
          alert(data.error || "Operation failed");
        }
      } catch (error) {
        console.error("Error saving designation:", error);
        alert("Failed to save designation");
      }
      return;
    }

    if (!designationNames.trim()) {
      alert("Please enter at least one designation name");
      return;
    }

    const names = designationNames
      .split(",")
      .map((name) => name.trim())
      .filter((name) => name.length > 0);

    if (names.length === 0) {
      alert("Please enter valid designation names");
      return;
    }

    try {
      const results = [];
      for (const name of names) {
        const id = name.toUpperCase().replace(/\s+/g, "_");
        const title = name;

        const response = await fetch("/api/designations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            id,
            title,
            summary: `Training pathway for ${name}`,
            iconName: "Book",
            coreTrainings: 0,
            refreshers: 0,
          }),
        });

        if (response.ok) {
          results.push({ success: true, name });
        } else {
          const data = await response.json();
          results.push({ success: false, name, error: data.error });
        }
      }

      const successCount = results.filter((r) => r.success).length;
      if (successCount > 0) {
        await fetchDesignations();
        resetForm();
        setShowForm(false);
        if (successCount < names.length) {
          alert(`Created ${successCount} of ${names.length} designations. Some may already exist.`);
        }
      } else {
        alert("Failed to create designations. They may already exist.");
      }
    } catch (error) {
      console.error("Error saving designations:", error);
      alert("Failed to save designations");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this designation?")) return;

    try {
      const response = await fetch(`/api/designations/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        await fetchDesignations();
      } else {
        const data = await response.json();
        alert(data.error || "Delete failed");
      }
    } catch (error) {
      console.error("Error deleting designation:", error);
      alert("Failed to delete designation");
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

  const resetForm = () => {
    setFormData({
      id: "",
      title: "",
    });
    setDesignationNames("");
    setEditingId(null);
  };

  const handleSortEnd = async (evt: any) => {
    try {
      const items = Array.from(evt.to.children);
      const assignmentIds = items.map((item: any) => {
        const assignmentId = item.getAttribute('data-assignment-id');
        return assignmentId;
      }).filter(Boolean);

      // Update order for each assignment
      const updates = assignmentIds.map((assignmentId, index) => {
        return fetch(`/api/training-assignments/${assignmentId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ order: index }),
        });
      });

      await Promise.all(updates);
      await fetchTrainingsForDesignation(selectedDesignation!.id, selectedTrack);
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const handleAssignTraining = async (training: AllTraining) => {
    if (!selectedDesignation) return;

    try {
      const response = await fetch(`/api/training-assignments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          trainingId: training._id,
          designationId: selectedDesignation.id,
          trackType: selectedTrack,
        }),
      });

      if (response.ok) {
        await fetchTrainingsForDesignation(selectedDesignation.id, selectedTrack);
        setShowSearchModal(false);
        setSearchTrainingQuery("");
      } else {
        const data = await response.json();
        alert(data.error || "Failed to assign training");
      }
    } catch (error) {
      console.error("Error assigning training:", error);
      alert("Failed to assign training");
    }
  };

  const handleRemoveTraining = async (assignmentId: string) => {
    if (!selectedDesignation) return;

    try {
      const response = await fetch(`/api/training-assignments/${assignmentId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        await fetchTrainingsForDesignation(selectedDesignation.id, selectedTrack);
      } else {
        const data = await response.json();
        alert(data.error || "Failed to remove training");
      }
    } catch (error) {
      console.error("Error removing training:", error);
      alert("Failed to remove training");
    }
  };

  useEffect(() => {
    if (!showTrainingAssignment || !selectedDesignation) return;

    let sortableInstance: any = null;
    const timeoutId = setTimeout(() => {
      const container = document.getElementById(`trainings-list-${selectedTrack}`);
      if (container && trainings.length > 0) {
        sortableInstance = Sortable.create(container, {
          animation: 150,
          handle: '.drag-handle',
          ghostClass: 'opacity-50',
          onEnd: (evt) => {
            handleSortEnd(evt);
          },
        });
      }
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      if (sortableInstance && sortableInstance.destroy) {
        sortableInstance.destroy();
      }
    };
  }, [showTrainingAssignment, trainings, selectedDesignation, selectedTrack]);

  const filteredAllTrainings = allTrainings.filter((training) => {
    const query = searchTrainingQuery.toLowerCase();
    return training.programTitle.toLowerCase().includes(query);
  });

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
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gradient-to-r from-teal-50 to-blue-50 text-teal-700 mt-1">
              <Book className="w-5 h-5" />
              <span className="font-semibold">Designations</span>
            </div>
            <Link
              href="/admin/trainings"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-100 text-gray-700 transition-all group mt-1"
            >
              <GraduationCap className="w-5 h-5 text-gray-400 group-hover:text-teal-600 transition-colors" />
              <span className="font-medium">Total Trainings</span>
            </Link>
          </div>

          <div className="mb-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">
              Quick Access ({designations.length})
            </h3>
            <div className="space-y-1 max-h-[300px] overflow-y-auto">
              {designations.length === 0 ? (
                <p className="text-xs text-gray-400 px-3 py-2">No designations yet</p>
              ) : (
                designations.slice(0, 10).map((designation) => (
                  <button
                    key={designation._id || designation.id}
                    onClick={() => {
                      setSelectedDesignation(designation);
                      setShowTrainingAssignment(true);
                      setSidebarOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 transition-all text-left group"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-teal-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="text-sm font-medium truncate flex-1">{designation.title}</span>
                  </button>
                ))
              )}
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
                    Designations
                    <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full">
                      {designations.length}
                    </span>
                  </h1>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Manage your designation catalog
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  resetForm();
                  setShowForm(true);
                }}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gray-900 rounded-xl hover:bg-gray-800 transition-all shadow-sm hover:shadow-md active:scale-95"
              >
                <Plus className="w-4 h-4" />
                Add Designation
              </button>
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
                placeholder="Search designations..."
                className="w-full pl-12 pr-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white transition-all"
              />
            </div>
          </div>

          {/* Designations Grid */}
          {filteredDesignations.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white border border-gray-200 rounded-xl p-12 text-center"
            >
              <Book className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-2">
                {searchQuery ? "No designations found" : "No designations yet"}
              </p>
              <p className="text-gray-400 text-sm">
                {searchQuery ? "Try adjusting your search" : "Add your first designation to get started"}
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <AnimatePresence>
                {filteredDesignations.map((designation, index) => (
                  <motion.div
                    key={designation._id || designation.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.03 }}
                    className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-gray-300 transition-all group cursor-pointer"
                    onClick={() => {
                      setSelectedDesignation(designation);
                      setShowTrainingAssignment(true);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-gray-900">
                        {designation.title}
                      </h3>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </main>
      </div>

      {/* Training Assignment Modal */}
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
                  {/* Track Selection Tabs */}
                  <div className="flex gap-2 mb-6 border-b border-gray-200">
                    <button
                      onClick={() => setSelectedTrack('normal')}
                      className={`px-6 py-3 text-sm font-semibold transition-all relative ${
                        selectedTrack === 'normal'
                          ? 'text-teal-700'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4" />
                        Normal Track
                      </div>
                      {selectedTrack === 'normal' && (
                        <motion.div
                          layoutId="trackIndicator"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600"
                        />
                      )}
                    </button>
                    <button
                      onClick={() => setSelectedTrack('hi-po')}
                      className={`px-6 py-3 text-sm font-semibold transition-all relative ${
                        selectedTrack === 'hi-po'
                          ? 'text-purple-700'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4" />
                        Hi-Po Track
                      </div>
                      {selectedTrack === 'hi-po' && (
                        <motion.div
                          layoutId="trackIndicator"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600"
                        />
                      )}
                    </button>
                  </div>

                  {/* Add Training Button */}
                  <div className="mb-6">
                    <button
                      onClick={() => {
                        setShowSearchModal(true);
                      }}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gray-900 rounded-xl hover:bg-gray-800 transition-all shadow-sm hover:shadow-md active:scale-95"
                    >
                      <Plus className="w-4 h-4" />
                      Add Training
                    </button>
                  </div>

                  {/* Trainings List */}
                  {trainings.length > 0 ? (
                    <div className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
                      <div className={`px-6 py-4 border-b border-gray-200 ${
                        selectedTrack === 'normal' 
                          ? 'bg-gradient-to-r from-teal-50 to-blue-50' 
                          : 'bg-gradient-to-r from-purple-50 to-pink-50'
                      }`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            selectedTrack === 'normal'
                              ? 'bg-gradient-to-br from-teal-500 to-blue-600'
                              : 'bg-gradient-to-br from-purple-500 to-pink-600'
                          }`}>
                            <Layers className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">
                              {selectedTrack === 'normal' ? 'Normal' : 'Hi-Po'} Track
                            </h3>
                            <p className="text-xs text-gray-500">
                              {trainings.length} training{trainings.length !== 1 ? "s" : ""} • Drag to reorder
                            </p>
                          </div>
                        </div>
                      </div>
                      <div
                        id={`trainings-list-${selectedTrack}`}
                        className="p-4 space-y-2"
                      >
                        {trainings.map((training, index) => (
                          <div
                            key={training.assignmentId || training._id || index}
                            data-assignment-id={training.assignmentId}
                            className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all group cursor-move"
                          >
                            <div className="drag-handle cursor-move p-1 hover:bg-gray-100 rounded transition-colors">
                              <GripVertical className="w-4 h-4 text-gray-400" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-gray-400 w-6">
                                  {index + 1}.
                                </span>
                                <h4 className="text-sm font-semibold text-gray-900">
                                  {training.programTitle}
                                </h4>
                              </div>
                            </div>
                            <button
                              onClick={() => handleRemoveTraining(training.assignmentId!)}
                              className="p-1.5 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <X className="w-4 h-4 text-red-500" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 border border-gray-200 rounded-xl">
                      <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg mb-2">No trainings assigned yet</p>
                      <p className="text-gray-400 text-sm mb-4">
                        Click "Add Training" to assign trainings to this {selectedTrack === 'normal' ? 'Normal' : 'Hi-Po'} track
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

      {/* Search Training Modal */}
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
                  <div className="mb-4">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={searchTrainingQuery}
                        onChange={(e) => setSearchTrainingQuery(e.target.value)}
                        placeholder="Search trainings..."
                        className="w-full pl-12 pr-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white"
                        autoFocus
                      />
                    </div>
                  </div>

                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {filteredAllTrainings.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        {searchTrainingQuery ? "No trainings found" : "No available trainings"}
                      </div>
                    ) : (
                      filteredAllTrainings.map((training) => (
                        <div
                          key={training._id}
                          className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl hover:border-gray-300 transition-all"
                        >
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold text-gray-900">
                              {training.programTitle}
                            </h4>
                          </div>
                          <button
                            onClick={() => handleAssignTraining(training)}
                            className="px-4 py-2 text-sm font-semibold text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-all"
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
        )}
      </AnimatePresence>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
              onClick={() => {
                setShowForm(false);
                resetForm();
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                  <h2 className="text-xl font-bold text-gray-900">
                    {editingId ? "Edit Designation" : "Add Designation"}
                  </h2>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      resetForm();
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                  {editingId ? (
                    // Edit mode
                    <>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Designation ID *
                        </label>
                        <input
                          type="text"
                          value={formData.id}
                          onChange={(e) =>
                            setFormData({ ...formData, id: e.target.value.toUpperCase() })
                          }
                          className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                          required
                          disabled
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Title *
                        </label>
                        <input
                          type="text"
                          value={formData.title}
                          onChange={(e) =>
                            setFormData({ ...formData, title: e.target.value })
                          }
                          className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                          required
                        />
                      </div>
                    </>
                  ) : (
                    // Add mode - only name field (comma-separated)
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Designation Names *
                      </label>
                      <input
                        type="text"
                        value={designationNames}
                        onChange={(e) => setDesignationNames(e.target.value)}
                        placeholder="Service Ambassador, Branch Service Officer, Branch Service Manager"
                        className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                        required
                        autoFocus
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        Enter multiple names separated by commas. ID will be auto-generated from each name.
                      </p>
                    </div>
                  )}

                  <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                    <button
                      type="submit"
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-gray-900 rounded-xl hover:bg-gray-800 transition-all shadow-sm hover:shadow-md active:scale-95"
                    >
                      <Check className="w-4 h-4" />
                      {editingId ? "Update" : "Create"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        resetForm();
                      }}
                      className="px-4 py-3 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
