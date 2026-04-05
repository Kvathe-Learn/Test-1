import { NextRequest, NextResponse } from "next/server";
import openai from "@/lib/openai";
import { getCurrentUser } from "@/lib/session";
import prisma from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { prompt, tone, contentType, generateImage, imageStyle } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt required" }, { status: 400 });
    }

    // Fetch brand kit for context
    const brandKit = await prisma.brandKit.findFirst({
      where: { userId: user.id },
    });

    let brandContext = "";
    if (brandKit) {
      brandContext = `\n\nBrand context:
- Brand: ${brandKit.brandName || "N/A"}
- Voice: ${brandKit.brandVoice || "N/A"}
- Target audience: ${brandKit.targetAudience || "N/A"}
- Industry: ${brandKit.industry || "N/A"}
- Keywords to include: ${brandKit.keywords.join(", ") || "N/A"}
- Words to avoid: ${brandKit.avoidWords.join(", ") || "N/A"}`;
    }

    // Generate text
    const textCompletion = await openai.chat.completions.create({
      model: "gpt-4.1",
      messages: [
        {
          role: "system",
          content: `You are a professional content creator. Generate ${contentType} content with a ${tone} tone. Write high-quality, engaging content that's ready to use.${brandContext}`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 2000,
      temperature: 0.8,
    });

    const text = textCompletion.choices[0]?.message?.content || "";

    // Generate image if requested
    let imageUrl: string | undefined;
    if (generateImage) {
      try {
        const imagePrompt = `${imageStyle} style: ${prompt}. Professional, high-quality, suitable for ${contentType}.`;
        const imageResponse = await openai.images.generate({
          model: "gpt-image-1",
          prompt: imagePrompt,
          n: 1,
          size: "1024x1024",
          quality: "high",
        });

        // gpt-image-1 returns base64
        const imageData = imageResponse.data[0];
        if (imageData.b64_json) {
          imageUrl = `data:image/png;base64,${imageData.b64_json}`;
        } else if (imageData.url) {
          imageUrl = imageData.url;
        }
      } catch (imgError) {
        console.error("Image generation error:", imgError);
        // Continue without image
      }
    }

    return NextResponse.json({ text, imageUrl });
  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json(
      { error: "Generation failed" },
      { status: 500 }
    );
  }
}
