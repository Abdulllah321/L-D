"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  ArrowLeft,
  Save,
  Calendar,
  Users,
  Target,
  Clock,
  Plus,
  Trash2,
  X,
  Layers
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/components/ui/toast";

interface TrainingDay {
  day: number;
  heading?: string; // Top-level heading (groups multiple main topics)
  mainTopic?: string; // Main topic/heading (e.g., "Basics of IB & Economic Model")
  topic: string; // Sub-topic or activity name
  time: string; // Time range (e.g., "09:00 - 09:30")
  duration?: string; // Optional separate duration field
  isBreak?: boolean;
  breakType?: 'lunch' | 'tea' | 'Other Activity';
  isQuiz?: boolean; // Quiz type item
  isCertificateDistribution?: boolean; // Certificate Distribution & Group Photo type
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
  isHalfDay?: boolean; // Whether this is a half-day training
  competencies: {
    functional?: string[];
    core?: string[];
    leadership?: string[];
  };
  outcomesBenefits: string;
  frequency: string;
  assessmentFollowUp: string;
  reviewDate?: string;
  schedule: TrainingDay[];
}

export default function CreateTrainingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeDay, setActiveDay] = useState(1);
  const [selectedDays, setSelectedDays] = useState<number[]>([1]); // Multi-day selection
  const [formData, setFormData] = useState<Partial<Training>>({
    programTitle: "",
    programObjective: "",
    trainingPartner: "",
    targetAudience: "",
    durationFormat: "",
    isHalfDay: false,
    competencies: { functional: [], core: [], leadership: [] },
    outcomesBenefits: "",
    frequency: "",
    assessmentFollowUp: "",
    reviewDate: "",
    schedule: [],
  });
  const [currentScheduleItem, setCurrentScheduleItem] = useState<Partial<TrainingDay>>({
    day: activeDay,
    heading: "",
    mainTopic: "",
    topic: "",
    time: "",
    duration: "",
    isBreak: false,
    breakType: undefined,
    isQuiz: false,
    isCertificateDistribution: false,
    presenters: { north: "", centralI: "", centralII: "", south: "" },
    notes: "",
    order: 0,
  });

  // Sync currentScheduleItem.day with activeDay
  useEffect(() => {
    setCurrentScheduleItem(prev => ({ ...prev, day: activeDay }));
    // Only add activeDay to selectedDays if no days are selected, don't reset existing selections
    setSelectedDays(prev => {
      if (prev.length === 0) {
        return [activeDay];
      } else if (!prev.includes(activeDay)) {
        // Add activeDay to selectedDays without removing others
        return [...prev, activeDay];
      }
      return prev; // Keep existing selections
    });
  }, [activeDay]);

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      setEditingId(id);
      setIsFetching(true);
      fetchTraining(id).finally(() => setIsFetching(false));
    } else {
      setIsLoading(false);
    }
  }, [searchParams]);

  const fetchTraining = async (id: string) => {
    try {
      const response = await fetch(`/api/trainings/${id}`, {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        const training = data.training || data;
        
        console.log("Fetched training:", training); // Debug log
        
        // Ensure all fields are properly set with defaults
        setFormData({
          programTitle: training.programTitle || "",
          programObjective: training.programObjective || "",
          trainingPartner: training.trainingPartner || "",
          targetAudience: training.targetAudience || "",
          durationFormat: training.durationFormat || "",
          isHalfDay: training.isHalfDay || false,
          competencies: {
            functional: Array.isArray(training.competencies?.functional) 
              ? training.competencies.functional 
              : [],
            core: Array.isArray(training.competencies?.core) 
              ? training.competencies.core 
              : [],
            leadership: Array.isArray(training.competencies?.leadership) 
              ? training.competencies.leadership 
              : [],
          },
          outcomesBenefits: training.outcomesBenefits || "",
          frequency: training.frequency || "",
          assessmentFollowUp: training.assessmentFollowUp || "",
          reviewDate: training.reviewDate || "",
          schedule: Array.isArray(training.schedule) ? training.schedule : [],
        });
        
        if (training.schedule && training.schedule.length > 0) {
          const maxDay = Math.max(...training.schedule.map((s: TrainingDay) => s.day || 1));
          setActiveDay(maxDay);
        }
      } else {
        const errorData = await response.json();
        showToast(errorData.error || "Failed to load training", "error");
      }
    } catch (error) {
      console.error("Error fetching training:", error);
      showToast("Failed to load training", "error");
    }
  };

  // Handle Enter key in schedule form to add item instead of submitting
  const handleScheduleFormKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      addScheduleItem();
    }
  };

  // Handle Enter in textarea (allow Shift+Enter for new lines)
  const handleScheduleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      addScheduleItem();
    }
  };

  // Handle Ctrl+Enter or Cmd+Enter to submit the form
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        const form = document.querySelector('form') as HTMLFormElement;
        if (form && !isLoading) {
          // Create a synthetic submit event
          const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement;
          if (submitButton && !submitButton.disabled) {
            submitButton.click();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = editingId ? `/api/trainings/${editingId}` : "/api/trainings";
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        showToast(
          editingId ? "Training updated successfully" : "Training created successfully",
          "success"
        );
        setTimeout(() => {
          router.push("/admin/trainings");
        }, 1000);
      } else {
        const data = await response.json();
        showToast(data.error || "Operation failed", "error");
      }
    } catch (error) {
      console.error("Error saving training:", error);
      showToast("Failed to save training", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const addScheduleItem = () => {
    // For quiz and certificate distribution items, only time is required
    if (!currentScheduleItem.time) {
      showToast("Please fill in time", "warning");
      return;
    }
    
    // For non-quiz, non-break, and non-certificate items, topic is required
    if (!currentScheduleItem.isQuiz && !currentScheduleItem.isBreak && !currentScheduleItem.isCertificateDistribution && !currentScheduleItem.topic) {
      showToast("Please fill in topic/activity and time", "warning");
      return;
    }
    
    // For break items, topic (label) is required
    if (currentScheduleItem.isBreak && !currentScheduleItem.topic) {
      showToast("Please fill in break label and time", "warning");
      return;
    }

    const schedule = formData.schedule || [];
    const daysToAdd = selectedDays.length > 0 ? selectedDays : [activeDay];
    const newItems: TrainingDay[] = [];

    // Create items for all selected days
    daysToAdd.forEach(dayNumber => {
      const dayItems = schedule.filter(item => item.day === dayNumber);
      const order = dayItems.length;

      const newItem: TrainingDay = {
        day: dayNumber,
        heading: currentScheduleItem.heading?.trim() || undefined,
        mainTopic: currentScheduleItem.mainTopic?.trim() || undefined,
        topic: currentScheduleItem.topic || (currentScheduleItem.isQuiz ? "Quiz" : currentScheduleItem.isCertificateDistribution ? "Certificate Distribution & Group Photo" : ""),
        time: currentScheduleItem.time || "",
        duration: currentScheduleItem.duration?.trim() || undefined,
        isBreak: currentScheduleItem.isBreak || false,
        breakType: currentScheduleItem.breakType,
        isQuiz: currentScheduleItem.isQuiz || false,
        isCertificateDistribution: currentScheduleItem.isCertificateDistribution || false,
        presenters: currentScheduleItem.presenters || {},
        notes: currentScheduleItem.notes || "",
        order: order,
      };

      newItems.push(newItem);
    });

    // Add new items and sort by day first, then by time within each day
    const updatedSchedule = [...schedule, ...newItems].sort((a, b) => {
      if (a.day !== b.day) return a.day - b.day;
      // Sort by time within the same day
      const timeA = parseTimeForSort(a.time);
      const timeB = parseTimeForSort(b.time);
      return timeA - timeB;
    });

    setFormData({
      ...formData,
      schedule: updatedSchedule,
    });

    // Only clear topic/activity, break, quiz, and certificate fields (keep heading and mainTopic for convenience)
    setCurrentScheduleItem({
      ...currentScheduleItem,
      topic: "",
      isBreak: false,
      breakType: undefined,
      isQuiz: false,
      isCertificateDistribution: false,
    });

    const dayText = daysToAdd.length > 1 
      ? `Days ${daysToAdd.sort((a, b) => a - b).join(", ")}` 
      : `Day ${daysToAdd[0]}`;
    showToast(`Schedule item added successfully to ${dayText}`, "success");
  };

  const removeScheduleItem = (index: number) => {
    const newSchedule = formData.schedule?.filter((_, i) => i !== index) || [];
    setFormData({ ...formData, schedule: newSchedule });
    showToast("Schedule item removed", "info");
  };

  // Parse time string to get start time for sorting
  const parseTimeForSort = (timeString: string): number => {
    if (!timeString) return 9999; // Put items without time at the end
    
    // Extract start time from "HH:MM - HH:MM" or "HH:MM am/pm - HH:MM am/pm"
    const parts = timeString.split(" - ");
    const startTimeStr = parts[0]?.trim() || "";
    
    if (!startTimeStr) return 9999;
    
    // Try 24h format first
    const time24hMatch = startTimeStr.match(/^(\d{1,2}):(\d{2})$/);
    if (time24hMatch) {
      const hour = parseInt(time24hMatch[1]);
      const minutes = parseInt(time24hMatch[2]);
      if (hour >= 0 && hour < 24 && minutes >= 0 && minutes < 60) {
        return hour * 60 + minutes;
      }
    }
    
    // Try 12h format
    const match = startTimeStr.match(/(\d{1,2}):(\d{2})\s*(am|pm)/i);
    if (!match) return 9999;
    
    let hour = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    const ampm = match[3]?.toLowerCase();
    
    // Convert to 24h format
    if (ampm === "pm" && hour !== 12) hour += 12;
    if (ampm === "am" && hour === 12) hour = 0;
    
    return hour * 60 + minutes; // Convert to minutes for easy comparison
  };

  const getScheduleByDay = () => {
    const schedule = formData.schedule || [];
    const grouped: { [key: number]: TrainingDay[] } = {};
    schedule.forEach(item => {
      if (!grouped[item.day]) {
        grouped[item.day] = [];
      }
      grouped[item.day].push(item);
    });
    // Sort by time (start time) within each day
    Object.keys(grouped).forEach(day => {
      grouped[parseInt(day)].sort((a, b) => {
        const timeA = parseTimeForSort(a.time);
        const timeB = parseTimeForSort(b.time);
        return timeA - timeB;
      });
    });
    return grouped;
  };

  const getScheduleByHeadingAndMainTopic = (dayItems: TrainingDay[]) => {
    // First level: group by heading
    const byHeading: { [key: string]: TrainingDay[] } = {};
    let noHeading: TrainingDay[] = [];
    
    dayItems.forEach(item => {
      if (item.heading && item.heading.trim()) {
        const headingKey = item.heading.trim();
        if (!byHeading[headingKey]) {
          byHeading[headingKey] = [];
        }
        byHeading[headingKey].push(item);
      } else {
        noHeading.push(item);
      }
    });
    
    // Second level: within each heading, group by main topic
    const result: { 
      [heading: string]: { 
        grouped: { [mainTopic: string]: TrainingDay[] }, 
        noMainTopic: TrainingDay[] 
      } 
    } = {};
    
    Object.keys(byHeading).forEach(heading => {
      const items = byHeading[heading];
      const grouped: { [key: string]: TrainingDay[] } = {};
      let noMainTopic: TrainingDay[] = [];
      
      items.forEach(item => {
        if (item.mainTopic && item.mainTopic.trim()) {
          const key = item.mainTopic.trim();
          if (!grouped[key]) {
            grouped[key] = [];
          }
          grouped[key].push(item);
        } else {
          noMainTopic.push(item);
        }
      });
      
      result[heading] = { grouped, noMainTopic };
    });
    
    // Handle items without heading
    const noHeadingGrouped: { [key: string]: TrainingDay[] } = {};
    let noHeadingNoMainTopic: TrainingDay[] = [];
    
    noHeading.forEach(item => {
      if (item.mainTopic && item.mainTopic.trim()) {
        const key = item.mainTopic.trim();
        if (!noHeadingGrouped[key]) {
          noHeadingGrouped[key] = [];
        }
        noHeadingGrouped[key].push(item);
      } else {
        noHeadingNoMainTopic.push(item);
      }
    });
    
    return { 
      byHeading: result, 
      noHeading: { grouped: noHeadingGrouped, noMainTopic: noHeadingNoMainTopic }
    };
  };

  const scheduleByDay = getScheduleByDay();
  const availableDays = Object.keys(scheduleByDay).map(Number).sort((a, b) => a - b);
  const maxDay = availableDays.length > 0 ? Math.max(...availableDays) : 1;
  const allDays = Array.from({ length: Math.max(maxDay, activeDay) }, (_, i) => i + 1);

  if (isFetching) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 mb-2">Loading training data...</div>
          <div className="text-sm text-gray-400">Please wait</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/trainings"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {editingId ? "Edit Training" : "Create New Training"}
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                {editingId ? "Update training program details" : "Add a new training program to the catalog"}
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <section className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Target className="w-5 h-5 text-teal-600" />
              Program Overview
            </h2>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Program Title *
              </label>
              <input
                type="text"
                value={formData.programTitle}
                onChange={(e) =>
                  setFormData({ ...formData, programTitle: e.target.value })
                }
                placeholder="e.g., Trainee Branch Service Ambassador Program"
                className="w-full px-4 py-3 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Program Objective *
              </label>
              <textarea
                value={formData.programObjective}
                onChange={(e) =>
                  setFormData({ ...formData, programObjective: e.target.value })
                }
                rows={3}
                placeholder="Describe the program objective..."
                className="w-full px-4 py-3 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Training Partner *
                </label>
                <input
                  type="text"
                  value={formData.trainingPartner}
                  onChange={(e) =>
                    setFormData({ ...formData, trainingPartner: e.target.value })
                  }
                  placeholder="e.g., Circle Women - Sadaffe Abid"
                  className="w-full px-4 py-3 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Target Audience *
                </label>
                <input
                  type="text"
                  value={formData.targetAudience}
                  onChange={(e) =>
                    setFormData({ ...formData, targetAudience: e.target.value })
                  }
                  placeholder="e.g., Service Ambassadors"
                  className="w-full px-4 py-3 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Duration & Format *
                </label>
                <input
                  type="text"
                  value={formData.durationFormat}
                  onChange={(e) =>
                    setFormData({ ...formData, durationFormat: e.target.value })
                  }
                  placeholder="e.g., 4 Weeks Classroom & Projects"
                  className="w-full px-4 py-3 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Frequency *
                </label>
                <input
                  type="text"
                  value={formData.frequency}
                  onChange={(e) =>
                    setFormData({ ...formData, frequency: e.target.value })
                  }
                  placeholder="e.g., Once a Year"
                  className="w-full px-4 py-3 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isHalfDay || false}
                  onChange={(e) =>
                    setFormData({ ...formData, isHalfDay: e.target.checked })
                  }
                  className="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500 focus:ring-2"
                />
                <span className="text-sm font-semibold text-gray-700">
                  Half Day Training
                </span>
              </label>
              <p className="text-xs text-gray-500 mt-1 ml-8">
                Check this if the training is conducted in half a day instead of a full day
              </p>
            </div>
          </section>

          {/* Competencies */}
          <section className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-teal-600" />
              Competencies & Skills
            </h2>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Functional
                </label>
                <textarea
                  value={(formData.competencies?.functional || []).join(", ")}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      competencies: {
                        ...formData.competencies,
                        functional: e.target.value.split(",").map(s => s.trim()).filter(s => s),
                      },
                    })
                  }
                  rows={3}
                  placeholder="Comma-separated"
                  className="w-full px-4 py-3 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Core
                </label>
                <textarea
                  value={(formData.competencies?.core || []).join(", ")}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      competencies: {
                        ...formData.competencies,
                        core: e.target.value.split(",").map(s => s.trim()).filter(s => s),
                      },
                    })
                  }
                  rows={3}
                  placeholder="Comma-separated"
                  className="w-full px-4 py-3 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Leadership
                </label>
                <textarea
                  value={(formData.competencies?.leadership || []).join(", ")}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      competencies: {
                        ...formData.competencies,
                        leadership: e.target.value.split(",").map(s => s.trim()).filter(s => s),
                      },
                    })
                  }
                  rows={3}
                  placeholder="Comma-separated"
                  className="w-full px-4 py-3 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                />
              </div>
            </div>
          </section>

          {/* Outcomes & Assessment */}
          <section className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Target className="w-5 h-5 text-teal-600" />
              Outcomes & Assessment
            </h2>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Outcomes & Benefits *
              </label>
              <textarea
                value={formData.outcomesBenefits}
                onChange={(e) =>
                  setFormData({ ...formData, outcomesBenefits: e.target.value })
                }
                rows={2}
                placeholder="Describe expected outcomes..."
                className="w-full px-4 py-3 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Assessment & Follow-Up *
                </label>
                <input
                  type="text"
                  value={formData.assessmentFollowUp}
                  onChange={(e) =>
                    setFormData({ ...formData, assessmentFollowUp: e.target.value })
                  }
                  placeholder="e.g., Final Exam & Branch Rotation Feedback"
                  className="w-full px-4 py-3 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Review Date
                </label>
                <input
                  type="text"
                  value={formData.reviewDate}
                  onChange={(e) =>
                    setFormData({ ...formData, reviewDate: e.target.value })
                  }
                  placeholder="e.g., Sep-25"
                  className="w-full px-4 py-3 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>
          </section>

          {/* Schedule Builder */}
          <section className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-teal-600" />
                Training Schedule
              </h2>
            </div>

            {/* Day Selection & Merge Section */}
            <div className="space-y-4">
              {/* Instructions */}
              <div className="bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Layers className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">Merge Days - Add Same Schedule to Multiple Days</h4>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">How to merge:</span> Check the boxes next to the days you want to merge (e.g., Day 3, 4, 5). 
                      Fill in the schedule details below, then click "Add to Schedule". The same content will be added to all selected days.
                    </p>
                  </div>
                </div>
              </div>

              {/* Day Tabs with Checkboxes */}
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-gray-700">Select Days to Merge:</label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (selectedDays.length === allDays.length) {
                          setSelectedDays([]);
                        } else {
                          setSelectedDays([...allDays]);
                        }
                      }}
                      className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                    >
                      {selectedDays.length === allDays.length ? "Clear All" : "Select All"}
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {allDays.map((day) => (
                    <div key={day} className="flex items-center gap-2 bg-white border-2 rounded-xl p-2 transition-all hover:shadow-md"
                      style={{
                        borderColor: selectedDays.includes(day) 
                          ? (activeDay === day ? '#0d9488' : '#14b8a6') 
                          : '#e5e7eb'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedDays.includes(day)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedDays([...selectedDays, day]);
                          } else {
                            setSelectedDays(selectedDays.filter(d => d !== day));
                          }
                          setActiveDay(day);
                          setCurrentScheduleItem(prev => ({ ...prev, day, time: prev.time || "" }));
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-5 h-5 text-teal-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-teal-500 cursor-pointer"
                        title={`Select Day ${day} for merging`}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setActiveDay(day);
                          if (!selectedDays.includes(day)) {
                            setSelectedDays([...selectedDays, day]);
                          }
                          setCurrentScheduleItem(prev => ({ ...prev, day, time: prev.time || "" }));
                        }}
                        className={`px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-all ${
                          activeDay === day
                            ? "bg-teal-600 text-white shadow-lg"
                            : selectedDays.includes(day)
                            ? "bg-teal-100 text-teal-800 hover:bg-teal-200"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        Day {day}
                        {scheduleByDay[day] && (
                          <span className="ml-2 text-xs opacity-75">
                            ({scheduleByDay[day].length})
                          </span>
                        )}
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      const newDay = allDays.length + 1;
                      setActiveDay(newDay);
                      setSelectedDays([newDay]);
                      setCurrentScheduleItem(prev => ({ ...prev, day: newDay, time: prev.time || "" }));
                    }}
                    className="px-4 py-2 rounded-xl font-medium text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all flex items-center gap-2 border-2 border-dashed border-gray-300"
                  >
                    <Plus className="w-4 h-4" />
                    Add Day
                  </button>
                </div>
              </div>

              {/* Multi-day Merge Indicator */}
              {selectedDays.length > 1 && (
                <div className="bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-xl p-4 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 rounded-lg p-2">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-lg mb-1">Merging {selectedDays.length} Days</div>
                      <div className="text-sm opacity-95">
                        The schedule item below will be added to: <span className="font-bold">Day {selectedDays.sort((a, b) => a - b).join(", ")}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedDays([activeDay])}
                      className="bg-white/20 hover:bg-white/30 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors"
                    >
                      Clear Merge
                    </button>
                  </div>
                </div>
              )}
              {selectedDays.length === 1 && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-600">
                  <span className="font-medium">Single Day Mode:</span> Schedule item will be added to Day {activeDay} only. 
                  <button
                    type="button"
                    onClick={() => {
                      // Suggest selecting another day
                      const nextDay = activeDay + 1;
                      if (allDays.includes(nextDay)) {
                        setSelectedDays([activeDay, nextDay]);
                      }
                    }}
                    className="ml-2 text-teal-600 hover:text-teal-700 font-medium underline"
                  >
                    Want to merge? Select another day above.
                  </button>
                </div>
              )}
            </div>

            {/* Add Schedule Item Form */}
            <div className="bg-gray-50 border-2 border-gray-300 rounded-xl p-6 space-y-4"
              style={{
                borderColor: selectedDays.length > 1 ? '#14b8a6' : '#d1d5db'
              }}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-gray-900">
                  {selectedDays.length > 1 ? (
                    <span className="text-teal-600">
                      📋 Add Schedule to {selectedDays.length} Days: {selectedDays.sort((a, b) => a - b).join(", ")}
                    </span>
                  ) : (
                    `Add Schedule Item - Day ${activeDay}`
                  )}
                </h3>
                {selectedDays.length > 1 && (
                  <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-xs font-bold">
                    MERGE MODE
                  </span>
                )}
              </div>
              {selectedDays.length > 1 && (
                <p className="text-sm text-gray-600 bg-teal-50 border border-teal-200 rounded-lg p-3">
                  💡 <span className="font-semibold">Tip:</span> Fill in the fields below and click "Add to Schedule". 
                  This same content will be automatically added to all {selectedDays.length} selected days.
                </p>
              )}
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Heading (Optional)
                </label>
                <input
                  type="text"
                  value={currentScheduleItem.heading || ""}
                  onChange={(e) =>
                    setCurrentScheduleItem({ ...currentScheduleItem, heading: e.target.value })
                  }
                  onKeyDown={handleScheduleFormKeyDown}
                  placeholder="e.g., Module 1: Foundation"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Top-level grouping for multiple main topics</p>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Main Topic (Optional)
                </label>
                <input
                  type="text"
                  value={currentScheduleItem.mainTopic || ""}
                  onChange={(e) =>
                    setCurrentScheduleItem({ ...currentScheduleItem, mainTopic: e.target.value })
                  }
                  onKeyDown={handleScheduleFormKeyDown}
                  placeholder="e.g., Basics of IB & Economic Model"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Group related sub-topics under a main topic (can be under a heading)</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Time *
                  </label>
                  <input
                    type="text"
                    value={currentScheduleItem.time || ""}
                    onChange={(e) =>
                      setCurrentScheduleItem({ ...currentScheduleItem, time: e.target.value })
                    }
                    onKeyDown={handleScheduleFormKeyDown}
                    placeholder="e.g., 09:30 am - 01:00 pm"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Duration (Optional)
                  </label>
                  <input
                    type="text"
                    value={currentScheduleItem.duration || ""}
                    onChange={(e) =>
                      setCurrentScheduleItem({ ...currentScheduleItem, duration: e.target.value })
                    }
                    onKeyDown={handleScheduleFormKeyDown}
                    placeholder="e.g., 4 hours"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Item Type
                  </label>
                  <select
                    value={
                      currentScheduleItem.isQuiz 
                        ? 'quiz' 
                        : currentScheduleItem.isCertificateDistribution
                        ? 'certificate'
                        : currentScheduleItem.isBreak 
                        ? (currentScheduleItem.breakType || 'lunch') 
                        : ''
                    }
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === 'quiz') {
                        setCurrentScheduleItem({
                          ...currentScheduleItem,
                          isQuiz: true,
                          isBreak: false,
                          isCertificateDistribution: false,
                          breakType: undefined,
                        });
                      } else if (value === 'certificate') {
                        setCurrentScheduleItem({
                          ...currentScheduleItem,
                          isCertificateDistribution: true,
                          isBreak: false,
                          isQuiz: false,
                          breakType: undefined,
                        });
                      } else if (value === 'lunch' || value === 'tea' || value === 'Other Activity') {
                        setCurrentScheduleItem({
                          ...currentScheduleItem,
                          isBreak: true,
                          isQuiz: false,
                          isCertificateDistribution: false,
                          breakType: value as 'lunch' | 'tea' | 'Other Activity',
                        });
                      } else {
                        setCurrentScheduleItem({
                          ...currentScheduleItem,
                          isBreak: false,
                          isQuiz: false,
                          isCertificateDistribution: false,
                          breakType: undefined,
                        });
                      }
                    }}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="">Regular Activity</option>
                    <option value="quiz">Quiz</option>
                    <option value="certificate">Certificate Distribution & Group Photo</option>
                    <option value="lunch">Lunch Break</option>
                    <option value="tea">Tea Break</option>
                    <option value="Other Activity">Other Activity</option>
                  </select>
                </div>
              </div>

              {!currentScheduleItem.isBreak && !currentScheduleItem.isQuiz && !currentScheduleItem.isCertificateDistribution && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      Topic/Activity *
                    </label>
                    <input
                      type="text"
                      value={currentScheduleItem.topic || ""}
                      onChange={(e) =>
                        setCurrentScheduleItem({ ...currentScheduleItem, topic: e.target.value })
                      }
                      onKeyDown={handleScheduleFormKeyDown}
                      placeholder="e.g., Introduction and Importance of BOE Policy"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">
                        Presenter - North
                      </label>
                      <input
                        type="text"
                        value={currentScheduleItem.presenters?.north || ""}
                        onChange={(e) =>
                          setCurrentScheduleItem({
                            ...currentScheduleItem,
                            presenters: {
                              ...currentScheduleItem.presenters,
                              north: e.target.value,
                            },
                          })
                        }
                        onKeyDown={handleScheduleFormKeyDown}
                        placeholder="e.g., Zubia Shehryar"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">
                        Presenter - Central I
                      </label>
                      <input
                        type="text"
                        value={currentScheduleItem.presenters?.centralI || ""}
                        onChange={(e) =>
                          setCurrentScheduleItem({
                            ...currentScheduleItem,
                            presenters: {
                              ...currentScheduleItem.presenters,
                              centralI: e.target.value,
                            },
                          })
                        }
                        onKeyDown={handleScheduleFormKeyDown}
                        placeholder="e.g., Habiba Sulman"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">
                        Presenter - Central II
                      </label>
                      <input
                        type="text"
                        value={currentScheduleItem.presenters?.centralII || ""}
                        onChange={(e) =>
                          setCurrentScheduleItem({
                            ...currentScheduleItem,
                            presenters: {
                              ...currentScheduleItem.presenters,
                              centralII: e.target.value,
                            },
                          })
                        }
                        onKeyDown={handleScheduleFormKeyDown}
                        placeholder="e.g., Saba Noor"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">
                        Presenter - South
                      </label>
                      <input
                        type="text"
                        value={currentScheduleItem.presenters?.south || ""}
                        onChange={(e) =>
                          setCurrentScheduleItem({
                            ...currentScheduleItem,
                            presenters: {
                              ...currentScheduleItem.presenters,
                              south: e.target.value,
                            },
                          })
                        }
                        onKeyDown={handleScheduleFormKeyDown}
                        placeholder="e.g., Junella"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </>
              )}

              {currentScheduleItem.isBreak && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Break Label *
                  </label>
                  <input
                    type="text"
                    value={currentScheduleItem.topic || ""}
                    onChange={(e) =>
                      setCurrentScheduleItem({ ...currentScheduleItem, topic: e.target.value })
                    }
                    onKeyDown={handleScheduleFormKeyDown}
                    placeholder="e.g., Lunch Break"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              )}

              {currentScheduleItem.isQuiz && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Quiz Title (Optional)
                  </label>
                  <input
                    type="text"
                    value={currentScheduleItem.topic || ""}
                    onChange={(e) =>
                      setCurrentScheduleItem({ ...currentScheduleItem, topic: e.target.value })
                    }
                    onKeyDown={handleScheduleFormKeyDown}
                    placeholder="e.g., Quiz about Day-01 contents"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Leave empty to use default "Quiz" label</p>
                </div>
              )}

              {currentScheduleItem.isCertificateDistribution && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Title (Optional)
                  </label>
                  <input
                    type="text"
                    value={currentScheduleItem.topic || ""}
                    onChange={(e) =>
                      setCurrentScheduleItem({ ...currentScheduleItem, topic: e.target.value })
                    }
                    onKeyDown={handleScheduleFormKeyDown}
                    placeholder="e.g., Certificate Distribution & Group Photo"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Leave empty to use default "Certificate Distribution & Group Photo" label</p>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Notes
                </label>
                <textarea
                  value={currentScheduleItem.notes || ""}
                  onChange={(e) =>
                    setCurrentScheduleItem({ ...currentScheduleItem, notes: e.target.value })
                  }
                  onKeyDown={handleScheduleTextareaKeyDown}
                  rows={2}
                  placeholder="Additional notes... (Shift+Enter for new line, Enter to add)"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={addScheduleItem}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-teal-600 rounded-xl hover:bg-teal-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add to Schedule
                </button>
                <span className="text-xs text-gray-500 whitespace-nowrap">
                  or press Enter
                </span>
              </div>
            </div>

            {/* Schedule Display by Day */}
            {availableDays.length > 0 && (
              <div className="space-y-4">
                {availableDays.map((day) => {
                  const dayItems = scheduleByDay[day];
                  return (
                    <div
                      key={day}
                      className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden"
                    >
                      <div className="bg-gradient-to-r from-teal-50 to-blue-50 px-5 py-3 border-b border-gray-200">
                        <h4 className="text-base font-bold text-gray-900">Day {day}</h4>
                      </div>
                      <div className="p-4 space-y-4">
                        {(() => {
                          const { byHeading, noHeading } = getScheduleByHeadingAndMainTopic(dayItems);
                          const headings = Object.keys(byHeading);
                          
                          return (
                            <>
                              {/* Items grouped by heading, then by main topic */}
                              {headings.map((heading) => {
                                const { grouped, noMainTopic } = byHeading[heading];
                                const mainTopics = Object.keys(grouped);
                                
                                return (
                                  <div key={heading} className="space-y-3">
                                    {/* Heading */}
                                    <h3 className="text-base font-bold text-blue-800 border-l-4 border-blue-600 pl-3 py-2 bg-blue-50 rounded-lg">
                                      {heading}
                                    </h3>
                                    
                                    {/* Main topics under this heading */}
                                    {mainTopics.map((mainTopic) => (
                                      <div key={`${heading}-${mainTopic}`} className="ml-4 space-y-2">
                                        <h4 className="text-sm font-bold text-teal-700 border-l-4 border-teal-500 pl-2 py-1 bg-teal-50 rounded">
                                          {mainTopic}
                                        </h4>
                                        {grouped[mainTopic].map((item, idx) => {
                                          const scheduleIndex = formData.schedule?.findIndex(
                                            (s) => s.day === item.day && s.topic === item.topic && s.time === item.time && s.mainTopic === item.mainTopic && s.heading === item.heading
                                          ) || 0;
                                          return (
                                            <div
                                              key={`${heading}-${mainTopic}-${idx}`}
                                            className={`ml-4 p-3 rounded-lg border ${
                                              item.isBreak
                                                ? 'bg-yellow-50 border-yellow-200'
                                                : item.isQuiz
                                                ? 'bg-purple-50 border-purple-200'
                                                : item.isCertificateDistribution
                                                ? 'bg-amber-50 border-amber-300'
                                                : 'bg-white border-gray-200'
                                            }`}
                                          >
                                            <div className="flex items-start justify-between gap-3">
                                              <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-1">
                                                  <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                                    {item.time}
                                                  </span>
                                                  {item.duration && (
                                                    <span className="text-xs text-gray-500">({item.duration})</span>
                                                  )}
                                                  {item.isBreak && (
                                                    <span className="text-xs font-semibold text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded">
                                                      {item.breakType === 'lunch' ? '🍽️ Lunch' : item.breakType === 'tea' ? '☕ Tea' : item.breakType === 'Other Activity' ? '⏸️ Other Activity' : '⏸️ Break'}
                                                    </span>
                                                  )}
                                                  {item.isQuiz && (
                                                    <span className="text-xs font-semibold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                                                      📝 Quiz
                                                    </span>
                                                  )}
                                                  {item.isCertificateDistribution && (
                                                    <span className="text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                                                      🏆 Certificate & Photo
                                                    </span>
                                                  )}
                                                </div>
                                                <h5 className={`text-sm font-semibold ${
                                                  item.isBreak 
                                                    ? 'text-yellow-800' 
                                                    : item.isQuiz 
                                                    ? 'text-purple-800' 
                                                    : item.isCertificateDistribution
                                                    ? 'text-amber-800'
                                                    : 'text-gray-900'
                                                }`}>
                                                  {item.topic}
                                                </h5>
                                                {!item.isBreak && !item.isQuiz && !item.isCertificateDistribution && (
                                                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                                                    {item.presenters?.north && (
                                                      <p className="text-gray-600">
                                                        <span className="font-medium">North:</span> {item.presenters.north}
                                                      </p>
                                                    )}
                                                    {item.presenters?.centralI && (
                                                      <p className="text-gray-600">
                                                        <span className="font-medium">Central I:</span> {item.presenters.centralI}
                                                      </p>
                                                    )}
                                                    {item.presenters?.centralII && (
                                                      <p className="text-gray-600">
                                                        <span className="font-medium">Central II:</span> {item.presenters.centralII}
                                                      </p>
                                                    )}
                                                    {item.presenters?.south && (
                                                      <p className="text-gray-600">
                                                        <span className="font-medium">South:</span> {item.presenters.south}
                                                      </p>
                                                    )}
                                                  </div>
                                                )}
                                                {item.notes && (
                                                  <p className="text-xs text-gray-500 mt-2 italic">{item.notes}</p>
                                                )}
                                              </div>
                                              <button
                                                type="button"
                                                onClick={() => removeScheduleItem(scheduleIndex)}
                                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                                              >
                                                <Trash2 className="w-4 h-4" />
                                              </button>
                                            </div>
                                          </div>
                                          );
                                        })}
                                      </div>
                                    ))}
                                    
                                    {/* Items without main topic under this heading */}
                                    {noMainTopic.length > 0 && (
                                      <div className="ml-4 space-y-2">
                                        {noMainTopic.map((item, idx) => {
                                          const scheduleIndex = formData.schedule?.findIndex(
                                            (s) => s.day === item.day && s.topic === item.topic && s.time === item.time && !s.mainTopic && s.heading === item.heading
                                          ) || 0;
                                          return (
                                            <div
                                              key={`${heading}-no-topic-${idx}`}
                                              className={`p-3 rounded-lg border ${
                                                item.isBreak
                                                  ? 'bg-yellow-50 border-yellow-200'
                                                  : item.isQuiz
                                                  ? 'bg-purple-50 border-purple-200'
                                                  : item.isCertificateDistribution
                                                  ? 'bg-amber-50 border-amber-300'
                                                  : 'bg-white border-gray-200'
                                              }`}
                                            >
                                              <div className="flex items-start justify-between gap-3">
                                                <div className="flex-1">
                                                  <div className="flex items-center gap-3 mb-1">
                                                    <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                                      {item.time}
                                                    </span>
                                                    {item.duration && (
                                                      <span className="text-xs text-gray-500">({item.duration})</span>
                                                    )}
                                                    {item.isBreak && (
                                                      <span className="text-xs font-semibold text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded">
                                                        {item.breakType === 'lunch' ? '🍽️ Lunch' : item.breakType === 'tea' ? '☕ Tea' : item.breakType === 'Other Activity' ? '⏸️ Other Activity' : '⏸️ Break'}
                                                      </span>
                                                    )}
                                                    {item.isQuiz && (
                                                      <span className="text-xs font-semibold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                                                        📝 Quiz
                                                      </span>
                                                    )}
                                                    {item.isCertificateDistribution && (
                                                      <span className="text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                                                        🏆 Certificate & Photo
                                                      </span>
                                                    )}
                                                  </div>
                                                  <h5 className={`text-sm font-semibold ${
                                                    item.isBreak 
                                                      ? 'text-yellow-800' 
                                                      : item.isQuiz 
                                                      ? 'text-purple-800' 
                                                      : item.isCertificateDistribution
                                                      ? 'text-amber-800'
                                                      : 'text-gray-900'
                                                  }`}>
                                                    {item.topic}
                                                  </h5>
                                                  {!item.isBreak && !item.isQuiz && !item.isCertificateDistribution && (
                                                    <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                                                      {item.presenters?.north && (
                                                        <p className="text-gray-600">
                                                          <span className="font-medium">North:</span> {item.presenters.north}
                                                        </p>
                                                      )}
                                                      {item.presenters?.centralI && (
                                                        <p className="text-gray-600">
                                                          <span className="font-medium">Central I:</span> {item.presenters.centralI}
                                                        </p>
                                                      )}
                                                      {item.presenters?.centralII && (
                                                        <p className="text-gray-600">
                                                          <span className="font-medium">Central II:</span> {item.presenters.centralII}
                                                        </p>
                                                      )}
                                                      {item.presenters?.south && (
                                                        <p className="text-gray-600">
                                                          <span className="font-medium">South:</span> {item.presenters.south}
                                                        </p>
                                                      )}
                                                    </div>
                                                  )}
                                                  {item.notes && (
                                                    <p className="text-xs text-gray-500 mt-2 italic">{item.notes}</p>
                                                  )}
                                                </div>
                                                <button
                                                  type="button"
                                                  onClick={() => removeScheduleItem(scheduleIndex)}
                                                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                                                >
                                                  <Trash2 className="w-4 h-4" />
                                                </button>
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                              
                              {/* Items without heading, grouped by main topic */}
                              {noHeading.grouped && Object.keys(noHeading.grouped).length > 0 && (
                                <div className="space-y-3">
                                  {Object.keys(noHeading.grouped).map((mainTopic) => (
                                    <div key={mainTopic} className="space-y-2">
                                      <h4 className="text-sm font-bold text-teal-700 border-l-4 border-teal-500 pl-2 py-1 bg-teal-50 rounded">
                                        {mainTopic}
                                      </h4>
                                      {noHeading.grouped[mainTopic].map((item, idx) => {
                                        const scheduleIndex = formData.schedule?.findIndex(
                                          (s) => s.day === item.day && s.topic === item.topic && s.time === item.time && s.mainTopic === item.mainTopic && !s.heading
                                        ) || 0;
                                        return (
                                          <div
                                            key={`no-heading-${mainTopic}-${idx}`}
                                            className={`ml-4 p-3 rounded-lg border ${
                                              item.isBreak
                                                ? 'bg-yellow-50 border-yellow-200'
                                                : item.isQuiz
                                                ? 'bg-purple-50 border-purple-200'
                                                : item.isCertificateDistribution
                                                ? 'bg-amber-50 border-amber-300'
                                                : 'bg-white border-gray-200'
                                            }`}
                                          >
                                            <div className="flex items-start justify-between gap-3">
                                              <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-1">
                                                  <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                                    {item.time}
                                                  </span>
                                                  {item.duration && (
                                                    <span className="text-xs text-gray-500">({item.duration})</span>
                                                  )}
                                                  {item.isBreak && (
                                                    <span className="text-xs font-semibold text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded">
                                                      {item.breakType === 'lunch' ? '🍽️ Lunch' : item.breakType === 'tea' ? '☕ Tea' : item.breakType === 'Other Activity' ? '⏸️ Other Activity' : '⏸️ Break'}
                                                    </span>
                                                  )}
                                                  {item.isQuiz && (
                                                    <span className="text-xs font-semibold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                                                      📝 Quiz
                                                    </span>
                                                  )}
                                                  {item.isCertificateDistribution && (
                                                    <span className="text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                                                      🏆 Certificate & Photo
                                                    </span>
                                                  )}
                                                </div>
                                                <h5 className={`text-sm font-semibold ${
                                                  item.isBreak 
                                                    ? 'text-yellow-800' 
                                                    : item.isQuiz 
                                                    ? 'text-purple-800' 
                                                    : item.isCertificateDistribution
                                                    ? 'text-amber-800'
                                                    : 'text-gray-900'
                                                }`}>
                                                  {item.topic}
                                                </h5>
                                                {!item.isBreak && !item.isQuiz && !item.isCertificateDistribution && (
                                                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                                                    {item.presenters?.north && (
                                                      <p className="text-gray-600">
                                                        <span className="font-medium">North:</span> {item.presenters.north}
                                                      </p>
                                                    )}
                                                    {item.presenters?.centralI && (
                                                      <p className="text-gray-600">
                                                        <span className="font-medium">Central I:</span> {item.presenters.centralI}
                                                      </p>
                                                    )}
                                                    {item.presenters?.centralII && (
                                                      <p className="text-gray-600">
                                                        <span className="font-medium">Central II:</span> {item.presenters.centralII}
                                                      </p>
                                                    )}
                                                    {item.presenters?.south && (
                                                      <p className="text-gray-600">
                                                        <span className="font-medium">South:</span> {item.presenters.south}
                                                      </p>
                                                    )}
                                                  </div>
                                                )}
                                                {item.notes && (
                                                  <p className="text-xs text-gray-500 mt-2 italic">{item.notes}</p>
                                                )}
                                              </div>
                                              <button
                                                type="button"
                                                onClick={() => removeScheduleItem(scheduleIndex)}
                                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                                              >
                                                <Trash2 className="w-4 h-4" />
                                              </button>
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  ))}
                                </div>
                              )}
                              
                              {/* Items without heading and without main topic */}
                              {noHeading.noMainTopic && noHeading.noMainTopic.length > 0 && (
                                <div className="space-y-2">
                                  {noHeading.noMainTopic.map((item, index) => {
                                    const scheduleIndex = formData.schedule?.findIndex(
                                      (s) => s.day === item.day && s.topic === item.topic && s.time === item.time && !s.mainTopic && !s.heading
                                    ) || 0;
                                    return (
                                      <div
                                        key={`no-heading-no-topic-${index}`}
                                        className={`p-3 rounded-lg border ${
                                          item.isBreak
                                            ? 'bg-yellow-50 border-yellow-200'
                                            : item.isQuiz
                                            ? 'bg-purple-50 border-purple-200'
                                            : item.isCertificateDistribution
                                            ? 'bg-amber-50 border-amber-300'
                                            : 'bg-white border-gray-200'
                                        }`}
                                      >
                                        <div className="flex items-start justify-between gap-3">
                                          <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-1">
                                              <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                                {item.time}
                                              </span>
                                              {item.duration && (
                                                <span className="text-xs text-gray-500">({item.duration})</span>
                                              )}
                                              {item.isBreak && (
                                                <span className="text-xs font-semibold text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded">
                                                  {item.breakType === 'lunch' ? '🍽️ Lunch' : item.breakType === 'tea' ? '☕ Tea' : '⏸️ Break'}
                                                </span>
                                              )}
                                              {item.isQuiz && (
                                                <span className="text-xs font-semibold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                                                  📝 Quiz
                                                </span>
                                              )}
                                              {item.isCertificateDistribution && (
                                                <span className="text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                                                  🏆 Certificate & Photo
                                                </span>
                                              )}
                                            </div>
                                            <h5 className={`text-sm font-semibold ${
                                              item.isBreak 
                                                ? 'text-yellow-800' 
                                                : item.isQuiz 
                                                ? 'text-purple-800' 
                                                : item.isCertificateDistribution
                                                ? 'text-amber-800'
                                                : 'text-gray-900'
                                            }`}>
                                              {item.topic}
                                            </h5>
                                            {!item.isBreak && !item.isQuiz && !item.isCertificateDistribution && (
                                              <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                                                {item.presenters?.north && (
                                                  <p className="text-gray-600">
                                                    <span className="font-medium">North:</span> {item.presenters.north}
                                                  </p>
                                                )}
                                                {item.presenters?.centralI && (
                                                  <p className="text-gray-600">
                                                    <span className="font-medium">Central I:</span> {item.presenters.centralI}
                                                  </p>
                                                )}
                                                {item.presenters?.centralII && (
                                                  <p className="text-gray-600">
                                                    <span className="font-medium">Central II:</span> {item.presenters.centralII}
                                                  </p>
                                                )}
                                                {item.presenters?.south && (
                                                  <p className="text-gray-600">
                                                    <span className="font-medium">South:</span> {item.presenters.south}
                                                  </p>
                                                )}
                                              </div>
                                            )}
                                            {item.notes && (
                                              <p className="text-xs text-gray-500 mt-2 italic">{item.notes}</p>
                                            )}
                                          </div>
                                          <button
                                            type="button"
                                            onClick={() => removeScheduleItem(scheduleIndex)}
                                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                                          >
                                            <Trash2 className="w-4 h-4" />
                                          </button>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Submit Buttons */}
          <div className="flex items-center gap-3 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-teal-600 rounded-xl hover:bg-teal-700 transition-all shadow-sm hover:shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {isLoading ? "Saving..." : editingId ? "Update Training" : "Create Training"}
            </button>
            <span className="text-xs text-gray-500 hidden sm:inline">
              Press Ctrl+Enter to save
            </span>
            <Link
              href="/admin/trainings"
              className="px-6 py-3 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

