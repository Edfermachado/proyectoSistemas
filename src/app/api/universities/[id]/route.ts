import { NextResponse } from "next/server";
import { UniversitiesService } from "@/services/universities.service";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const data = await UniversitiesService.getUniversityById(resolvedParams.id);
    if (!data) return NextResponse.json({ error: "Not Found" }, { status: 404 });
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const body = await request.json();
    const data = await UniversitiesService.updateUniversity(resolvedParams.id, body);
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const data = await UniversitiesService.deleteUniversity(resolvedParams.id);
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "No se pudo eliminar. Verifique que no tenga facultades asociadas." }, { status: 400 });
  }
}
