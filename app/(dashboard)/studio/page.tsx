import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { StudioContent } from '@/components/studio/StudioContent';

export default async function StudioPage() {
  const session = await getServerSession(authOptions);
  const userId = session!.user.id;

  const [brandKit, templates] = await Promise.all([
    db.brandKit.findUnique({ where: { userId } }),
    db.template.findMany({
      where: { userId, isActive: true },
      orderBy: { usageCount: 'desc' },
    }),
  ]);

  return (
    <StudioContent
      brandKit={brandKit ? JSON.parse(JSON.stringify(brandKit)) : null}
      templates={JSON.parse(JSON.stringify(templates))}
    />
  );
}
