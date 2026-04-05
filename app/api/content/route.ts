import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import prisma from "@/lib/db";

// GET - list content
export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const search = searchParams.get("search");

    const where: any = { userId: user.id };
    if (type) where.type = type;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { body: { contains: search, mode: "insensitive" } },
      ];
    }

    const items = await prisma.content.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error("Content fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 });
  }
}

// POST - save content
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, body, imageUrl, type, tone, prompt } = await req.json();

    const content = await prisma.content.create({
      data: {
        title: title || "Untitled",
        body: body || null,
        imageUrl: imageUrl || null,
        type: type || "General",
        tone: tone || null,
        prompt: prompt || null,
        userId: user.id,
      },
    });

    return NextResponse.json(content, { status: 201 });
  } catch (error) {
    console.error("Content save error:", error);
    return NextResponse.json({ error: "Failed to save content" }, { status: 500 });
  }
}

// DELETE - delete content
export async function DELETE(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    // Verify ownership
    const content = await prisma.content.findFirst({
      where: { id, userId: user.id },
    });

    if (!content) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await prisma.content.delete({ where: { id } });

    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error("Content delete error:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
