import { NextRequest, NextResponse } from "next/server";
import openai from "@/lib/openai";
import { getCurrentUser } from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { prompt, style, size } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt required" }, { status: 400 });
    }

    const imagePrompt = `${style} style: ${prompt}. Professional, high-quality visual.`;

    const validSize = ["1024x1024", "1536x1024", "1024x1536"].includes(size)
      ? (size as "1024x1024" | "1536x1024" | "1024x1536")
      : "1024x1024";

    const response = await openai.images.generate({
      model: "gpt-image-1",
      prompt: imagePrompt,
      n: 1,
      size: validSize,
      quality: "high",
    });

    const imageData = response.data[0];
    let imageUrl: string;

    if (imageData.b64_json) {
      imageUrl = `data:image/png;base64,${imageData.b64_json}`;
    } else if (imageData.url) {
      imageUrl = imageData.url;
    } else {
      throw new Error("No image data returned");
    }

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error("Image generation error:", error);
    return NextResponse.json(
      { error: "Image generation failed" },
      { status: 500 }
    );
  }
}
