"use server";

import { db } from "@/db";
import { eventRequests } from "@/db/schema";
import { EventRequestMetadataSchema, type EventRequestMetadata } from "@/validations/requests";
import { getSession } from "@/lib/auth";

export async function createEventRequest(
  eventId: string, 
  requestType: "soporte_academico" | "patrocinio" | "cobertura_prensa" | "derechos_transmision", 
  metadataRaw: any
) {
  const session = await getSession();
  if (!session) {
    throw new Error("No estás autenticado.");
  }

  // Zod Validation (Fail-Fast execution security)
  const validationResult = EventRequestMetadataSchema.safeParse(metadataRaw);
  
  if (!validationResult.success) {
    throw new Error(`Datos inválidos: ${validationResult.error.message}`);
  }

  const metadata = validationResult.data as EventRequestMetadata;

  // Insert into DB
  const [newRequest] = await db.insert(eventRequests).values({
    eventId,
    requestType,
    metadata
  }).returning();

  return newRequest;
}
