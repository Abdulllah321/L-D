"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";
import LightRays from "./HeroBackground";

// Animated SVG Icon Components using pathLength
function AnimatedLinkIcon({
  className,
  color = "currentColor",
  delay = 0,
}: {
  className?: string;
  color?: string;
  delay?: number;
}) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <svg
      className={className}
      fill="none"
      stroke={color}
      viewBox="0 0 24 24"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
        pathLength="1"
        strokeDasharray="1"
        strokeDashoffset={isAnimating ? "0" : "1"}
        style={{
          transition: "stroke-dashoffset 1.5s ease-in-out",
        }}
      />
    </svg>
  );
}

function AnimatedChartIcon({
  className,
  color = "currentColor",
  delay = 0,
}: {
  className?: string;
  color?: string;
  delay?: number;
}) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <svg
      className={className}
      fill="none"
      stroke={color}
      viewBox="0 0 24 24"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        pathLength="1"
        strokeDasharray="1"
        strokeDashoffset={isAnimating ? "0" : "1"}
        style={{
          transition: "stroke-dashoffset 1.2s ease-in-out",
        }}
      />
    </svg>
  );
}

function AnimatedUsersIcon({
  className,
  color = "currentColor",
  delay = 0,
}: {
  className?: string;
  color?: string;
  delay?: number;
}) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <svg
      className={className}
      fill="none"
      stroke={color}
      viewBox="0 0 24 24"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        pathLength="1"
        strokeDasharray="1"
        strokeDashoffset={isAnimating ? "0" : "1"}
        style={{
          transition: "stroke-dashoffset 1.5s ease-in-out",
        }}
      />
    </svg>
  );
}

function AnimatedArrowIcon({
  className,
  color = "currentColor",
}: {
  className?: string;
  color?: string;
}) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <svg
      className={className}
      fill="none"
      stroke={color}
      viewBox="0 0 24 24"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
        pathLength="1"
        strokeDasharray="1"
        strokeDashoffset={isAnimating ? "0" : "1"}
        style={{
          transition: "stroke-dashoffset 1s ease-in-out",
        }}
      />
    </svg>
  );
}

// Growth Illustration Component
function GrowthIllustration() {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden lg:block w-64 h-64 opacity-10 pointer-events-none">
      <svg viewBox="0 0 200 200" className="w-full h-full">
        {/* Upward trending line */}
        <path
          d="M20 160 L40 140 L60 120 L80 100 L100 80 L120 60 L140 40 L160 20"
          fill="none"
          stroke="#000"
          strokeWidth="2"
          strokeLinecap="round"
          pathLength="1"
          strokeDasharray="1"
          strokeDashoffset={isAnimating ? "0" : "1"}
          style={{
            transition: "stroke-dashoffset 2s ease-in-out",
          }}
        />
        {/* Chart bars */}
        <rect
          x="30"
          y="150"
          width="15"
          height="20"
          fill="#000"
          opacity={isAnimating ? 0.3 : 0}
          style={{
            transition: "opacity 0.5s ease-in-out 0.5s",
          }}
        />
        <rect
          x="55"
          y="130"
          width="15"
          height="40"
          fill="#000"
          opacity={isAnimating ? 0.3 : 0}
          style={{
            transition: "opacity 0.5s ease-in-out 0.7s",
          }}
        />
        <rect
          x="80"
          y="110"
          width="15"
          height="60"
          fill="#000"
          opacity={isAnimating ? 0.3 : 0}
          style={{
            transition: "opacity 0.5s ease-in-out 0.9s",
          }}
        />
        <rect
          x="105"
          y="90"
          width="15"
          height="80"
          fill="#000"
          opacity={isAnimating ? 0.3 : 0}
          style={{
            transition: "opacity 0.5s ease-in-out 1.1s",
          }}
        />
        <rect
          x="130"
          y="70"
          width="15"
          height="100"
          fill="#000"
          opacity={isAnimating ? 0.3 : 0}
          style={{
            transition: "opacity 0.5s ease-in-out 1.3s",
          }}
        />
        {/* Upward arrow */}
        <path
          d="M170 30 L180 20 L190 30 M180 20 L180 50"
          fill="none"
          stroke="#000"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength="1"
          strokeDasharray="1"
          strokeDashoffset={isAnimating ? "0" : "1"}
          style={{
            transition: "stroke-dashoffset 1s ease-in-out 1.5s",
          }}
        />
      </svg>
    </div>
  );
}

// Animated SVG Drawing Component
function AnimatedSVG({
  delay = 0,
  children,
  className = "",
}: {
  delay?: number;
  children: React.ReactNode;
  className?: string;
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      } ${className}`}
    >
      {children}
    </div>
  );
}

// Drawing Path Animation Component
function DrawingPath({
  path,
  delay = 0,
  duration = 2,
  color = "currentColor",
  strokeWidth = 2,
}: {
  path: string;
  delay?: number;
  duration?: number;
  color?: string;
  strokeWidth?: number;
}) {
  const pathRef = useRef<SVGPathElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(true);
      if (pathRef.current) {
        const pathElement = pathRef.current;
        const length = pathElement.getTotalLength();
        pathElement.style.strokeDasharray = `${length}`;
        pathElement.style.strokeDashoffset = `${length}`;
        pathElement.style.transition = `stroke-dashoffset ${duration}s ease-in-out`;
        pathElement.style.strokeDashoffset = "0";
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, duration]);

  return (
    <path
      ref={pathRef}
      d={path}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

// Beam Effect Path Component with Framer Motion
function BeamPath({
  path,
  delay = 0,
  duration = 2,
  color = "#000",
  strokeWidth = 2,
  beamIntensity = 0.3,
  infinite = false,
  randomVariation = false,
}: {
  path: string;
  delay?: number;
  duration?: number;
  color?: string;
  strokeWidth?: number;
  beamIntensity?: number;
  infinite?: boolean;
  randomVariation?: boolean;
}) {
  const pathRef = useRef<SVGPathElement>(null);
  const uniqueId = useRef(`beam-${Math.random().toString(36).substr(2, 9)}`);
  const [pathLength, setPathLength] = useState(0);

  // Random variations for attractiveness
  const randomDelay = randomVariation ? Math.random() * 2 : delay;
  const randomDuration = randomVariation
    ? duration + (Math.random() * 2 - 1)
    : duration;
  const randomIntensity = randomVariation
    ? beamIntensity + (Math.random() * 0.2 - 0.1)
    : beamIntensity;

  useEffect(() => {
    if (pathRef.current) {
      const length = pathRef.current.getTotalLength();
      setPathLength(length);
    }
  }, []);

  const initialDashOffset = pathLength;
  const animateDashOffset = infinite
    ? [initialDashOffset, 0, initialDashOffset]
    : [initialDashOffset, 0];
  const transition = {
    duration: randomDuration,
    delay: randomDelay,
    ease: [0.4, 0, 0.6, 1] as const, // easeInOut
    repeat: infinite ? Infinity : 0,
    repeatDelay: infinite ? 0.5 : 0,
  };

  return (
    <>
      <defs>
        <linearGradient
          id={`gradient-${uniqueId.current}`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%"
        >
          <stop offset="0%" stopColor={color} stopOpacity="0" />
          <stop offset="50%" stopColor={color} stopOpacity={randomIntensity} />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
        <filter id={`glow-${uniqueId.current}`}>
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <motion.path
        ref={pathRef}
        d={path}
        fill="none"
        stroke={`url(#gradient-${uniqueId.current})`}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={`url(#glow-${uniqueId.current})`}
        initial={{
          opacity: 0,
          strokeDasharray: pathLength,
          strokeDashoffset: initialDashOffset,
        }}
        animate={{
          opacity: 1,
          strokeDashoffset: animateDashOffset,
        }}
        transition={transition}
      />
      <motion.path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth * 0.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{
          duration: randomDuration * 0.3,
          delay: randomDelay,
        }}
      />
    </>
  );
}

// Additional Animated Icons
function AnimatedBookIcon({
  className,
  color = "currentColor",
  delay = 0,
}: {
  className?: string;
  color?: string;
  delay?: number;
}) {
  const [isAnimating, setIsAnimating] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <svg
      className={className}
      fill="none"
      stroke={color}
      viewBox="0 0 24 24"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        pathLength="1"
        strokeDasharray="1"
        strokeDashoffset={isAnimating ? "0" : "1"}
        style={{ transition: "stroke-dashoffset 1.5s ease-in-out" }}
      />
    </svg>
  );
}

function AnimatedStarIcon({
  className,
  color = "currentColor",
  delay = 0,
}: {
  className?: string;
  color?: string;
  delay?: number;
}) {
  const [isAnimating, setIsAnimating] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <svg
      className={className}
      fill="none"
      stroke={color}
      viewBox="0 0 24 24"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
        pathLength="1"
        strokeDasharray="1"
        strokeDashoffset={isAnimating ? "0" : "1"}
        style={{ transition: "stroke-dashoffset 1.8s ease-in-out" }}
      />
    </svg>
  );
}

function AnimatedTrophyIcon({
  className,
  color = "currentColor",
  delay = 0,
}: {
  className?: string;
  color?: string;
  delay?: number;
}) {
  const [isAnimating, setIsAnimating] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <svg
      className={className}
      fill="none"
      stroke={color}
      viewBox="0 0 24 24"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
        pathLength="1"
        strokeDasharray="1"
        strokeDashoffset={isAnimating ? "0" : "1"}
        style={{ transition: "stroke-dashoffset 2s ease-in-out" }}
      />
    </svg>
  );
}

function AnimatedTargetIcon({
  className,
  color = "currentColor",
  delay = 0,
}: {
  className?: string;
  color?: string;
  delay?: number;
}) {
  const [isAnimating, setIsAnimating] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <svg
      className={className}
      fill="none"
      stroke={color}
      viewBox="0 0 24 24"
      strokeWidth={2}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        pathLength="1"
        strokeDasharray="1"
        strokeDashoffset={isAnimating ? "0" : "1"}
        style={{ transition: "stroke-dashoffset 1.5s ease-in-out" }}
      />
      <circle
        cx="12"
        cy="12"
        r="6"
        pathLength="1"
        strokeDasharray="1"
        strokeDashoffset={isAnimating ? "0" : "1"}
        style={{ transition: "stroke-dashoffset 1.5s ease-in-out 0.3s" }}
      />
      <circle
        cx="12"
        cy="12"
        r="2"
        pathLength="1"
        strokeDasharray="1"
        strokeDashoffset={isAnimating ? "0" : "1"}
        style={{ transition: "stroke-dashoffset 1.5s ease-in-out 0.6s" }}
      />
    </svg>
  );
}

function AnimatedRocketIcon({
  className,
  color = "currentColor",
  delay = 0,
}: {
  className?: string;
  color?: string;
  delay?: number;
}) {
  const [isAnimating, setIsAnimating] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <svg
      className={className}
      fill="none"
      stroke={color}
      viewBox="0 0 24 24"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13 10V3L4 14h7v7l9-11h-7z"
        pathLength="1"
        strokeDasharray="1"
        strokeDashoffset={isAnimating ? "0" : "1"}
        style={{ transition: "stroke-dashoffset 1.2s ease-in-out" }}
      />
    </svg>
  );
}

// Floating Background Icons with Framer Motion
function FloatingIcons() {
  // Random floating animations - create unique variants for each icon
  const createFloatVariant = () => ({
    y: [0, -20, 0],
    x: [0, Math.random() * 10 - 5, 0],
    rotate: [0, Math.random() * 10 - 5, 0],
    transition: {
      duration: 3 + Math.random() * 2,
      repeat: Infinity,
      ease: [0.4, 0, 0.6, 1] as const, // easeInOut
    },
  });

  return (
    <div className="absolute inset-0 pointer-events-none opacity-5">
      {/* Top Left - Dark Blue */}
      <motion.div
        className="absolute top-20 left-10 w-12 h-12"
        animate={createFloatVariant()}
        transition={{ delay: 0 }}
      >
        <AnimatedBookIcon
          className="w-full h-full"
          color="#1e40af"
          delay={800}
        />
      </motion.div>

      {/* Top Right - Deep Purple */}
      <motion.div
        className="absolute top-32 right-20 w-10 h-10"
        animate={createFloatVariant()}
        transition={{ delay: 1 }}
      >
        <AnimatedStarIcon
          className="w-full h-full"
          color="#6b21a8"
          delay={1000}
        />
      </motion.div>

      {/* Middle Left - Dark Teal */}
      <motion.div
        className="absolute top-1/2 left-16 -translate-y-1/2 w-14 h-14"
        animate={createFloatVariant()}
        transition={{ delay: 1.5 }}
      >
        <AnimatedTrophyIcon
          className="w-full h-full"
          color="#0d9488"
          delay={1200}
        />
      </motion.div>

      {/* Bottom Left - Indigo */}
      <motion.div
        className="absolute bottom-32 left-24 w-11 h-11"
        animate={createFloatVariant()}
        transition={{ delay: 2 }}
      >
        <AnimatedTargetIcon
          className="w-full h-full"
          color="#4f46e5"
          delay={1400}
        />
      </motion.div>

      {/* Bottom Right - Purple */}
      <motion.div
        className="absolute bottom-20 right-16 w-12 h-12"
        animate={createFloatVariant()}
        transition={{ delay: 2.5 }}
      >
        <AnimatedRocketIcon
          className="w-full h-full"
          color="#7c3aed"
          delay={1600}
        />
      </motion.div>

      {/* Center Top - Cyan */}
      <motion.div
        className="absolute top-40 left-1/2 -translate-x-1/2 w-10 h-10"
        animate={createFloatVariant()}
        transition={{ delay: 0.5 }}
      >
        <AnimatedStarIcon
          className="w-full h-full"
          color="#0891b2"
          delay={900}
        />
      </motion.div>
    </div>
  );
}

// Decorative Background SVG with Beam Effects
function DecorativeSVG() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.08]">
      <svg
        className="w-full h-full"
        viewBox="0 0 1200 800"
        preserveAspectRatio="none"
      >
        {/* Main flowing beam - Dark Blue/Indigo - INFINITE */}
        <BeamPath
          path="M0,400 Q300,200 600,400 T1200,400"
          delay={500}
          duration={4}
          color="#1e40af"
          strokeWidth={3}
          beamIntensity={0.4}
          infinite={true}
        />
        {/* Top beam - Dark Teal/Cyan - INFINITE with random variation */}
        <BeamPath
          path="M0,200 Q300,100 600,200 T1200,200"
          delay={1000}
          duration={3.5}
          color="#0d9488"
          strokeWidth={2}
          beamIntensity={0.3}
          infinite={true}
          randomVariation={true}
        />
        {/* Bottom beam - Deep Purple - INFINITE */}
        <BeamPath
          path="M0,600 Q300,500 600,600 T1200,600"
          delay={1500}
          duration={4.5}
          color="#6b21a8"
          strokeWidth={2}
          beamIntensity={0.3}
          infinite={true}
        />
        {/* Additional beam paths - Teal gradient - Random variation */}
        <BeamPath
          path="M0,100 Q200,50 400,100 T800,100 T1200,100"
          delay={2000}
          duration={2.5}
          color="#14b8a6"
          strokeWidth={1.5}
          beamIntensity={0.25}
          randomVariation={true}
        />
        {/* Additional beam paths - Indigo gradient - INFINITE with random */}
        <BeamPath
          path="M0,700 Q400,650 800,700 T1600,700"
          delay={2500}
          duration={3}
          color="#4f46e5"
          strokeWidth={1.5}
          beamIntensity={0.25}
          infinite={true}
          randomVariation={true}
        />
        {/* Additional flowing beam - Purple gradient - Random variation */}
        <BeamPath
          path="M0,300 Q150,250 300,300 T600,300 T900,300 T1200,300"
          delay={3000}
          duration={3}
          color="#7c3aed"
          strokeWidth={1.2}
          beamIntensity={0.2}
          randomVariation={true}
        />
        {/* Additional flowing beam - Cyan gradient - INFINITE */}
        <BeamPath
          path="M0,500 Q250,450 500,500 T1000,500 T1500,500"
          delay={3500}
          duration={3.5}
          color="#0891b2"
          strokeWidth={1.2}
          beamIntensity={0.2}
          infinite={true}
        />
        {/* Extra random flowing beams for more dynamism */}
        <BeamPath
          path="M0,150 Q400,100 800,150 T1600,150"
          delay={Math.random() * 2000}
          duration={2.8}
          color="#06b6d4"
          strokeWidth={1}
          beamIntensity={0.15}
          randomVariation={true}
        />
        <BeamPath
          path="M0,650 Q200,600 400,650 T800,650 T1200,650"
          delay={Math.random() * 2000 + 1000}
          duration={3.2}
          color="#6366f1"
          strokeWidth={1}
          beamIntensity={0.15}
          infinite={true}
          randomVariation={true}
        />
      </svg>
    </div>
  );
}

export default function HeroSection() {
  const [hoveredPill, setHoveredPill] = useState<string | null>(null);

  return (
    <div
      id="hero"
      className="w-full overflow-x-hidden relative min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-20 overflow-hidden"
    >
      <DecorativeSVG />
      <FloatingIcons />
      <GrowthIllustration />
      {/* Top Banner */}
      <AnimatedSVG delay={200}>
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-teal-50/90 via-blue-50/90 to-indigo-50/90 backdrop-blur-sm border border-teal-200/50 text-sm text-gray-700 hover:from-teal-100/90 hover:via-blue-100/90 hover:to-indigo-100/90 hover:border-teal-300/50 transition-all duration-300 shadow-sm hover:shadow-md">
            <span>Introducing Branch Operations Learning Portal</span>
            <AnimatedArrowIcon className="w-4 h-4" />
          </div>
        </div>
      </AnimatedSVG>

      {/* Main Headline with animated underline */}
      <AnimatedSVG delay={400}>
        <div className="relative mb-6">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-black text-center max-w-4xl leading-tight">
            Turn learning into growth.
          </h1>
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-teal-500 via-blue-600 to-indigo-700 animate-[expand_1s_ease-out_0.8s_forwards]">
            <style jsx>{`
              @keyframes expand {
                to {
                  width: 60%;
                }
              }
            `}</style>
          </div>
        </div>
      </AnimatedSVG>

      {/* Subtitle */}
      <AnimatedSVG delay={600}>
        <p className="text-lg md:text-xl text-gray-600 text-center mb-12 max-w-2xl leading-relaxed">
          Branch Ops Open Learning Catalog is the modern training discovery
          platform for role-based pathways, skill development, and career
          advancement.
        </p>
      </AnimatedSVG>

      {/* CTA Buttons */}
      <AnimatedSVG delay={800}>
        <div className="flex flex-col sm:flex-row gap-4 mb-20">
          <button
            onClick={() => {
              const element = document.getElementById("catalog");
              if (element) element.scrollIntoView({ behavior: "smooth" });
            }}
            className="relative px-8 py-3.5 bg-black text-white rounded-lg font-medium hover:bg-gray-900 transition-all duration-300 text-base shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:scale-95"
          >
            <span className="relative z-10">Explore Catalog</span>
          </button>
          <button
            onClick={() => {
              const element = document.getElementById("pathways");
              if (element) element.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-8 py-3.5 bg-white text-black border-2 border-black rounded-lg font-medium hover:bg-gray-50 transition-all duration-300 text-base shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:scale-95"
          >
            View Pathways
          </button>
        </div>
      </AnimatedSVG>

      {/* Feature Pills with animated icons */}
      <AnimatedSVG delay={1000}>
        <div className="flex flex-wrap justify-center gap-4 max-w-4xl">
          {/* Role-Based Training */}
          <div
            onMouseEnter={() => setHoveredPill("role")}
            onMouseLeave={() => setHoveredPill(null)}
            className={`group relative flex items-center gap-2.5 px-5 py-3 rounded-full border text-sm font-medium cursor-pointer transition-all duration-300 ${
              hoveredPill === "role"
                ? "bg-teal-50 border-teal-400 text-teal-700 shadow-lg scale-105"
                : "bg-teal-50/50 border-teal-200 text-gray-800 hover:bg-teal-50 hover:border-teal-300"
            }`}
          >
            <div
              className={`transition-transform duration-300 ${
                hoveredPill === "role" ? "scale-110 rotate-12" : ""
              }`}
            >
              <AnimatedLinkIcon
                className="w-5 h-5"
                color="#0d9488"
                delay={1000}
              />
            </div>
            <span className="relative">
              Role-Based Training
              {hoveredPill === "role" && (
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-teal-600 animate-[expand_0.3s_ease-out]"></span>
              )}
            </span>
          </div>

          {/* Career Pathways */}
          <div
            onMouseEnter={() => setHoveredPill("pathway")}
            onMouseLeave={() => setHoveredPill(null)}
            className={`group relative flex items-center gap-2.5 px-5 py-3 rounded-full border text-sm font-medium cursor-pointer transition-all duration-300 ${
              hoveredPill === "pathway"
                ? "bg-blue-50 border-blue-400 text-blue-700 shadow-lg scale-105"
                : "bg-blue-50/50 border-blue-200 text-gray-800 hover:bg-blue-50 hover:border-blue-300"
            }`}
          >
            <div
              className={`transition-transform duration-300 ${
                hoveredPill === "pathway" ? "scale-110 rotate-12" : ""
              }`}
            >
              <AnimatedChartIcon
                className="w-5 h-5"
                color="#1e40af"
                delay={1100}
              />
            </div>
            <span className="relative">
              Career Pathways
              {hoveredPill === "pathway" && (
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-600 animate-[expand_0.3s_ease-out]"></span>
              )}
            </span>
          </div>

          {/* Learning Tracks */}
          <div
            onMouseEnter={() => setHoveredPill("track")}
            onMouseLeave={() => setHoveredPill(null)}
            className={`group relative flex items-center gap-2.5 px-5 py-3 rounded-full border text-sm font-medium cursor-pointer transition-all duration-300 ${
              hoveredPill === "track"
                ? "bg-indigo-50 border-indigo-400 text-indigo-700 shadow-lg scale-105"
                : "bg-indigo-50/50 border-indigo-200 text-gray-800 hover:bg-indigo-50 hover:border-indigo-300"
            }`}
          >
            <div
              className={`transition-transform duration-300 ${
                hoveredPill === "track" ? "scale-110 rotate-12" : ""
              }`}
            >
              <AnimatedUsersIcon
                className="w-5 h-5"
                color="#4f46e5"
                delay={1200}
              />
            </div>
            <span className="relative">
              Learning Tracks
              {hoveredPill === "track" && (
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-indigo-600 animate-[expand_0.3s_ease-out]"></span>
              )}
            </span>
          </div>
        </div>
      </AnimatedSVG>
   
    </div>
  );
}
