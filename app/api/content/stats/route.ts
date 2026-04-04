import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const [total, drafts, ready, posted, thisWeek, byType] = await Promise.all([
      db.content.count({ where: { userId } }),
      db.content.count({ where: { userId, status: 'DRAFT' } }),
      db.content.count({ where: { userId, status: 'READY' } }),
      db.content.count({ where: { userId, status: 'POSTED' } }),
      db.content.count({ where: { userId, createdAt: { gte: weekAgo } } }),
      db.content.groupBy({
        by: ['type'],
        where: { userId },
        _count: { type: true },
      }),
    ]);

    const contentByType: Record<string, number> = {};
    byType.forEach((item) => {
      contentByType[item.type] = item._count.type;
    });

    return NextResponse.json({
      success: true,
      data: {
        totalContent: total,
        drafts,
        ready,
        posted,
        thisWeek,
        contentByType,
      },
    });
  } catch (error: unknown) {
    console.error('Stats error:', error);
    const message = error instanceof Error ? error.message : 'Failed to fetch stats';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
