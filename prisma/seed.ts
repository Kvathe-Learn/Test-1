import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create default user
  const user = await prisma.user.upsert({
    where: { email: 'admin@contentforge.app' },
    update: {},
    create: {
      email: 'admin@contentforge.app',
      name: 'Creator',
      password: 'admin123', // Change in production
    },
  });

  console.log(`✅ User created: ${user.email}`);

  // Create brand kit
  await prisma.brandKit.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      brandName: 'TechPulse',
      tagline: 'AI & Tech Insights That Matter',
      primaryColor: '#4c6ef5',
      secondaryColor: '#748ffc',
      accentColor: '#ff6b6b',
      backgroundColor: '#0f0f1a',
      textColor: '#ffffff',
      toneOfVoice:
        'Professional but approachable. Knowledgeable about AI and tech. Slightly provocative to drive engagement. Uses data and examples.',
      targetAudience:
        'Tech enthusiasts, developers, AI practitioners, startup founders, and digital marketers. Ages 25-40. Active on Instagram and TikTok.',
      contentPillars: [
        'AI News & Trends',
        'Tool Reviews & Tutorials',
        'Industry Analysis',
        'Career in Tech',
        'Future Predictions',
      ],
      visualStyle:
        'Modern minimalist. Dark backgrounds (#0f0f1a) with vibrant accent colors (electric blue, purple gradients, neon). Clean typography. High contrast. Premium tech aesthetic.',
      fontPreference: 'Inter, SF Pro, modern sans-serif',
    },
  });

  console.log('✅ Brand kit created');

  // Create default templates
  const templates = [
    {
      name: 'AI Tool Review',
      description: 'In-depth review of a new AI tool or platform',
      type: 'CAROUSEL' as const,
      platform: 'BOTH' as const,
      promptTemplate:
        'Create a comprehensive review of [TOOL NAME]. Cover: what it does, 3 key features, pros & cons, pricing, and who it\'s best for. Make each slide punchy and visual.',
      defaultHashtags: ['AItools', 'techreview', 'AI', 'productivity', 'tech2026'],
    },
    {
      name: 'Breaking Tech News',
      description: 'Quick news update about a tech/AI development',
      type: 'IMAGE_POST' as const,
      platform: 'BOTH' as const,
      promptTemplate:
        'Create an engaging post about this breaking news: [NEWS]. Explain what happened, why it matters, and what it means for the industry. Keep it concise and impactful.',
      defaultHashtags: ['technews', 'AI', 'breakingnews', 'innovation'],
    },
    {
      name: '5 Quick Tips',
      description: 'Actionable tips carousel',
      type: 'CAROUSEL' as const,
      platform: 'INSTAGRAM' as const,
      promptTemplate:
        'Create 5 actionable and practical tips about: [TOPIC]. Each tip should be immediately applicable with a clear benefit. Include examples where possible.',
      defaultHashtags: ['techtips', 'AIhacks', 'learnAI', 'techcommunity'],
    },
    {
      name: 'Viral Short Video',
      description: 'Hook-driven short video for Reels/TikTok',
      type: 'REEL' as const,
      platform: 'BOTH' as const,
      promptTemplate:
        'Create a viral-worthy 30-second video script about: [TOPIC]. Start with a mind-blowing hook. Pack value in the middle. End with a follow CTA. Make it fast-paced.',
      defaultHashtags: ['viral', 'techtok', 'AI', 'fyp', 'reels'],
    },
  ];

  for (const template of templates) {
    await prisma.template.upsert({
      where: {
        id: `seed-${template.name.toLowerCase().replace(/\s+/g, '-')}`,
      },
      update: {},
      create: {
        id: `seed-${template.name.toLowerCase().replace(/\s+/g, '-')}`,
        userId: user.id,
        ...template,
      },
    });
  }

  console.log(`✅ ${templates.length} templates created`);
  console.log('🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
