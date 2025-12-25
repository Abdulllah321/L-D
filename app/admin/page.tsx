"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Book } from "@solar-icons/react";
import { Plus, Pencil, Trash2 as Trash, LogOut, Lock, X, Check } from "lucide-react";
import { useRouter } from "next/navigation";

interface Designation {
  _id?: string;
  id: string;
  title: string;
  summary: string;
  iconName: string;
  coreTrainings: number;
  refreshers: number;
}

const ICON_OPTIONS = [
  "User",
  "UserId",
  "UserSpeakRounded",
  "UserCheckRounded",
  "Book",
  "BookmarkCircle",
  "Bookmark",
  "Star",
  "Target",
  "Rocket",
];

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [showLogin, setShowLogin] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Designation>>({
    id: "",
    title: "",
    summary: "",
    iconName: "Book",
    coreTrainings: 0,
    refreshers: 0,
  });

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/me", {
        credentials: "include", // Include cookies
      });
      if (response.ok) {
        setIsAuthenticated(true);
        setShowLogin(false);
        fetchDesignations();
      } else {
        setIsAuthenticated(false);
        setShowLogin(true);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setIsAuthenticated(false);
      setShowLogin(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Important for cookies
        body: JSON.stringify(loginData),
      });

      if (response.ok) {
        setIsAuthenticated(true);
        setShowLogin(false);
        fetchDesignations();
      } else {
        const data = await response.json();
        alert(data.error || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please try again.");
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include", // Include cookies
      });
      setIsAuthenticated(false);
      setShowLogin(true);
      setDesignations([]);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const fetchDesignations = async () => {
    try {
      const response = await fetch("/api/designations", {
        credentials: "include", // Include cookies for authenticated requests
      });
      if (response.ok) {
        const data = await response.json();
        setDesignations(data.designations || []);
      }
    } catch (error) {
      console.error("Error fetching designations:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId
        ? `/api/designations/${editingId}`
        : "/api/designations";
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Include cookies for authentication
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
  };

  const handleEdit = (designation: Designation) => {
    setFormData(designation);
    setEditingId(designation.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this designation?")) return;

    try {
      const response = await fetch(`/api/designations/${id}`, {
        method: "DELETE",
        credentials: "include", // Include cookies for authentication
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

  const resetForm = () => {
    setFormData({
      id: "",
      title: "",
      summary: "",
      iconName: "Book",
      coreTrainings: 0,
      refreshers: 0,
    });
    setEditingId(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (showLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-teal-500 to-blue-600 flex items-center justify-center">
              <Lock className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
            Admin Login
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Access the admin dashboard
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                value={loginData.username}
                onChange={(e) =>
                  setLoginData({ ...loginData, username: e.target.value })
                }
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-teal-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-teal-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
            >
              Login
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-teal-500 to-blue-600 flex items-center justify-center">
                <Book className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add Button */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            Designations ({designations.length})
          </h2>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:from-teal-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>Add Designation</span>
          </button>
        </div>

        {/* Designations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <AnimatePresence>
            {designations.map((designation) => (
              <motion.div
                key={designation._id || designation.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                      <Book className="w-6 h-6 text-gray-700" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {designation.id}
                      </span>
                      <h3 className="text-lg font-bold text-gray-900 mt-1">
                        {designation.title}
                      </h3>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {designation.summary}
                </p>
                <div className="flex items-center gap-4 mb-4 text-xs text-gray-500">
                  <span>{designation.coreTrainings} Core</span>
                  <span>•</span>
                  <span>{designation.refreshers} Refreshers</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(designation)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-teal-50 text-teal-700 rounded-lg hover:bg-teal-100 transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(designation.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <Trash className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {designations.length === 0 && (
          <div className="text-center py-12">
            <Book className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No designations found. Add your first one!</p>
          </div>
        )}
      </main>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => {
              setShowForm(false);
              resetForm();
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingId ? "Edit Designation" : "Add New Designation"}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Designation ID *
                    </label>
                    <input
                      type="text"
                      value={formData.id}
                      onChange={(e) =>
                        setFormData({ ...formData, id: e.target.value.toUpperCase() })
                      }
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                      required
                      disabled={!!editingId}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Icon Name *
                    </label>
                    <select
                      value={formData.iconName}
                      onChange={(e) =>
                        setFormData({ ...formData, iconName: e.target.value })
                      }
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                      required
                    >
                      {ICON_OPTIONS.map((icon) => (
                        <option key={icon} value={icon}>
                          {icon}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Summary *
                  </label>
                  <textarea
                    value={formData.summary}
                    onChange={(e) =>
                      setFormData({ ...formData, summary: e.target.value })
                    }
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none resize-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Core Trainings *
                    </label>
                    <input
                      type="number"
                      value={formData.coreTrainings}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          coreTrainings: parseInt(e.target.value) || 0,
                        })
                      }
                      min="0"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Refreshers *
                    </label>
                    <input
                      type="number"
                      value={formData.refreshers}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          refreshers: parseInt(e.target.value) || 0,
                        })
                      }
                      min="0"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:from-teal-700 hover:to-blue-700 transition-all font-semibold"
                  >
                    <Check className="w-5 h-5" />
                    <span>{editingId ? "Update" : "Create"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      resetForm();
                    }}
                    className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

