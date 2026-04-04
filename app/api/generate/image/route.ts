import { NextRequest, NextResponse } from 'next/server';
import { openai } from '@/lib/openai';
import { buildImagePrompt } from '@/lib/prompts';
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
    const { prompt, style, size, quality, contentType, n } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: 'Missing required field: prompt' },
        { status: 400 }
      );
    }

    // Get brand kit for visual style
    const brandKit = await db.brandKit.findUnique({
      where: { userId: session.user.id },
    });

    const imagePrompt = buildImagePrompt(
      prompt,
      style,
      brandKit?.visualStyle || undefined,
      contentType
    );

    const response = await openai.images.generate({
      model: 'gpt-image-1',
      prompt: imagePrompt,
      n: Math.min(n || 1, 4),
      size: size || '1024x1024',
      quality: quality || 'medium',
    });

    const images = (response.data || []).map((img) => ({
      url: img.url || '',
      b64_json: img.b64_json || null,
      revisedPrompt: (img as Record<string, unknown>).revised_prompt as string | undefined,
    }));

    return NextResponse.json({ success: true, data: { images } });
  } catch (error: unknown) {
    console.error('Image generation error:', error);
    const message = error instanceof Error ? error.message : 'Image generation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
