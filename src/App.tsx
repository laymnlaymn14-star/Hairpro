import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BOOK_PAGES, CHAPTERS_LIST, BOOK_WATERMARK } from './data/bookData';
import { PageRenderer } from './components/PageRenderer';
import { BookCover } from './components/BookCover';
import { TableOfContents } from './components/TableOfContents';
import { SearchModal } from './components/SearchModal';
import { 
  ChevronRight, ChevronLeft, BookOpen, Search, Bookmark, 
  BookmarkCheck, Sparkles, Home, 
  ChevronsRight, ChevronsLeft, Columns, Square, Maximize2, Minimize2, Heart
} from 'lucide-react';

export default function App() {
  // Persistence state
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(() => {
    const saved = localStorage.getItem('hair_pro_last_page');
    if (saved !== null) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed) && parsed >= 0 && parsed < BOOK_PAGES.length) {
        return parsed;
      }
    }
    return 0;
  });

  const [isCoverView, setIsCoverView] = useState<boolean>(() => {
    return localStorage.getItem('hair_pro_visited') !== 'true';
  });

  const [bookmarks, setBookmarks] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('hair_pro_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // UI Modals & Settings
  const [isTOCOpen, setIsTOCOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isTwoPageMode, setIsTwoPageMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [flipAnimation, setFlipAnimation] = useState<'next' | 'prev' | null>(null);

  // Swipe gesture tracking
  const touchStartXRef = useRef<number | null>(null);
  const bookContainerRef = useRef<HTMLDivElement | null>(null);

  // Save current page to localStorage
  useEffect(() => {
    localStorage.setItem('hair_pro_last_page', currentPageIndex.toString());
    localStorage.setItem('hair_pro_visited', 'true');
  }, [currentPageIndex]);

  // Save bookmarks to localStorage
  useEffect(() => {
    localStorage.setItem('hair_pro_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  // Auto-detect wide screens for two-page mode optional preference
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024 && isTwoPageMode) {
        setIsTwoPageMode(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isTwoPageMode]);

  // Flip page handlers with animation
  const goToPage = useCallback((newIndex: number, direction: 'next' | 'prev' = 'next') => {
    if (newIndex < 0 || newIndex >= BOOK_PAGES.length) return;
    setFlipAnimation(direction);
    setIsCoverView(false);
    
    // Quick timeout to reset animation class
    setTimeout(() => {
      setCurrentPageIndex(newIndex);
      setFlipAnimation(null);
    }, 150);
  }, []);

  const handleNext = useCallback(() => {
    if (isCoverView) {
      setIsCoverView(false);
      return;
    }
    const increment = isTwoPageMode ? 2 : 1;
    if (currentPageIndex + increment < BOOK_PAGES.length) {
      goToPage(currentPageIndex + increment, 'next');
    }
  }, [isCoverView, isTwoPageMode, currentPageIndex, goToPage]);

  const handlePrev = useCallback(() => {
    if (isCoverView) return;
    const decrement = isTwoPageMode ? 2 : 1;
    if (currentPageIndex - decrement >= 0) {
      goToPage(currentPageIndex - decrement, 'prev');
    } else {
      setIsCoverView(true);
    }
  }, [isCoverView, isTwoPageMode, currentPageIndex, goToPage]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === 'ArrowLeft' || e.key === 'PageDown') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowRight' || e.key === 'PageUp') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'Escape') {
        setIsTOCOpen(false);
        setIsSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  // Touch gesture handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchEndX - touchStartXRef.current;
    
    if (Math.abs(deltaX) > 50) {
      if (deltaX < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartXRef.current = null;
  };

  // Toggle Bookmark for current page
  const toggleBookmark = () => {
    setBookmarks(prev => {
      if (prev.includes(currentPageIndex)) {
        return prev.filter(p => p !== currentPageIndex);
      } else {
        return [...prev, currentPageIndex].sort((a, b) => a - b);
      }
    });
  };

  const isCurrentBookmarked = bookmarks.includes(currentPageIndex);

  // Jump to next or previous chapter
  const currentChapterNum = BOOK_PAGES[currentPageIndex]?.chapterNumber || 1;
  const currentChapterObj = CHAPTERS_LIST.find(c => c.number === currentChapterNum);

  const goToNextChapter = () => {
    const nextCh = CHAPTERS_LIST.find(c => c.number === currentChapterNum + 1);
    if (nextCh) {
      goToPage(nextCh.startPageIndex, 'next');
    }
  };

  const goToPrevChapter = () => {
    const prevCh = CHAPTERS_LIST.find(c => c.number === currentChapterNum - 1);
    if (prevCh) {
      goToPage(prevCh.startPageIndex, 'prev');
    } else {
      setIsCoverView(true);
    }
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  const progressPercent = Math.round(((currentPageIndex + 1) / BOOK_PAGES.length) * 100);

  return (
    <div 
      className="min-h-screen flex flex-col bg-[#FDF5F7] text-[#382127] selection:bg-[#F8D2DC] selection:text-[#5A1C2C] font-sans antialiased"
      dir="rtl"
    >
      {/* 1. TOP ELEGANT NAVIGATION BAR - Feminine Light Pink */}
      <header className="sticky top-0 z-40 bg-[#FFF8FA]/95 backdrop-blur-md border-b border-[#F2CBD4] px-3 sm:px-6 py-2.5 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          {/* Logo & Book Brand */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setIsCoverView(true)}
              className="flex items-center gap-2 text-right hover:opacity-85 transition-opacity cursor-pointer group"
              title="العودة إلى الغلاف"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#D88A9C] via-[#C87386] to-[#A84C62] text-white flex items-center justify-center font-latin-title font-bold text-xs shadow-xs">
                HP
              </div>
              <div className="hidden xs:block">
                <span className="font-latin-title font-bold text-sm tracking-wider text-[#3D1E26] flex items-center gap-1 leading-none">
                  HAIR PRO
                  <Heart className="w-2.5 h-2.5 text-[#D88A9C] fill-[#EAB1BF]" />
                </span>
                <span className="text-[10px] text-[#A66878] leading-none">
                  الدليل التعليمي الأنثوي
                </span>
              </div>
            </button>
          </div>

          {/* Center: Current Location / Chapter Title */}
          {!isCoverView && (
            <div className="hidden md:flex items-center gap-2 text-xs text-[#782C3E] bg-[#FFF0F4] px-3.5 py-1.5 rounded-full border border-[#F2CCD6] shadow-2xs">
              <span className="font-bold text-[#A84C62]">
                الفصل {currentChapterNum}:
              </span>
              <span className="truncate max-w-[200px] lg:max-w-[300px]">
                {currentChapterObj?.title.replace(/الفصل \d+ — /, '')}
              </span>
              <span className="text-[#A66878] text-[10px] border-r border-[#F5CAD4] pr-2">
                {currentPageIndex + 1} / {BOOK_PAGES.length}
              </span>
            </div>
          )}

          {/* Right Action Icons */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            {/* Table of Contents Button */}
            <button
              onClick={() => setIsTOCOpen(true)}
              className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#FFF0F4] border border-[#F2CCD6] hover:bg-[#FCE5EB] text-[#632938] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="الفهرس"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#C86A80]" />
              <span className="hidden sm:inline">الفهرس</span>
            </button>

            {/* Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-1.5 sm:px-3 sm:py-1.5 rounded-lg bg-[#FFF0F4] border border-[#F2CCD6] hover:bg-[#FCE5EB] text-[#632938] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="البحث"
            >
              <Search className="w-3.5 h-3.5 text-[#C86A80]" />
              <span className="hidden sm:inline">بحث</span>
            </button>

            {/* Bookmark Toggle */}
            {!isCoverView && (
              <button
                onClick={toggleBookmark}
                className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border transition-all cursor-pointer ${
                  isCurrentBookmarked 
                    ? 'bg-[#FCE8ED] border-[#D88A9C] text-[#8C384E]' 
                    : 'bg-[#FFF0F4] border-[#F2CCD6] hover:bg-[#FCE5EB] text-[#632938]'
                }`}
                title={isCurrentBookmarked ? 'إزالة من المحفوظات' : 'حفظ الصفحة'}
              >
                {isCurrentBookmarked ? (
                  <BookmarkCheck className="w-3.5 h-3.5 fill-[#D88A9C] text-[#D88A9C]" />
                ) : (
                  <Bookmark className="w-3.5 h-3.5" />
                )}
              </button>
            )}

            {/* Cover Button */}
            {!isCoverView && (
              <button
                onClick={() => setIsCoverView(true)}
                className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-[#FFF0F4] border border-[#F2CCD6] hover:bg-[#FCE5EB] text-[#632938] text-xs transition-colors cursor-pointer"
                title="الغلاف"
              >
                <Home className="w-3.5 h-3.5 text-[#C86A80]" />
              </button>
            )}

            {/* Two-page Spread Toggle on large screens */}
            <button
              onClick={() => setIsTwoPageMode(!isTwoPageMode)}
              className="hidden lg:flex p-1.5 rounded-lg bg-[#FFF0F4] border border-[#F2CCD6] hover:bg-[#FCE5EB] text-[#632938] text-xs transition-colors cursor-pointer"
              title={isTwoPageMode ? 'عرض صفحة واحدة' : 'عرض صفحتين'}
            >
              {isTwoPageMode ? (
                <Square className="w-3.5 h-3.5 text-[#C86A80]" />
              ) : (
                <Columns className="w-3.5 h-3.5 text-[#C86A80]" />
              )}
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              className="hidden sm:flex p-1.5 rounded-lg bg-[#FFF0F4] border border-[#F2CCD6] hover:bg-[#FCE5EB] text-[#632938] text-xs transition-colors cursor-pointer"
              title={isFullscreen ? 'إنهاء ملء الشاشة' : 'ملء الشاشة'}
            >
              {isFullscreen ? (
                <Minimize2 className="w-3.5 h-3.5 text-[#C86A80]" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5 text-[#C86A80]" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* 2. MAIN READING STAGE */}
      <main 
        ref={bookContainerRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="flex-1 flex flex-col justify-center items-center p-2 sm:p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full relative"
      >
        {isCoverView ? (
          <BookCover 
            onOpenBook={() => setIsCoverView(false)} 
            onOpenTOC={() => setIsTOCOpen(true)} 
          />
        ) : (
          <div className="w-full flex-1 flex flex-col justify-center items-center book-perspective">
            {/* Desktop Flip Stage */}
            <div 
              className={`w-full max-w-5xl transition-all duration-300 ease-out ${
                flipAnimation === 'next' ? 'scale-[0.985] opacity-90' : 
                flipAnimation === 'prev' ? 'scale-[0.985] opacity-90' : 'scale-100 opacity-100'
              }`}
            >
              {isTwoPageMode && window.innerWidth >= 1024 ? (
                /* TWO-PAGE SPREAD (Delicate Pink Open Book Simulation) */
                <div className="grid grid-cols-2 gap-0 rounded-2xl overflow-hidden shadow-2xl shadow-[#E8B4C0]/25 border-2 border-[#E8B4C0]/70 bg-gradient-to-b from-[#FFFDFE] to-[#FFF5F7] relative">
                  {/* Central Spine Fold Shadow with rose undertones */}
                  <div className="absolute top-0 bottom-0 left-1/2 -ml-3 w-6 pointer-events-none z-10 bg-gradient-to-r from-black/8 via-transparent to-black/8 shadow-inner" />

                  {/* Right Page (RTL: Page 1) */}
                  <div className="page-spine-shadow-right border-l border-[#F5CCD6] overflow-y-auto max-h-[80vh] p-1">
                    <PageRenderer 
                      page={BOOK_PAGES[currentPageIndex]} 
                      currentPageNumber={currentPageIndex + 1}
                      totalPages={BOOK_PAGES.length}
                    />
                  </div>

                  {/* Left Page (RTL: Page 2 if exists) */}
                  <div className="page-spine-shadow-left overflow-y-auto max-h-[80vh] p-1">
                    {currentPageIndex + 1 < BOOK_PAGES.length ? (
                      <PageRenderer 
                        page={BOOK_PAGES[currentPageIndex + 1]} 
                        currentPageNumber={currentPageIndex + 2}
                        totalPages={BOOK_PAGES.length}
                      />
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center p-8 text-center text-[#8C4A5A]">
                        <Sparkles className="w-8 h-8 text-[#D88A9C] mb-3" />
                        <h3 className="font-bold text-base text-[#3D1E26]">نهاية الكتاب التعليمي</h3>
                        <p className="text-xs text-[#7A3E4E] mt-1">تهانينا على إتمام فصول HAIR PRO الـ 27!</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* SINGLE PAGE (Mobile & Focused Mode) */
                <div className="w-full max-w-2xl mx-auto rounded-2xl overflow-hidden shadow-xl shadow-[#E8B4C0]/20 border border-[#E8B4C0]/80 bg-gradient-to-b from-[#FFFDFE] to-[#FFF5F7] min-h-[500px]">
                  <PageRenderer 
                    page={BOOK_PAGES[currentPageIndex]} 
                    currentPageNumber={currentPageIndex + 1}
                    totalPages={BOOK_PAGES.length}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* 3. BOTTOM READING CONTROLS & DYNAMIC PAGINATION BAR */}
      {!isCoverView && (
        <footer className="sticky bottom-0 z-30 bg-[#FFF8FA]/95 backdrop-blur-md border-t border-[#F2CBD4] px-3 sm:px-6 py-2.5">
          <div className="max-w-4xl mx-auto flex flex-col gap-2">
            {/* Navigation Buttons and Slider */}
            <div className="flex items-center justify-between gap-2 sm:gap-4">
              {/* Previous Page Button (In RTL, ChevronRight moves backward) */}
              <div className="flex items-center gap-1">
                <button
                  onClick={goToPrevChapter}
                  disabled={currentChapterNum <= 1}
                  className="p-2 rounded-xl bg-[#FFF0F4] border border-[#F2CCD6] text-[#632938] hover:bg-[#FCE5EB] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  title="الفصل السابق"
                >
                  <ChevronsRight className="w-4 h-4 text-[#C86A80]" />
                </button>
                <button
                  onClick={handlePrev}
                  className="px-3 sm:px-4 py-2 rounded-xl bg-[#FFF0F4] border border-[#F2CCD6] text-[#632938] font-bold text-xs sm:text-sm hover:bg-[#FCE5EB] active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4 text-[#C86A80]" />
                  <span>السابق</span>
                </button>
              </div>

              {/* Dynamic Page Jumping Slider & Number Box */}
              <div className="flex-1 flex items-center justify-center gap-2 max-w-xs sm:max-w-sm">
                <input
                  type="range"
                  min="0"
                  max={BOOK_PAGES.length - 1}
                  value={currentPageIndex}
                  onChange={(e) => goToPage(parseInt(e.target.value, 10))}
                  className="w-full accent-[#D88A9C] h-1.5 bg-[#F5D5DC] rounded-lg cursor-pointer"
                  title={`انتقال سريع (صفحة ${currentPageIndex + 1})`}
                />
                <div className="shrink-0 text-[11px] font-bold text-[#8C384E] bg-[#FCE8ED] px-2.5 py-1 rounded-md border border-[#F2CCD6]">
                  {currentPageIndex + 1} / {BOOK_PAGES.length}
                </div>
              </div>

              {/* Next Page Button (In RTL, ChevronLeft moves forward) */}
              <div className="flex items-center gap-1">
                <button
                  onClick={handleNext}
                  disabled={currentPageIndex >= BOOK_PAGES.length - 1}
                  className="px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-[#D88A9C] via-[#C87386] to-[#B75B6F] text-white font-bold text-xs sm:text-sm hover:shadow-md hover:shadow-[#D88A9C]/30 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1 cursor-pointer"
                >
                  <span>التالي</span>
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={goToNextChapter}
                  disabled={currentChapterNum >= 27}
                  className="p-2 rounded-xl bg-[#FFF0F4] border border-[#F2CCD6] text-[#632938] hover:bg-[#FCE5EB] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  title="الفصل التالي"
                >
                  <ChevronsLeft className="w-4 h-4 text-[#C86A80]" />
                </button>
              </div>
            </div>

            {/* Reading Progress Percentage Line */}
            <div className="flex items-center justify-between text-[10px] text-[#A66878] px-1">
              <span className="flex items-center gap-1">
                <Heart className="w-2.5 h-2.5 text-[#D88A9C] fill-[#EAB1BF]" />
                تقدم القراءة: {progressPercent}%
              </span>
              <span className="font-mono text-[9px] opacity-60 font-semibold">{BOOK_WATERMARK}</span>
              <span>انقري أو اسحبي للتنقل بين الصفحات</span>
            </div>
          </div>
        </footer>
      )}

      {/* 4. MODALS & DRAWERS */}
      <TableOfContents
        isOpen={isTOCOpen}
        onClose={() => setIsTOCOpen(false)}
        chapters={CHAPTERS_LIST}
        allPages={BOOK_PAGES}
        currentPageIndex={currentPageIndex}
        onSelectPage={(idx) => goToPage(idx)}
        bookmarks={bookmarks}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectPage={(idx) => goToPage(idx)}
      />
    </div>
  );
}
