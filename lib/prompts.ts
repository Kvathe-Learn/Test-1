import { ContentType, Platform } from '@prisma/client';

interface PromptContext {
  topic: string;
  contentType: ContentType;
  platform: Platform;
  tone?: string;
  targetAudience?: string;
  contentPillars?: string[];
  brandName?: string;
  visualStyle?: string;
}

export function buildCaptionPrompt(ctx: PromptContext): string {
  const platformGuide = {
    INSTAGRAM: 'Instagram (max 2200 chars, optimized for engagement, use line breaks for readability)',
    TIKTOK: 'TikTok (short, punchy, max 300 chars, trend-aware, conversational)',
    BOTH: 'Instagram and TikTok (provide two versions: one longer for IG, one short for TikTok)',
  };

  const typeGuide = {
    IMAGE_POST: 'a single image post — caption should complement the visual',
    CAROUSEL: 'a carousel post (multiple slides) — caption should tease the content and encourage swiping',
    STORY: 'a Story — very short, engaging text with a call-to-action',
    REEL: 'a Reel/short video — hook in first line, conversational tone',
    TIKTOK: 'a TikTok video — ultra-casual, trend-aware, uses platform lingo',
  };

  return `You are an expert social media content creator specializing in Tech & AI content.

TASK: Write a caption for ${typeGuide[ctx.contentType]} on ${platformGuide[ctx.platform]}.

TOPIC: ${ctx.topic}

${ctx.tone ? `TONE OF VOICE: ${ctx.tone}` : 'TONE: Professional but approachable, knowledgeable, slightly provocative to drive engagement.'}
${ctx.targetAudience ? `TARGET AUDIENCE: ${ctx.targetAudience}` : 'TARGET AUDIENCE: Tech enthusiasts, developers, AI practitioners, startup founders (25-40 years old).'}
${ctx.contentPillars?.length ? `CONTENT PILLARS: ${ctx.contentPillars.join(', ')}` : ''}
${ctx.brandName ? `BRAND: ${ctx.brandName}` : ''}

REQUIREMENTS:
- Start with a STRONG HOOK (first line must stop the scroll)
- Include a clear value proposition
- End with a call-to-action (save, share, follow, comment)
- Use line breaks for readability
- Be authentic, not salesy
- Include 2-3 relevant emojis (not excessive)

Respond in this exact JSON format:
{
  "caption": "the full caption text",
  "hookText": "just the first line / hook",
  "hashtags": ["hashtag1", "hashtag2", ... up to 15 relevant hashtags],
  "suggestions": ["suggestion 1 for improvement", "suggestion 2"]
${ctx.contentType === 'REEL' || ctx.contentType === 'TIKTOK' ? ',  "script": "A short video script with intro, body, and CTA sections"' : ''}
}`;
}

export function buildCarouselPrompt(ctx: PromptContext, slideCount: number = 7): string {
  return `You are an expert social media content creator specializing in Tech & AI carousel posts.

TASK: Create a ${slideCount}-slide carousel about: ${ctx.topic}

${ctx.tone ? `TONE: ${ctx.tone}` : 'TONE: Educational, authoritative, visually clean.'}
${ctx.targetAudience ? `AUDIENCE: ${ctx.targetAudience}` : 'AUDIENCE: Tech professionals and AI enthusiasts.'}

CAROUSEL STRUCTURE:
- Slide 1: HOOK slide — bold statement or question that stops the scroll
- Slides 2-${slideCount - 1}: VALUE slides — one key point per slide, concise text
- Slide ${slideCount}: CTA slide — follow, save, share prompt

REQUIREMENTS PER SLIDE:
- Headline (max 8 words, bold impact)
- Body text (max 30 words, clear and direct)
- Each slide must stand alone but flow as a story

Respond in this exact JSON format:
{
  "slides": [
    {
      "order": 1,
      "headline": "Slide headline",
      "body": "Supporting text for the slide",
      "visualSuggestion": "Brief description of what the visual should show"
    }
  ],
  "caption": "Caption to accompany the carousel post",
  "hashtags": ["hashtag1", "hashtag2", ... up to 15],
  "hookText": "The hook text for the first slide"
}`;
}

export function buildImagePrompt(
  topic: string,
  style?: string,
  visualStyle?: string,
  contentType?: ContentType
): string {
  const typeContext = {
    IMAGE_POST: 'social media post image, square format 1:1',
    CAROUSEL: 'carousel slide, clean layout with space for text overlay',
    STORY: 'vertical story image (9:16), immersive full-screen',
    REEL: 'video thumbnail, eye-catching, vertical format',
    TIKTOK: 'TikTok cover image, bold and attention-grabbing',
  };

  const context = contentType ? typeContext[contentType] : 'social media image';

  return `Create a ${context} about: ${topic}.

Style: ${style || visualStyle || 'Modern, clean, professional tech aesthetic. Dark background with vibrant accent colors (electric blue, purple gradients). Minimalist design with bold typography space. High-end, editorial quality.'}

Requirements:
- Professional quality suitable for a top tech brand
- Clean composition with visual hierarchy
- No text in the image (text will be added separately)
- Modern, premium feel
- Good contrast and visual impact for mobile screens`;
}

export function buildVideoScriptPrompt(ctx: PromptContext): string {
  const durationGuide = ctx.platform === 'TIKTOK' ? '15-30 seconds' : '30-60 seconds';

  return `You are a viral short-form video scriptwriter for Tech & AI content.

TASK: Write a video script about: ${ctx.topic}
PLATFORM: ${ctx.platform === 'BOTH' ? 'Instagram Reels + TikTok' : ctx.platform}
DURATION: ${durationGuide}

${ctx.tone ? `TONE: ${ctx.tone}` : 'TONE: Engaging, fast-paced, slightly provocative.'}
${ctx.targetAudience ? `AUDIENCE: ${ctx.targetAudience}` : 'AUDIENCE: Tech-savvy young professionals.'}

SCRIPT STRUCTURE:
1. HOOK (0-3 sec): Pattern interrupt — bold claim, question, or surprising fact
2. SETUP (3-8 sec): Context — why this matters
3. VALUE (8-20 sec): The main content — tips, explanation, reveal
4. CTA (last 3-5 sec): Tell them what to do next

Respond in this exact JSON format:
{
  "script": {
    "hook": "Opening line (spoken text)",
    "setup": "Setup text",
    "value": "Main content text",
    "cta": "Call to action"
  },
  "fullScript": "Complete spoken script as one continuous text",
  "caption": "Post caption",
  "hashtags": ["hashtag1", "hashtag2", ...],
  "hookText": "The hook text",
  "visualNotes": "Brief notes on what visuals to show",
  "estimatedDuration": "25 seconds"
}`;
}
