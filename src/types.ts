export interface VisualElement {
  type: string;
  title?: string;
  data?: any;
  caption?: string;
}

export interface BookPage {
  id: string;
  chapterNumber: number;
  chapterTitle: string;
  pageTitle: string;
  category: string;
  summary?: string;
  content: {
    explanation: string[];
    visual?: VisualElement;
    application?: {
      title?: string;
      steps: string[];
    };
    result?: string;
    mistakes?: {
      bad: string;
      fix: string;
      why: string;
    };
    proTip?: string;
    checklist?: string[];
  };
}

export interface Chapter {
  number: number;
  title: string;
  pagesCount: number;
  startPageIndex: number;
  description: string;
  category: string;
}

export interface PageContentBlock {
  type: 'title' | 'summary' | 'paragraph' | 'visual' | 'application' | 'mistakes' | 'checklist' | 'result' | 'final_cover';
  text?: string;
  isPartial?: boolean;
  continuationNote?: string;
  visual?: VisualElement;
  application?: {
    title?: string;
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

