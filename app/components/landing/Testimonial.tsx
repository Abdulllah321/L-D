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
        'mb-4 flex w-full cursor-pointer break-inside-avoid flex-col items-center justify-between gap-6 rounded-xl p-4',
        // theme styles
        'border-border bg-card/50 border shadow-sm',
        // hover effect
        'transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md',
        className,
      )}
      {...props}
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
        <img
          width={40}
          height={40}
          src={img || ''}
          alt={name}
          className="size-10 rounded-full ring-1 ring-teal-500/20 ring-offset-2"
        />

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
    name: 'Ahmed Hassan',
    role: 'Branch Service Manager',
    img: 'https://randomuser.me/api/portraits/men/22.jpg',
    description: (
      <p>
        The Learning Catalog has transformed how I approach my team&apos;s development.
        <Highlight>
          The clear pathways helped me identify skill gaps and create targeted training plans.
        </Highlight>{' '}
        My branch performance has improved significantly since implementing structured learning.
      </p>
    ),
  },
  {
    name: 'Fatima Ali',
    role: 'Service Ambassador',
    img: 'https://randomuser.me/api/portraits/women/33.jpg',
    description: (
      <p>
        As a new SA, I was overwhelmed by all the training options available.
        <Highlight>
          The role-based pathways made it easy to find exactly what I needed to excel.
        </Highlight>{' '}
        I completed my core trainings in just 3 months and feel much more confident.
      </p>
    ),
  },
  {
    name: 'Muhammad Khan',
    role: 'Branch Service Officer',
    img: 'https://randomuser.me/api/portraits/men/32.jpg',
    description: (
      <p>
        The Regular Learning Track provided a clear roadmap for my career growth.
        <Highlight>
          I progressed from BSO to BSM within 18 months by following the structured pathway.
        </Highlight>{' '}
        The program sheets were especially helpful in preparing for each training.
      </p>
    ),
  },
  {
    name: 'Ayesha Malik',
    role: 'Area Operations Manager',
    img: 'https://randomuser.me/api/portraits/women/44.jpg',
    description: (
      <p>
        Being selected for the Hi-Po track was a game-changer for my career.
        <Highlight>
          The accelerated pathway exposed me to leadership concepts I wouldn&apos;t have discovered otherwise.
        </Highlight>{' '}
        I&apos;m now better equipped to handle regional responsibilities.
      </p>
    ),
  },
  {
    name: 'Hassan Raza',
    role: 'Regional Operations Manager',
    img: 'https://randomuser.me/api/portraits/men/55.jpg',
    description: (
      <p>
        The Learning Catalog helped me understand the complete journey from frontline to leadership.
        <Highlight>
          I use it regularly to mentor my team and guide their career development.
        </Highlight>{' '}
        The transparency of pathways builds trust and motivation across all levels.
      </p>
    ),
  },
  {
    name: 'Sana Ahmed',
    role: 'Trainee Branch SA',
    img: 'https://randomuser.me/api/portraits/women/67.jpg',
    description: (
      <p>
        Starting as a trainee, I was unsure about my learning path.
        <Highlight>
          The catalog showed me exactly which trainings to complete and in what order.
        </Highlight>{' '}
        I feel prepared and ready to take on my role as a full Service Ambassador.
      </p>
    ),
  },
  {
    name: 'Omar Sheikh',
    role: 'Branch Service Manager',
    img: 'https://randomuser.me/api/portraits/men/78.jpg',
    description: (
      <p>
        The interactive program sheets are incredibly detailed and practical.
        <Highlight>
          I can see the full agenda, trainers, and objectives before committing to a training.
        </Highlight>{' '}
        This transparency helps me plan my schedule and maximize learning outcomes.
      </p>
    ),
  },
  {
    name: 'Zainab Hussain',
    role: 'Service Ambassador',
    img: 'https://randomuser.me/api/portraits/women/89.jpg',
    description: (
      <p>
        Customer satisfaction scores in my branch improved by 35% after completing the service excellence track.
        <Highlight>
          The refresher trainings keep my skills sharp and up-to-date.
        </Highlight>{' '}
        I recommend this portal to all new team members.
      </p>
    ),
  },
  {
    name: 'Bilal Iqbal',
    role: 'Area Operations Manager',
    img: 'https://randomuser.me/api/portraits/men/92.jpg',
    description: (
      <p>
        The Hi-Po track challenged me with advanced governance and leadership modules.
        <Highlight>
          I gained exposure to strategic thinking and broader organizational perspectives.
        </Highlight>{' '}
        This accelerated my readiness for regional responsibilities.
      </p>
    ),
  },
  {
    name: 'Nida Farooq',
    role: 'Branch Service Officer',
    img: 'https://randomuser.me/api/portraits/women/29.jpg',
    description: (
      <p>
        The Regular Learning Track provided a solid foundation for my role.
        <Highlight>
          Each training built on the previous one, creating a comprehensive skill set.
        </Highlight>{' '}
        I&apos;m now confident in handling complex customer interactions and branch operations.
      </p>
    ),
  },
];

export default function Testimonials() {
  return (
    <section className="relative container py-10">
      {/* Decorative elements */}
      <div className="absolute top-20 -left-20 z-10 h-64 w-64 rounded-full bg-teal-500/5 blur-3xl" />
      <div className="absolute -right-20 bottom-20 z-10 h-64 w-64 rounded-full bg-blue-500/5 blur-3xl" />

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

      <div className="relative mt-6 max-h-screen overflow-hidden">
        <div className="gap-4 md:columns-2 xl:columns-3 2xl:columns-4">
          {Array(Math.ceil(testimonials.length / 3))
            .fill(0)
            .map((_, i) => (
              <Marquee
                vertical
                key={i}
                className={cn({
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
                  >
                    <TestimonialCard {...card} />
                  </motion.div>
                ))}
              </Marquee>
            ))}
        </div>
        <div className="from-background pointer-events-none absolute inset-x-0 bottom-0 h-1/4 w-full bg-gradient-to-t from-20%"></div>
        <div className="from-background pointer-events-none absolute inset-x-0 top-0 h-1/4 w-full bg-gradient-to-b from-20%"></div>
      </div>
    </section>
  );
}
