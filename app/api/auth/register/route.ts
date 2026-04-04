import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      );
    }

    const user = await db.user.create({
      data: {
        name: name || email.split('@')[0],
        email,
        password, // In production, hash with bcrypt
      },
    });

    // Create default brand kit
    await db.brandKit.create({
      data: {
        userId: user.id,
        brandName: name || 'My Brand',
        toneOfVoice: 'Professional but approachable, knowledgeable about tech and AI',
        targetAudience: 'Tech enthusiasts, developers, AI practitioners (25-40)',
        contentPillars: ['AI News', 'Tech Tutorials', 'Industry Insights', 'Tools & Reviews'],
        visualStyle: 'Modern minimalist, dark backgrounds, vibrant accent colors',
      },
    });

    return NextResponse.json(
      { success: true, data: { id: user.id, email: user.email, name: user.name } },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('Registration error:', error);
    const message = error instanceof Error ? error.message : 'Registration failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
