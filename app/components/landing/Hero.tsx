"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowRight, PlayCircle } from "lucide-react";
import FloatingLines from "./HeroPrismBG";

export default function Hero() {
    const router = useRouter();

    const handleExploreClick = () => {
        router.push('/catalog');
    };

    const handlePathwaysClick = () => {
        const element = document.getElementById("pathways");
        if (element) element.scrollIntoView({ behavior: "smooth" });
    };

    return (<>
        <section className="relative w-full h-screen overflow-hidden bg-black text-white flex flex-col items-center justify-center">
            {/* Prism Background */}
            <div className="absolute inset-0 z-0 opacity-80">

                <FloatingLines
                    linesGradient={["#47c1f5", "#2F4BC0", "#47f592"]}
                    animationSpeed={1}
                    interactive
                    bendRadius={5}
                    bendStrength={-0.5}
                    mouseDamping={0.05}
                    parallax
                    parallaxStrength={0.2}
                />


            </div>

            {/* Content Overlay */}
            <div className="relative z-10 w-full max-w-5xl mx-auto px-6 flex flex-col items-center text-center mt-[-40px] pointer-events-none">
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-100 border border-zinc-200 mb-8 hover:bg-zinc-50 transition-colors shadow-sm"
                >
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                    </span>
                    <span className="text-sm font-medium tracking-wide text-zinc-600">
                        Branch Operations Learning Portal
                    </span>
                </motion.div>

                {/* Title */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 leading-[1.1] text-white">
                        Turn learning <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 via-blue-600 to-purple-600 animate-gradient-x">
                            into growth.
                        </span>
                    </h1>
                </motion.div>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="max-w-2xl mx-auto text-lg md:text-xl text-zinc-100 leading-relaxed mb-10"
                >
                    Branch Ops Open Learning Catalog is the modern training discovery platform for role-based pathways, skill development, and career advancement.
                </motion.p>

                {/* Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
                >
                    <button
                        onClick={handleExploreClick}
                        className="group relative w-full sm:w-auto px-8 py-4 bg-zinc-900 text-white rounded-full font-semibold transition-all hover:scale-105 active:scale-100 shadow-[0_6px_0_rgb(24,24,27),0_0_0_2px_#ffffff,inset_0_1px_0_rgba(255,255,255,0.4)] active:shadow-[0_0_0_2px_#ffffff,inset_0_1px_0_rgba(255,255,255,0.4)] active:translate-y-[6px] flex items-center justify-center gap-2 overflow-hidden pointer-events-auto"
                    >
                        <div className="bg-gradient-to-t from-white/10 to-transparent via-white/5 absolute top-0 left-0 w-full h-full rounded-full" />
                        <span className="relative z-10">Explore Catalog</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
                    </button>

                    <button
                        onClick={handlePathwaysClick}
                        className="group w-full sm:w-auto px-8 py-4 bg-white text-zinc-900 rounded-full font-semibold transition-all hover:scale-105 active:scale-100 shadow-[0_6px_0_rgb(228,228,231),0_0_0_2px_#ffffff,inset_0_0_0_1px_rgb(228,228,231)] active:shadow-[0_0_0_2px_#ffffff,inset_0_0_0_1px_rgb(228,228,231)] active:translate-y-[6px] flex items-center justify-center gap-2 overflow-hidden pointer-events-auto"
                    >
                        <PlayCircle className="w-5 h-5 text-zinc-500 group-hover:text-zinc-900 transition-colors" />
                        <span>View Pathways</span>
                    </button>
                </motion.div>
            </div>

            {/* Bottom Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent pointer-events-none z-10" />
        </section>
        {/* <div className="absolute top-full left-0 right-0 h-40 bg-gradient-to-b from-black  to-transparent pointer-events-none z-10" /> */}
    </>
    );
}