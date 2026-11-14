import React from 'react';
import { CheckCircle2, ArrowRight, RotateCcw, ShieldCheck } from 'lucide-react';
import { Confetti } from './Confetti';

interface SuccessScreenProps {
  onReset: () => void;
}

export const SuccessScreen: React.FC<SuccessScreenProps> = ({ onReset }) => {
  return (
    <div className="relative min-h-[75vh] flex items-center justify-center py-10 px-4 sm:px-6">
      <Confetti />

      <div className="max-w-xl w-full bg-white rounded-3xl border border-neutral-200/90 shadow-elevated p-6 sm:p-12 text-center space-y-6 relative z-10 transition-all animate-fadeIn">
        
        {/* Animated Checkmark Icon with soft pulse */}
        <div className="relative inline-flex items-center justify-center mx-auto">
          <div className="absolute inset-0 rounded-full bg-[#6E76E0]/20 animate-ping opacity-40" />
          <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full bg-linear-to-tr from-[#14143A] to-[#2E3180] text-white flex items-center justify-center shadow-lg relative z-10">
            <CheckCircle2 className="w-10 h-10 sm:w-11 sm:h-11 text-emerald-400" strokeWidth={2.5} />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Response Confirmed & Recorded</span>
          </div>

          <h1 className="font-montserrat text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#14143A] tracking-tight leading-tight">
            Thank you for being part of ONIT.
          </h1>

          <p className="text-neutral-600 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
            Your feedback helps us understand what matters most when it comes to home services. We're working towards making finding and booking reliable professionals easier.
          </p>
        </div>

        {/* Subtle highlights */}
        <div className="bg-[#F8FAFC] rounded-2xl p-4 border border-neutral-200/70 text-left max-w-md mx-auto space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#14143A]">
            <span className="w-2 h-2 rounded-full bg-[#6E76E0]" />
            What happens next?
          </div>
          <p className="text-xs text-neutral-500 leading-relaxed">
            Our research team analyzes your input to prioritize vetted service categories, transparent pricing models, and fast response times across Kerala.
          </p>
        </div>

        {/* Brand divider */}
        <div className="h-px bg-neutral-100 max-w-xs mx-auto" />

        {/* Actions */}
        <div className="pt-1 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="https://www.onitservices.in/home"
            className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#14143A] hover:bg-[#2E3180] text-white text-sm font-bold shadow-md hover:shadow-lg active:scale-95 transition-all cursor-pointer group"
          >
            <span>Back to ONIT</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </a>

          <button
            type="button"
            onClick={onReset}
            className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-sm font-semibold active:scale-95 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Submit another response</span>
          </button>
        </div>
      </div>
    </div>
  );
};
