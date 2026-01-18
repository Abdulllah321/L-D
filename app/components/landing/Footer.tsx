'use client';

import { motion } from 'framer-motion';
import { Rocket, User, Mail, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
export default function FooterGlow() {
  return (
    <footer className="relative z-10 mt-8 w-full overflow-hidden pt-0 pb-8">
      <style jsx global>{`
        .glass {
          backdrop-filter: blur(3px) saturate(180%);
          background: radial-gradient(circle, #fff9 0%, #e0f2fe4d 60%, #f0f9ff 100%);
          border: 1px solid #0d94881a;
          justify-content: center;
          align-items: center;
          transition: all .3s;
          display: flex;
        }
        .glass:where(.dark, .dark *) {
          display: flex
          backdrop-filter: blur(2px) !important;
          background: radial-gradient(circle, #ffffff1a 0%, #0d94881a 60%, #1e40af1a 100%) !important;
          border: 1px solid #0d94880d !important;
          border-radius: 16px !important;
          justify-content: center !important;
          align-items: center !important;
        }
      `}</style>
      <div className="pointer-events-none absolute top-0 left-1/2 z-0 h-full w-full -translate-x-1/2 select-none">
        <motion.div
          className="absolute -top-32 left-1/4 h-72 w-72 rounded-full bg-teal-500/20 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute right-1/4 -bottom-24 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
      <div className="glass relative mx-auto flex max-w-6xl flex-col items-center gap-8 rounded-2xl px-6 py-10 md:flex-row md:items-start md:justify-between md:gap-12">
        <div className="flex flex-col items-center md:items-start">
          <Link href="/" className="mb-4 flex items-center gap-3">
            <Image
              src="/image.png"
              alt="Learning & Development"
              width={220}
              height={48}
              className="h-10 w-auto object-contain scale-130 origin-left"
            />
          </Link>
          <p className="text-gray-700 mb-6 max-w-xs text-center text-sm md:text-left">
            Empowering branch operations professionals with structured learning pathways,
            role-specific training, and continuous development opportunities.
          </p>
          <div className="mt-2 flex flex-col gap-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-teal-600" />
              <span>learning@faysalbank.com</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-blue-600" />
              <span>+92 21 111 000 000</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-indigo-600" />
              <span>Karachi, Pakistan</span>
            </div>
          </div>
        </div>
        <nav className="flex w-full flex-col gap-9 text-center md:w-auto md:flex-row md:justify-end md:text-left">
          <div>
            <div className="mb-3 text-xs font-semibold tracking-widest text-teal-600 uppercase">
              Navigation
            </div>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-600 hover:text-teal-600 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/catalog"
                  className="text-gray-600 hover:text-teal-600 transition-colors"
                >
                  Designation Catalog
                </Link>
              </li>
              <li>
                <Link
                  href="/#pathways"
                  className="text-gray-600 hover:text-teal-600 transition-colors"
                >
                  Learning Tracks
                </Link>
              </li>
              <li>
                <Link
                  href="/catalog"
                  className="text-gray-600 hover:text-teal-600 transition-colors"
                >
                  Resources
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <div className="mb-3 text-xs font-semibold tracking-widest text-blue-600 uppercase">
              Learning Tracks
            </div>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/catalog"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Regular Track
                </Link>
              </li>
              <li>
                <Link
                  href="/catalog"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Hi-Po Track
                </Link>
              </li>
              <li>
                <Link
                  href="/catalog"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  All Designations
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <div className="mb-3 text-xs font-semibold tracking-widest text-indigo-600 uppercase">
              Support
            </div>
            <ul className="space-y-2">
              <li>
                <a href="mailto:learning@faysalbank.com" className="text-gray-600 hover:text-indigo-600 transition-colors">
                  Contact L&D Team
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">
                  Training Resources
                </a>
              </li>
              <li>
                <Link href="/admin" className="text-gray-600 hover:text-indigo-600 transition-colors">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>
      <div className="text-gray-600 relative z-10 mt-10 text-center text-xs">
        <span>&copy; 2025 Faysal Bank Limited. All rights reserved.</span>
        <span className="block mt-1 text-gray-500">
          Branch Operations Learning Portal • Generated for L&D use
        </span>
      </div>
    </footer>
  );
}
