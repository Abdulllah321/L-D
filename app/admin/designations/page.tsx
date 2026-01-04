"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  Book,
  Menu,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
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
  rectSortingStrategy,
} from '@dnd-kit/sortable';

import {
  Designation,
  Training,
  AllTraining,
  LearningPath,
  LearningDeck,
  TrackType,
  AnnualType,
  SelectedTraining
} from "./types";
import { SortableDesignationItem } from "./_components/SortableDesignationItem";
import { AdminSidebar } from "./_components/AdminSidebar";
import { TrainingAssignmentModal } from "./_components/TrainingAssignmentModal";
import { SearchTrainingModal } from "./_components/SearchTrainingModal";
import { DesignationFormModal } from "./_components/DesignationFormModal";
import { LearningPathManagementModal } from "./_components/LearningPathManagementModal";
import { LearningPathCreationModal } from "./_components/LearningPathCreationModal";

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
  const [selectedAnnualType, setSelectedAnnualType] = useState<'annual-regular' | 'annual-ecourse' | null>(null);
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
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [learningDecks, setLearningDecks] = useState<LearningDeck[]>([]);
  const [showLearningPathModal, setShowLearningPathModal] = useState(false);
  const [selectedSubDesignation, setSelectedSubDesignation] = useState<string | null>(null);
  const [showLPCreationModal, setShowLPCreationModal] = useState(false);
  const [newLPData, setNewLPData] = useState<{ title: string; description: string; frequency?: string; deckId?: string; categoryId?: string }>({ title: '', description: '', frequency: '' });
  const [lpSelectedTrainings, setLpSelectedTrainings] = useState<SelectedTraining[]>([]);
  const [assignMode, setAssignMode] = useState<'training' | 'learning-path'>('training');

  useEffect(() => {
    checkAuthAndFetch();
  }, []);

  useEffect(() => {
    // Sort designations by order
    const sorted = [...designations].sort((a, b) => (a.order || 0) - (b.order || 0));

    if (searchQuery.trim() === "") {
      setFilteredDesignations(sorted);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredDesignations(
        sorted.filter(
          (d) =>
            d.id.toLowerCase().includes(query) ||
            d.title.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, designations]);

  useEffect(() => {
    if (selectedDesignation) {
      fetchTrainingsForDesignation(selectedDesignation.id, selectedTrack, selectedSubDesignation || undefined, selectedAnnualType);
    }
  }, [selectedDesignation, selectedTrack, selectedSubDesignation, selectedAnnualType]);

  useEffect(() => {
    if (showTrainingAssignment && selectedDesignation) {
      fetchAllTrainings();
      fetchLearningPaths();
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
        const desigs = (data.designations || data || []).sort((a: Designation, b: Designation) => (a.order || 0) - (b.order || 0));
        setDesignations(desigs);
      }
    } catch (error) {
      console.error("Error fetching designations:", error);
    }
  };

  const fetchLearningPaths = async () => {
    try {
      const response = await fetch("/api/learning-paths", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setLearningPaths(data.learningPaths || []);
      }
    } catch (error) {
      console.error("Error fetching learning paths:", error);
    }
  };

  const fetchLearningDecks = async () => {
    try {
      const response = await fetch("/api/learning-decks", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setLearningDecks(data.decks || []);
      }
    } catch (error) {
      console.error("Error fetching learning decks:", error);
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

  const fetchTrainingsForDesignation = async (designationId: string, trackType: TrackType, subId?: string, annualType?: AnnualType) => {
    try {
      let url = `/api/training-assignments?designationId=${designationId}&trackType=${trackType}`;
      if (subId) {
        url += `&subDesignationId=${subId}`;
      }
      if (annualType !== undefined) {
        url += `&annualType=${annualType === null ? 'null' : annualType}`;
      }
      const response = await fetch(url, {
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
            iconName: "Book",
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
      subDesignations: []
    });
    setDesignationNames("");
    setEditingId(null);
  };

  const handleAssignTraining = async (items: (AllTraining | LearningPath)[], type: 'training' | 'learning-path') => {
    if (!selectedDesignation) return;

    // Optimistic update
    const newAssignments: Training[] = items.map((item, index) => ({
      _id: type === 'training' ? (item as AllTraining)._id : undefined,
      assignmentId: `temp-${Date.now()}-${index}`,
      programTitle: item.title || (item as AllTraining).programTitle,
      order: trainings.length + index,
      designationId: selectedDesignation.id,
      subDesignationId: selectedSubDesignation || undefined,
      trackType: selectedTrack,
      annualType: selectedAnnualType,
      learningPathId: type === 'learning-path' ? (item as LearningPath)._id : undefined,
      learningPathTitle: type === 'learning-path' ? (item as LearningPath).title : undefined,
    }));

    if (type === 'training') {
      setTrainings([...trainings, ...newAssignments]);
    }

    setShowSearchModal(false);
    setSearchTrainingQuery("");

    try {
      const results = { success: 0, skipped: 0, failed: 0 };
      const skippedItems: string[] = [];

      for (const item of items) {
        const payload: any = {
          designationId: selectedDesignation.id,
          trackType: selectedTrack,
          annualType: selectedAnnualType,
        };

        if (selectedSubDesignation) {
          payload.subDesignationId = selectedSubDesignation;
        }

        if (type === 'training') {
          payload.trainingId = (item as AllTraining)._id;
        } else {
          payload.learningPathId = (item as LearningPath)._id;
        }

        try {
          const response = await fetch(`/api/training-assignments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(payload),
          });

          if (response.ok) {
            results.success++;
          } else {
            const errorData = await response.json();
            if (errorData.error?.includes('already assigned')) {
              results.skipped++;
              skippedItems.push(item.title || (item as AllTraining).programTitle);
            } else {
              results.failed++;
            }
          }
        } catch (err) {
          results.failed++;
        }
      }

      // Refresh to get the correct exploded View (especially for Learning Paths)
      await fetchTrainingsForDesignation(selectedDesignation.id, selectedTrack, selectedSubDesignation || undefined, selectedAnnualType);

      // Show summary message
      if (results.skipped > 0) {
        alert(`Assignment complete!\n✓ ${results.success} added\n⊘ ${results.skipped} already assigned (skipped)\n${results.failed > 0 ? `✗ ${results.failed} failed` : ''}\n\nSkipped items:\n${skippedItems.join('\n')}`);
      } else if (results.failed > 0) {
        alert(`${results.success} items assigned successfully, but ${results.failed} failed.`);
      }

    } catch (error) {
      console.error("Error assigning:", error);
      // Revert optimistic update (simple reload)
      await fetchTrainingsForDesignation(selectedDesignation.id, selectedTrack, selectedSubDesignation || undefined, selectedAnnualType);
      alert("Failed to assign some items");
    }
  };

  const handleAddCustomTraining = async (customTrainingName: string) => {
    if (!selectedDesignation || !customTrainingName.trim()) return;

    // Optimistic update
    const newAssignment: Training = {
      assignmentId: `temp-${Date.now()}`,
      programTitle: customTrainingName.trim(),
      order: trainings.length,
      designationId: selectedDesignation.id,
      subDesignationId: selectedSubDesignation || undefined,
      trackType: selectedTrack,
      annualType: selectedAnnualType,
      isCustomTraining: true,
    };

    setTrainings([...trainings, newAssignment]);

    try {
      const payload: any = {
        designationId: selectedDesignation.id,
        trackType: selectedTrack,
        annualType: selectedAnnualType,
        customTrainingName: customTrainingName.trim(),
      };

      if (selectedSubDesignation) {
        payload.subDesignationId = selectedSubDesignation;
      }

      const response = await fetch(`/api/training-assignments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        // Refresh to get the correct assignment ID
        await fetchTrainingsForDesignation(selectedDesignation.id, selectedTrack, selectedSubDesignation || undefined, selectedAnnualType);
      } else {
        // Revert on error
        await fetchTrainingsForDesignation(selectedDesignation.id, selectedTrack, selectedSubDesignation || undefined, selectedAnnualType);
        const errorData = await response.json();
        alert(errorData.error || "Failed to add custom training");
      }
    } catch (error) {
      console.error("Error adding custom training:", error);
      // Revert on error
      await fetchTrainingsForDesignation(selectedDesignation.id, selectedTrack, selectedSubDesignation || undefined, selectedAnnualType);
      alert("Failed to add custom training");
    }
  };

  const handleCreateLearningPath = async () => {
    if (!newLPData.title) {
      alert("Please fill in title and description");
      return;
    }

    if (lpSelectedTrainings.length === 0) {
      alert("Please select at least one training");
      return;
    }

    try {
      const response = await fetch('/api/learning-paths', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title: newLPData.title,
          description: newLPData.description,
          frequency: newLPData.frequency,
          trainings: lpSelectedTrainings
        })
      });

      if (response.ok) {
        await fetchLearningPaths();
        setShowLPCreationModal(false);
        setNewLPData({ title: '', description: '', frequency: '' });
        setLpSelectedTrainings([]);
      } else {
        const data = await response.json();
        alert(data.error || "Failed to create Learning Path");
      }
    } catch (error) {
      console.error("Error creating LP:", error);
      alert("Failed to create Learning Path");
    }
  };

  const handleRemoveTraining = async (assignmentId: string) => {
    if (!selectedDesignation) return;

    // Optimistic update - remove training immediately
    const trainingToRemove = trainings.find(t => t.assignmentId === assignmentId);
    const updatedTrainings = trainings.filter(t => t.assignmentId !== assignmentId);
    // Reorder remaining trainings
    const reorderedTrainings = updatedTrainings.map((t, index) => ({
      ...t,
      order: index,
    }));
    setTrainings(reorderedTrainings);

    // Update API in background
    try {
      const response = await fetch(`/api/training-assignments/${assignmentId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        // Revert on error
        setTrainings(trainings);
        const data = await response.json();
        alert(data.error || "Failed to remove training");
      }
    } catch (error) {
      console.error("Error removing training:", error);
      // Revert on error
      setTrainings(trainings);
      alert("Failed to remove training");
    }
  };

  const handleTrainingDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || !selectedDesignation || active.id === over.id) {
      return;
    }

    const oldIndex = trainings.findIndex(
      (t) => String(t.assignmentId) === String(active.id) || String(t._id) === String(active.id)
    );
    const newIndex = trainings.findIndex(
      (t) => String(t.assignmentId) === String(over.id) || String(t._id) === String(over.id)
    );

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    // Optimistic update - update UI immediately
    const newOrder = arrayMove(trainings, oldIndex, newIndex);
    // Update order numbers for display
    const updatedOrder = newOrder.map((training, index) => ({
      ...training,
      order: index,
    }));
    setTrainings(updatedOrder);

    // Update API in background using bulk reorder endpoint
    try {
      const items = updatedOrder
        .filter((training: Training) => training.assignmentId)
        .map((training: Training, index: number) => ({
          assignmentId: training.assignmentId!,
          order: index,
        }));

      if (items.length === 0) {
        return;
      }

      const response = await fetch(`/api/training-assignments/reorder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ items }),
      });

      if (!response.ok) {
        throw new Error('Failed to reorder trainings');
      }
    } catch (error) {
      console.error("Error updating order:", error);
      // Revert on error
      await fetchTrainingsForDesignation(selectedDesignation.id, selectedTrack, selectedSubDesignation || undefined, selectedAnnualType);
      alert("Failed to save training order. Reverting changes.");
    }
  };

  const handleDesignationDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = filteredDesignations.findIndex(
      (d) => String(d._id) === String(active.id) || String(d.id) === String(active.id)
    );
    const newIndex = filteredDesignations.findIndex(
      (d) => String(d._id) === String(over.id) || String(d.id) === String(over.id)
    );

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    // Optimistic update - update UI immediately
    const newOrder = arrayMove(filteredDesignations, oldIndex, newIndex).map((d, index) => ({
      ...d,
      order: index,
    }));
    setFilteredDesignations(newOrder);

    // Update main designations array with new order values
    const updatedDesignations = designations.map(designation => {
      const updated = newOrder.find(d => (d._id || d.id) === (designation._id || designation.id));
      return updated ? { ...designation, order: updated.order } : designation;
    }).sort((a, b) => (a.order || 0) - (b.order || 0));
    setDesignations(updatedDesignations);

    // Update API in background using bulk reorder endpoint
    try {
      const items = newOrder.map((designation: Designation, index: number) => ({
        id: designation._id || designation.id,
        order: index,
      }));

      const response = await fetch(`/api/designations/reorder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ items }),
      });

      if (!response.ok) {
        throw new Error('Failed to reorder designations');
      }
    } catch (error) {
      console.error("Error updating designation order:", error);
      // Revert on error
      await fetchDesignations();
      alert("Failed to save designation order. Reverting changes.");
    }
  };

  // Setup sensors for drag and drop
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
      <AdminSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        designations={designations}
        selectedDesignation={selectedDesignation}
        setSelectedDesignation={setSelectedDesignation}
        setShowTrainingAssignment={setShowTrainingAssignment}
        handleLogout={handleLogout}
      />

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
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    fetchLearningPaths();
                    setShowLearningPathModal(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all shadow-sm"
                >
                  <Book className="w-4 h-4" />
                  Manage Learning Paths
                </button>
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
          ) : searchQuery.trim() !== "" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredDesignations.map((designation) => (
                <div
                  key={designation._id || designation.id}
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
                </div>
              ))}
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDesignationDragEnd}
            >
              <SortableContext
                items={filteredDesignations.map(d => d._id || d.id)}
                strategy={rectSortingStrategy}
              >
                <div  
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  {filteredDesignations.map((designation) => (
                    <SortableDesignationItem
                      key={designation._id || designation.id}
                      designation={designation}
                      searchQuery={searchQuery}
                      onSelect={(d) => {
                        setSelectedDesignation(d);
                        setShowTrainingAssignment(true);
                      }}
                      onEdit={(d) => {
                        setEditingId(d._id || d.id);
                        setFormData({
                          id: d.id,
                          title: d.title,
                          subDesignations: d.subDesignations || []
                        });
                        setShowForm(true);
                      }}
                      onDelete={(id) => {
                        if (id) handleDelete(id);
                      }}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </main>
      </div>

      <TrainingAssignmentModal
        showTrainingAssignment={showTrainingAssignment}
        setShowTrainingAssignment={setShowTrainingAssignment}
        selectedDesignation={selectedDesignation}
        setSelectedDesignation={setSelectedDesignation}
        selectedTrack={selectedTrack}
        setSelectedTrack={setSelectedTrack}
        selectedAnnualType={selectedAnnualType}
        setSelectedAnnualType={setSelectedAnnualType}
        selectedSubDesignation={selectedSubDesignation}
        setSelectedSubDesignation={setSelectedSubDesignation}
        trainings={trainings}
        handleTrainingDragEnd={handleTrainingDragEnd}
        handleRemoveTraining={handleRemoveTraining}
        setShowSearchModal={setShowSearchModal}
        handleAddCustomTraining={handleAddCustomTraining}
        setAssignMode={setAssignMode}
      />

      <SearchTrainingModal
        showSearchModal={showSearchModal}
        setShowSearchModal={setShowSearchModal}
        selectedDesignation={selectedDesignation}
        selectedTrack={selectedTrack}
        selectedAnnualType={selectedAnnualType}
        assignMode={assignMode}
        setAssignMode={setAssignMode}
        searchTrainingQuery={searchTrainingQuery}
        setSearchTrainingQuery={setSearchTrainingQuery}
        filteredAllTrainings={filteredAllTrainings}
        learningPaths={learningPaths}
        handleAssignTraining={handleAssignTraining}
      />

      <DesignationFormModal
        showForm={showForm}
        setShowForm={setShowForm}
        resetForm={resetForm}
        editingId={editingId}
        formData={formData}
        setFormData={setFormData}
        designationNames={designationNames}
        setDesignationNames={setDesignationNames}
        handleSubmit={handleSubmit}
      />

      <LearningPathManagementModal
        showLearningPathModal={showLearningPathModal}
        setShowLearningPathModal={setShowLearningPathModal}
        setShowLPCreationModal={setShowLPCreationModal}
        fetchAllTrainings={fetchAllTrainings}
        fetchLearningDecks={fetchLearningDecks}
        learningPaths={learningPaths}
      />

      <LearningPathCreationModal
        showLPCreationModal={showLPCreationModal}
        setShowLPCreationModal={setShowLPCreationModal}
        newLPData={newLPData}
        setNewLPData={setNewLPData}
        allTrainings={allTrainings}
        lpSelectedTrainings={lpSelectedTrainings}
        setLpSelectedTrainings={setLpSelectedTrainings}
        handleCreateLearningPath={handleCreateLearningPath}
        learningDecks={learningDecks}
      />
    </div>
  );
}
