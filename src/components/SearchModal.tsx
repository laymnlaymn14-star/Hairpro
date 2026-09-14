import React, { useState, useMemo } from 'react';
import { searchBook } from '../data/bookData';
import { Search, X, ChevronLeft, BookOpen, AlertCircle, Heart } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPage: (index: number) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectPage
}) => {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    return searchBook(query);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div 
        className="w-full max-w-xl max-h-[85vh] bg-[#FFF8FA] rounded-2xl shadow-2xl flex flex-col border border-[#F2CBD4] overflow-hidden text-right"
        dir="rtl"
      >
        {/* Search Header Input */}
        <div className="p-3.5 sm:p-4 border-b border-[#F2CBD4] bg-[#FDEEF2] flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#FCE8ED] border border-[#F5CCD6] flex items-center justify-center shrink-0">
            <Search className="w-4 h-4 text-[#C86A80]" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحثي عن موضوع (مثال: المسامية، سيشوار، حرارة، كيرلي، سيلك برس)..."
            className="flex-1 bg-transparent border-none text-xs sm:text-sm text-[#422129] placeholder-[#B37B8B] focus:outline-none"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-[#A66878] hover:text-[#422129] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#FADCE4] text-[#782C3E] transition-colors cursor-pointer mr-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Results List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {query.trim().length < 2 ? (
            <div className="py-12 text-center text-xs text-[#8C5260] space-y-2">
              <BookOpen className="w-8 h-8 text-[#D88A9C] mx-auto opacity-75" />
              <p>اكتبي كلمتين على الأقل للبحث في كامل صفحات الكتاب الـ 118</p>
              <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3 pt-2">
                {['المسامية', 'السيشوار', 'الكيراتين', 'تقسيم الخصلات', 'Silk Press', 'بكرات الفيلكرو'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-3 py-1 rounded-full bg-[#FCE8ED] text-[11px] text-[#8C384E] border border-[#F7CED7] hover:bg-[#FAD6DF] transition-colors cursor-pointer"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#8C5260] space-y-2">
              <AlertCircle className="w-7 h-7 text-[#D88A9C] mx-auto" />
              <p>لم يتم العثور على نتائج مطابقة لـ &quot;{query}&quot;</p>
              <p className="text-[11px] text-[#A66878]">جربي البحث بكلمة مرادفة أو مبسطة</p>
            </div>
          ) : (
            <>
              <div className="text-[11px] font-bold text-[#8C384E] px-1 pb-1 flex items-center gap-1">
                <Heart className="w-3 h-3 text-[#D88A9C] fill-[#EAB1BF]" />
                تم العثور على {results.length} نتيجة:
              </div>
              {results.map(({ pageIndex, page, matchText }) => (
                <button
                  key={page.id}
                  onClick={() => {
                    onSelectPage(pageIndex);
                    onClose();
                  }}
                  className="w-full text-right p-3 rounded-xl bg-[#FFFDFE] border border-[#F2CCD6] hover:border-[#D88A9C] hover:bg-[#FFF0F4] transition-all cursor-pointer group shadow-2xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-[#8C384E] bg-[#FCE8ED] px-2 py-0.5 rounded-full border border-[#F5CCD6]">
                      {page.chapterTitle}
                    </span>
                    <span className="text-[10.5px] text-[#A66878] flex items-center gap-1">
                      صفحة {pageIndex + 1}
                      <ChevronLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform text-[#C86A80]" />
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-[#422129] mb-1">
                    {page.pageTitle}
                  </h4>
                  <p className="text-[11px] text-[#633541] line-clamp-2 leading-relaxed">
                    {matchText}
                  </p>
                </button>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
