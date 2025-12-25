"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import {
  User,
  UserId,
  UserSpeakRounded,
  UserCheckRounded,
  Book,
  BookmarkCircle,
  Bookmark,
  Star,
  Target,
  Magnifer,
} from "@solar-icons/react";

// Designation data structure
interface Designation {
  _id?: string;
  id: string;
  title: string;
  summary: string;
  icon: React.ComponentType<{ className?: string }>;
  coreTrainings: number;
  refreshers: number;
}

// Icon mapping from database iconName to component
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  User,
  UserId,
  UserSpeakRounded,
  UserCheckRounded,
  Book,
  BookmarkCircle,
  Bookmark,
  Star,
  Target,
  Rocket: Star, // Fallback
};

// Simple Designation Card Component
function DesignationCard({
  designation,
  onCardClick,
}: {
  designation: Designation;
  onCardClick: (id: string) => void;
}) {
  const IconComponent = designation.icon;

  return (
    <motion.div
      layout
      layoutId={`card-${designation.id}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{
        layout: { duration: 0.3, ease: "easeInOut" },
        opacity: { duration: 0.2 },
        scale: { duration: 0.2 },
      }}
      whileHover={{ y: -4 }}
      onClick={() => onCardClick(designation.id)}
      className="group cursor-pointer"
    >
      <div className="h-full bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 hover:shadow-md transition-all duration-200">
        {/* Icon */}
        <div className="mb-4">
          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
            <IconComponent className="w-6 h-6 text-gray-700" />
          </div>
        </div>

        {/* Content */}
        <div>
          {/* Designation ID */}
          <span className="inline-block px-2.5 py-1 rounded text-xs font-semibold bg-gray-100 text-gray-700 mb-3">
            {designation.id}
          </span>

          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {designation.title}
          </h3>

          {/* Summary */}
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {designation.summary}
          </p>

          {/* Stats */}
          <div className="flex items-center gap-4 text-xs text-gray-500 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-1.5">
              <Book className="w-3.5 h-3.5" />
              <span>{designation.coreTrainings} Core</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5" />
              <span>{designation.refreshers} Refreshers</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function DesignationCatalog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch designations from API
  useEffect(() => {
    const fetchDesignations = async () => {
      try {
        const response = await fetch("/api/designations");
        if (response.ok) {
          const data = await response.json();
          // Map database designations to component format with icons
          const mappedDesignations = (data.designations || []).map((d: any) => ({
            ...d,
            icon: iconMap[d.iconName] || Book, // Default to Book if icon not found
          }));
          setDesignations(mappedDesignations);
        }
      } catch (error) {
        console.error("Error fetching designations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDesignations();
  }, []);

  // Filter designations based on search
  const filteredDesignations = useMemo(() => {
    if (!searchQuery.trim()) return designations;
    const query = searchQuery.toLowerCase();
    return designations.filter(
      (d) =>
        d.id.toLowerCase().includes(query) ||
        d.title.toLowerCase().includes(query) ||
        d.summary.toLowerCase().includes(query)
    );
  }, [searchQuery, designations]);

  const handleCardClick = (id: string) => {
    // TODO: Navigate to pathway view
    console.log("Navigate to pathway for:", id);
  };

  return (
    <section id="catalog" className="relative bg-white py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Designation Catalog
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover training pathways for all branch operations roles
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-10 max-w-xl mx-auto"
        >
          <div className="relative">
            <Magnifer className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search designations..."
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 bg-white focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 transition-all"
            />
            {searchQuery && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Designation Grid with Layout Animation */}
        {isLoading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
            <p className="text-gray-500 mt-4">Loading designations...</p>
          </div>
        ) : (
          <LayoutGroup>
            <AnimatePresence mode="popLayout">
              {filteredDesignations.length > 0 ? (
                <motion.div
                  key="grid"
                  layout
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {filteredDesignations.map((designation) => (
                    <DesignationCard
                      key={designation._id || designation.id}
                      designation={designation}
                      onCardClick={handleCardClick}
                    />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-16"
                >
                  <Target className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No designations found</p>
                  <p className="text-sm text-gray-400 mt-1">
                    {searchQuery ? "Try adjusting your search" : "No designations available yet"}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </LayoutGroup>
        )}
      </div>
    </section>
  );
}
