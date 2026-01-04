import Link from "next/link";
import { motion } from "framer-motion";
import {
    Book,
    X as XIcon,
    LayoutDashboard,
    GraduationCap,
    LogOut,
} from "lucide-react";
import { Designation } from "../types";

interface AdminSidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    designations: Designation[];
    selectedDesignation: Designation | null;
    setSelectedDesignation: (designation: Designation) => void;
    setShowTrainingAssignment: (show: boolean) => void;
    handleLogout: () => void;
}

export function AdminSidebar({
    sidebarOpen,
    setSidebarOpen,
    designations,
    selectedDesignation,
    setSelectedDesignation,
    setShowTrainingAssignment,
    handleLogout,
}: AdminSidebarProps) {
    return (
        <>
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
                            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-teal-500 to-blue-600 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
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
                        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-linear-to-r from-teal-50 to-blue-50 text-teal-700 mt-1">
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
        </>
    );
}
