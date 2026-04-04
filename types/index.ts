import { ContentType, ContentStatus, Platform } from '@prisma/client';

export interface GenerateTextRequest {
  topic: string;
  contentType: ContentType;
  platform: Platform;
  tone?: string;
  targetAudience?: string;
  contentPillars?: string[];
  includeHashtags?: boolean;
  includeHook?: boolean;
  language?: string;
}

export interface GenerateTextResponse {
  caption: string;
  hashtags: string[];
  hookText: string;
  script?: string;
  suggestions: string[];
}

export interface GenerateImageRequest {
  prompt: string;
  style?: string;
  size?: '1024x1024' | '1024x1536' | '1536x1024';
  quality?: 'low' | 'medium' | 'high';
  n?: number;
}

export interface GenerateImageResponse {
  images: {
    url: string;
    revisedPrompt?: string;
  }[];
}

export interface ContentFormData {
  title: string;
  topic: string;
  type: ContentType;
  platform: Platform;
  customPrompt?: string;
  templateId?: string;
}

export interface DashboardStats {
  totalContent: number;
  drafts: number;
  ready: number;
  posted: number;
  thisWeek: number;
  contentByType: Record<ContentType, number>;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
