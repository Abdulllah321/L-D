"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import clsx from "clsx";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string, sectionId?: string) => {
    if (sectionId) {
      if (pathname !== "/") {
        router.push(`/#${sectionId}`);
      } else {
        const element = document.getElementById(sectionId);
        element?.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      router.push(href);
    }
  };

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-6 inset-x-0 z-50 flex flex-col items-center pointer-events-none px-4"
    >
      <div
        className={clsx(
          "pointer-events-auto relative flex items-center p-2 rounded-full border transition-all duration-300",
          isScrolled || isMobileMenuOpen
            ? "bg-white/90 backdrop-blur-xl border-white/20 shadow-2xl shadow-zinc-500/10"
            : "bg-white/70 backdrop-blur-lg border-white/40 shadow-xl shadow-zinc-500/5"
        )}
      >
        <div className="flex items-center gap-1">
          {/* Logo */}
          <button
            onClick={() => router.push("/")}
            className="relative flex items-center justify-center h-10 px-2 hover:scale-105 transition-transform"
          >
            <Image
              src="/image.png"
              alt="Learning & Development"
              width={160}
              height={40}
              className="h-8 w-auto object-contain"
            />
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 mx-1">
            <div className="w-px h-4 bg-zinc-200 mx-1" />
            <nav className="flex items-center gap-1">
              <NavItem
                label="Home"
                isActive={pathname === "/"}
                onClick={() => router.push("/")}
              />
              <NavItem
                label="Catalog"
                isActive={pathname?.startsWith("/catalog")}
                onClick={() => router.push("/catalog")}
              />
              <NavItem
                label="Pathways"
                isActive={false}
                onClick={() => handleNavClick("/", "pathways")}
              />
            </nav>
            <div className="w-px h-4 bg-zinc-200 mx-1" />
          </div>

          {/* Desktop CTA */}
          <button
            onClick={() => router.push("/catalog")}
            className="hidden md:flex group relative px-5 py-2 rounded-full bg-zinc-900 text-white text-sm font-medium transition-all hover:bg-zinc-800 hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
          >
            <span className="relative z-10">Explore</span>
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-zinc-100/50 hover:bg-zinc-100 text-zinc-600 transition-colors ml-1"
          >
            <div className="relative w-4 h-4">
              <span className={clsx("absolute left-0 w-full h-0.5 bg-current transition-all duration-300", isMobileMenuOpen ? "top-1.5 rotate-45" : "top-0.5")} />
              <span className={clsx("absolute left-0 w-full h-0.5 bg-current transition-all duration-300", isMobileMenuOpen ? "opacity-0" : "top-1.5")} />
              <span className={clsx("absolute left-0 w-full h-0.5 bg-current transition-all duration-300", isMobileMenuOpen ? "top-1.5 -rotate-45" : "top-2.5")} />
            </div>
          </button>
        </div>

        {/* Mobile Dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 mt-2 p-2 bg-transparent backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl shadow-zinc-500/10 overflow-hidden flex flex-col gap-1 md:hidden min-w-[200px]"
            >
              <MobileNavItem label="Home" onClick={() => { router.push("/"); setIsMobileMenuOpen(false); }} isActive={pathname === "/"} />
              <MobileNavItem label="Catalog" onClick={() => { router.push("/catalog"); setIsMobileMenuOpen(false); }} isActive={pathname?.startsWith("/catalog") || false} />
              <MobileNavItem label="Pathways" onClick={() => { handleNavClick("/", "pathways"); setIsMobileMenuOpen(false); }} isActive={false} />
              <div className="h-px bg-zinc-100 my-1" />
              <button
                onClick={() => { router.push("/catalog"); setIsMobileMenuOpen(false); }}
                className="w-full relative px-4 py-2.5 rounded-xl bg-zinc-900 text-white text-sm font-medium transition-all active:scale-[0.98] text-center"
              >
                Explore Catalog
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}

function MobileNavItem({ label, onClick, isActive }: { label: string; onClick: () => void; isActive: boolean }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "w-full px-4 py-2.5 rounded-xl text-sm font-medium text-left transition-colors",
        isActive ? "bg-zinc-100 text-zinc-900" : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
      )}
    >
      {label}
    </button>
  );
}

function NavItem({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "relative px-4 py-2 rounded-full text-sm font-medium transition-colors hover:bg-black/5",
        isActive ? "text-zinc-900" : "text-zinc-500 hover:text-zinc-900"
      )}
    >
      {label}
      {isActive && (
        <motion.div
          layoutId="navbar-indicator"
          className="absolute inset-0 bg-white shadow-sm rounded-full border border-zinc-100 -z-10"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
    </button>
  );
}
