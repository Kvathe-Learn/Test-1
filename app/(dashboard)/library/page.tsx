import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { LibraryContent } from '@/components/dashboard/LibraryContent';

export default async function LibraryPage() {
  const session = await getServerSession(authOptions);
  const userId = session!.user.id;

  const contents = await db.content.findMany({
    where: { userId },
    include: { slides: { orderBy: { order: 'asc' } } },
    orderBy: { createdAt: 'desc' },
  });

  return <LibraryContent contents={JSON.parse(JSON.stringify(contents))} />;
}
