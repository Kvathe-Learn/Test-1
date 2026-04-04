import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { DashboardContent } from '@/components/dashboard/DashboardContent';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const userId = session!.user.id;

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const [total, drafts, ready, posted, thisWeek, recentContent] = await Promise.all([
    db.content.count({ where: { userId } }),
    db.content.count({ where: { userId, status: 'DRAFT' } }),
    db.content.count({ where: { userId, status: 'READY' } }),
    db.content.count({ where: { userId, status: 'POSTED' } }),
    db.content.count({ where: { userId, createdAt: { gte: weekAgo } } }),
    db.content.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 8,
      include: { slides: { orderBy: { order: 'asc' } } },
    }),
  ]);

  const stats = { totalContent: total, drafts, ready, posted, thisWeek };

  return (
    <DashboardContent
      stats={stats}
      recentContent={JSON.parse(JSON.stringify(recentContent))}
      userName={session!.user.name || 'Creator'}
    />
  );
}
