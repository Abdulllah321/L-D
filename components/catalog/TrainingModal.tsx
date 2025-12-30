'use client';

import { ITraining } from '@/models/Training';
import { AnimatePresence, motion } from 'motion/react';
import { X, Calendar, Clock, Target, Award, Users, BookOpen } from 'lucide-react';
import { useEffect } from 'react';

interface TrainingModalProps {
  training: ITraining | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function TrainingModal({ training, isOpen, onClose }: TrainingModalProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && training && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-zinc-900 w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col relative"
            >
              {/* Header Image/Gradient */}
              <div className="h-32 bg-gradient-to-r from-violet-600 to-indigo-600 relative shrink-0">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
                <div className="absolute bottom-6 left-8 text-white">
                  <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded backdrop-blur-md mb-2 inline-block">
                    {training.trainingPartner}
                  </span>
                  <h2 className="text-3xl font-bold tracking-tight">{training.programTitle}</h2>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="overflow-y-auto p-8 space-y-8 custom-scrollbar">
                
                {/* Meta Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex flex-col gap-1 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
                    <div className="flex items-center gap-2 text-zinc-500 text-sm">
                      <Clock size={16} />
                      <span>Duration</span>
                    </div>
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200">{training.durationFormat}</span>
                  </div>
                  <div className="flex flex-col gap-1 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
                    <div className="flex items-center gap-2 text-zinc-500 text-sm">
                      <Users size={16} />
                      <span>Audience</span>
                    </div>
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200 line-clamp-1" title={training.targetAudience}>{training.targetAudience}</span>
                  </div>
                  <div className="flex flex-col gap-1 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
                    <div className="flex items-center gap-2 text-zinc-500 text-sm">
                      <Calendar size={16} />
                      <span>Frequency</span>
                    </div>
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200">{training.frequency}</span>
                  </div>
                  <div className="flex flex-col gap-1 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
                    <div className="flex items-center gap-2 text-zinc-500 text-sm">
                      <Award size={16} />
                      <span>Assessment</span>
                    </div>
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200 line-clamp-1" title={training.assessmentFollowUp}>{training.assessmentFollowUp}</span>
                  </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid md:grid-cols-3 gap-8">
                  {/* Left Column: Details */}
                  <div className="md:col-span-2 space-y-8">
                    <section>
                      <h3 className="flex items-center gap-2 text-lg font-semibold mb-3 text-zinc-800 dark:text-zinc-100">
                        <Target className="text-violet-600" size={20} />
                        Objectives
                      </h3>
                      <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-wrap">
                        {training.programObjective}
                      </p>
                    </section>

                    <section>
                      <h3 className="flex items-center gap-2 text-lg font-semibold mb-3 text-zinc-800 dark:text-zinc-100">
                        <BookOpen className="text-violet-600" size={20} />
                        Outcomes & Benefits
                      </h3>
                      <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-wrap">
                        {training.outcomesBenefits}
                      </p>
                    </section>

                    <section>
                      <h3 className="flex items-center gap-2 text-lg font-semibold mb-3 text-zinc-800 dark:text-zinc-100">
                        <Calendar className="text-violet-600" size={20} />
                        Schedule
                      </h3>
                      <div className="space-y-4">
                        {training.schedule && training.schedule.map((day, idx) => (
                           <div key={idx} className="border-l-2 border-zinc-200 dark:border-zinc-700 pl-4 py-2 relative">
                             <div className="absolute -left-[9px] top-3 w-4 h-4 rounded-full bg-zinc-100 dark:bg-zinc-800 border-2 border-violet-500" />
                             <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 mb-1">
                               <span className="text-sm font-bold text-violet-600">Day {day.day}</span>
                               <span className="text-sm text-zinc-500">{day.time}</span>
                             </div>
                             <h4 className="font-semibold text-zinc-800 dark:text-zinc-200">{day.topic}</h4>
                             {day.mainTopic && <p className="text-sm text-zinc-500 mt-1">{day.mainTopic}</p>}
                           </div>
                        ))}
                        {(!training.schedule || training.schedule.length === 0) && (
                          <p className="text-zinc-500 italic">No schedule details available.</p>
                        )}
                      </div>
                    </section>
                  </div>

                  {/* Right Column: Competencies */}
                  <div className="space-y-6">
                     <div className="bg-zinc-50 dark:bg-zinc-800/50 p-6 rounded-2xl">
                        <h3 className="text-lg font-semibold mb-4 text-zinc-800 dark:text-zinc-100">Competencies</h3>
                        
                        {training.competencies.functional && training.competencies.functional.length > 0 && (
                          <div className="mb-4">
                            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-2">Functional</span>
                            <div className="flex flex-wrap gap-2">
                              {training.competencies.functional.map(c => (
                                <span key={c} className="text-xs px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-md font-medium">
                                  {c}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {training.competencies.core && training.competencies.core.length > 0 && (
                          <div className="mb-4">
                            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-2">Core</span>
                            <div className="flex flex-wrap gap-2">
                              {training.competencies.core.map(c => (
                                <span key={c} className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 rounded-md font-medium">
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
                                <span key={c} className="text-xs px-2 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 rounded-md font-medium">
                                  {c}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                     </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
