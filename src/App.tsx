import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Chapter } from './types';
import { BOOK_PAGES, CHAPTERS_LIST, BOOK_WATERMARK } from './data/bookData';
import { PageRenderer } from './components/PageRenderer';
import { BookCover } from './components/BookCover';
import { TableOfContents } from './components/TableOfContents';
import { SearchModal } from './components/SearchModal';
import { PWAInstallButton } from './components/PWAInstallButton';
import { generatePaginatedBook, DisplayPage } from './utils/paginationEngine';
import { 
  BookOpen, Search, Bookmark, 
  BookmarkCheck, Sparkles, Home, 
  ChevronsRight, ChevronsLeft, Columns, Square, Maximize2, Minimize2, Heart
} from 'lucide-react';

interface FlipTransition {
  isFlipping: boolean;
  direction: 'next' | 'prev';
  fromIndex: number;
  toIndex: number;
}

export default function App() {
  // Screen and Container Dimensions for Dynamic Typesetting
  const [viewportSize, setViewportSize] = useState(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 800,
    height: typeof window !== 'undefined' ? window.innerHeight : 800
  }));

  const bookContainerRef = useRef<HTMLDivElement | null>(null);

  // Resize listener for fluid responsive calculations
  useEffect(() => {
    let timeoutId: any;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setViewportSize({
          width: window.innerWidth,
          height: window.innerHeight
        });
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  // Compute fixed usable height for typesetting
  const usableHeight = useMemo(() => {
    // Stage height inside the fixed container frame (560px to 700px)
    let frameH = 620;
    if (viewportSize.height < 650) frameH = 540;
    else if (viewportSize.height >= 850) frameH = 680;
    // Inside card: header (~40px), footer (~40px), padding (~48px)
    return Math.max(340, frameH - 128);
  }, [viewportSize.height]);

  const contentWidth = useMemo(() => {
    const maxW = Math.min(640, viewportSize.width - 32);
    return Math.max(260, maxW - 48);
  }, [viewportSize.width]);

  // Generate complete smart-paginated book (with final cover page at the end)
  const paginatedPages: DisplayPage[] = useMemo(() => {
    return generatePaginatedBook(BOOK_PAGES, usableHeight, contentWidth);
  }, [usableHeight, contentWidth]);

  // Current Display Page Index
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(() => {
    const saved = localStorage.getItem('eloria_last_page') || localStorage.getItem('hair_pro_last_page');
    if (saved !== null) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed) && parsed >= 0) {
        return parsed;
      }
    }
    return 0;
  });

  // Clamp currentPageIndex if paginatedPages length changes
  useEffect(() => {
    if (paginatedPages.length > 0 && currentPageIndex >= paginatedPages.length) {
      setCurrentPageIndex(paginatedPages.length - 1);
    }
  }, [paginatedPages.length, currentPageIndex]);

  const [isCoverView, setIsCoverView] = useState<boolean>(() => {
    return (localStorage.getItem('eloria_visited') || localStorage.getItem('hair_pro_visited')) !== 'true';
  });

  const [bookmarks, setBookmarks] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('eloria_bookmarks') || localStorage.getItem('hair_pro_bookmarks');
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

  // Realistic 3D Page Turn State
  const [flipTransition, setFlipTransition] = useState<FlipTransition>({
    isFlipping: false,
    direction: 'next',
    fromIndex: currentPageIndex,
    toIndex: currentPageIndex
  });

  // Swipe gesture tracking
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  // Save current page to localStorage
  useEffect(() => {
    localStorage.setItem('eloria_last_page', currentPageIndex.toString());
    localStorage.setItem('eloria_visited', 'true');
  }, [currentPageIndex]);

  // Save bookmarks to localStorage
  useEffect(() => {
    localStorage.setItem('eloria_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  // Auto-detect wide screens for two-page mode optional preference
  useEffect(() => {
    if (viewportSize.width < 1024 && isTwoPageMode) {
      setIsTwoPageMode(false);
    }
  }, [viewportSize.width, isTwoPageMode]);

  // Realistic 3D Page Turn navigation handler
  const goToPage = useCallback((newIndex: number, direction: 'next' | 'prev' = 'next') => {
    if (newIndex < 0 || newIndex >= paginatedPages.length) return;
    if (newIndex === currentPageIndex && !isCoverView) return;

    if (isCoverView) {
      setIsCoverView(false);
      setCurrentPageIndex(newIndex);
      return;
    }

    // Trigger realistic 3D book leaf turn
    setFlipTransition({
      isFlipping: true,
      direction,
      fromIndex: currentPageIndex,
      toIndex: newIndex
    });

    // Complete animation after 500ms
    const timer = setTimeout(() => {
      setCurrentPageIndex(newIndex);
      setFlipTransition(prev => ({
        ...prev,
        isFlipping: false,
        fromIndex: newIndex,
        toIndex: newIndex
      }));
    }, 490);

    return () => clearTimeout(timer);
  }, [currentPageIndex, isCoverView, paginatedPages.length]);

  // Navigation handlers with symbols ‹ (السابق) and › (التالي)
  const handleNext = useCallback(() => {
    if (isCoverView) {
      setIsCoverView(false);
      return;
    }
    if (flipTransition.isFlipping) return;
    const increment = isTwoPageMode ? 2 : 1;
    if (currentPageIndex + increment < paginatedPages.length) {
      goToPage(currentPageIndex + increment, 'next');
    }
  }, [isCoverView, flipTransition.isFlipping, isTwoPageMode, currentPageIndex, paginatedPages.length, goToPage]);

  const handlePrev = useCallback(() => {
    if (isCoverView) return;
    if (flipTransition.isFlipping) return;
    const decrement = isTwoPageMode ? 2 : 1;
    if (currentPageIndex - decrement >= 0) {
      goToPage(currentPageIndex - decrement, 'prev');
    } else {
      setIsCoverView(true);
    }
  }, [isCoverView, flipTransition.isFlipping, isTwoPageMode, currentPageIndex, goToPage]);

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

  // Touch gesture handlers for mobile realistic page flip
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchEndX - touchStartXRef.current;
    const deltaY = touchEndY - touchStartYRef.current;
    
    // Check horizontal dominance to avoid vertical scroll conflict
    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2) {
      if (deltaX < 0) {
        // Swipe left in RTL moves forward to next page (›)
        handleNext();
      } else {
        // Swipe right in RTL moves backward to previous page (‹)
        handlePrev();
      }
    }
    touchStartXRef.current = null;
    touchStartYRef.current = null;
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

  // Dynamic Chapter Manifest mapped accurately to current paginated layout
  const dynamicChapters: Chapter[] = useMemo(() => {
    const chapterMap = new Map<number, { title: string; count: number; startIndex: number; category: string }>();

    paginatedPages.forEach((p, index) => {
      if (p.isFinalCoverPage) return;
      const chNum = p.chapterNumber;
      if (!chapterMap.has(chNum)) {
        chapterMap.set(chNum, {
          title: p.chapterTitle,
          count: 1,
          startIndex: index,
          category: p.category
        });
      } else {
        const existing = chapterMap.get(chNum)!;
        existing.count += 1;
      }
    });

    const chapters: Chapter[] = [];
    chapterMap.forEach((val, num) => {
      chapters.push({
        number: num,
        title: val.title,
        pagesCount: val.count,
        startPageIndex: val.startIndex,
        description: `يحتوي على ${val.count} صفحة تعليمية`,
        category: val.category
      });
    });

    return chapters.length > 0 ? chapters : CHAPTERS_LIST;
  }, [paginatedPages]);

  // Current page details
  const currentPage = paginatedPages[currentPageIndex] || paginatedPages[0];
  const currentChapterNum = currentPage?.chapterNumber || 1;
  const currentChapterObj = dynamicChapters.find(c => c.number === currentChapterNum) || CHAPTERS_LIST.find(c => c.number === currentChapterNum);

  // Jump to next or previous chapter
  const goToNextChapter = () => {
    const nextChapterIdx = paginatedPages.findIndex(p => p.chapterNumber === currentChapterNum + 1);
    if (nextChapterIdx !== -1) {
      goToPage(nextChapterIdx, 'next');
    } else if (paginatedPages.length > 0) {
      goToPage(paginatedPages.length - 1, 'next');
    }
  };

  const goToPrevChapter = () => {
    if (currentChapterNum <= 1) {
      setIsCoverView(true);
      return;
    }
    const prevChapterIdx = paginatedPages.findIndex(p => p.chapterNumber === currentChapterNum - 1);
    if (prevChapterIdx !== -1) {
      goToPage(prevChapterIdx, 'prev');
    } else {
      setIsCoverView(true);
    }
  };

  // Direct TOC page selection (points directly to exact DisplayPage index)
  const handleSelectFromTOC = (displayIndex: number) => {
    if (displayIndex >= 0 && displayIndex < paginatedPages.length) {
      goToPage(displayIndex, displayIndex > currentPageIndex ? 'next' : 'prev');
    }
  };

  // Search selection (maps original BookPage topic index to DisplayPage)
  const handleSelectFromSearch = (origIdx: number) => {
    const targetIdx = paginatedPages.findIndex(p => p.originalPageIndex === origIdx);
    if (targetIdx !== -1) {
      goToPage(targetIdx, targetIdx > currentPageIndex ? 'next' : 'prev');
    } else if (origIdx >= 0 && origIdx < paginatedPages.length) {
      goToPage(origIdx, origIdx > currentPageIndex ? 'next' : 'prev');
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

  const progressPercent = Math.round(((currentPageIndex + 1) / Math.max(1, paginatedPages.length)) * 100);

  // Unified Strict Fixed Dimension Classes for Page Frame
  const singlePageFrameClass = "w-full max-w-2xl h-[560px] sm:h-[620px] md:h-[660px] lg:h-[700px] rounded-2xl shadow-xl shadow-[#E8B4C0]/20 border border-[#E8B4C0]/80 bg-gradient-to-b from-[#FFFDFE] to-[#FFF5F7] overflow-hidden relative";
  const twoPageFrameClass = "w-full max-w-5xl h-[560px] sm:h-[620px] md:h-[660px] lg:h-[700px] rounded-2xl shadow-2xl shadow-[#E8B4C0]/25 border-2 border-[#E8B4C0]/70 bg-gradient-to-b from-[#FFFDFE] to-[#FFF5F7] overflow-hidden relative";

  return (
    <div 
      className="min-h-screen flex flex-col bg-[#FDF5F7] text-[#382127] selection:bg-[#F8D2DC] selection:text-[#5A1C2C] font-sans antialiased"
      dir="rtl"
    >
      {/* 1. TOP ELEGANT NAVIGATION BAR */}
      <header className="sticky top-0 z-40 bg-[#FFF8FA]/95 backdrop-blur-md border-b border-[#F2CBD4] px-3 sm:px-6 py-2.5 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          {/* Logo & Book Brand */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setIsCoverView(true)}
              className="flex items-center gap-2 text-right hover:opacity-85 transition-opacity cursor-pointer group"
              title="العودة إلى الغلاف"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#D88A9C] via-[#C87386] to-[#A84C62] text-white flex items-center justify-center font-serif font-bold text-sm shadow-xs">
                𝑬
              </div>
              <div className="hidden xs:block">
                <span className="font-serif font-bold text-sm tracking-wider text-[#3D1E26] flex items-center gap-1 leading-none">
                  𝑬𝑳𝑶𝑹𝑰𝑨
                  <Heart className="w-2.5 h-2.5 text-[#D88A9C] fill-[#EAB1BF]" />
                </span>
                <span className="text-[10px] text-[#A66878] leading-none">
                  Hair • Care • Beauty
                </span>
              </div>
            </button>
          </div>

          {/* Center: Current Location / Chapter Title */}
          {!isCoverView && currentPage && (
            <div className="hidden md:flex items-center gap-2 text-xs text-[#782C3E] bg-[#FFF0F4] px-3.5 py-1.5 rounded-full border border-[#F2CCD6] shadow-2xs">
              <span className="font-bold text-[#A84C62]">
                {currentPage.isFinalCoverPage ? 'لوحة الختام' : `الفصل ${currentChapterNum}:`}
              </span>
              <span className="truncate max-w-[200px] lg:max-w-[300px]">
                {currentPage.isFinalCoverPage ? 'غلاف الختام الفني' : currentChapterObj?.title.replace(/الفصل \d+ — /, '')}
              </span>
              <span className="text-[#A66878] text-[10px] border-r border-[#F5CAD4] pr-2">
                {currentPageIndex + 1} / {paginatedPages.length}
              </span>
            </div>
          )}

          {/* Right Action Icons */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            {/* PWA Install ELORIA Button */}
            <PWAInstallButton compact={true} />

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

      {/* 2. MAIN READING STAGE WITH REALISTIC 3D PAGE FLIP */}
      <main 
        ref={bookContainerRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className={`flex-1 flex flex-col justify-center items-center w-full relative select-none ${
          isCoverView ? 'p-0 max-w-none' : 'p-2 sm:p-4 md:p-6 lg:p-8 max-w-7xl mx-auto'
        }`}
      >
        {isCoverView ? (
          <BookCover 
            onOpenBook={() => setIsCoverView(false)} 
            onOpenTOC={() => setIsTOCOpen(true)} 
          />
        ) : (
          <div className="w-full flex-1 flex flex-col justify-center items-center book-perspective">
            {isTwoPageMode && viewportSize.width >= 1024 ? (
              /* TWO-PAGE SPREAD - STRICT FIXED DIMENSIONS */
              <div className={twoPageFrameClass}>
                <div className="grid grid-cols-2 gap-0 w-full h-full relative">
                  {/* Central Spine Fold Shadow */}
                  <div className="absolute top-0 bottom-0 left-1/2 -ml-3 w-6 pointer-events-none z-20 bg-gradient-to-r from-black/8 via-transparent to-black/8 shadow-inner" />

                  {/* Right Page (RTL: Page 1) */}
                  <div className="page-spine-shadow-right border-l border-[#F5CCD6] p-1 h-full w-full">
                    {currentPage && (
                      <PageRenderer 
                        page={currentPage} 
                        currentPageNumber={currentPageIndex + 1}
                        totalPages={paginatedPages.length}
                      />
                    )}
                  </div>

                  {/* Left Page (RTL: Page 2 if exists) */}
                  <div className="page-spine-shadow-left p-1 h-full w-full">
                    {currentPageIndex + 1 < paginatedPages.length ? (
                      <PageRenderer 
                        page={paginatedPages[currentPageIndex + 1]} 
                        currentPageNumber={currentPageIndex + 2}
                        totalPages={paginatedPages.length}
                      />
                    ) : (
                      <div className="h-full w-full flex flex-col items-center justify-center p-8 text-center text-[#8C4A5A] bg-gradient-to-b from-[#FFFDFE] to-[#FFF5F7] rounded-xl border border-[#F5D5DC]">
                        <Sparkles className="w-8 h-8 text-[#D88A9C] mb-3" />
                        <h3 className="font-bold text-base text-[#3D1E26]">نهاية كتاب ELORIA</h3>
                        <p className="text-xs text-[#7A3E4E] mt-1">تهانينا على إتمام فصول 𝑬𝑳𝑶𝑹𝑰𝑨 الـ 27 والتصفيف الاحترافي!</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* SINGLE PAGE (Mobile & Focused Mode) - REALISTIC 3D FLIP */
              <div className={singlePageFrameClass}>
                {flipTransition.isFlipping ? (
                  /* 3D Realistic Turning Leaf Stage */
                  <div className="book-leaf-wrapper">
                    {/* Base Page (revealed underneath) */}
                    <div className="absolute inset-0 w-full h-full">
                      {flipTransition.direction === 'next' ? (
                        <div className="w-full h-full relative">
                          <PageRenderer 
                            page={paginatedPages[flipTransition.toIndex]} 
                            currentPageNumber={flipTransition.toIndex + 1}
                            totalPages={paginatedPages.length}
                          />
                          <div className="base-page-shadow" />
                        </div>
                      ) : (
                        <div className="w-full h-full relative">
                          <PageRenderer 
                            page={paginatedPages[flipTransition.fromIndex]} 
                            currentPageNumber={flipTransition.fromIndex + 1}
                            totalPages={paginatedPages.length}
                          />
                        </div>
                      )}
                    </div>

                    {/* Flipping Leaf (rotating with 3D perspective and paper shadow) */}
                    <div 
                      className={`book-page-leaf ${
                        flipTransition.direction === 'next' 
                          ? 'page-turn-next-leaf' 
                          : 'page-turn-prev-leaf'
                      }`}
                    >
                      {flipTransition.direction === 'next' ? (
                        <div className="w-full h-full relative bg-[#FFF8FA] rounded-2xl">
                          <PageRenderer 
                            page={paginatedPages[flipTransition.fromIndex]} 
                            currentPageNumber={flipTransition.fromIndex + 1}
                            totalPages={paginatedPages.length}
                          />
                          <div className="leaf-curl-shadow" />
                        </div>
                      ) : (
                        <div className="w-full h-full relative bg-[#FFF8FA] rounded-2xl">
                          <PageRenderer 
                            page={paginatedPages[flipTransition.toIndex]} 
                            currentPageNumber={flipTransition.toIndex + 1}
                            totalPages={paginatedPages.length}
                          />
                          <div className="leaf-curl-shadow" />
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Resting Page */
                  <div className="w-full h-full">
                    {currentPage && (
                      <PageRenderer 
                        page={currentPage} 
                        currentPageNumber={currentPageIndex + 1}
                        totalPages={paginatedPages.length}
                      />
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        {/* SMART LAZY LOADING PRE-WARMER CACHE:
            Prepares only the previous page and next page in advance offscreen,
            so styles, layouts, fonts, and DOM trees are pre-compiled and primed
            before any flip gesture occurs, guaranteeing 60fps buttery fluidity on all devices.
        */}
        <div 
          aria-hidden="true" 
          className="hidden pointer-events-none opacity-0 fixed -top-[9999px] -left-[9999px] w-[600px] h-[600px] overflow-hidden select-none"
        >
          {currentPageIndex > 0 && paginatedPages[currentPageIndex - 1] && (
            <PageRenderer 
              key={`lazy-prev-${currentPageIndex - 1}`}
              page={paginatedPages[currentPageIndex - 1]}
              currentPageNumber={currentPageIndex}
              totalPages={paginatedPages.length}
            />
          )}
          {currentPageIndex + 1 < paginatedPages.length && (
            <PageRenderer 
              key={`lazy-next-${currentPageIndex + 1}`}
              page={paginatedPages[currentPageIndex + 1]}
              currentPageNumber={currentPageIndex + 2}
              totalPages={paginatedPages.length}
            />
          )}
        </div>
      </main>

      {/* 3. BOTTOM READING CONTROLS - SYMBOLS ONLY: ‹ & › */}
      {!isCoverView && (
        <footer className="sticky bottom-0 z-30 bg-[#FFF8FA]/95 backdrop-blur-md border-t border-[#F2CBD4] px-3 sm:px-6 py-2.5">
          <div className="max-w-4xl mx-auto flex flex-col gap-2">
            {/* Navigation Buttons and Slider */}
            <div className="flex items-center justify-between gap-2 sm:gap-4">
              {/* Previous Controls Group */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={goToPrevChapter}
                  disabled={currentChapterNum <= 1 && currentPageIndex === 0}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#FFF0F4] border border-[#F2CCD6] text-[#632938] hover:bg-[#FCE5EB] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer flex items-center justify-center"
                  title="الفصل السابق"
                >
                  <ChevronsRight className="w-4 h-4 text-[#C86A80]" />
                </button>

                {/* السابق: ‹ (الرمز فقط بدون أي نص) */}
                <button
                  onClick={handlePrev}
                  disabled={currentPageIndex <= 0}
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#FFF0F4] border border-[#F2CCD6] text-[#632938] hover:bg-[#FCE5EB] active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center cursor-pointer shadow-2xs font-serif text-2xl font-bold leading-none select-none"
                  aria-label="السابق"
                  title="‹"
                >
                  ‹
                </button>
              </div>

              {/* Dynamic Page Jumping Slider & Number Box */}
              <div className="flex-1 flex items-center justify-center gap-2 max-w-xs sm:max-w-sm">
                <input
                  type="range"
                  min="0"
                  max={Math.max(0, paginatedPages.length - 1)}
                  value={currentPageIndex}
                  onChange={(e) => goToPage(parseInt(e.target.value, 10), parseInt(e.target.value, 10) > currentPageIndex ? 'next' : 'prev')}
                  className="w-full accent-[#D88A9C] h-1.5 bg-[#F5D5DC] rounded-lg cursor-pointer"
                  title={`صفحة ${currentPageIndex + 1}`}
                />
                <div className="shrink-0 text-[11px] font-bold text-[#8C384E] bg-[#FCE8ED] px-2.5 py-1 rounded-md border border-[#F2CCD6]">
                  {currentPageIndex + 1} / {paginatedPages.length}
                </div>
              </div>

              {/* Next Controls Group */}
              <div className="flex items-center gap-1.5">
                {/* التالي: › (الرمز فقط بدون أي نص) */}
                <button
                  onClick={handleNext}
                  disabled={currentPageIndex >= paginatedPages.length - 1}
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-r from-[#D88A9C] via-[#C87386] to-[#B75B6F] text-white hover:shadow-md hover:shadow-[#D88A9C]/30 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center cursor-pointer shadow-2xs font-serif text-2xl font-bold leading-none select-none"
                  aria-label="التالي"
                  title="›"
                >
                  ›
                </button>

                <button
                  onClick={goToNextChapter}
                  disabled={currentPageIndex >= paginatedPages.length - 1}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#FFF0F4] border border-[#F2CCD6] text-[#632938] hover:bg-[#FCE5EB] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer flex items-center justify-center"
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
              <span>اسحبي أو انقري للتنقل</span>
            </div>
          </div>
        </footer>
      )}

      {/* 4. MODALS & DRAWERS */}
      <TableOfContents
        isOpen={isTOCOpen}
        onClose={() => setIsTOCOpen(false)}
        chapters={dynamicChapters}
        allPages={paginatedPages}
        currentPageIndex={currentPageIndex}
        onSelectPage={handleSelectFromTOC}
        bookmarks={bookmarks}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectPage={handleSelectFromSearch}
      />
    </div>
  );
}
