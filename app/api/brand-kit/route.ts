import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import prisma from "@/lib/db";

// GET - fetch brand kit
export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const brandKit = await prisma.brandKit.findFirst({
      where: { userId: user.id },
    });

    return NextResponse.json(brandKit);
  } catch (error) {
    console.error("Brand kit fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch brand kit" }, { status: 500 });
  }
}

// POST - create/update brand kit
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    const existing = await prisma.brandKit.findFirst({
      where: { userId: user.id },
    });

    const kitData = {
      brandName: data.brandName || "",
      brandVoice: data.brandVoice || "",
      targetAudience: data.targetAudience || "",
      keywords: data.keywords || [],
      avoidWords: data.avoidWords || [],
      colorPrimary: data.colorPrimary || "#FF4D00",
      colorSecondary: data.colorSecondary || "#0A0A0A",
      industry: data.industry || "",
    };

    let brandKit;
    if (existing) {
      brandKit = await prisma.brandKit.update({
        where: { id: existing.id },
        data: kitData,
      });
    } else {
      brandKit = await prisma.brandKit.create({
        data: {
          ...kitData,
          userId: user.id,
        },
      });
    }

    return NextResponse.json(brandKit);
  } catch (error) {
    console.error("Brand kit save error:", error);
    return NextResponse.json({ error: "Failed to save brand kit" }, { status: 500 });
  }
}
