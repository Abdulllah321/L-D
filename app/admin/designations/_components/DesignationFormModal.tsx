import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Check,
} from "lucide-react";
import { Designation } from "../types";

interface DesignationFormModalProps {
    showForm: boolean;
    setShowForm: (show: boolean) => void;
    resetForm: () => void;
    editingId: string | null;
    handleSubmit: (e: React.FormEvent) => void;
    formData: Partial<Designation>;
    setFormData: (data: Partial<Designation>) => void;
    designationNames: string;
    setDesignationNames: (names: string) => void;
}

export function DesignationFormModal({
    showForm,
    setShowForm,
    resetForm,
    editingId,
    handleSubmit,
    formData,
    setFormData,
    designationNames,
    setDesignationNames,
}: DesignationFormModalProps) {
    return (
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

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Sub-Designations (comma separated)
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="e.g. Branch Track, Operations Track"
                                                defaultValue={formData.subDesignations?.map(s => s.title).join(', ')}
                                                onBlur={(e) => {
                                                    const titles = e.target.value.split(',').map(t => t.trim()).filter(Boolean);
                                                    const subs = titles.map(t => ({ id: t.toUpperCase().replace(/\s+/g, '_'), title: t }));
                                                    setFormData({ ...formData, subDesignations: subs });
                                                }}
                                                className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                                            />
                                            <p className="text-xs text-gray-500 mt-2">
                                                Enter multiple sub-designation titles separated by commas.
                                            </p>
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
    );
}
