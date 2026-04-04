import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { TemplatesContent } from '@/components/dashboard/TemplatesContent';

export default async function TemplatesPage() {
  const session = await getServerSession(authOptions);
  const userId = session!.user.id;

  const templates = await db.template.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  return <TemplatesContent templates={JSON.parse(JSON.stringify(templates))} />;
}
