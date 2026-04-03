"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Book, Rocket, ArrowRight } from "@solar-icons/react";

// Track Card Component with Micro-interactions
function TrackCard({
  icon: Icon,
  badge,
  title,
  description,
  features,
  gradient,
  delay = 0,
  onClick
}: {
  icon: React.ComponentType<{ className?: string }>;
  badge: string;
  title: string;
  description: string;
  features: string[];
  gradient: string;
  delay?: number;
  onClick?: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 200 };
  const x = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), springConfig);
  const y = useSpring(useTransform(mouseY, [-0.5, 0.5], [-10, 10]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXRelative = (e.clientX - rect.left) / width - 0.5;
    const mouseYRelative = (e.clientY - rect.top) / height - 0.5;
    mouseX.set(mouseXRelative);
    mouseY.set(mouseYRelative);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      layout
      onClick={onClick}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden cursor-pointer"
      style={{ x, y }}
    >
      {/* Gradient Background with Clip-path Animation */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0`}
        animate={{
          opacity: isHovered ? 0.05 : 0,
          clipPath: isHovered
            ? "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"
            : "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
        }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      />

      {/* Masking Reveal Effect */}
      <motion.div
        className="absolute inset-0 bg-white"
        animate={{
          clipPath: isHovered
            ? "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)"
            : "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />

      {/* Content */}
      <div className="relative z-10 p-8">
        {/* Icon with Micro-interaction */}
        <motion.div
          className="mb-6"
        >
          <motion.div
            className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors relative overflow-hidden"
            animate={{
              background: isHovered
                ? "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)"
                : "linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)",
            }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-blue-500/20"
              animate={{
                opacity: isHovered ? 1 : 0,
                scale: isHovered ? 1 : 0.8,
              }}
              transition={{ duration: 0.3 }}
            />
            <Icon className="w-7 h-7 text-gray-700 relative z-10" />
          </motion.div>
        </motion.div>

        {/* Badge with Clip-path Animation */}
        <motion.span
          className="inline-block px-3 py-1 rounded text-xs font-semibold bg-gray-100 text-gray-700 mb-4 relative overflow-hidden"
          whileHover={{ scale: 1.05 }}
        >
          <motion.div
            className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-0`}
            animate={{
              opacity: isHovered ? 0.15 : 0,
              clipPath: isHovered
                ? "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"
                : "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
            }}
            transition={{ duration: 0.3 }}
          />
          <span className="relative z-10">{badge}</span>
        </motion.span>

        {/* Title */}
        <motion.h3
          className="text-2xl font-bold text-gray-900 mb-3"
          animate={{
            color: isHovered ? undefined : undefined,
          }}
        >
          {title}
        </motion.h3>

        {/* Description */}
        <p className="text-gray-600 leading-relaxed mb-6">{description}</p>

        {/* Features with Stagger Animation */}
        <div className="space-y-2.5 mb-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature}
              className="flex items-center gap-2.5"
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: delay + index * 0.1 }}
              whileHover={{ x: 4 }}
            >
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-gray-400"
                animate={{
                  scale: isHovered ? 1.2 : 1,
                  backgroundColor: isHovered ? "#14b8a6" : "#9ca3af",
                }}
                transition={{ delay: index * 0.05 }}
              />
              <span className="text-sm text-gray-600">{feature}</span>
            </motion.div>
          ))}
        </div>

        {/* CTA with Arrow Animation */}
        <motion.div
          className="flex items-center gap-2 text-gray-700 font-medium text-sm"
          animate={{
            color: isHovered ? "#111827" : "#374151",
          }}
        >
          <span>Explore Track</span>
          <motion.div
            animate={{
              x: isHovered ? 4 : 0,
            }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <ArrowRight className="w-4 h-4" />
          </motion.div>
        </motion.div>

        {/* Border Gradient on Hover */}
        <motion.div
          className={`absolute inset-0 border-2 rounded-xl bg-gradient-to-r ${gradient} opacity-0 pointer-events-none`}
          animate={{
            opacity: isHovered ? 0.2 : 0,
          }}
          transition={{ duration: 0.3 }}
          style={{
            maskImage: "linear-gradient(to right, transparent, black, transparent)",
            WebkitMaskImage: "linear-gradient(to right, transparent, black, transparent)",
          }}
        />
      </div>
    </motion.div>
  );
}

export default function LearningTracksIntro() {
  const router = useRouter();

  return (
    <section id="pathways" className="relative bg-white py-24 px-4 overflow-hidden">
      {/* Subtle Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header with Masking Animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <motion.h2
            className="text-4xl md:text-4xl font-bold text-clip text-transparent bg-gradient-to-b pb-2 from-gray-500 to-gray-900 bg-clip-text mb-4"
            initial={{ clipPath: "polygon(0 0, 0 0, 0 100%, 0% 100%)" }}
            whileInView={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            Your Learning Journey
          </motion.h2>
          <motion.p
            className="text-gray-600 max-w-2xl mx-auto text-lg"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            This catalogue provides a role-wise learning roadmap for Branch Operations in 2025.
            Use the tabs above to open the learning track pages. Training titles that have supporting{" "}
            <span className="font-semibold text-gray-900"> "program sheets" </span>
            are clickable and open details on the same page.
          </motion.p>
        </motion.div>

        {/* Two Track Cards - Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Regular Learning Track */}
          <TrackCard
            icon={Book}
            badge="Standard Pathway"
            title="Regular Learning Track"
            description="Standard development pathway for Branch Operations roles, combining onboarding/readiness programs, service excellence, compliance essentials, and role-specific capability building."
            features={[
              "Onboarding & Readiness",
              "Service Excellence",
              "Compliance Essentials",
              "Role-Specific Capabilities",
            ]}
            gradient="from-teal-500 to-blue-500"
            delay={0.1}
            onClick={() => router.push('/catalog')}
          />

          {/* Hi-Po Learning Track */}
          <TrackCard
            icon={Rocket}
            badge="Accelerated Pathway"
            title="Advanced Track"
            description="Accelerated pathway for high-potential talent, emphasizing leadership readiness, broader exposure, and strengthened governance & service disciplines."
            features={[
              "Leadership Readiness",
              "Broader Exposure",
              "Governance Excellence",
              "Advanced Service Disciplines",
            ]}
            gradient="from-indigo-500 to-purple-500"
            delay={0.2}
            onClick={() => router.push('/catalog')}
          />
        </div>
      </div>
    </section>
  );
}
