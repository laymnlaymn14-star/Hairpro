import React from 'react';
import { Sparkles, BookOpen, Compass, ChevronLeft, Heart } from 'lucide-react';
import { BOOK_WATERMARK } from '../data/bookData';

interface BookCoverProps {
  onOpenBook: () => void;
  onOpenTOC: () => void;
}

export const BookCover: React.FC<BookCoverProps> = ({ onOpenBook, onOpenTOC }) => {
  return (
    <div className="w-full max-w-xl mx-auto my-auto p-4 sm:p-6 text-center select-none animate-fadeIn">
      {/* Deluxe Feminine Light Pink Hardcover Frame */}
      <div className="relative rounded-2xl p-7 sm:p-10 border-2 border-[#E8B4C0]/70 shadow-2xl shadow-[#E8B4C0]/25 bg-gradient-to-b from-[#FFFDFE] via-[#FDEFF2] to-[#F9E2E8] overflow-hidden">
        {/* Soft Pink Background Floral Ornaments (Subtle Glows) */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#FCD7E0]/40 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-[#FAD0DC]/40 rounded-full blur-2xl pointer-events-none" />

        {/* Elegant Feminine Corner Filigree Accents */}
        <div className="absolute top-3.5 right-3.5 w-8 h-8 border-t-2 border-r-2 border-[#D88A9C]/70 rounded-tr-md" />
        <div className="absolute top-3.5 left-3.5 w-8 h-8 border-t-2 border-l-2 border-[#D88A9C]/70 rounded-tl-md" />
        <div className="absolute bottom-3.5 right-3.5 w-8 h-8 border-b-2 border-r-2 border-[#D88A9C]/70 rounded-br-md" />
        <div className="absolute bottom-3.5 left-3.5 w-8 h-8 border-b-2 border-l-2 border-[#D88A9C]/70 rounded-bl-md" />

        {/* Delicate Header Ribbon Accent */}
        <div className="flex items-center justify-center gap-2 mb-5">
          <span className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#D88A9C]" />
          <span className="text-[10.5px] tracking-[0.25em] font-bold text-[#A8586B] uppercase font-latin-title flex items-center gap-1.5">
            <Heart className="w-3 h-3 text-[#D88A9C] fill-[#EAB1BF]" />
            Digital Masterclass Edition
          </span>
          <span className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#D88A9C]" />
        </div>

        {/* Main Title: HAIR PRO */}
        <div className="my-5">
          <h1 className="text-4xl sm:text-6xl font-black tracking-wider text-[#3D1E26] font-latin-title uppercase drop-shadow-xs">
            HAIR PRO
          </h1>
          <div className="h-0.5 w-24 mx-auto bg-gradient-to-r from-[#D88A9C]/20 via-[#D88A9C] to-[#D88A9C]/20 my-3.5" />
          <p className="font-arabic-heading text-lg sm:text-xl font-bold text-[#632938] leading-relaxed max-w-md mx-auto">
            دليلكِ العملي الشامل للعناية بالشعر والتصفيف خطوة بخطوة
          </p>
        </div>

        {/* Core Book Highlights Card */}
        <div className="my-6 py-4 px-3 rounded-xl bg-[#FFF9FB]/90 border border-[#F2CBD4] max-w-sm mx-auto text-xs text-[#52212E] space-y-2 leading-relaxed shadow-xs">
          <p className="flex items-center justify-center gap-2 font-bold text-[#8C384E]">
            <Sparkles className="w-3.5 h-3.5 text-[#D88A9C]" />
            27 فصلاً تعليمياً مكثفاً + 118 صفحة مفصلة
          </p>
          <p className="text-[11px] text-[#7A3E4E]">
            باللغة العربية الدارجة الطبيعية وبخطوات تطبيقية ورسوم توضيحية مصممة بأناقة أنثوية هادئة.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-7">
          <button
            onClick={onOpenBook}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-[#D88A9C] via-[#C87386] to-[#B75B6F] text-white font-bold text-sm shadow-md hover:shadow-lg hover:shadow-[#D88A9C]/30 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>تصفح الكتاب الرقمي</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenTOC}
            className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white/90 border border-[#E8BAC5] text-[#632938] font-bold text-xs hover:bg-[#FDF0F3] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
          >
            <Compass className="w-3.5 h-3.5 text-[#D88A9C]" />
            <span>فهرس الفصول الـ 27</span>
          </button>
        </div>

        {/* Watermark discreetly integrated */}
        <div className="mt-8 pt-4 border-t border-[#F2CBD4] flex items-center justify-between text-[10px] text-[#A66878]">
          <span>الإصدار الرقمي الأول</span>
          <span className="tracking-widest font-mono opacity-60 font-semibold">{BOOK_WATERMARK}</span>
          <span>جميع الحقوق محفوظة</span>
        </div>
      </div>
    </div>
  );
};
