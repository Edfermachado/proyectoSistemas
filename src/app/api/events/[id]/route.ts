import { NextResponse } from "next/server";
import { EventsService } from "@/services/events.service";
import { uploadEventImage } from "@/lib/supabase";
import { getSession } from "@/lib/auth";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const event = await EventsService.getEventById(id);
    if (!event) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(event);
  } catch (error: any) {
    console.error("GET /api/events/[id] Error:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message || String(error) }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    
    const contentType = request.headers.get("content-type") || "";
    let body: any = {};

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      
      body.title = formData.get("title");
      body.description = formData.get("description");
      if (formData.get("date")) body.date = new Date(formData.get("date") as string);
      if (formData.get("duration")) body.duration = parseInt(formData.get("duration") as string);
      body.price = formData.get("price");
      body.tenantId = formData.get("tenantId");
      body.spaceId = formData.get("spaceId");
      body.paymentPhone = formData.get("paymentPhone");
      body.paymentId = formData.get("paymentId");
      body.paymentBank = formData.get("paymentBank");
      body.managerId = formData.get("managerId");

      const image = formData.get("image") as File | null;
      if (image && image.size > 0) {
        if (image.size > 5 * 1024 * 1024) {
          return NextResponse.json({ error: "La imagen es demasiado grande (Máximo 5MB)" }, { status: 400 });
        }
        
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(image.type)) {
          return NextResponse.json({ error: "Formato de imagen inválido. Solo JPG, PNG y WEBP están permitidos." }, { status: 400 });
        }

        const arrayBuffer = await image.arrayBuffer();
        let buffer = Buffer.from(arrayBuffer);
        
        const fileName = `event-${Date.now()}.webp`;
        
        const sharp = (await import("sharp")).default;
        buffer = await sharp(buffer)
          .resize(1200, 800, { fit: 'cover', withoutEnlargement: true })
          .webp({ quality: 80 })
          .toBuffer();
          
        const uploadedUrl = await uploadEventImage(buffer, fileName);
        if (uploadedUrl) {
          body.imageUrl = uploadedUrl;
        }
      }
      
      // Limpiar propiedades undefined o null que no fueron enviadas (excepto si el cliente quiere borrar algo, pero FormData devuelve string vacío o null si no se envió)
      Object.keys(body).forEach(key => {
        if (body[key] === null || body[key] === undefined) {
          delete body[key];
        }
      });
    } else {
      // Soporte retrocompatible para JSON
      body = await request.json();
      if (body.date) {
        body.date = new Date(body.date);
      }
    }
    
    const updated = await EventsService.updateEvent(id, body);
    return NextResponse.json(updated);
  } catch (error: any) {
    if (error.message?.includes("CONF_001")) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await EventsService.deleteEvent(id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
