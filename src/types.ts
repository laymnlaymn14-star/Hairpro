export interface VisualElement {
  type: 
    | 'hair-anatomy'
    | 'growth-cycle'
    | 'hair-types'
    | 'porosity-scale'
    | 'density-thickness'
    | 'hair-conditions'
    | 'tools-guide'
    | 'brush-selection'
    | 'product-ladder'
    | 'wash-steps'
    | 'detangle-steps'
    | 'drying-methods'
    | 'blowdry-angles'
    | 'heat-dial'
    | 'sleep-protection'
    | 'hairstyle-diagram'
    | 'braid-sequence'
    | 'curl-types'
    | 'wave-methods'
    | 'straight-profiles'
    | 'length-styles'
    | 'occasion-styles'
    | 'accessories-grid'
    | 'mistake-card'
    | 'routine-flow'
    | 'project-breakdown'
    | 'rescue-matrix'
    | 'safety-rules'
    | 'checklist-card'
    | 'glossary-cards'
    | 'custom-illustration';
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
