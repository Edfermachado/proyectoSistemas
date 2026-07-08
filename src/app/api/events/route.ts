import { NextResponse } from "next/server";
import { EventsService } from "@/services/events.service";

/**
 * API Route Handler
 * Su única responsabilidad es extraer datos de la Request HTTP, 
 * inyectarlos al Servicio, y formatear la Response HTTP.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get("tenantId");

    if (!tenantId) {
      return NextResponse.json({ error: "Missing tenantId" }, { status: 400 });
    }

    // Delegamos la búsqueda a la capa de servicio
    const data = await EventsService.getEventsByTenant(tenantId);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error("[GET /api/events]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Aquí podríamos agregar una capa de validación Zod (ej. EventSchema.parse(body))
    const { title, date, tenantId, spaceId, description } = body;

    // Delegamos la lógica de validación de colisiones e inserción al servicio
    const newEvent = await EventsService.createEvent({
      title,
      date: new Date(date),
      tenantId,
      spaceId,
      description
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
