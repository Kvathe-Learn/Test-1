import { NextRequest, NextResponse } from 'next/server';
import { openai } from '@/lib/openai';
import { buildCaptionPrompt, buildCarouselPrompt, buildVideoScriptPrompt } from '@/lib/prompts';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { topic, contentType, platform, tone, targetAudience, contentPillars } = body;

    if (!topic || !contentType || !platform) {
      return NextResponse.json(
        { error: 'Missing required fields: topic, contentType, platform' },
        { status: 400 }
      );
    }

    // Get brand kit for personalization
    const brandKit = await db.brandKit.findUnique({
      where: { userId: session.user.id },
    });

    const ctx = {
      topic,
      contentType,
      platform,
      tone: tone || brandKit?.toneOfVoice || undefined,
      targetAudience: targetAudience || brandKit?.targetAudience || undefined,
      contentPillars: contentPillars || brandKit?.contentPillars || undefined,
      brandName: brandKit?.brandName || undefined,
      visualStyle: brandKit?.visualStyle || undefined,
    };

    let prompt: string;

    if (contentType === 'CAROUSEL') {
      prompt = buildCarouselPrompt(ctx);
    } else if (contentType === 'REEL' || contentType === 'TIKTOK') {
      prompt = buildVideoScriptPrompt(ctx);
    } else {
      prompt = buildCaptionPrompt(ctx);
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4.1',
      messages: [
        {
          role: 'system',
          content: 'You are an expert social media content creator. Always respond with valid JSON only. No markdown, no code blocks, just raw JSON.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.8,
      max_tokens: 2000,
    });

    const responseText = completion.choices[0]?.message?.content || '{}';
    
    // Clean response - remove markdown code blocks if present
    const cleaned = responseText
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return NextResponse.json(
        { error: 'Failed to parse AI response', raw: cleaned },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: parsed });
  } catch (error: unknown) {
    console.error('Text generation error:', error);
    const message = error instanceof Error ? error.message : 'Generation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
