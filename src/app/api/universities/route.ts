import { NextResponse } from "next/server";
import { UniversitiesService } from "@/services/universities.service";

export async function GET() {
  try {
    const data = await UniversitiesService.getAllUniversities();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[GET /api/universities]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newUniv = await UniversitiesService.createUniversity(body);
    return NextResponse.json(newUniv, { status: 201 });
  } catch (error) {
    console.error("[POST /api/universities]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
