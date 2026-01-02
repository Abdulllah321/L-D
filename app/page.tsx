"use client";

import Hero from "./components/landing/Hero";
import LearningTracksIntro from "./components/landing/LearningTracksIntro";
import DesignationCatalog from "./components/landing/DesignationCatalog";
import DomeGallery from "./components/landing/DomeGallery";
import { motion } from "framer-motion";
import Testimonial from "./components/landing/Testimonial";
import Logo from "@/components/ui/sparkles-logo";
import Footer from "./components/landing/Footer";
import Header from "./components/Header";

export default function Home() {
  return (
    <div className="">
      <Header />
      <main className="bg-gray-50 ">
        <Hero />
        <LearningTracksIntro />
        <div className="py-24 px-4">
          {/* Header with Masking Animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <motion.h2
              className="text-4xl md:text-4xl font-bold text-clip text-transparent bg-gradient-to-b pb-2 from-gray-500 to-gray-900 bg-clip-text mb-4"
              initial={{ clipPath: "polygon(0 0, 0 0, 0 100%, 0% 100%)" }}
              whileInView={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              Our Previous Events
            </motion.h2>
            <motion.p
              className="text-gray-600 max-w-2xl mx-auto text-lg"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              We have conducted several events to help you learn and grow.
            </motion.p>
          </motion.div>

          <div className="w-full h-[600px] md:h-[700px] lg:h-[800px] relative max-w-7xl mx-auto">
            <DomeGallery
              overlayBlurColor="#f9fafb"
              grayscale={false}
            // minRadius={400}
            // maxRadius={500}
            />
          </div>
        </div>
        <Testimonial />
        <Logo />
        <Footer />
      </main>
    </div>
  );
}
