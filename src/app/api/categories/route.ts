import { NextResponse } from "next/server";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { generateUniqueSlug } from "@/lib/slug-helpers";

export async function GET() {
  try {
    const data = await db.query.categories.findMany({
      orderBy: (categories, { desc }) => [desc(categories.createdAt)],
    });
    return NextResponse.json(data);
  } catch (error: unknown) {
    return NextResponse.json({ error: (error instanceof Error ? error.message : "Error desconocido") }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, icon } = body;
    const slug = await generateUniqueSlug("categories", name);
    const [newCategory] = await db.insert(categories).values({
      name,
      icon,
      slug,
    }).returning();
    return NextResponse.json(newCategory);
  } catch (error: unknown) {
    return NextResponse.json({ error: (error instanceof Error ? error.message : "Error desconocido") }, { status: 500 });
  }
}
