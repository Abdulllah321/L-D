'use client';

import { ITraining } from '@/models/Training';
import { AnimatePresence, motion } from 'motion/react';
import { IconX, IconCalendar, IconClock, IconTarget, IconAward, IconUsers, IconBook } from '@tabler/icons-react';
import { useEffect } from 'react';

interface TrainingModalProps {
  training: ITraining | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function TrainingModal({ training, isOpen, onClose }: TrainingModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Prevent body scroll when modal is open
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence mode="wait">
      {isOpen && training && (
        <>
          {/* Backdrop with Fade */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-zinc-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          >
            {/* Shared Layout Container */}
            <motion.div
              layoutId={`training-card-${training._id}`}
              onClick={(e) => e.stopPropagation()}
              className="bg-white border border-zinc-100 w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col relative"
              transition={{ type: "spring", stiffness: 350, damping: 35 }}
            >
              {/* Header with Linked Elements */}
              <div className="h-32 bg-gradient-to-r from-teal-50 via-blue-50 to-violet-50 relative shrink-0 border-b border-zinc-100 p-8 flex items-end">

                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 bg-white/50 hover:bg-white text-zinc-600 rounded-full transition-colors shadow-sm"
                >
                  <IconX size={20} />
                </button>

                <div className="w-full">
                  <div className="absolute top-6 right-16">
                    {/* Badge maps to the Duration/Type badge on card */}
                    <div className="inline-block">
                      <span className="text-xs font-medium bg-white/60 text-teal-700 border border-teal-100 px-2.5 py-1 rounded-full backdrop-blur-md mb-2 inline-block shadow-sm">
                        {training.isHalfDay ? 'Half Day' : training.durationFormat}
                      </span>
                    </div>
                  </div>

                  {/* Title maps to Card Title */}
                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-3xl font-bold tracking-tight text-zinc-900 mt-2"
                  >
                    {training.programTitle}
                  </motion.h2>

                  {/* Partner Name maps to Card Partner */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center gap-2 mt-2 text-zinc-500 text-sm"
                  >
                    <IconBook size={16} className="text-violet-600" />
                    <span>
                      {training.trainingPartner}
                    </span>
                  </motion.div>

                </div>
              </div>

              {/* Content Fade In (Not shared, just simple fade) */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="overflow-y-auto p-8 space-y-8 custom-scrollbar bg-zinc-50/50"
              >

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex flex-col gap-1 p-3 rounded-2xl bg-white border border-zinc-100 shadow-sm">
                    <div className="flex items-center gap-2 text-zinc-400 text-sm font-medium">
                      <IconClock size={16} className="text-teal-500" />
                      <span>Duration</span>
                    </div>
                    <span className="font-semibold text-zinc-700">{training.durationFormat}</span>
                  </div>
                  <div className="flex flex-col gap-1 p-3 rounded-2xl bg-white border border-zinc-100 shadow-sm">
                    <div className="flex items-center gap-2 text-zinc-400 text-sm font-medium">
                      <IconUsers size={16} className="text-blue-500" />
                      <span>Audience</span>
                    </div>
                    <span className="font-semibold text-zinc-700 line-clamp-1" title={training.targetAudience}>{training.targetAudience}</span>
                  </div>
                  <div className="flex flex-col gap-1 p-3 rounded-2xl bg-white border border-zinc-100 shadow-sm">
                    <div className="flex items-center gap-2 text-zinc-400 text-sm font-medium">
                      <IconCalendar size={16} className="text-violet-500" />
                      <span>Frequency</span>
                    </div>
                    <span className="font-semibold text-zinc-700">{training.frequency}</span>
                  </div>
                  <div className="flex flex-col gap-1 p-3 rounded-2xl bg-white border border-zinc-100 shadow-sm">
                    <div className="flex items-center gap-2 text-zinc-400 text-sm font-medium">
                      <IconAward size={16} className="text-amber-500" />
                      <span>Assessment</span>
                    </div>
                    <span className="font-semibold text-zinc-700 line-clamp-1" title={training.assessmentFollowUp}>{training.assessmentFollowUp}</span>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                  <div className="md:col-span-2 space-y-8">
                    <section>
                      <h3 className="flex items-center gap-2 text-lg font-bold mb-3 text-zinc-900">
                        <IconTarget className="text-teal-500" size={20} />
                        Objectives
                      </h3>
                      <p className="text-zinc-600 leading-relaxed whitespace-pre-wrap">
                        {training.programObjective}
                      </p>
                    </section>

                    <section>
                      <h3 className="flex items-center gap-2 text-lg font-bold mb-3 text-zinc-900">
                        <IconBook className="text-blue-500" size={20} />
                        Outcomes & Benefits
                      </h3>
                      <p className="text-zinc-600 leading-relaxed whitespace-pre-wrap">
                        {training.outcomesBenefits}
                      </p>
                    </section>

                    {/* Schedule Section */}
                    {training.schedule && training.schedule.length > 0 && (
                      <section>
                        <h3 className="flex items-center gap-2 text-lg font-bold mb-3 text-zinc-900">
                          <IconCalendar className="text-violet-500" size={20} />
                          Schedule
                        </h3>
                        <div className="space-y-4">
                          {training.schedule.map((day, idx) => (
                            <div key={idx} className="border-l-2 border-zinc-200 pl-4 py-2 relative">
                              <div className="absolute -left-[9px] top-3 w-4 h-4 rounded-full bg-white border-2 border-teal-500" />
                              <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 mb-1">
                                <span className="text-sm font-bold text-teal-600">Day {day.day}</span>
                                <span className="text-sm text-zinc-500">{day.time}</span>
                              </div>
                              <h4 className="font-semibold text-zinc-800">{day.topic}</h4>
                              {day.mainTopic && <p className="text-sm text-zinc-500 mt-1">{day.mainTopic}</p>}
                            </div>
                          ))}
                        </div>
                      </section>
                    )}
                  </div>

                  <div className="space-y-6">
                    <div className="bg-white border border-zinc-100 p-6 rounded-2xl shadow-sm">
                      <h3 className="text-lg font-bold mb-4 text-zinc-900">Competencies</h3>

                      {training.competencies.functional && training.competencies.functional.length > 0 && (
                        <div className="mb-4">
                          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-2">Functional</span>
                          <div className="flex flex-wrap gap-2">
                            {training.competencies.functional.map(c => (
                              <span key={c} className="text-xs px-2 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg font-medium">
                                {c}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Other competencies... same as before */}
                      {training.competencies.core && training.competencies.core.length > 0 && (
                        <div className="mb-4">
                          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-2">Core</span>
                          <div className="flex flex-wrap gap-2">
                            {training.competencies.core.map(c => (
                              <span key={c} className="text-xs px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg font-medium">
                                {c}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {training.competencies.leadership && training.competencies.leadership.length > 0 && (
                        <div>
                          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-2">Leadership</span>
                          <div className="flex flex-wrap gap-2">
                            {training.competencies.leadership.map(c => (
                              <span key={c} className="text-xs px-2 py-1 bg-amber-50 text-amber-700 border border-amber-100 rounded-lg font-medium">
                                {c}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
