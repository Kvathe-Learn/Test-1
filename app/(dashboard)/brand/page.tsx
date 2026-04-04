import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { BrandKitContent } from '@/components/dashboard/BrandKitContent';

export default async function BrandPage() {
  const session = await getServerSession(authOptions);
  const userId = session!.user.id;

  const brandKit = await db.brandKit.findUnique({ where: { userId } });

  return <BrandKitContent brandKit={brandKit ? JSON.parse(JSON.stringify(brandKit)) : null} />;
}
