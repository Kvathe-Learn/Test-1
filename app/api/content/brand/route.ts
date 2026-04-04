import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const brandKit = await db.brandKit.findUnique({
      where: { userId: session.user.id },
    });

    return NextResponse.json({ success: true, data: brandKit });
  } catch (error: unknown) {
    console.error('Brand kit fetch error:', error);
    const message = error instanceof Error ? error.message : 'Failed to fetch brand kit';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    const brandKit = await db.brandKit.upsert({
      where: { userId: session.user.id },
      update: { ...body },
      create: {
        userId: session.user.id,
        ...body,
      },
    });

    return NextResponse.json({ success: true, data: brandKit });
  } catch (error: unknown) {
    console.error('Brand kit update error:', error);
    const message = error instanceof Error ? error.message : 'Failed to update brand kit';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
