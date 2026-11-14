import React from 'react';

interface SurveySectionProps {
  number: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}

export const SurveySection: React.FC<SurveySectionProps> = ({
  number,
  title,
  description,
  children,
}) => {
  return (
    <section 
      id={`section-${number}`}
      className="scroll-mt-36 bg-white rounded-2xl sm:rounded-3xl border border-neutral-200/90 shadow-card p-4 sm:p-8 transition-all hover:border-neutral-300"
    >
      {/* Section Header */}
      <div className="border-b border-neutral-100 pb-4 sm:pb-5 mb-5 sm:mb-6">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#F2F3FC] text-[#14143A] text-[11px] sm:text-xs font-bold tracking-wider uppercase mb-1.5 sm:mb-2">
          <span>Section {number}</span>
        </div>
        <h2 className="font-montserrat text-lg sm:text-2xl font-bold text-[#14143A] tracking-tight">
          {title}
        </h2>
        {description && (
          <p className="text-neutral-500 text-xs sm:text-sm mt-1 leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* Questions container */}
      <div className="space-y-5 sm:space-y-7">
        {children}
      </div>
    </section>
  );
};
