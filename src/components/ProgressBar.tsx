import React from 'react';
import { Check, Sparkles } from 'lucide-react';

interface BubbleIndicatorProps {
  completedCount: number;
  totalQuestions: number;
  completedSections?: number[];
  activeSection?: number;
}

const SECTIONS = [
  { id: 'section-01', num: 1, label: 'You', fullLabel: 'About You' },
  { id: 'section-02', num: 2, label: 'Services', fullLabel: 'Requirements' },
  { id: 'section-03', num: 3, label: 'Booking', fullLabel: 'Behaviour' },
  { id: 'section-04', num: 4, label: 'Challenges', fullLabel: 'Pain Points' },
  { id: 'section-05', num: 5, label: 'Expectations', fullLabel: 'Ratings' },
  { id: 'section-06', num: 6, label: 'Adoption', fullLabel: 'Platform' },
];

export const ProgressBar: React.FC<BubbleIndicatorProps> = ({ 
  completedCount, 
  totalQuestions,
  completedSections = []
}) => {
  const percentage = Math.min(100, Math.round((completedCount / totalQuestions) * 100));

  const handleJumpToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="sticky top-16 sm:top-18 z-30 bg-white/95 backdrop-blur-md border-b border-neutral-200/80 pt-3 pb-3 px-3 sm:px-6 shadow-xs transition-all">
      <div className="max-w-3xl mx-auto flex flex-col gap-2.5">
        
        {/* Top Info Row */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-montserrat font-bold text-[#14143A] flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#6E76E0] animate-pulse" />
              Survey Progress
            </span>
            <span className="hidden sm:inline-block text-neutral-300">|</span>
            <span className="hidden sm:inline-flex items-center gap-1 text-neutral-500 font-medium">
              <Sparkles className="w-3 h-3 text-[#6E76E0]" />
              Tap any step bubble to jump
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-neutral-500 font-semibold text-[11px] sm:text-xs">
              <strong className="text-[#14143A] font-bold">{completedCount}</strong> of {totalQuestions} answered
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#F2F3FC] text-[#14143A] font-bold text-[11px] border border-[#6E76E0]/20">
              {percentage}%
            </span>
          </div>
        </div>

        {/* 13 Micro Question Bubbles Strip (Visual representation of all 13 questions) */}
        <div className="flex items-center justify-between gap-1 sm:gap-1.5 py-1 px-1 bg-neutral-100/70 rounded-full" aria-label="13 Question Bubbles">
          {Array.from({ length: totalQuestions }).map((_, idx) => {
            const isAnswered = idx < completedCount;
            const isCurrent = idx === completedCount;
            return (
              <div
                key={idx}
                title={`Question ${idx + 1}: ${isAnswered ? 'Answered' : 'Pending'}`}
                className={`relative flex-1 h-2 rounded-full transition-all duration-300 ${
                  isAnswered
                    ? 'bg-gradient-to-r from-[#14143A] to-[#6E76E0] shadow-xs'
                    : isCurrent
                    ? 'bg-[#6E76E0]/40 ring-2 ring-[#6E76E0]/40 animate-pulse'
                    : 'bg-neutral-200'
                }`}
              />
            );
          })}
        </div>

        {/* Connected 6-Section Step Bubble Flow */}
        <div className="relative pt-1">
          {/* Connector Line behind bubbles */}
          <div className="absolute top-4 sm:top-5 left-4 right-4 h-0.5 bg-neutral-200 -z-0" />

          {/* Stepper Bubbles */}
          <div className="flex items-center justify-between relative z-10">
            {SECTIONS.map((sec) => {
              const isCompleted = completedSections.includes(sec.num);
              // Calculate if this is the active/next section
              const isActive = !isCompleted && (
                sec.num === 1 || 
                completedSections.includes(sec.num - 1)
              );

              return (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => handleJumpToSection(sec.id)}
                  className="flex flex-col items-center group cursor-pointer focus:outline-hidden"
                  title={`Section ${sec.num}: ${sec.fullLabel}`}
                >
                  {/* Circular Step Bubble */}
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                      isCompleted
                        ? 'bg-[#14143A] text-white shadow-sm ring-2 ring-[#6E76E0] scale-100 group-hover:scale-105'
                        : isActive
                        ? 'bg-white text-[#14143A] border-2 border-[#6E76E0] ring-3 ring-[#6E76E0]/20 font-extrabold scale-110 shadow-sm'
                        : 'bg-white text-neutral-400 border-2 border-neutral-300 group-hover:border-neutral-400'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                    ) : (
                      <span>{sec.num}</span>
                    )}
                  </div>

                  {/* Bubble Text Label */}
                  <span
                    className={`mt-1 text-[10px] sm:text-[11px] font-semibold tracking-tight transition-colors ${
                      isCompleted
                        ? 'text-[#14143A] font-bold'
                        : isActive
                        ? 'text-[#6E76E0] font-bold'
                        : 'text-neutral-400 group-hover:text-neutral-600'
                    }`}
                  >
                    <span className="sm:hidden">{sec.label}</span>
                    <span className="hidden sm:inline">{sec.fullLabel}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
