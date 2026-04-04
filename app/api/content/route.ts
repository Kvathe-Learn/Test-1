import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

// GET - List all content for user
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where: Record<string, unknown> = { userId: session.user.id };
    if (type) where.type = type;
    if (status) where.status = status;

    const [contents, total] = await Promise.all([
      db.content.findMany({
        where,
        include: { slides: { orderBy: { order: 'asc' } } },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      db.content.count({ where }),
    ]);

    return NextResponse.json({ success: true, data: { contents, total } });
  } catch (error: unknown) {
    console.error('Content fetch error:', error);
    const message = error instanceof Error ? error.message : 'Failed to fetch content';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST - Create new content
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      type,
      platform,
      caption,
      hashtags,
      hookText,
      script,
      mediaUrls,
      thumbnailUrl,
      topic,
      prompt,
      aiModel,
      status,
      slides,
    } = body;

    if (!title || !type) {
      return NextResponse.json(
        { error: 'Missing required fields: title, type' },
        { status: 400 }
      );
    }

    const content = await db.content.create({
      data: {
        userId: session.user.id,
        title,
        type,
        platform: platform || 'BOTH',
        caption,
        hashtags: hashtags || [],
        hookText,
        script,
        mediaUrls: mediaUrls || [],
        thumbnailUrl,
        topic,
        prompt,
        aiModel,
        status: status || 'DRAFT',
        slides: slides?.length
          ? {
              create: slides.map((s: { order: number; imageUrl?: string; text?: string }) => ({
                order: s.order,
                imageUrl: s.imageUrl,
                text: s.text,
              })),
            }
          : undefined,
      },
      include: { slides: { orderBy: { order: 'asc' } } },
    });

    return NextResponse.json({ success: true, data: content }, { status: 201 });
  } catch (error: unknown) {
    console.error('Content create error:', error);
    const message = error instanceof Error ? error.message : 'Failed to create content';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PATCH - Update content
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing content id' }, { status: 400 });
    }

    // Verify ownership
    const existing = await db.content.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    const content = await db.content.update({
      where: { id },
      data: updateData,
      include: { slides: { orderBy: { order: 'asc' } } },
    });

    return NextResponse.json({ success: true, data: content });
  } catch (error: unknown) {
    console.error('Content update error:', error);
    const message = error instanceof Error ? error.message : 'Failed to update content';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE - Delete content
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing content id' }, { status: 400 });
    }

    // Verify ownership
    const existing = await db.content.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    await db.content.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Content delete error:', error);
    const message = error instanceof Error ? error.message : 'Failed to delete content';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
