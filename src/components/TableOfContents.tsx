import React from 'react';
import { Chapter, BookPage, DisplayPage } from '../types';
import { X, BookOpen, ChevronLeft, Bookmark, Heart, Image as ImageIcon } from 'lucide-react';

interface TableOfContentsProps {
  isOpen: boolean;
  onClose: () => void;
  chapters: Chapter[];
  allPages: (BookPage | DisplayPage)[];
  currentPageIndex: number;
  onSelectPage: (index: number) => void;
  bookmarks: number[];
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({
  isOpen,
  onClose,
  chapters,
  allPages,
  currentPageIndex,
  onSelectPage,
  bookmarks
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div 
        className="w-full max-w-md h-full bg-[#FFF8FA] shadow-2xl flex flex-col border-l border-[#F2CBD4] text-right"
        dir="rtl"
      >
        {/* Header */}
        <div className="p-4 border-b border-[#F2CBD4] flex items-center justify-between bg-[#FDEEF2]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#FCE8ED] border border-[#F5CCD6] flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-[#C86A80]" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#422129] flex items-center gap-1.5">
                فهرس الكتاب (27 فصلاً)
                <Heart className="w-3 h-3 text-[#D88A9C] fill-[#EAB1BF]" />
              </h3>
              <p className="text-[11px] text-[#8C5260]">إجمالي {allPages.length} صفحة تعليمية مصممة بأناقة</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#FADCE4] text-[#782C3E] transition-colors cursor-pointer"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chapters List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {chapters.map((ch) => {
            const isCurrentChapter = 
              currentPageIndex >= ch.startPageIndex && 
              currentPageIndex < ch.startPageIndex + ch.pagesCount;

            return (
              <div 
                key={ch.number} 
                className={`rounded-xl border transition-all ${
                  isCurrentChapter 
                    ? 'bg-[#FFFDFE] border-[#D88A9C] shadow-xs' 
                    : 'bg-[#FFFDFE] border-[#F2CCD6] hover:border-[#E8A5B5]'
                }`}
              >
                {/* Chapter Title Bar */}
                <button
                  onClick={() => {
                    onSelectPage(ch.startPageIndex);
                    onClose();
                  }}
                  className="w-full p-3 flex items-center justify-between text-right cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center shrink-0 ${
                      isCurrentChapter 
                        ? 'bg-gradient-to-r from-[#D88A9C] to-[#C86A80] text-white shadow-2xs' 
                        : 'bg-[#FCE8ED] text-[#8C384E]'
                    }`}>
                      {ch.number}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-[#422129]">{ch.title}</h4>
                      <span className="text-[10px] text-[#A66878]">{ch.category}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#A66878] text-[11px]">
                    <span>{ch.pagesCount} صفحات</span>
                    <ChevronLeft className="w-3.5 h-3.5 text-[#C86A80]" />
                  </div>
                </button>

                {/* Sub-pages inside chapter */}
                <div className="px-3 pb-2.5 pt-1 border-t border-[#F7D8E0] space-y-1">
                  {allPages.slice(ch.startPageIndex, ch.startPageIndex + ch.pagesCount).map((p, idx) => {
                    const absIndex = ch.startPageIndex + idx;
                    const isCurrent = absIndex === currentPageIndex;
                    const isBookmarked = bookmarks.includes(absIndex);

                    return (
                      <button
                        key={p.id}
                        onClick={() => {
                          onSelectPage(absIndex);
                          onClose();
                        }}
                        className={`w-full text-right px-2.5 py-1.5 rounded-lg text-[11.5px] flex items-center justify-between transition-colors cursor-pointer ${
                          isCurrent 
                            ? 'bg-[#FCE8ED] text-[#782638] font-bold border border-[#F5C2CD]' 
                            : 'hover:bg-[#FDF1F4] text-[#52212D]'
                        }`}
                      >
                        <span className="truncate max-w-[260px]">
                          {idx + 1}. {p.pageTitle}
                        </span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {isBookmarked && (
                            <Bookmark className="w-3 h-3 text-[#D88A9C] fill-[#D88A9C]" />
                          )}
                          <span className="text-[10px] text-[#A66878]">
                            ص {absIndex + 1}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Dedicated Final Cover link */}
          {allPages.length > 0 && (
            <div className="rounded-xl border border-[#F2CCD6] bg-gradient-to-r from-[#FFF0F4] to-[#FCE8ED] p-3">
              <button
                onClick={() => {
                  onSelectPage(allPages.length - 1);
                  onClose();
                }}
                className="w-full flex items-center justify-between text-right cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-[#EAB1BF] text-white flex items-center justify-center shrink-0">
                    <ImageIcon className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#422129]">لوحة غلاف الختام الفنية</h4>
                    <span className="text-[10px] text-[#A66878]">خاتمة الكتاب — ELORIA</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-[#A66878] text-[11px]">
                  <span>ص {allPages.length}</span>
                  <ChevronLeft className="w-3.5 h-3.5 text-[#C86A80]" />
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
