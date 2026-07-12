"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, 
  Award, 
  Sparkles, 
  Search, 
  GraduationCap, 
  Briefcase, 
  ArrowRight,
  ChevronRight,
  Bookmark,
  CheckCircle,
  Building,
  TrendingUp
} from "lucide-react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/landing/Footer";
import Logo from "../ui/sparkles-logo";
import { RetailDepartmentData, RetailJobFamily } from "@/app/actions/retail";

interface RetailCatalogViewProps {
  data: RetailDepartmentData;
}

export default function RetailCatalogView({ data }: RetailCatalogViewProps) {
  const [selectedJobFamilyId, setSelectedJobFamilyId] = useState<string>(
    data.jobFamilies[0]?.id || ""
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedAccordionId, setExpandedAccordionId] = useState<string | null>(
    data.jobFamilies[0]?.id || null
  );

  // Normalize for search matching
  const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, "");

  // Filter job families and their tracks
  const filteredJobFamilies = useMemo(() => {
    if (!searchQuery.trim()) return data.jobFamilies;
    const query = normalize(searchQuery);

    return data.jobFamilies.filter((jf) => {
      const matchFamily = normalize(jf.name).includes(query);
      const matchTracks = jf.learningTracks.some((t) => 
        normalize(t.name).includes(query)
      );
      return matchFamily || matchTracks;
    });
  }, [data.jobFamilies, searchQuery]);

  // Find the selected job family for the desktop view
  const selectedJobFamily = useMemo(() => {
    return data.jobFamilies.find((jf) => jf.id === selectedJobFamilyId) || data.jobFamilies[0];
  }, [data.jobFamilies, selectedJobFamilyId]);

  return (
    <div className="min-h-screen bg-zinc-50 selection:bg-purple-500/30 text-zinc-900 font-sans">
      <Header />

      {/* Background Gradients & Grids */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-purple-50/50 via-white to-transparent" />
        <div className="absolute -top-[20%] right-0 w-[600px] h-[600px] bg-purple-100/40 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] left-[-10%] w-[500px] h-[500px] bg-pink-100/40 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />
      </div>

      <main className="relative z-10 pt-32 pb-16">
        {/* Hero Section */}
        <section className="relative px-6 text-center max-w-4xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 p-2 px-4 rounded-full bg-white border border-purple-100 shadow-sm mb-6"
          >
            <Sparkles size={16} className="text-purple-500 animate-pulse" />
            <span className="text-sm font-medium bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Retail Banking Catalog
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold tracking-tighter text-zinc-900 mb-6 leading-tight"
          >
            Empower Your <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
              Retail Pathways
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-lg text-zinc-600 leading-relaxed max-w-2xl mx-auto mb-8"
          >
            Discover training programs designed for customer-facing and relationship management excellence. Elevate your performance step-by-step.
          </motion.p>

          {/* Search Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="max-w-md mx-auto relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl opacity-10 group-hover:opacity-20 blur transition-opacity" />
            <div className="relative bg-white rounded-2xl shadow-xl flex items-center p-2 border border-zinc-100">
              <Search className="text-zinc-400 ml-3" size={20} />
              <input
                type="text"
                placeholder="Search job families or tracks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-3 bg-transparent border-none outline-none text-zinc-800 placeholder:text-zinc-400 font-medium"
              />
            </div>
          </motion.div>
        </section>

        {/* Content Section */}
        <section className="container mx-auto px-4 max-w-6xl">
          {filteredJobFamilies.length > 0 ? (
            <>
              {/* DESKTOP VIEW: MASTER-DETAIL */}
              <div className="hidden md:grid grid-cols-12 gap-8 items-start">
                {/* Left Panel: Master Job Families */}
                <div className="col-span-4 space-y-4">
                  <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider px-2">
                    Job Families ({filteredJobFamilies.length})
                  </div>
                  <div className="space-y-3">
                    {filteredJobFamilies.map((jf) => {
                      const isSelected = jf.id === selectedJobFamilyId;
                      return (
                        <motion.button
                          key={jf.id}
                          onClick={() => setSelectedJobFamilyId(jf.id)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden flex items-center justify-between group ${
                            isSelected
                              ? "bg-white border-purple-500/30 shadow-lg shadow-purple-500/5 ring-1 ring-purple-500/20"
                              : "bg-white/80 border-zinc-200 hover:border-zinc-300 hover:bg-white shadow-sm"
                          }`}
                        >
                          {/* Active glowing stripe */}
                          {isSelected && (
                            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-purple-500 to-pink-500" />
                          )}

                          <div className="flex items-center gap-4">
                            <div
                              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                                isSelected
                                  ? "bg-purple-100 text-purple-600"
                                  : "bg-zinc-100 text-zinc-500 group-hover:bg-zinc-200"
                              }`}
                            >
                              <Briefcase size={20} />
                            </div>
                            <div>
                              <h3 className="font-semibold text-zinc-900 text-base">
                                {jf.name}
                              </h3>
                              <p className="text-xs text-zinc-500 mt-0.5">
                                {jf.learningTracks.length} Learning Track
                                {jf.learningTracks.length !== 1 && "s"}
                              </p>
                            </div>
                          </div>

                          <ChevronRight
                            size={18}
                            className={`transition-transform duration-300 ${
                              isSelected
                                ? "text-purple-500 translate-x-1"
                                : "text-zinc-400 group-hover:translate-x-0.5"
                            }`}
                          />
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Right Panel: Detail View (Learning Tracks) */}
                <div className="col-span-8 bg-white border border-zinc-200/80 rounded-3xl p-8 shadow-xl shadow-zinc-500/5 min-h-[450px] relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-purple-100/30 to-pink-100/10 rounded-full blur-3xl pointer-events-none" />
                  
                  <AnimatePresence mode="wait">
                    {selectedJobFamily && (
                      <motion.div
                        key={selectedJobFamily.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        <div className="flex items-center justify-between border-b border-zinc-100 pb-5">
                          <div>
                            <div className="text-xs font-semibold text-purple-600 uppercase tracking-wider mb-1">
                              Assigned Tracks
                            </div>
                            <h2 className="text-2xl font-bold text-zinc-900">
                              {selectedJobFamily.name}
                            </h2>
                          </div>
                          <div className="px-3 py-1.5 rounded-full bg-purple-50 text-purple-700 text-xs font-medium border border-purple-100 flex items-center gap-1.5">
                            <GraduationCap size={14} />
                            <span>{selectedJobFamily.learningTracks.length} Tracks</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {selectedJobFamily.learningTracks.map((track, idx) => (
                            <motion.div
                              key={track.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.05 }}
                              className="group relative bg-zinc-50 hover:bg-gradient-to-br hover:from-white hover:to-purple-50/20 border border-zinc-200/60 hover:border-purple-200 rounded-2xl p-5 transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer flex flex-col justify-between"
                            >
                              <div>
                                <div className="w-9 h-9 rounded-lg bg-white border border-zinc-200/80 flex items-center justify-center text-purple-500 mb-4 group-hover:scale-110 transition-transform duration-300">
                                  <BookOpen size={16} />
                                </div>
                                <h4 className="font-semibold text-zinc-800 group-hover:text-purple-900 transition-colors">
                                  {track.name}
                                </h4>
                                <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
                                  Structured training curriculum with milestones and assessments.
                                </p>
                              </div>

                              <div className="flex items-center justify-between mt-6 pt-3 border-t border-zinc-100">
                                <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                                  Catalog Track
                                </span>
                                <div className="text-zinc-400 group-hover:text-purple-600 transition-colors flex items-center gap-1 text-xs font-medium">
                                  <span>View</span>
                                  <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* MOBILE VIEW: ACCORDIONS */}
              <div className="block md:hidden space-y-4">
                <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider px-2">
                  Job Families ({filteredJobFamilies.length})
                </div>
                <div className="space-y-3">
                  {filteredJobFamilies.map((jf) => {
                    const isExpanded = expandedAccordionId === jf.id;
                    return (
                      <div
                        key={jf.id}
                        className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm transition-all"
                      >
                        <button
                          onClick={() => setExpandedAccordionId(isExpanded ? null : jf.id)}
                          className="w-full flex items-center justify-between p-5 text-left"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isExpanded ? "bg-purple-100 text-purple-600" : "bg-zinc-100 text-zinc-500"}`}>
                              <Briefcase size={18} />
                            </div>
                            <div>
                              <h3 className="font-bold text-zinc-900 text-base">{jf.name}</h3>
                              <p className="text-xs text-zinc-500 mt-0.5">
                                {jf.learningTracks.length} Learning Track
                                {jf.learningTracks.length !== 1 && "s"}
                              </p>
                            </div>
                          </div>
                          <ChevronRight
                            size={18}
                            className={`text-zinc-400 transition-transform duration-300 ${
                              isExpanded ? "rotate-90 text-purple-500" : ""
                            }`}
                          />
                        </button>

                        <AnimatePresence initial={false}>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25, ease: "easeInOut" }}
                            >
                              <div className="px-5 pb-5 border-t border-zinc-100 pt-4 bg-zinc-50/50 space-y-3">
                                {jf.learningTracks.map((track) => (
                                  <div
                                    key={track.id}
                                    className="p-4 bg-white border border-zinc-200 rounded-xl flex items-center gap-3 shadow-xs"
                                  >
                                    <div className="w-7 h-7 rounded-md bg-purple-50 flex items-center justify-center text-purple-600">
                                      <BookOpen size={14} />
                                    </div>
                                    <span className="font-medium text-zinc-800 text-sm">{track.name}</span>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 bg-white border border-zinc-200 rounded-3xl max-w-md mx-auto shadow-sm"
            >
              <p className="text-zinc-500 text-lg font-medium">
                No job families match "{searchQuery}"
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="mt-4 text-purple-600 hover:text-purple-700 font-semibold text-sm underline underline-offset-4"
              >
                Clear Search
              </button>
            </motion.div>
          )}
        </section>
      </main>

      <Logo />
      <Footer />
    </div>
  );
}
