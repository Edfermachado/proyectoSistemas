import { getSession } from "@/lib/auth";
import { NextResponse } from "next/server";
import { EventsService } from "@/services/events.service";
import { uploadEventImage } from "@/lib/supabase";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get("tenantId");

    if (!tenantId) {
      return NextResponse.json({ error: "Missing tenantId" }, { status: 400 });
    }

    const data = await EventsService.getEventsByTenant(tenantId);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error("[GET /api/events]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ya no usamos request.json() porque esperamos multipart/form-data
    const formData = await request.formData();
    
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const date = formData.get("date") as string;
    const duration = parseInt(formData.get("duration") as string) || 60; // Default a 60 min
    const price = formData.get("price") as string;
    const tenantId = formData.get("tenantId") as string;
    const spaceId = formData.get("spaceId") as string;
    const capacityStr = formData.get("capacity") as string;
    const capacity = capacityStr ? parseInt(capacityStr) : undefined;
    const visibility = (formData.get("visibility") as "publico" | "privado") || "publico";
    const requiresIpProtection = formData.get("requiresIpProtection") === "true";
    const image = formData.get("image") as File | null;
    
    // Payment fields
    const paymentPhone = formData.get("paymentPhone") as string;
    const paymentId = formData.get("paymentId") as string;
    const paymentBank = formData.get("paymentBank") as string;
    const managerId = formData.get("managerId") as string;

    let imageUrl = null;

    // Procesamiento de Imagen con compresión (sharp)
    if (image && image.size > 0) {
      // 1. Limite de tamaño: 5MB
      if (image.size > 5 * 1024 * 1024) {
        return NextResponse.json({ error: "La imagen es demasiado grande (Máximo 5MB)" }, { status: 400 });
      }
      
      // 2. Limite de formato
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(image.type)) {
        return NextResponse.json({ error: "Formato de imagen inválido. Solo JPG, PNG y WEBP están permitidos." }, { status: 400 });
      }

      const arrayBuffer = await image.arrayBuffer();
      let buffer = Buffer.from(arrayBuffer);
      
      const fileName = `event-${Date.now()}.webp`; // Forzamos formato WebP
      
      // 3. Compresión con Sharp
      const sharp = (await import("sharp")).default;
      buffer = await sharp(buffer)
        .resize(1200, 800, { fit: 'cover', withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer();
        
      const uploadedUrl = await uploadEventImage(buffer, fileName);
      if (uploadedUrl) {
        imageUrl = uploadedUrl;
      }
    }
    
    // Default to 'pendiente' if event_manager, 'aprobado' if tenant_admin
    const status = session?.role === "event_manager" ? "pendiente" : "aprobado";

    // Delegamos la lógica de validación de colisiones e inserción al servicio
    const newEvent = await EventsService.createEvent({
      title,
      date: new Date(date),
      duration,
      price: price || '0',
      tenantId,
      spaceId,
      description,
      imageUrl,
      capacity,
      visibility,
      requiresIpProtection,
      status,
      paymentPhone,
      paymentId,
      paymentBank,
      managerId
    });

    return NextResponse.json(newEvent, { status: 201 });
  } catch (error: any) {
    if (error.message?.includes("CONF_001")) {
      return NextResponse.json({ error: error.message }, { status: 409 }); // Conflict
    }
    
    console.error("[POST /api/events]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
