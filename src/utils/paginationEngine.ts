import { BookPage } from '../types';

export interface PageContentBlock {
  type: 'title' | 'summary' | 'paragraph' | 'visual' | 'application' | 'mistakes' | 'checklist' | 'result' | 'final_cover';
  text?: string;
  isPartial?: boolean;
  continuationNote?: string;
  visual?: any;
  application?: {
    title: string;
    steps: string[];
    isContinuation?: boolean;
    startStepIndex?: number;
  };
  mistakes?: {
    bad: string;
    fix: string;
    why?: string;
  };
  checklist?: {
    title?: string;
    items: string[];
    isContinuation?: boolean;
    startIndex?: number;
  };
  imageSrc?: string;
}

export interface DisplayPage {
  id: string;
  originalPageId: string;
  originalPageIndex: number;
  chapterNumber: number;
  chapterTitle: string;
  pageTitle: string;
  category: string;
  isContinuation: boolean;
  partIndex: number;
  totalParts: number;
  blocks: PageContentBlock[];
  isFinalCoverPage?: boolean;
}

/**
 * Clean Sentence & Clause Splitter
 * Splits Arabic & Latin text cleanly at punctuation boundaries (. ! ؟ ؛)
 * and at Arabic comma clauses (،) for extra-long passages.
 * CRITICAL: Never cuts words in half; keeps punctuation intact.
 */
export function splitIntoSentences(text: string): string[] {
  if (!text || !text.trim()) return [];
  const clean = text.trim();

  // Primary delimiters: Arabic & standard periods, exclamation marks, question marks, semicolons
  const sentenceRegex = /([^.!?؟؛\n]+[.!?؟؛\n]+(?:\s+|$)|[^.!?؟؛\n]+$)/g;
  const rawSentences: string[] = [];
  let match;
  while ((match = sentenceRegex.exec(clean)) !== null) {
    const s = match[1].trim();
    if (s.length > 0) {
      rawSentences.push(s);
    }
  }

  // Second pass: If a sentence is unusually long (> 130 characters) and contains commas ('،'),
  // split at natural comma clauses so paragraphs don't create unnatural massive gaps
  const result: string[] = [];
  for (const item of rawSentences) {
    if (item.length > 130 && item.includes('،')) {
      const clauseRegex = /([^،]+،(?:\s+|$)|[^،]+$)/g;
      let cMatch;
      const subChunks: string[] = [];
      while ((cMatch = clauseRegex.exec(item)) !== null) {
        const c = cMatch[1].trim();
        if (c.length > 0) subChunks.push(c);
      }
      if (subChunks.length > 1) {
        result.push(...subChunks);
        continue;
      }
    }
    result.push(item);
  }

  return result.length > 0 ? result : [clean];
}

/**
 * Optical and Typographic Height Estimator
 * Calibrated specifically for Arabic typography in ELORIA:
 * Base font ~13px, leading ~21px, responsive character density.
 */
export function estimateBlockHeight(block: PageContentBlock, contentWidth: number): number {
  const charsPerLine = Math.max(26, Math.floor(contentWidth / 8.2));
  const lineHeight = 21;

  switch (block.type) {
    case 'title': {
      const lines = Math.ceil((block.text?.length || 24) / (charsPerLine * 0.72));
      return Math.max(34, lines * 28) + 8;
    }
    case 'summary': {
      const lines = Math.ceil((block.text?.length || 40) / charsPerLine);
      return Math.max(44, lines * lineHeight + 22) + 12;
    }
    case 'paragraph': {
      const lines = Math.ceil((block.text?.length || 30) / charsPerLine);
      return Math.max(21, lines * lineHeight) + 8;
    }
    case 'visual': {
      return 170; // Fixed visual stage height
    }
    case 'application': {
      let h = 32; // Title allowance
      if (block.application?.steps) {
        for (const step of block.application.steps) {
          const lines = Math.ceil(step.length / (charsPerLine - 6));
          h += Math.max(24, lines * lineHeight + 6);
        }
      }
      return h + 12;
    }
    case 'mistakes': {
      let h = 24;
      if (block.mistakes?.bad) h += Math.ceil(block.mistakes.bad.length / charsPerLine) * lineHeight + 6;
      if (block.mistakes?.fix) h += Math.ceil(block.mistakes.fix.length / charsPerLine) * lineHeight + 6;
      if (block.mistakes?.why) h += Math.ceil(block.mistakes.why.length / charsPerLine) * 18 + 8;
      return Math.max(88, h) + 12;
    }
    case 'checklist': {
      let h = 26; // Title
      if (block.checklist?.items) {
        for (const item of block.checklist.items) {
          const lines = Math.ceil(item.length / (charsPerLine - 4));
          h += Math.max(22, lines * lineHeight + 4);
        }
      }
      return h + 12;
    }
    case 'result': {
      const lines = Math.ceil((block.text?.length || 30) / (charsPerLine - 10));
      return Math.max(36, lines * lineHeight + 16) + 10;
    }
    case 'final_cover': {
      return 520;
    }
    default:
      return 36;
  }
}

/**
 * Natural Continuous Book Typesetting Engine
 * 
 * Rules strictly enforced per author specifications:
 * 1. Content flows continuously across pages like a real printed book.
 * 2. Paragraphs are NOT forced onto a single page; they naturally continue on the next page without cutting words.
 * 3. Sub-titles of the same chapter can start on the same page if remaining space allows.
 * 4. A single page can contain: end of previous section -> new section heading -> start of new paragraph -> continuation.
 * 5. NO synthetic continuation markers ("تابع", "يتبع", "تكملة", etc.).
 * 6. NO artificial text added; pure original book content preserved.
 */
export function generatePaginatedBook(
  bookPages: BookPage[],
  usableHeight: number,
  contentWidth: number
): DisplayPage[] {
  const allDisplayPages: DisplayPage[] = [];
  const safetyLimit = Math.max(340, usableHeight - 16);

  // Group topics by chapter to preserve chapter hierarchy and continuous in-chapter flow
  const chapterGroups = new Map<number, {
    chapterNumber: number;
    chapterTitle: string;
    category: string;
    topics: { page: BookPage; originalIndex: number }[];
  }>();

  bookPages.forEach((page, originalIndex) => {
    if (!chapterGroups.has(page.chapterNumber)) {
      chapterGroups.set(page.chapterNumber, {
        chapterNumber: page.chapterNumber,
        chapterTitle: page.chapterTitle,
        category: page.category,
        topics: []
      });
    }
    chapterGroups.get(page.chapterNumber)!.topics.push({ page, originalIndex });
  });

  // Process each chapter
  chapterGroups.forEach((chGroup) => {
    let currentBlocks: PageContentBlock[] = [];
    let currentHeight = 0;
    let activeTopic = chGroup.topics[0].page;
    let activeTopicIndex = chGroup.topics[0].originalIndex;

    const flushCurrentPage = () => {
      if (currentBlocks.length === 0) return;
      allDisplayPages.push({
        id: `page-${allDisplayPages.length + 1}`,
        originalPageId: activeTopic.id,
        originalPageIndex: activeTopicIndex,
        chapterNumber: chGroup.chapterNumber,
        chapterTitle: chGroup.chapterTitle,
        pageTitle: activeTopic.pageTitle,
        category: chGroup.category,
        isContinuation: false,
        partIndex: 1,
        totalParts: 1,
        blocks: [...currentBlocks]
      });
      currentBlocks = [];
      currentHeight = 0;
    };

    const addParagraph = (text: string) => {
      if (!text || !text.trim()) return;
      const clean = text.trim();
      const paraH = estimateBlockHeight({ type: 'paragraph', text: clean }, contentWidth);

      // 1. Fits completely on current page
      if (currentHeight + paraH <= safetyLimit) {
        currentBlocks.push({ type: 'paragraph', text: clean });
        currentHeight += paraH;
        return;
      }

      // 2. Does not fit completely: check if some sentences can fit
      const sentences = splitIntoSentences(clean);
      if (sentences.length > 1) {
        const fittingSentences: string[] = [];
        let remainingSentences: string[] = [];
        let testH = currentHeight;

        for (let sIdx = 0; sIdx < sentences.length; sIdx++) {
          const s = sentences[sIdx];
          const sH = estimateBlockHeight({ type: 'paragraph', text: s }, contentWidth);
          if (testH + sH <= safetyLimit) {
            fittingSentences.push(s);
            testH += sH;
          } else {
            remainingSentences = sentences.slice(sIdx);
            break;
          }
        }

        if (fittingSentences.length > 0) {
          // Add fitting sentences to current page
          currentBlocks.push({
            type: 'paragraph',
            text: fittingSentences.join(' ')
          });
          // Page is now naturally filled; flush to start next page
          flushCurrentPage();

          // Continue remaining sentences on the next page
          if (remainingSentences.length > 0) {
            addParagraph(remainingSentences.join(' '));
          }
          return;
        }
      }

      // 3. Not even 1 sentence fit:
      // If current page already has content, flush it and start fresh
      if (currentBlocks.length > 0) {
        flushCurrentPage();
        addParagraph(clean);
      } else {
        // Page was already empty, place paragraph here
        currentBlocks.push({ type: 'paragraph', text: clean });
        currentHeight += paraH;
      }
    };

    const addApplication = (app: { title?: string; steps: string[] }) => {
      const steps = app.steps;
      if (!steps || steps.length === 0) return;

      const title = app.title || 'خطوات التطبيق العملي';
      const titleH = 30;
      const charsPerLine = Math.max(26, Math.floor(contentWidth / 8.2));
      const stepHeights = steps.map(s => Math.max(24, Math.ceil(s.length / (charsPerLine - 6)) * 21 + 6));
      const totalH = titleH + stepHeights.reduce((a, b) => a + b, 0) + 12;

      // Fits completely
      if (currentHeight + totalH <= safetyLimit) {
        currentBlocks.push({
          type: 'application',
          application: {
            title,
            steps: steps,
            startStepIndex: 0
          }
        });
        currentHeight += totalH;
        return;
      }

      // Can title + at least 1 step fit?
      if (currentHeight + titleH + stepHeights[0] <= safetyLimit) {
        const fittingSteps: string[] = [];
        let remainingSteps: string[] = [];
        let testH = currentHeight + titleH;

        for (let i = 0; i < steps.length; i++) {
          if (testH + stepHeights[i] <= safetyLimit) {
            fittingSteps.push(steps[i]);
            testH += stepHeights[i];
          } else {
            remainingSteps = steps.slice(i);
            break;
          }
        }

        if (fittingSteps.length > 0) {
          currentBlocks.push({
            type: 'application',
            application: {
              title,
              steps: fittingSteps,
              startStepIndex: 0
            }
          });
          flushCurrentPage();

          if (remainingSteps.length > 0) {
            // Continues naturally without artificial labels
            currentBlocks.push({
              type: 'application',
              application: {
                title,
                steps: remainingSteps,
                startStepIndex: fittingSteps.length
              }
            });
            currentHeight += titleH + remainingSteps.reduce((sum, s, idx) => sum + stepHeights[fittingSteps.length + idx], 0);
          }
          return;
        }
      }

      // Move to next page if space wasn't enough
      if (currentBlocks.length > 0) {
        flushCurrentPage();
        addApplication(app);
      } else {
        currentBlocks.push({
          type: 'application',
          application: {
            title,
            steps: steps,
            startStepIndex: 0
          }
        });
        currentHeight += totalH;
      }
    };

    const addChecklist = (items: string[]) => {
      if (!items || items.length === 0) return;
      const titleH = 24;
      const itemH = 26;
      const totalH = titleH + items.length * itemH + 10;

      if (currentHeight + totalH <= safetyLimit) {
        currentBlocks.push({
          type: 'checklist',
          checklist: { items, startIndex: 0 }
        });
        currentHeight += totalH;
        return;
      }

      if (currentHeight + titleH + itemH <= safetyLimit) {
        const fitting: string[] = [];
        let remaining: string[] = [];
        let testH = currentHeight + titleH;

        for (let i = 0; i < items.length; i++) {
          if (testH + itemH <= safetyLimit) {
            fitting.push(items[i]);
            testH += itemH;
          } else {
            remaining = items.slice(i);
            break;
          }
        }

        if (fitting.length > 0) {
          currentBlocks.push({
            type: 'checklist',
            checklist: { items: fitting, startIndex: 0 }
          });
          flushCurrentPage();

          if (remaining.length > 0) {
            currentBlocks.push({
              type: 'checklist',
              checklist: { items: remaining, startIndex: fitting.length }
            });
            currentHeight += titleH + remaining.length * itemH;
          }
          return;
        }
      }

      if (currentBlocks.length > 0) {
        flushCurrentPage();
        addChecklist(items);
      } else {
        currentBlocks.push({
          type: 'checklist',
          checklist: { items, startIndex: 0 }
        });
        currentHeight += totalH;
      }
    };

    // Flow each topic inside this chapter
    for (let tIdx = 0; tIdx < chGroup.topics.length; tIdx++) {
      const { page: topic, originalIndex } = chGroup.topics[tIdx];
      activeTopic = topic;
      activeTopicIndex = originalIndex;

      // Section Heading / Subtitle Handling:
      // If page is brand new, heading goes at top
      if (currentBlocks.length === 0) {
        const titleBlock: PageContentBlock = { type: 'title', text: topic.pageTitle };
        currentBlocks.push(titleBlock);
        currentHeight += estimateBlockHeight(titleBlock, contentWidth);
      } else {
        // Subsequent topic inside the same chapter:
        // Check if there is enough space for subtitle + opening lines (> 72px)
        const remaining = safetyLimit - currentHeight;
        if (remaining >= 72) {
          // Subtitle starts naturally on the same page!
          const titleBlock: PageContentBlock = { type: 'title', text: topic.pageTitle };
          currentBlocks.push(titleBlock);
          currentHeight += estimateBlockHeight(titleBlock, contentWidth);
        } else {
          // Flush page so heading isn't an orphan at the bottom edge
          flushCurrentPage();
          const titleBlock: PageContentBlock = { type: 'title', text: topic.pageTitle };
          currentBlocks.push(titleBlock);
          currentHeight += estimateBlockHeight(titleBlock, contentWidth);
        }
      }

      // Summary
      if (topic.summary) {
        const sumBlock: PageContentBlock = { type: 'summary', text: topic.summary };
        const sumH = estimateBlockHeight(sumBlock, contentWidth);
        if (currentHeight + sumH <= safetyLimit) {
          currentBlocks.push(sumBlock);
          currentHeight += sumH;
        } else {
          flushCurrentPage();
          currentBlocks.push(sumBlock);
          currentHeight += sumH;
        }
      }

      // Explanation paragraphs
      if (topic.content.explanation && topic.content.explanation.length > 0) {
        for (const para of topic.content.explanation) {
          if (para && para.trim()) {
            addParagraph(para.trim());
          }
        }
      }

      // Educational Visual
      if (topic.content.visual) {
        const vBlock: PageContentBlock = { type: 'visual', visual: topic.content.visual };
        const vH = 170;
        if (currentHeight + vH <= safetyLimit) {
          currentBlocks.push(vBlock);
          currentHeight += vH;
        } else {
          flushCurrentPage();
          currentBlocks.push(vBlock);
          currentHeight += vH;
        }
      }

      // Application Steps
      if (topic.content.application && topic.content.application.steps?.length > 0) {
        addApplication(topic.content.application);
      }

      // Mistakes Section
      if (topic.content.mistakes) {
        const mBlock: PageContentBlock = { type: 'mistakes', mistakes: topic.content.mistakes };
        const mH = estimateBlockHeight(mBlock, contentWidth);
        if (currentHeight + mH <= safetyLimit) {
          currentBlocks.push(mBlock);
          currentHeight += mH;
        } else {
          flushCurrentPage();
          currentBlocks.push(mBlock);
          currentHeight += mH;
        }
      }

      // Checklist Section
      if (topic.content.checklist && topic.content.checklist.length > 0) {
        addChecklist(topic.content.checklist);
      }

      // Result Section
      if (topic.content.result) {
        const rBlock: PageContentBlock = { type: 'result', text: topic.content.result };
        const rH = estimateBlockHeight(rBlock, contentWidth);
        if (currentHeight + rH <= safetyLimit) {
          currentBlocks.push(rBlock);
          currentHeight += rH;
        } else {
          flushCurrentPage();
          currentBlocks.push(rBlock);
          currentHeight += rH;
        }
      }
    }

    // Flush any remaining content of this chapter
    if (currentBlocks.length > 0) {
      flushCurrentPage();
    }
  });

  // Dedicated Final Cover Page at the very end of the book
  const finalCoverPage: DisplayPage = {
    id: 'eloria-final-cover-art',
    originalPageId: 'final-cover',
    originalPageIndex: bookPages.length,
    chapterNumber: 27,
    chapterTitle: 'خاتمة الكتاب — لوحة الغلاف الفنية',
    pageTitle: '𝑬𝑳𝑶𝑹𝑰𝑨 — Hair • Care • Beauty',
    category: 'غلاف الختام الفني',
    isContinuation: false,
    partIndex: 1,
    totalParts: 1,
    blocks: [
      {
        type: 'final_cover',
        imageSrc: '/eloria_cover.jpg'
      }
    ],
    isFinalCoverPage: true
  };

  allDisplayPages.push(finalCoverPage);

  return allDisplayPages;
}
