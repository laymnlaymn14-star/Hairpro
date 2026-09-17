import React from 'react';
import { BookOpen, Compass, ChevronLeft } from 'lucide-react';
import { BOOK_WATERMARK } from '../data/bookData';

interface BookCoverProps {
  onOpenBook: () => void;
  onOpenTOC: () => void;
}

export const BookCover: React.FC<BookCoverProps> = ({ onOpenBook, onOpenTOC }) => {
  return (
    <div className="relative w-full h-full min-h-[85vh] sm:min-h-[88vh] flex flex-col justify-between items-center text-center select-none overflow-hidden rounded-2xl shadow-2xl">
      {/* Background Image - Full Bleed Edge-to-Edge Responsive */}
      <img
        src="/eloria_cover.jpg"
        alt="𝑬𝑳𝑶𝑹𝑰𝑨 — Hair • Care • Beauty"
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
      />

      {/* Luxury Editorial Soft Scrim Overlays for pristine legibility without heavy cards */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FFF5F7]/90 via-[#FFF5F7]/25 to-[#2A141A]/75 pointer-events-none" />

      {/* Top Editorial Identity - STRICTLY Title & Subtitle Only */}
      <div className="relative z-10 pt-12 sm:pt-16 px-4 max-w-xl mx-auto flex flex-col items-center">
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-serif font-bold tracking-wider text-[#351820] drop-shadow-xs select-none">
          𝑬𝑳𝑶𝑹𝑰𝑨
        </h1>
        <p className="mt-3 text-sm sm:text-base md:text-lg tracking-[0.25em] font-medium text-[#6B283A] uppercase font-latin-title">
          Hair • Care • Beauty
        </p>
      </div>

      {/* Bottom Editorial Actions & Minimal Watermark Only */}
      <div className="relative z-10 pb-8 sm:pb-12 px-4 w-full max-w-md mx-auto flex flex-col items-center gap-4">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
          <button
            onClick={onOpenBook}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#D88A9C]/95 hover:bg-[#C87386] text-white font-bold text-sm shadow-lg hover:shadow-xl backdrop-blur-md active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer border border-white/40"
          >
            <BookOpen className="w-4 h-4" />
            <span>تصفح الكتاب</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenTOC}
            className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white/85 hover:bg-white text-[#422129] font-medium text-xs backdrop-blur-md active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer border border-white/60 shadow-xs"
          >
            <Compass className="w-3.5 h-3.5 text-[#C86A80]" />
            <span>الفهرس</span>
          </button>
        </div>

        {/* Watermark discreet and unobtrusive */}
        <div className="pt-2 text-center">
          <span className="text-xs tracking-widest text-white/85 font-serif select-none drop-shadow-sm font-light">
            {BOOK_WATERMARK}
          </span>
        </div>
      </div>
    </div>
  );
};
