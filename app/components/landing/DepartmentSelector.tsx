"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Building2, ShoppingBag, Coins, ArrowRight, Sparkles } from "lucide-react";
import { useState } from "react";

interface DepartmentRoute {
  id: string;
  name: string;
  badge: string;
  description: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  glowColor: string;
  features: string[];
  status: "active" | "coming_soon";
}

const DEPARTMENTS: DepartmentRoute[] = [
  {
    id: "branch-ops",
    name: "Branch Ops",
    badge: "Branch Operations",
    description: "Standard and advanced learning pathways for branch operations roles, combining onboarding readiness, compliance essentials, and service excellence.",
    href: "/catalog",
    icon: Building2,
    gradient: "from-teal-500 to-blue-600",
    glowColor: "rgba(20, 184, 166, 0.15)",
    features: ["Onboarding & Readiness", "Compliance Essentials", "Role-Based Pathways"],
    status: "active"
  },
  {
    id: "retail",
    name: "Retail Catalog",
    badge: "Retail Banking",
    description: "Specialized learning tracks and curriculums for Retail banking job families, mapped from Relationship Officers to Senior Relationship Managers.",
    href: "/retail",
    icon: ShoppingBag,
    gradient: "from-purple-600 to-pink-600",
    glowColor: "rgba(168, 85, 247, 0.15)",
    features: ["Job Family Milestones", "Relationship Management", "Product Launches"],
    status: "active"
  },
  {
    id: "consumer-finance",
    name: "Consumer Finance",
    badge: "Coming Soon",
    description: "Specialized training programs for consumer finance roles, personal loans, card operations, and credit analysis. Releases in the next phase.",
    icon: Coins,
    gradient: "from-amber-500 to-orange-600",
    glowColor: "rgba(245, 158, 11, 0.1)",
    features: ["Credit Assessment", "Portfolio Management", "Loan Advisory Services"],
    status: "coming_soon"
  }
];

export default function DepartmentSelector() {
  const router = useRouter();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <section id="departments" className="relative bg-white py-24 px-4 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-zinc-50 rounded-full blur-[160px] pointer-events-none opacity-40" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header with Masking Animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-flex items-center gap-2 p-1.5 px-3 rounded-full bg-zinc-100 border border-zinc-200 mb-4"
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles size={14} className="text-zinc-600" />
            <span className="text-xs font-semibold text-zinc-600 uppercase tracking-wider">
              Department Portals
            </span>
          </motion.div>

          <motion.h2
            className="text-4xl md:text-5xl font-bold text-transparent bg-gradient-to-b pb-2 from-zinc-800 to-zinc-950 bg-clip-text mb-4 tracking-tight"
            initial={{ clipPath: "polygon(0 0, 0 0, 0 100%, 0% 100%)" }}
            whileInView={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            Select Your Learning Catalog
          </motion.h2>
          <motion.p
            className="text-zinc-500 max-w-2xl mx-auto text-lg leading-relaxed"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Access the customized learning track resources, compliance checklists, and growth journeys curated specifically for your division.
          </motion.p>
        </motion.div>

        {/* Dynamic Department Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {DEPARTMENTS.map((dept, index) => {
            const Icon = dept.icon;
            const isActive = dept.status === "active";
            const isHovered = hoveredCard === dept.id;

            return (
              <motion.div
                key={dept.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onMouseEnter={() => setHoveredCard(dept.id)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => isActive && dept.href && router.push(dept.href)}
                className={`group relative bg-white border rounded-2xl p-8 flex flex-col justify-between h-[420px] transition-all duration-500 ${
                  isActive
                    ? "border-zinc-200 hover:border-transparent cursor-pointer shadow-sm"
                    : "border-zinc-100 opacity-60 cursor-not-allowed select-none"
                }`}
                style={{
                  boxShadow: isActive && isHovered 
                    ? `0 20px 40px -15px ${dept.glowColor}, 0 0 0 1px rgba(0,0,0,0.05)` 
                    : undefined
                }}
              >
                {/* Active Card Glow Background on Hover */}
                {isActive && (
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${dept.gradient} opacity-0 rounded-2xl`}
                    animate={{ opacity: isHovered ? 0.03 : 0 }}
                    transition={{ duration: 0.4 }}
                  />
                )}

                <div>
                  {/* Badge & Icon */}
                  <div className="flex items-center justify-between mb-8">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                        isActive 
                          ? isHovered 
                            ? `bg-gradient-to-br ${dept.gradient} text-white scale-110 shadow-md`
                            : "bg-zinc-100 text-zinc-700" 
                          : "bg-zinc-50 text-zinc-400"
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${
                        isActive
                          ? "bg-zinc-50 text-zinc-600 border-zinc-200 group-hover:border-transparent transition-colors duration-300"
                          : "bg-zinc-100 text-zinc-400 border-zinc-200"
                      }`}
                    >
                      {dept.badge}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-zinc-900 mb-3 group-hover:text-zinc-950 transition-colors">
                    {dept.name}
                  </h3>

                  {/* Description */}
                  <p className="text-zinc-500 text-sm leading-relaxed mb-6 group-hover:text-zinc-600 transition-colors">
                    {dept.description}
                  </p>
                </div>

                {/* Features List */}
                <div className="space-y-2 mb-6">
                  {dept.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div
                        className={`w-1.5 h-1.5 rounded-full transition-colors ${
                          isActive 
                            ? isHovered 
                              ? `bg-gradient-to-br ${dept.gradient}`
                              : "bg-zinc-400"
                            : "bg-zinc-300"
                        }`}
                      />
                      <span className="text-xs text-zinc-500 font-medium group-hover:text-zinc-600 transition-colors">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Bottom Interactive Trigger */}
                <div className="pt-4 border-t border-zinc-100 flex items-center justify-between mt-auto">
                  <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                    {isActive ? "Portal Gateway" : "Locked"}
                  </span>
                  
                  {isActive ? (
                    <motion.div
                      className="flex items-center gap-1.5 text-zinc-700 font-semibold text-sm group-hover:text-zinc-900"
                      animate={{ x: isHovered ? 4 : 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <span>Explore Catalog</span>
                      <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-zinc-900" />
                    </motion.div>
                  ) : (
                    <span className="text-zinc-400 font-semibold text-sm">
                      Coming Soon
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
