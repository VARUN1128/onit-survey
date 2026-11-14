import React from 'react';
import { 
  Clock, 
  ShieldCheck, 
  ArrowDown, 
  Wrench, 
  Sparkle, 
  Wind, 
  Zap, 
  MapPin,
  CheckCircle2
} from 'lucide-react';

interface HeroProps {
  onStartSurvey: () => void;
  completedCount: number;
  totalQuestions: number;
}

export const Hero: React.FC<HeroProps> = ({ onStartSurvey, completedCount, totalQuestions }) => {
  const percentage = Math.min(100, Math.round((completedCount / totalQuestions) * 100));

  return (
    <section className="relative overflow-hidden pt-8 pb-10 sm:pt-14 sm:pb-16 bg-gradient-to-b from-white via-[#F2F3FC]/50 to-[#F8FAFC] border-b border-neutral-200/70">
      
      {/* Subtle Background Glows (Creative ONIT Indigo & Navy Accents) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-[#6E76E0]/10 via-[#14143A]/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="hidden md:block absolute -top-12 -left-12 w-64 h-64 bg-[#6E76E0]/8 rounded-full blur-2xl pointer-events-none" />
      <div className="hidden md:block absolute top-1/2 -right-12 w-72 h-72 bg-[#14143A]/5 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center space-y-6 max-w-2xl mx-auto">
          
          {/* Creative Badges Row */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-[#14143A] text-xs font-bold shadow-xs border border-neutral-200/90 transition-transform hover:scale-102">
              <ShieldCheck className="w-4 h-4 text-[#6E76E0]" />
              <span>Customer Research Survey</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F2F3FC] text-[#14143A] text-xs font-bold border border-[#6E76E0]/30 shadow-2xs">
              <Clock className="w-3.5 h-3.5 text-[#6E76E0]" />
              <span>2–3 minutes to complete</span>
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="font-montserrat text-3xl sm:text-5xl font-black text-[#14143A] tracking-tight leading-[1.12]">
            Your home deserves <br />
            <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#14143A] via-[#2E3180] to-[#6E76E0]">
              better service.
              <span className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#6E76E0]/60 to-transparent rounded-full" />
            </span>
          </h1>

          {/* Supporting Text */}
          <p className="text-neutral-600 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
            We're researching how people find, choose and experience home services. Share your thoughts through this short survey and help us build a more reliable and accessible home services experience.
          </p>

          {/* Creative Floating Service Chips (Visible & Interactive on both Desktop & Mobile) */}
          <div className="py-1">
            <p className="text-[11px] font-bold tracking-wider text-neutral-400 uppercase mb-2">
              Covering home essentials across Kerala
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 max-w-lg mx-auto">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-neutral-200 text-xs font-semibold text-neutral-700 shadow-2xs hover:border-[#6E76E0]/50 transition-colors">
                <Sparkle className="w-3.5 h-3.5 text-[#6E76E0]" /> Deep Cleaning
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-neutral-200 text-xs font-semibold text-neutral-700 shadow-2xs hover:border-[#6E76E0]/50 transition-colors">
                <Wind className="w-3.5 h-3.5 text-[#6E76E0]" /> AC Service
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-neutral-200 text-xs font-semibold text-neutral-700 shadow-2xs hover:border-[#6E76E0]/50 transition-colors">
                <Zap className="w-3.5 h-3.5 text-[#6E76E0]" /> Electrical
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-neutral-200 text-xs font-semibold text-neutral-700 shadow-2xs hover:border-[#6E76E0]/50 transition-colors">
                <Wrench className="w-3.5 h-3.5 text-[#6E76E0]" /> Plumbing
              </span>
            </div>
          </div>

          {/* CTA Button & Live Bubble Teaser */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={onStartSurvey}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#14143A] hover:bg-[#2E3180] text-white text-base font-bold shadow-lg hover:shadow-xl active:scale-95 transition-all cursor-pointer group"
            >
              <span>Start Survey</span>
              <ArrowDown className="w-4 h-4 transition-transform group-hover:translate-y-1" />
            </button>

            {/* Bubble Progress Indicator Preview in Hero */}
            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-neutral-200/90 shadow-2xs text-xs">
              <div className="flex -space-x-1.5">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <div
                    key={num}
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border ${
                      num <= Math.ceil((completedCount / totalQuestions) * 6) && completedCount > 0
                        ? 'bg-[#6E76E0] text-white border-white'
                        : 'bg-neutral-100 text-neutral-400 border-white'
                    }`}
                  >
                    {num}
                  </div>
                ))}
              </div>
              <span className="text-neutral-600 font-medium">
                {completedCount > 0 ? (
                  <><strong>{completedCount}</strong>/{totalQuestions} answered ({percentage}%)</>
                ) : (
                  <>6 quick sections &bull; 13 questions</>
                )}
              </span>
            </div>
          </div>

          {/* 3 Creative Feature Micro-Cards (Desktop 3 columns, Mobile clean stack) */}
          <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
            <div className="p-3.5 rounded-2xl bg-white/90 border border-neutral-200/80 shadow-2xs flex items-center sm:items-start gap-3 transition-transform hover:-translate-y-0.5">
              <div className="w-8 h-8 rounded-xl bg-[#F2F3FC] text-[#6E76E0] flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#14143A]">Direct Impact</h4>
                <p className="text-[11px] text-neutral-500 mt-0.5 leading-snug">
                  Helps design verified pricing & reliable response times.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/90 border border-neutral-200/80 shadow-2xs flex items-center sm:items-start gap-3 transition-transform hover:-translate-y-0.5">
              <div className="w-8 h-8 rounded-xl bg-[#F2F3FC] text-[#6E76E0] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#14143A]">100% Anonymous</h4>
                <p className="text-[11px] text-neutral-500 mt-0.5 leading-snug">
                  Strictly customer research, no promotional spam.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/90 border border-neutral-200/80 shadow-2xs flex items-center sm:items-start gap-3 transition-transform hover:-translate-y-0.5">
              <div className="w-8 h-8 rounded-xl bg-[#F2F3FC] text-[#6E76E0] flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#14143A]">Built for Kerala</h4>
                <p className="text-[11px] text-neutral-500 mt-0.5 leading-snug">
                  Tailored to local home service needs and challenges.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
