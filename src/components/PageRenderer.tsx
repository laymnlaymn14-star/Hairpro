import React from 'react';
import { BookPage } from '../types';
import { EducationalVisual } from './EducationalVisual';
import { BOOK_WATERMARK } from '../data/bookData';
import { 
  Sparkles, CheckCircle2, AlertTriangle, Lightbulb, 
  HelpCircle, Heart
} from 'lucide-react';

interface PageRendererProps {
  page: BookPage;
  currentPageNumber: number;
  totalPages: number;
}

export const PageRenderer: React.FC<PageRendererProps> = ({
  page,
  currentPageNumber,
  totalPages
}) => {
  return (
    <div className="w-full h-full flex flex-col justify-between p-4 sm:p-7 md:p-8 bg-gradient-to-b from-[#FFFDFE] via-[#FFF7F9] to-[#FDF1F4] rounded-xl text-right select-text border border-[#F5D5DC]">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between border-b border-[#F2CBD4] pb-2.5 mb-3.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#FCE8ED] text-[#8C384E] border border-[#F7CED7] text-[10px] sm:text-[11px] font-bold flex items-center gap-1">
              <Heart className="w-2.5 h-2.5 text-[#D88A9C] fill-[#EAB1BF]" />
              {page.category}
            </span>
          </div>
          <span className="text-[11px] font-bold text-[#A65B6F] tracking-wide">
            {page.chapterTitle}
          </span>
        </div>

        {/* Page Title */}
        <h2 className="font-arabic-heading text-lg sm:text-2xl font-bold text-[#3A1D25] leading-snug mb-3">
          {page.pageTitle}
        </h2>

        {/* Feminine Summary Pill */}
        {page.summary && (
          <div className="mb-4 px-3.5 py-2.5 rounded-xl bg-[#FFF0F4] border-r-3 border-r-[#D88A9C] border-[#F2CCD6] text-xs text-[#5E2534] leading-relaxed flex items-start gap-2 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#D88A9C] shrink-0 mt-0.5" />
            <span>{page.summary}</span>
          </div>
        )}

        {/* Explanations with comfortable line-height */}
        <div className="space-y-2.5 text-xs sm:text-[13px] text-[#42232B] leading-relaxed">
          {page.content.explanation.map((para, idx) => (
            <p key={idx} className="text-justify">
              {para}
            </p>
          ))}
        </div>

        {/* Visual Element if present */}
        {page.content.visual && (
          <EducationalVisual visual={page.content.visual} />
        )}

        {/* Application Steps */}
        {page.content.application && (
          <div className="my-4 p-3.5 sm:p-4 rounded-xl bg-[#FFFDFE] border border-[#F2CCD6] shadow-2xs">
            <h4 className="text-xs sm:text-[13px] font-bold text-[#782C3E] flex items-center gap-1.5 mb-2.5">
              <Lightbulb className="w-3.5 h-3.5 text-[#D88A9C]" />
              {page.content.application.title}
            </h4>
            <div className="space-y-2">
              {page.content.application.steps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-[12.5px] text-[#42232B]">
                  <span className="w-5 h-5 rounded-full bg-[#FCE8ED] text-[#8C384E] text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5 border border-[#F3BDC9]">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mistakes Section if present */}
        {page.content.mistakes && (
          <div className="my-3 p-3.5 rounded-xl bg-[#FFF7F8] border border-[#F5CCD3] text-xs space-y-1.5 shadow-2xs">
            <div className="flex items-start gap-1.5 text-[#A32938]">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold ml-1">الخطأ الشائع:</span>
                <span>{page.content.mistakes.bad}</span>
              </div>
            </div>
            <div className="flex items-start gap-1.5 text-[#2E6B43]">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold ml-1">التصحيح العملي:</span>
                <span>{page.content.mistakes.fix}</span>
              </div>
            </div>
            {page.content.mistakes.why && (
              <p className="text-[11px] text-[#7A424E] pt-1.5 border-t border-[#F7DCE2]">
                <span className="font-bold ml-1">التفسير العلمي:</span>
                {page.content.mistakes.why}
              </p>
            )}
          </div>
        )}

        {/* Checklist if present */}
        {page.content.checklist && (
          <div className="my-3 p-3.5 rounded-xl bg-[#FFFDFE] border border-[#F2CCD6] text-xs space-y-1.5 shadow-2xs">
            <span className="font-bold text-[#8C384E] block mb-1">نقاط التطبيق الأساسية:</span>
            {page.content.checklist.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2 text-[#42232B]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#D88A9C] shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        )}

        {/* Expected Result if present */}
        {page.content.result && (
          <div className="mt-3.5 p-2.5 rounded-lg bg-[#FAF0F3] border-r-3 border-r-[#C86A80] border-[#F2CCD6] text-xs text-[#4E212D] flex items-center gap-2">
            <span className="font-bold text-[#782C3E] shrink-0">النتيجة المتوقعة:</span>
            <span className="text-[11.5px]">{page.content.result}</span>
          </div>
        )}
      </div>

      {/* Discreet Luxury Page Footer */}
      <div className="mt-6 pt-3 border-t border-[#F2CBD4] flex items-center justify-between text-[11px] text-[#A66878] select-none">
        <span className="font-medium">
          صفحة {currentPageNumber} من {totalPages}
        </span>
        <span className="font-mono text-[9.5px] tracking-widest text-[#B37B8B] opacity-60 font-semibold">
          {BOOK_WATERMARK}
        </span>
        <span className="text-[10px] text-[#B37B8B]">
          الفصل {page.chapterNumber}
        </span>
      </div>
    </div>
  );
};
