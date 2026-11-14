import React from 'react';
import { AlertCircle } from 'lucide-react';

interface QuestionCardProps {
  id: string;
  questionNumber: string;
  title: string;
  subtitle?: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  id,
  questionNumber,
  title,
  subtitle,
  required = false,
  error,
  children,
}) => {
  return (
    <div 
      id={`question-${id}`}
      className={`rounded-xl p-4 sm:p-5 transition-all ${
        error 
          ? 'bg-rose-50/40 border border-rose-300 ring-1 ring-rose-200' 
          : 'bg-[#F8FAFC]/70 hover:bg-[#F8FAFC] border border-neutral-200/70'
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#6E76E0] font-montserrat tracking-tight">
              {questionNumber}
            </span>
            {required ? (
              <span className="text-[11px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                Required
              </span>
            ) : (
              <span className="text-[11px] font-medium text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full">
                Optional
              </span>
            )}
          </div>
          <label 
            htmlFor={id} 
            className="block text-sm sm:text-base font-bold text-[#14143A] mt-1 font-montserrat leading-snug cursor-pointer"
          >
            {title}
          </label>
          {subtitle && (
            <p className="text-xs sm:text-sm text-neutral-500 mt-1 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Input / Control slot */}
      <div className="mt-3">
        {children}
      </div>

      {/* Inline Validation Error */}
      {error && (
        <div 
          className="flex items-center gap-1.5 mt-2.5 text-xs font-semibold text-rose-600 animate-fadeIn"
          role="alert"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
