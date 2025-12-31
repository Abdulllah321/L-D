"use client";
import Image from 'next/image'
import clsx from "clsx";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 10);

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setScrollDirection('down');
      } else if (currentScrollY < lastScrollY) {
        setScrollDirection('up');
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{
        y: scrollDirection === 'down' && isScrolled ? -100 : 0,
        opacity: scrollDirection === 'down' && isScrolled ? 0 : 1
      }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className={clsx(
        "relative  top-0 left-0 right-0 w-full z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-200/60"
          : "bg-white/60 backdrop-blur-md"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <motion.button
            onClick={() => scrollToSection("hero")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Logo />
          </motion.button>
          <Navigation />
          <Button />
        </div>
      </div>
    </motion.header>
  );
}

const Logo = () => {
  return (
    <div className="flex items-center gap-3 group cursor-pointer">
      <div className="relative p-1.5 rounded-xl bg-gradient-to-br from-teal-500/10 to-blue-500/10 border border-teal-200/30 shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:border-teal-300/50">
        <Image
          src="/logo.png"
          alt="Logo"
          width={36}
          height={36}
          className="object-contain rounded-lg transition-transform duration-300 group-hover:scale-105"
        />
      </div>
    </div>
  )
}


const navItems = {
  "hero": {
    name: "Home",
    href: "/",
  },
  "catalog": {
    name: "Catalog",
    href: "/catalog",
  },
  "pathways": {
    name: "Pathways",
  },
  "resources": {
    name: "Resources",
  },
};

export function Navigation() {
  const router = useRouter(); // Define router here
  const pathname = usePathname();
  const [activePath, setActivePath] = useState("hero");

  useEffect(() => {
    // If we are on a catalog sub-page, set catalog as active
    if (pathname?.startsWith('/catalog')) {
      setActivePath('catalog');
      return;
    }

    const handleScroll = () => {
      if (pathname !== '/') return; // Only scroll spy on home page

      const sections = Object.keys(navItems);
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActivePath(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const handleNavClick = (key: string, item: { name: string, href?: string }) => {
    if (item.href) {
      // If it's a specific route
      router.push(item.href);
      setActivePath(key);
    } else {
      // It's a section on the Landing Page
      if (pathname === '/') {
        scrollToSection(key);
      } else {
        // Navigate to home with hash
        router.push(`/#${key}`);
        // Note: You might need a useEffect on the home page to handle hash scrolling if Next.js doesn't do it automatically or if smooth scrolling is custom. 
        // But for now, this router.push is the standard way.
      }
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActivePath(id);
    }
  };

  return (
    <nav className="hidden md:flex items-center justify-center">
      <div className="flex items-center gap-1 p-1.5 rounded-2xl bg-gray-100/80 backdrop-blur-sm border border-gray-200/60 shadow-sm">
        {Object.entries(navItems).map(([path, { name, href }]) => {
          const isActive = activePath === path;

          return (
            <motion.button
              key={path}
              onClick={() => handleNavClick(path, { name, href })}
              className={clsx(
                "relative px-4 py-2 text-sm font-medium transition-all duration-200 rounded-xl",
                isActive
                  ? "text-white"
                  : "text-gray-600 hover:text-gray-900"
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute inset-0 bg-gradient-to-r from-teal-600 to-blue-600 rounded-xl shadow-md"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{name}</span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}



const Button = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.button
      onClick={() => scrollToSection("catalog")}
      className="group relative overflow-hidden rounded-full bg-gradient-to-r from-teal-600 to-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-teal-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-teal-500/30"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative flex items-center gap-2 z-10">
        <span>Explore Catalog</span>
        <motion.svg
          fill="none"
          height="16"
          viewBox="0 0 24 24"
          width="16"
          xmlns="http://www.w3.org/2000/svg"
          animate={{ x: [0, 4, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <path
            d="M10.75 8.75L14.25 12L10.75 15.25"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </motion.svg>
      </div>
    </motion.button>
  );
}

export default Header