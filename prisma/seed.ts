import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🔥 Seeding ContentForge...");

  // Demo user
  const hashedPassword = await bcrypt.hash("demo123", 12);
  await prisma.user.upsert({
    where: { email: "demo@contentforge.com" },
    update: {},
    create: {
      email: "demo@contentforge.com",
      name: "Demo User",
      hashedPassword,
    },
  });

  console.log("✅ Demo user created (demo@contentforge.com / demo123)");

  // Templates
  const templates = [
    {
      name: "Blog Post Intro",
      description: "Hook readers with a compelling opening paragraph for any blog topic.",
      category: "Marketing",
      contentType: "Blog Post",
      tone: "Professional",
      promptTemplate: "Write an engaging blog post introduction about {topic}. Hook the reader in the first sentence, establish the problem or opportunity, and preview what they'll learn.",
    },
    {
      name: "Instagram Caption",
      description: "Scroll-stopping captions with emojis and hashtags.",
      category: "Social Media",
      contentType: "Social Media",
      tone: "Casual",
      promptTemplate: "Write an Instagram caption about {topic}. Include relevant emojis, a call to action, and 5-10 relevant hashtags. Keep it engaging and authentic.",
    },
    {
      name: "LinkedIn Thought Leader",
      description: "Position yourself as an industry expert with insightful posts.",
      category: "Social Media",
      contentType: "Social Media",
      tone: "Professional",
      promptTemplate: "Write a LinkedIn post sharing insights about {topic}. Open with a bold statement or surprising stat, share a personal perspective, and end with a question to drive engagement.",
    },
    {
      name: "Cold Email Outreach",
      description: "Get responses with personalized, value-driven cold emails.",
      category: "Email",
      contentType: "Email",
      tone: "Professional",
      promptTemplate: "Write a cold email to {recipient_type} about {topic}. Keep it under 150 words, lead with value, and include a clear CTA. No fluff.",
    },
    {
      name: "Newsletter Welcome",
      description: "Make a great first impression with new subscribers.",
      category: "Email",
      contentType: "Email",
      tone: "Friendly",
      promptTemplate: "Write a welcome email for new subscribers to a newsletter about {topic}. Set expectations, deliver immediate value, and build excitement for future emails.",
    },
    {
      name: "Facebook Ad Copy",
      description: "High-converting ad copy with clear CTAs.",
      category: "Marketing",
      contentType: "Ad Copy",
      tone: "Bold",
      promptTemplate: "Write Facebook ad copy for {product/service} targeting {audience}. Include a headline, primary text (125 chars), and description. Focus on benefits and urgency.",
    },
    {
      name: "Google Ads Headlines",
      description: "30-character headlines that drive clicks.",
      category: "Marketing",
      contentType: "Ad Copy",
      tone: "Bold",
      promptTemplate: "Generate 10 Google Ads headlines (max 30 characters each) for {product/service}. Focus on benefits, urgency, and unique value propositions.",
    },
    {
      name: "Product Description",
      description: "Sell benefits, not features. Convert browsers to buyers.",
      category: "E-commerce",
      contentType: "Product Description",
      tone: "Professional",
      promptTemplate: "Write a compelling product description for {product}. Lead with the key benefit, describe features in terms of user value, and close with social proof or urgency.",
    },
    {
      name: "SEO Meta Description",
      description: "155-character snippets that boost click-through rates.",
      category: "SEO",
      contentType: "Blog Post",
      tone: "Professional",
      promptTemplate: "Write 5 SEO meta descriptions (max 155 characters each) for a page about {topic}. Include the primary keyword naturally and a compelling reason to click.",
    },
    {
      name: "Twitter Thread",
      description: "Educational threads that go viral.",
      category: "Social Media",
      contentType: "Social Media",
      tone: "Casual",
      promptTemplate: "Write a 7-tweet thread about {topic}. Start with a hook tweet that makes people want to read more. End with a summary and CTA. Each tweet under 280 characters.",
    },
    {
      name: "Press Release",
      description: "Professional announcements that get media coverage.",
      category: "Marketing",
      contentType: "Press Release",
      tone: "Formal",
      promptTemplate: "Write a press release announcing {news}. Include a compelling headline, dateline, lead paragraph with who/what/when/where/why, supporting details, and a boilerplate company description.",
    },
    {
      name: "Brand Story",
      description: "Connect emotionally with your audience through narrative.",
      category: "Brand",
      contentType: "Blog Post",
      tone: "Friendly",
      promptTemplate: "Write a brand story about {brand/company} that covers the origin, mission, and vision. Use narrative techniques to make it emotionally compelling and memorable.",
    },
  ];

  for (const template of templates) {
    await prisma.template.upsert({
      where: {
        id: template.name.toLowerCase().replace(/\s+/g, "-"),
      },
      update: template,
      create: {
        id: template.name.toLowerCase().replace(/\s+/g, "-"),
        ...template,
      },
    });
  }

  console.log(`✅ ${templates.length} templates seeded`);
  console.log("🔥 Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
