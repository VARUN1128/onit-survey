import React from 'react';
import { BarChart3 } from 'lucide-react';

interface HeaderProps {
  onOpenAdmin?: () => void;
  isAdminView?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAdmin, isAdminView = false }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200/80 transition-all shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 sm:h-18 flex items-center justify-between">
        <a 
          href="https://www.onitservices.in/home" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-3 group focus:outline-hidden"
          aria-label="ONIT Home"
        >
          <img 
            src="/onit-logo.svg" 
            alt="ONIT Logo" 
            className="h-8 sm:h-9 w-auto object-contain transition-transform group-hover:scale-102" 
          />
          <div className="h-5 w-px bg-neutral-200 hidden sm:block" />
          <div className="flex flex-col">
            <span className="font-montserrat text-xs sm:text-sm font-bold text-[#14143A] tracking-tight">
              Customer Interest Survey
            </span>
            <span className="text-[11px] text-neutral-500 hidden sm:inline-block leading-none">
              Help us understand your home service needs
            </span>
          </div>
        </a>

        <div className="flex items-center gap-2">
          {!isAdminView && onOpenAdmin && (
            <button
              type="button"
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white hover:bg-[#F2F3FC] text-neutral-600 hover:text-[#14143A] text-xs font-semibold border border-neutral-200 hover:border-[#6E76E0]/30 transition-all cursor-pointer active:scale-95 shadow-2xs"
              title="View responses & analytics (/admin)"
            >
              <BarChart3 className="w-3.5 h-3.5 text-[#6E76E0]" />
              <span className="hidden sm:inline">Admin</span>
              <span>Analytics</span>
            </button>
          )}

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F2F3FC] text-[#14143A] text-xs font-semibold border border-[#6E76E0]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6E76E0] animate-pulse"></span>
            Research Study
          </span>
        </div>
      </div>
    </header>
  );
};
