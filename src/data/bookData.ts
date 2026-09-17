import { BookPage, Chapter } from '../types';
import { PART_1_PAGES } from './chapters/part1';
import { PART_2_PAGES } from './chapters/part2';
import { PART_3_PAGES } from './chapters/part3';
import { PART_4_PAGES } from './chapters/part4';
import { PART_5_PAGES } from './chapters/part5';

// Watermark per specification
export const BOOK_WATERMARK = "𝒻𝒾𝒻𝒾";

// Master array of all pages in the book
export const BOOK_PAGES: BookPage[] = [
  ...PART_1_PAGES,
  ...PART_2_PAGES,
  ...PART_3_PAGES,
  ...PART_4_PAGES,
  ...PART_5_PAGES
];

// Dynamic Chapter Manifest generator based on BOOK_PAGES
export function getChaptersManifest(): Chapter[] {
  const chapterMap = new Map<number, { title: string; count: number; startIndex: number; category: string }>();

  BOOK_PAGES.forEach((page, index) => {
    const chNum = page.chapterNumber;
    if (!chapterMap.has(chNum)) {
      chapterMap.set(chNum, {
        title: page.chapterTitle,
        count: 1,
        startIndex: index,
        category: page.category
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
      description: `يحتوي على ${val.count} صفحة تعليمية مصورة`,
      category: val.category
    });
  });

  return chapters;
}

export const CHAPTERS_LIST = getChaptersManifest();

// Global search utility across all 118 pages
export function searchBook(query: string): { pageIndex: number; page: BookPage; matchText: string }[] {
  if (!query || query.trim().length < 2) return [];
  const q = query.trim().toLowerCase();
  const results: { pageIndex: number; page: BookPage; matchText: string }[] = [];

  BOOK_PAGES.forEach((page, index) => {
    let matched = false;
    let matchSnippet = '';

    if (page.pageTitle.toLowerCase().includes(q)) {
      matched = true;
      matchSnippet = page.pageTitle;
    } else if (page.chapterTitle.toLowerCase().includes(q)) {
      matched = true;
      matchSnippet = page.chapterTitle;
    } else if (page.summary && page.summary.toLowerCase().includes(q)) {
      matched = true;
      matchSnippet = page.summary;
    } else {
      for (const line of page.content.explanation) {
        if (line.toLowerCase().includes(q)) {
          matched = true;
          matchSnippet = line;
          break;
        }
      }
      if (!matched && page.content.application) {
        for (const step of page.content.application.steps) {
          if (step.toLowerCase().includes(q)) {
            matched = true;
            matchSnippet = step;
            break;
          }
        }
      }
      if (!matched && page.content.mistakes) {
        if (page.content.mistakes.bad.toLowerCase().includes(q) || page.content.mistakes.fix.toLowerCase().includes(q)) {
          matched = true;
          matchSnippet = page.content.mistakes.fix;
        }
      }
    }

    if (matched) {
      results.push({
        pageIndex: index,
        page,
        matchText: matchSnippet
      });
    }
  });

  return results;
}
