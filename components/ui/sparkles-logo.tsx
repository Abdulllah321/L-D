'use client';

import { SparklesCore } from '@/components/ui/sparkles';
import { Marquee } from '@/components/ui/marquee';
import { motion } from 'framer-motion';

export default function Logo() {
  const logos = [
    { src: '/logo/COLUMBIA UNI.png', alt: 'Columbia University logo' },
    { src: '/logo/IBA.png', alt: 'IBA logo' },
    { src: '/logo/INSEAD.png', alt: 'INSEAD logo' },
    { src: '/logo/LIMS.png', alt: 'LIMS logo' },
    { src: '/logo/MIT.png', alt: 'MIT logo' },
    { src: '/logo/NIBAF.png', alt: 'NIBAF logo' },
    { src: '/logo/PSTD.png', alt: 'PSTD logo' },
    { src: '/logo/coursera.png', alt: 'Coursera logo' },
    { src: '/logo/learning-minds.png', alt: 'Learning Minds logo' }
  ];

  return (
    <div className="relative w-full overflow-hidden bg-transparent">
      <div className="mx-auto mt-32 w-full max-w-5xl px-6 relative z-10">
        <div className="text-center text-3xl font-bold text-gray-900">
          <span className="bg-gradient-to-r from-teal-600 via-blue-600 to-indigo-700 bg-clip-text text-transparent">
            Trusted by experts.
          </span>

          <br />

          <span className="text-gray-800">Used by the leaders.</span>
        </div>

        

        <div className="mt-10 px-4">
          <div className="relative">
            <Marquee pauseOnHover className="py-4">
              {logos.map((logo) => (
                <div key={logo.src} className="flex items-center justify-center px-8">
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    className="h-12 w-auto object-contain opacity-80 grayscale transition hover:opacity-100 hover:grayscale-0 md:h-16 lg:h-20"
                  />
                </div>
              ))}
            </Marquee>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-gray-50 via-gray-50/80 to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-gray-50 via-gray-50/80 to-transparent" />
          </div>
        </div>
      </div>

      <div className="relative -mt-32 h-96 w-full overflow-hidden z-0 [mask-image:radial-gradient(50%_50%,white,transparent)] before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_bottom_center,#0d9488,transparent_70%)] before:opacity-30 after:absolute after:top-1/2 after:-left-1/2 after:aspect-[1/0.7] after:w-[200%] after:rounded-[100%] after:border-t after:border-teal-200/30 after:bg-gray-50">
        <SparklesCore
          id="tsparticles"
          background="transparent"
          particleDensity={300}
          particleColor="#0d9488"
          className="absolute inset-x-0 bottom-0 h-full w-full [mask-image:radial-gradient(50%_50%,white,transparent_85%)]"
        />
      </div>
    <div className="absolute inset-0 top-2/3 flex flex-col items-center justify-center">
      <motion.h1 
        className="text-8xl md:text-9xl font-display font-extrabold tracking-tight relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        style={{
          fontFamily: 'var(--font-display), sans-serif',
          letterSpacing: '-0.03em',
        }}
      >
        <motion.span
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            background: 'linear-gradient(135deg, #0d9488 0%, #0891b2 25%, #3b82f6 50%, #6366f1 75%, #8b5cf6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            backgroundSize: '200% 200%',
            display: 'inline-block',
            filter: 'drop-shadow(0 4px 20px rgba(13, 148, 136, 0.25)) drop-shadow(0 0 40px rgba(59, 130, 246, 0.15))',
          }}
        >
          L & D
        </motion.span>
      </motion.h1>
      <motion.p 
        className="text-sm md:text-base text-gray-500 mt-2 tracking-wider font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        Learning & Development
      </motion.p>
      </div>
    </div>
  );
}
