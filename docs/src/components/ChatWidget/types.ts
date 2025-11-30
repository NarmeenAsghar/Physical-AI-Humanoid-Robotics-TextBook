/**
 * TypeScript types for ChatWidget component
 */

export interface Source {
  chapter: number;
  lesson: number;
  section: string;
  url: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: Source[];
  timestamp: Date;
}

export interface ChatWidgetProps {
  apiBaseUrl?: string;
  selectedText?: string;
  currentPage?: string;
  selectionTimestamp?: number;
}

export interface SSEMessage {
  type: 'sources' | 'content' | 'done' | 'error';
  sources?: Source[];
  chunk?: string;
  message?: string;
}
