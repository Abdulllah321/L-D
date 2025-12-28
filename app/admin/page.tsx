"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Book, 
  LayoutDashboard, 
  Upload, 
  Plus, 
  Pencil, 
  Trash2 as Trash, 
  LogOut, 
  Lock, 
  X, 
  Check,
  Menu,
  X as XIcon,
  FileText,
  Users,
  Settings,
  GraduationCap
} from "lucide-react";
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
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Designation>>({
    id: "",
    title: "",
    summary: "",
    iconName: "Book",
    coreTrainings: 0,
    refreshers: 0,
  });
  const [bulkText, setBulkText] = useState("");
  const [uploadStatus, setUploadStatus] = useState<{
    loading: boolean;
    message: string;
    type: "success" | "error" | null;
  }>({ loading: false, message: "", type: null });

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/me", {
        credentials: "include",
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
        credentials: "include",
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
        credentials: "include",
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
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setDesignations(data.designations || data || []);
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
  };

  const handleBulkUpload = async () => {
    if (!bulkText.trim()) {
      setUploadStatus({
        loading: false,
        message: "Please enter at least one designation name",
        type: "error",
      });
      return;
    }

    setUploadStatus({ loading: true, message: "Uploading...", type: null });

    try {
      // Parse the text - one name per line
      const names = bulkText
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

      if (names.length === 0) {
        setUploadStatus({
          loading: false,
          message: "No valid names found",
          type: "error",
        });
        return;
      }

      const designations = names.map((name) => ({ name }));

      const response = await fetch("/api/designations/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ designations }),
      });

      const data = await response.json();

      if (response.ok) {
        setUploadStatus({
          loading: false,
          message: data.message,
          type: "success",
        });
        setBulkText("");
        await fetchDesignations();
        setTimeout(() => {
          setShowBulkUpload(false);
          setUploadStatus({ loading: false, message: "", type: null });
        }, 2000);
      } else {
        setUploadStatus({
          loading: false,
          message: data.error || "Upload failed",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Bulk upload error:", error);
      setUploadStatus({
        loading: false,
        message: "Failed to upload designations",
        type: "error",
      });
    }
  };

  const handleEdit = (designation: Designation) => {
    setFormData(designation);
    setEditingId(designation._id || null);
    setShowForm(true);
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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: sidebarOpen ? 0 : -280 }}
        animate={{ x: sidebarOpen ? 0 : -280 }}
        transition={{ duration: 0.3 }}
        className="fixed lg:static inset-y-0 left-0 z-40 w-72 bg-white border-r border-gray-200 flex flex-col"
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-teal-500 to-blue-600 flex items-center justify-center">
                <Book className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XIcon className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">
              Main Menu
            </h3>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-gradient-to-r from-teal-50 to-blue-50 text-teal-700 font-medium">
              <LayoutDashboard className="w-5 h-5" />
              <span>Dashboard</span>
            </button>
            <a
              href="/admin/designations"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors mt-1"
            >
              <Book className="w-5 h-5" />
              <span>Designations</span>
            </a>
            <a
              href="/admin/trainings"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors mt-1"
            >
              <GraduationCap className="w-5 h-5" />
              <span>Total Trainings</span>
            </a>
          </div>

          <div className="mb-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">
              Designations ({designations.length})
            </h3>
            <div className="space-y-1 max-h-[400px] overflow-y-auto">
              {designations.length === 0 ? (
                <p className="text-sm text-gray-400 px-3 py-2">No designations yet</p>
              ) : (
                designations.map((designation) => (
                  <button
                    key={designation._id || designation.id}
                    onClick={() => {
                      handleEdit(designation);
                      setSidebarOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors text-left group"
                  >
                    <Book className="w-4 h-4 text-gray-400 group-hover:text-teal-600 transition-colors" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{designation.title}</p>
                      <p className="text-xs text-gray-400 truncate">{designation.id}</p>
                    </div>
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
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </motion.aside>

      {/* Sidebar Overlay (Mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Menu className="w-6 h-6 text-gray-600" />
                </button>
                <h2 className="text-2xl font-bold text-gray-900">
                  Designation Management
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    resetForm();
                    setShowBulkUpload(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
                >
                  <Upload className="w-5 h-5" />
                  <span className="hidden sm:inline">Bulk Upload</span>
                </button>
                <button
                  onClick={() => {
                    resetForm();
                    setShowForm(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:from-teal-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
                >
                  <Plus className="w-5 h-5" />
                  <span className="hidden sm:inline">Add Designation</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Designations</p>
                  <p className="text-3xl font-bold text-gray-900">{designations.length}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-teal-100 flex items-center justify-center">
                  <Book className="w-6 h-6 text-teal-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Core Trainings</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {designations.reduce((sum, d) => sum + (d.coreTrainings || 0), 0)}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Refreshers</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {designations.reduce((sum, d) => sum + (d.refreshers || 0), 0)}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center">
                  <Users className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Designations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {designations.map((designation) => (
                <motion.div
                  key={designation._id || designation.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all cursor-pointer"
                  onClick={() => handleEdit(designation)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-teal-100 to-blue-100 flex items-center justify-center">
                        <Book className="w-6 h-6 text-teal-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {designation.id}
                        </span>
                        <h3 className="text-lg font-bold text-gray-900 mt-1 truncate">
                          {designation.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {designation.summary}
                  </p>
                  <div className="flex items-center gap-4 mb-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5" />
                      {designation.coreTrainings} Core
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {designation.refreshers} Refreshers
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(designation);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-teal-50 text-teal-700 rounded-lg hover:bg-teal-100 transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(designation._id || designation.id);
                      }}
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
            <div className="text-center py-16">
              <Book className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-2">No designations found</p>
              <p className="text-gray-400 text-sm">Add your first designation or use bulk upload</p>
            </div>
          )}
        </main>
      </div>

      {/* Bulk Upload Modal */}
      <AnimatePresence>
        {showBulkUpload && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => {
              setShowBulkUpload(false);
              setBulkText("");
              setUploadStatus({ loading: false, message: "", type: null });
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-2xl w-full max-w-2xl"
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
                <h2 className="text-2xl font-bold text-gray-900">Bulk Upload Designations</h2>
                <button
                  onClick={() => {
                    setShowBulkUpload(false);
                    setBulkText("");
                    setUploadStatus({ loading: false, message: "", type: null });
                  }}
                  className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter designation names (one per line)
                  </label>
                  <textarea
                    value={bulkText}
                    onChange={(e) => setBulkText(e.target.value)}
                    placeholder="Service Ambassador&#10;Branch Service Officer&#10;Branch Service Manager&#10;Area Operations Manager"
                    rows={10}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none resize-none font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Each line will be treated as a designation name. ID will be auto-generated from the name.
                  </p>
                </div>

                {uploadStatus.message && (
                  <div
                    className={`p-4 rounded-lg ${
                      uploadStatus.type === "success"
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {uploadStatus.message}
                  </div>
                )}

                <div className="flex items-center gap-3 pt-4">
                  <button
                    onClick={handleBulkUpload}
                    disabled={uploadStatus.loading || !bulkText.trim()}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploadStatus.loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5" />
                        <span>Upload Designations</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowBulkUpload(false);
                      setBulkText("");
                      setUploadStatus({ loading: false, message: "", type: null });
                    }}
                    className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
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
