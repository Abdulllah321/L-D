"use client";
import Image from 'next/image'
import clsx from "clsx";
import Link from "next/link";
import { useState, useEffect } from "react";

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
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
        isScrolled
          ? scrollDirection === 'down'
            ? "-translate-y-full opacity-0"
            : "translate-y-0 opacity-100 bg-white/90 backdrop-blur-xl shadow-lg border-b border-gray-200/50"
          : "translate-y-0 opacity-100 bg-white/70 backdrop-blur-md"
      }`}
      style={{
        transform: isScrolled && scrollDirection === 'down' 
          ? 'translateY(-100%)' 
          : 'translateY(0)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">
          <button onClick={() => scrollToSection("hero")}>
            <Logo />
          </button>
          <Navigation />
          <Button />
        </div>
      </div>
    </header>
  );
}

const Logo = () => {
    return (
        <div className="flex items-center group cursor-pointer">
            <div className="relative border shadow-md p-1 rounded-full">
                <Image 
                    src="/logo.png" 
                    alt="Logo" 
                    width={40} 
                    height={40}
                    className="object-contain transition-transform duration-300  rounded-full group-hover:scale-110"
                />
            </div>
        </div>
    )
}


const navItems = {
  "hero": {
    name: "Home",
  },
  "catalog": {
    name: "Catalog",
  },
  "pathways": {
    name: "Pathways",
  },
  "resources": {
    name: "Resources",
  },
};

export function Navigation() {
  const [activePath, setActivePath] = useState("hero");

  const isActiveLink = (path: string) => {
    return activePath === path;
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
      <div className="glass flex items-center justify-between overflow-hidden rounded-xl bg-gray-100/50 backdrop-blur-sm border border-gray-200/50 shadow-sm">
        {Object.entries(navItems).map(([path, { name }], index, array) => {
          const isActive = isActiveLink(path);
          const isFirst = index === 0;
          const isLast = index === array.length - 1;
          const prevPath = index > 0 ? array[index - 1][0] : null;
          const nextPath =
            index < array.length - 1 ? array[index + 1][0] : null;

          return (
            <button
              onClick={() => scrollToSection(path)}
              className={clsx(
                "flex items-center justify-center bg-black p-1.5 px-4 text-sm text-white transition-all duration-300 dark:bg-white dark:text-black cursor-pointer",
                isActive
                  ? "mx-2 rounded-xl font-semibold text-sm"
                  : clsx(
                      (isActiveLink(prevPath || "") || isFirst) &&
                        "rounded-l-xl",
                      (isActiveLink(nextPath || "") || isLast) &&
                        "rounded-r-xl"
                    )
              )}
              key={path}
            >
              {name}
            </button>
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
    <button 
      onClick={() => scrollToSection("catalog")}
      className="bg-slate-800 no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-full p-px text-xs font-semibold leading-6 text-white inline-block hover:scale-105 transition-transform duration-300"
    >
      <span className="absolute inset-0 overflow-hidden rounded-full">
        <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </span>
      <div className="relative flex space-x-2 items-center z-10 rounded-full bg-zinc-950 py-0.5 px-4 ring-1 ring-white/10">
        <span>Explore Catalog</span>
        <svg
          fill="none"
          height="16"
          viewBox="0 0 24 24"
          width="16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10.75 8.75L14.25 12L10.75 15.25"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
        </svg>
      </div>
      <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40" />
    </button>
  );
}

export default Header