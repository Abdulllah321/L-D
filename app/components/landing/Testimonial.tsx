'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Marquee } from '@/components/ui/marquee';

export function Highlight({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'bg-teal-500/10 p-1 py-0.5 font-bold text-teal-600',
        className,
      )}
    >
      {children}
    </span>
  );
}

export interface TestimonialCardProps {
  name: string;
  role: string;
  img?: string;
  description: React.ReactNode;
  className?: string;
  [key: string]: any;
}

const getInitials = (fullName: string) =>
  fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join('');

export function TestimonialCard({
  description,
  name,
  img,
  role,
  className,
  ...props // Capture the rest of the props
}: TestimonialCardProps) {
  return (
    <div
      className={cn(
        'mb-4 flex w-full max-w-full cursor-pointer break-inside-avoid flex-col items-center justify-between gap-6 rounded-xl p-4',
        // theme styles
        'border-border bg-card/50 border shadow-sm',
        // hover effect
        'transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md',
        className,
      )}
      {...props}
      style={{ maxWidth: '100%', boxSizing: 'border-box' }}
    >
      <div className="text-muted-foreground text-sm font-normal select-none">
        {description}
        <div className="flex flex-row py-1">
          <Star className="size-4 fill-teal-500 text-teal-500" />
          <Star className="size-4 fill-teal-500 text-teal-500" />
          <Star className="size-4 fill-teal-500 text-teal-500" />
          <Star className="size-4 fill-teal-500 text-teal-500" />
          <Star className="size-4 fill-teal-500 text-teal-500" />
        </div>
      </div>

      <div className="flex w-full items-center justify-start gap-5 select-none">
        {img ? (
          <img
            width={40}
            height={40}
            src={img}
            alt={name}
            className="size-10 rounded-full object-cover ring-1 ring-teal-500/20 ring-offset-2"
          />
        ) : (
          <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-blue-600 text-xs font-semibold text-white ring-1 ring-teal-500/20 ring-offset-2">
            {getInitials(name)}
          </div>
        )}

        <div>
          <p className="text-foreground font-medium">{name}</p>
          <p className="text-muted-foreground text-xs font-normal">{role}</p>
        </div>
      </div>
    </div>
  );
}
const testimonials = [
  {
    name: 'Zahoor Khattak',
    role: 'Deputy General Manager – North',
    description: (
      <p>
        A commendable initiative undertaken by the bank, enabling its young professionals to autonomously delineate their hierarchical progression and career trajectories in alignment with their intrinsic passions and individual competencies.
      </p>
    ),
  },
  {
    name: 'Raza Ahmed Khan',
    role: 'Branch Manager',
    description: (
      <p>
        Training session was very interesting and knowledgeable. I am fully satisfied regarding this training and thank the learning department for arranging this session.
      </p>
    ),
  },
  {
    name: 'Imran Ali Zafar',
    role: 'Branch Manager',
    description: (
      <p>
        Integrates practical case studies, digital tools, and trade compliance insights to make the SME and Trade course more impactful and future-ready.
      </p>
    ),
  },
  {
    name: 'Saeed Ahmad',
    role: 'Branch Service Manager',
    description: (
      <p>
        Had an amazing opportunity to learn with grace. Thanks to Usman sb and the L&amp;D team, especially Ms Zubia and Majid sb, for making the journey memorable.
      </p>
    ),
  },
  {
    name: 'Muhammad Usman',
    role: 'Trainer',
    description: (
      <p>
        The journey would not have been complete without the great support from Ms Zubia and Majid, whose guidance elevated the entire learning experience.
      </p>
    ),
  },
  {
    name: 'Qaiser Jadoon',
    role: 'Regional Manager',
    description: (
      <p>
        Great job done by trainers and the entire L&amp;D team for organising the event and thanks to all trainees who attended and made it successful. Hoping everyone starts a new journey with full zeal and zest.
      </p>
    ),
  },
  {
    name: 'Ammar Azad',
    role: 'Trainee',
    description: (
      <p>
        It was overall a good experience. As a fresh graduate starting my banking career, I learned a lot from the training. Special thanks to Madam Zubia and Sir Majid for their continuous support and excellent management throughout the entire program.
      </p>
    ),
  },
  {
    name: 'Muhammad Ishaq Mir',
    role: 'VP / AOM',
    description: (
      <p>
        Very well done L&amp;D team and congratulations to all participants for the successful completion of the BSM Emerging Training.
      </p>
    ),
  },
  {
    name: 'Naqash Haider',
    role: 'Bank Teller',
    description: (
      <p>
        I&apos;m honored to have participated in the Emerging BSM Program, a flagship initiative that exemplifies dedication to talent development and leadership excellence. Grateful to the organizers and facilitators for a well-structured and engaging program.
      </p>
    ),
  },
  {
    name: 'Muhammad Basit Ullah',
    role: 'Management Trainee Officer',
    description: (
      <p>
        Inspiring initiative. Great to see the bank investing in team building and empowering women through such engaging sessions.
      </p>
    ),
  },
  {
    name: 'Nadeem Yaqoob',
    role: 'SVP / Area Operations Manager',
    description: (
      <p>
        Amazing. Ittehad Summit translated corporate values into actionable leadership experiences.
      </p>
    ),
  },
  {
    name: 'Mohsina Rayees',
    role: 'RVP',
    description: (
      <p>
        Excellent job. It&apos;s truly amazing, Zubia. We enjoyed the Ittehad Summit in Karachi; it was superb and we learned a lot.
      </p>
    ),
  },
];

export default function Testimonials() {
  return (
    <section className="relative w-full overflow-x-hidden py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Decorative elements */}
        <div className="absolute top-20 -left-10 z-10 h-64 w-64 rounded-full bg-teal-500/5 blur-3xl pointer-events-none" />
        <div className="absolute -right-10 bottom-20 z-10 h-64 w-64 rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-foreground mb-4 text-center text-4xl leading-[1.2] font-bold tracking-tighter md:text-5xl">
          What Our Team Members Are Saying
        </h2>
        <h3 className="text-muted-foreground mx-auto mb-8 max-w-lg text-center text-lg font-medium tracking-tight text-balance">
          Don&apos;t just take our word for it. Here&apos;s what{' '}
          <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
            branch operations professionals
          </span>{' '}
          are saying about the{' '}
          <span className="font-semibold text-teal-600">Learning Catalog</span>
        </h3>
      </motion.div>

        <div className="relative mt-6 max-h-screen overflow-hidden w-full">
          <div className="gap-x-4 md:columns-2 xl:columns-3 2xl:columns-4 w-full overflow-x-hidden" style={{ columnGap: '1rem' }}>
            {Array(Math.ceil(testimonials.length / 3))
              .fill(0)
              .map((_, i) => (
                <div key={i} className="w-full overflow-x-hidden break-inside-avoid">
                  <Marquee
                    vertical
                    className={cn("w-full overflow-x-hidden", {
                      '[--duration:60s]': i === 1,
                      '[--duration:30s]': i === 2,
                      '[--duration:70s]': i === 3,
                    })}
                  >
                    {testimonials.slice(i * 3, (i + 1) * 3).map((card, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{
                          delay: Math.random() * 0.8,
                          duration: 1.2,
                        }}
                        className="w-full break-inside-avoid"
                        style={{ maxWidth: '100%' }}
                      >
                        <TestimonialCard {...card} />
                      </motion.div>
                    ))}
                  </Marquee>
                </div>
              ))}
          </div>
          <div className="from-background pointer-events-none absolute inset-x-0 bottom-0 h-1/4 w-full bg-gradient-to-t from-20%"></div>
          <div className="from-background pointer-events-none absolute inset-x-0 top-0 h-1/4 w-full bg-gradient-to-b from-20%"></div>
        </div>
      </div>
    </section>
  );
}
