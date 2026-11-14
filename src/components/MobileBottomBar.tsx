import React from 'react';
import { ChevronDown, Send } from 'lucide-react';

interface MobileBottomBarProps {
  completedCount: number;
  totalQuestions: number;
  isFormValid: boolean;
  onNextUnanswered: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({
  completedCount,
  totalQuestions,
  isFormValid,
  onNextUnanswered,
  onSubmit,
  isSubmitting,
}) => {
  const percentage = Math.min(100, Math.round((completedCount / totalQuestions) * 100));

  return (
    <aside 
      aria-label="Survey Quick Actions"
      className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-neutral-200/90 px-4 py-2.5 pb-[max(0.65rem,env(safe-area-inset-bottom))] shadow-[0_-4px_20px_rgba(0,0,0,0.06)] transition-all"
    >
      <div className="max-w-md mx-auto flex items-center justify-between gap-3">
        {/* Bubble Progress Badge */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-9 h-9 rounded-full bg-[#14143A] text-white flex items-center justify-center font-montserrat font-bold text-xs shadow-sm ring-2 ring-[#6E76E0]/40">
            {completedCount}/{totalQuestions}
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6E76E0] animate-pulse" />
              <span className="text-[11px] font-bold text-[#14143A] leading-tight">
                {percentage}% Completed
              </span>
            </div>
            <span className="text-[10px] text-neutral-500 leading-none mt-0.5">
              {isFormValid ? 'Ready to submit!' : `${totalQuestions - completedCount} questions left`}
            </span>
          </div>
        </div>

        {/* Action Button */}
        {isFormValid ? (
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="flex-1 min-h-[44px] inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#14143A] hover:bg-[#2E3180] text-white text-xs font-bold shadow-md active:scale-95 transition-all cursor-pointer"
          >
            {isSubmitting ? (
              <span>Submitting...</span>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Submit Survey</span>
              </>
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={onNextUnanswered}
            className="flex-1 min-h-[44px] inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full bg-[#F2F3FC] hover:bg-[#EAEBFA] text-[#14143A] border border-[#6E76E0]/30 text-xs font-bold active:scale-95 transition-all cursor-pointer"
          >
            <span>Next Unanswered</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#6E76E0]" />
          </button>
        )}
      </div>
    </aside>
  );
};
