import React from 'react';
import { BookPage, DisplayPage, PageContentBlock } from '../types';
import { EducationalVisual } from './EducationalVisual';
import { BOOK_WATERMARK } from '../data/bookData';
import { 
  Sparkles, CheckCircle2, AlertTriangle, Lightbulb, 
  Heart
} from 'lucide-react';

interface PageRendererProps {
  page: DisplayPage | BookPage;
  currentPageNumber: number;
  totalPages: number;
}

export const PageRenderer: React.FC<PageRendererProps> = ({
  page,
  currentPageNumber,
  totalPages
}) => {
  const isDisplayPage = 'blocks' in page;
  const displayPage = isDisplayPage ? (page as DisplayPage) : null;
  const isFinalCover = displayPage?.isFinalCoverPage === true;

  // Final Cover Page Presentation
  if (isFinalCover) {
    return (
      <div className="w-full h-full flex flex-col justify-between p-4 sm:p-7 md:p-8 bg-gradient-to-b from-[#FFFDFE] via-[#FFF7F9] to-[#FDF1F4] rounded-xl text-right select-text border border-[#F5D5DC]">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-[#F2CBD4] pb-2.5 mb-2 shrink-0">
          <span className="px-2.5 py-0.5 rounded-full bg-[#FCE8ED] text-[#8C384E] border border-[#F7CED7] text-[10px] sm:text-[11px] font-bold flex items-center gap-1">
            <Heart className="w-2.5 h-2.5 text-[#D88A9C] fill-[#EAB1BF]" />
            غلاف الختام الفني
          </span>
          <span className="text-[11px] font-bold text-[#A65B6F] tracking-wide">
            لوحة الختام — ELORIA
          </span>
        </div>

        {/* Center Artwork: Uploaded Image Preserved in Original Proportions */}
        <div className="flex-1 flex flex-col items-center justify-center my-auto py-2">
          <div className="relative max-h-[58vh] sm:max-h-[62vh] rounded-2xl overflow-hidden shadow-xl shadow-[#E8B4C0]/25 border-2 border-[#E8B4C0]/90 bg-white/70 p-1 transition-transform">
            <img
              src="/eloria_cover.jpg"
              alt="ELORIA Final Cover Art"
              className="max-h-[54vh] sm:max-h-[58vh] w-auto h-auto object-contain rounded-xl"
              loading="eager"
            />
          </div>
          <div className="mt-3 text-center">
            <h3 className="font-arabic-heading text-sm sm:text-base font-bold text-[#632030] tracking-wide">
              𝑬𝑳𝑶𝑹𝑰𝑨 — Hair • Care • Beauty
            </h3>
            <p className="text-[10.5px] text-[#A65B6F] mt-0.5">
              الإصدار الكامل — الطبعة التفاعلية الفاخرة
            </p>
          </div>
        </div>

        {/* Discreet Luxury Page Footer */}
        <div className="pt-3 border-t border-[#F2CBD4] flex items-center justify-between text-[11px] text-[#A66878] select-none shrink-0">
          <span className="font-medium">
            صفحة {currentPageNumber} من {totalPages}
          </span>
          <span className="font-mono text-[9.5px] tracking-widest text-[#B37B8B] opacity-60 font-semibold">
            {BOOK_WATERMARK}
          </span>
          <span className="text-[10px] text-[#B37B8B]">
            خاتمة الكتاب
          </span>
        </div>
      </div>
    );
  }

  // Render DisplayPage Blocks (Smart Paginated View with Unified Fixed Structure)
  if (displayPage && displayPage.blocks) {
    return (
      <div className="w-full h-full flex flex-col justify-between p-4 sm:p-7 md:p-8 bg-gradient-to-b from-[#FFFDFE] via-[#FFF7F9] to-[#FDF1F4] rounded-xl text-right select-text border border-[#F5D5DC]">
        {/* Content Area */}
        <div className="flex-1 flex flex-col justify-start space-y-3">
          {/* Top Header */}
          <div className="flex items-center justify-between border-b border-[#F2CBD4] pb-2.5 mb-1 shrink-0">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#FCE8ED] text-[#8C384E] border border-[#F7CED7] text-[10px] sm:text-[11px] font-bold flex items-center gap-1">
                <Heart className="w-2.5 h-2.5 text-[#D88A9C] fill-[#EAB1BF]" />
                {displayPage.category}
              </span>
            </div>
            <span className="text-[11px] font-bold text-[#A65B6F] tracking-wide truncate max-w-[60%]">
              {displayPage.chapterTitle}
            </span>
          </div>

          {/* Sequential Natural Blocks */}
          {displayPage.blocks.map((block: PageContentBlock, bIdx: number) => {
            switch (block.type) {
              case 'title':
                return (
                  <div key={bIdx} className={bIdx > 0 ? "pt-2 mt-2 border-t border-[#F2CBD4]/60" : ""}>
                    <h2 
                      className={`font-arabic-heading font-bold text-[#3A1D25] leading-snug mb-1 ${
                        bIdx > 0 ? "text-base sm:text-lg text-[#52212D]" : "text-lg sm:text-2xl"
                      }`}
                    >
                      {block.text}
                    </h2>
                  </div>
                );

              case 'summary':
                return (
                  <div 
                    key={bIdx}
                    className="mb-2 px-3.5 py-2.5 rounded-xl bg-[#FFF0F4] border-r-3 border-r-[#D88A9C] border-[#F2CCD6] text-xs text-[#5E2534] leading-relaxed flex items-start gap-2 shadow-2xs"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#D88A9C] shrink-0 mt-0.5" />
                    <span>{block.text}</span>
                  </div>
                );

              case 'paragraph':
                return (
                  <p 
                    key={bIdx}
                    className="text-xs sm:text-[13px] text-[#42232B] leading-relaxed text-justify"
                  >
                    {block.text}
                  </p>
                );

              case 'visual':
                return (
                  <div key={bIdx} className="my-2">
                    <EducationalVisual visual={block.visual} />
                  </div>
                );

              case 'application':
                if (!block.application) return null;
                return (
                  <div 
                    key={bIdx}
                    className="my-2.5 p-3.5 sm:p-4 rounded-xl bg-[#FFFDFE] border border-[#F2CCD6] shadow-2xs"
                  >
                    <h4 className="text-xs sm:text-[13px] font-bold text-[#782C3E] flex items-center gap-1.5 mb-2.5">
                      <Lightbulb className="w-3.5 h-3.5 text-[#D88A9C]" />
                      {block.application.title || 'خطوات التطبيق العملي'}
                    </h4>
                    <div className="space-y-2">
                      {block.application.steps.map((step, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-[12.5px] text-[#42232B]">
                          <span className="w-5 h-5 rounded-full bg-[#FCE8ED] text-[#8C384E] text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5 border border-[#F3BDC9]">
                            {(block.application?.startStepIndex || 0) + idx + 1}
                          </span>
                          <span className="leading-relaxed">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );

              case 'mistakes':
                if (!block.mistakes) return null;
                return (
                  <div 
                    key={bIdx}
                    className="my-2 p-3.5 rounded-xl bg-[#FFF7F8] border border-[#F5CCD3] text-xs space-y-1.5 shadow-2xs"
                  >
                    <div className="flex items-start gap-1.5 text-[#A32938]">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold ml-1">الخطأ الشائع:</span>
                        <span>{block.mistakes.bad}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-1.5 text-[#2E6B43]">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold ml-1">التصحيح العملي:</span>
                        <span>{block.mistakes.fix}</span>
                      </div>
                    </div>
                    {block.mistakes.why && (
                      <p className="text-[11px] text-[#7A424E] pt-1.5 border-t border-[#F7DCE2]">
                        <span className="font-bold ml-1">التفسير العلمي:</span>
                        {block.mistakes.why}
                      </p>
                    )}
                  </div>
                );

              case 'checklist':
                if (!block.checklist) return null;
                return (
                  <div 
                    key={bIdx}
                    className="my-2 p-3.5 rounded-xl bg-[#FFFDFE] border border-[#F2CCD6] text-xs space-y-1.5 shadow-2xs"
                  >
                    <span className="font-bold text-[#8C384E] block mb-1">
                      {block.checklist.title || 'نقاط التطبيق الأساسية:'}
                    </span>
                    {block.checklist.items.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-[#42232B]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#D88A9C] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                );

              case 'result':
                return (
                  <div 
                    key={bIdx}
                    className="mt-2 p-2.5 rounded-lg bg-[#FAF0F3] border-r-3 border-r-[#C86A80] border-[#F2CCD6] text-xs text-[#4E212D] flex items-center gap-2"
                  >
                    <span className="font-bold text-[#782C3E] shrink-0">النتيجة المتوقعة:</span>
                    <span className="text-[11.5px]">{block.text}</span>
                  </div>
                );

              default:
                return null;
            }
          })}
        </div>

        {/* Discreet Luxury Page Footer - Always Pinned at Bottom */}
        <div className="mt-4 pt-3 border-t border-[#F2CBD4] flex items-center justify-between text-[11px] text-[#A66878] select-none shrink-0">
          <span className="font-medium">
            صفحة {currentPageNumber} من {totalPages}
          </span>
          <span className="font-mono text-[9.5px] tracking-widest text-[#B37B8B] opacity-60 font-semibold">
            {BOOK_WATERMARK}
          </span>
          <span className="text-[10px] text-[#B37B8B]">
            الفصل {displayPage.chapterNumber}
          </span>
        </div>
      </div>
    );
  }

  // Fallback for standard BookPage
  const standardPage = page as BookPage;
  return (
    <div className="w-full h-full flex flex-col justify-between p-4 sm:p-7 md:p-8 bg-gradient-to-b from-[#FFFDFE] via-[#FFF7F9] to-[#FDF1F4] rounded-xl text-right select-text border border-[#F5D5DC]">
      <div className="flex-1 flex flex-col justify-start space-y-3">
        <div className="flex items-center justify-between border-b border-[#F2CBD4] pb-2.5 mb-2 shrink-0">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#FCE8ED] text-[#8C384E] border border-[#F7CED7] text-[10px] sm:text-[11px] font-bold flex items-center gap-1">
              <Heart className="w-2.5 h-2.5 text-[#D88A9C] fill-[#EAB1BF]" />
              {standardPage.category}
            </span>
          </div>
          <span className="text-[11px] font-bold text-[#A65B6F] tracking-wide">
            {standardPage.chapterTitle}
          </span>
        </div>

        <h2 className="font-arabic-heading text-lg sm:text-2xl font-bold text-[#3A1D25] leading-snug mb-2">
          {standardPage.pageTitle}
        </h2>

        {standardPage.summary && (
          <div className="mb-3 px-3.5 py-2.5 rounded-xl bg-[#FFF0F4] border-r-3 border-r-[#D88A9C] border-[#F2CCD6] text-xs text-[#5E2534] leading-relaxed flex items-start gap-2 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#D88A9C] shrink-0 mt-0.5" />
            <span>{standardPage.summary}</span>
          </div>
        )}

        <div className="space-y-2.5 text-xs sm:text-[13px] text-[#42232B] leading-relaxed">
          {standardPage.content.explanation.map((para, idx) => (
            <p key={idx} className="text-justify">
              {para}
            </p>
          ))}
        </div>

        {standardPage.content.visual && (
          <EducationalVisual visual={standardPage.content.visual} />
        )}

        {standardPage.content.application && (
          <div className="my-3 p-3.5 sm:p-4 rounded-xl bg-[#FFFDFE] border border-[#F2CCD6] shadow-2xs">
            <h4 className="text-xs sm:text-[13px] font-bold text-[#782C3E] flex items-center gap-1.5 mb-2.5">
              <Lightbulb className="w-3.5 h-3.5 text-[#D88A9C]" />
              {standardPage.content.application.title}
            </h4>
            <div className="space-y-2">
              {standardPage.content.application.steps.map((step, idx) => (
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

        {standardPage.content.mistakes && (
          <div className="my-2 p-3.5 rounded-xl bg-[#FFF7F8] border border-[#F5CCD3] text-xs space-y-1.5 shadow-2xs">
            <div className="flex items-start gap-1.5 text-[#A32938]">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold ml-1">الخطأ الشائع:</span>
                <span>{standardPage.content.mistakes.bad}</span>
              </div>
            </div>
            <div className="flex items-start gap-1.5 text-[#2E6B43]">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold ml-1">التصحيح العملي:</span>
                <span>{standardPage.content.mistakes.fix}</span>
              </div>
            </div>
            {standardPage.content.mistakes.why && (
              <p className="text-[11px] text-[#7A424E] pt-1.5 border-t border-[#F7DCE2]">
                <span className="font-bold ml-1">التفسير العلمي:</span>
                {standardPage.content.mistakes.why}
              </p>
            )}
          </div>
        )}

        {standardPage.content.checklist && (
          <div className="my-2 p-3.5 rounded-xl bg-[#FFFDFE] border border-[#F2CCD6] text-xs space-y-1.5 shadow-2xs">
            <span className="font-bold text-[#8C384E] block mb-1">نقاط التطبيق الأساسية:</span>
            {standardPage.content.checklist.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2 text-[#42232B]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#D88A9C] shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        )}

        {standardPage.content.result && (
          <div className="mt-2.5 p-2.5 rounded-lg bg-[#FAF0F3] border-r-3 border-r-[#C86A80] border-[#F2CCD6] text-xs text-[#4E212D] flex items-center gap-2">
            <span className="font-bold text-[#782C3E] shrink-0">النتيجة المتوقعة:</span>
            <span className="text-[11.5px]">{standardPage.content.result}</span>
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-[#F2CBD4] flex items-center justify-between text-[11px] text-[#A66878] select-none shrink-0">
        <span className="font-medium">
          صفحة {currentPageNumber} من {totalPages}
        </span>
        <span className="font-mono text-[9.5px] tracking-widest text-[#B37B8B] opacity-60 font-semibold">
          {BOOK_WATERMARK}
        </span>
        <span className="text-[10px] text-[#B37B8B]">
          الفصل {standardPage.chapterNumber}
        </span>
      </div>
    </div>
  );
};
