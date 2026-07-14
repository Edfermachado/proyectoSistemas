"use server";

import { AttendeesService } from "@/services/attendees.service";
import { revalidatePath } from "next/cache";

import { getSession } from "@/lib/auth";

export async function registerForEvent(formData: FormData) {
  const eventId = formData.get("eventId") as string;
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const attendeeType = (formData.get("attendeeType") as "estudiante" | "foraneo") || "estudiante";

  try {
    const session = await getSession();
    if (!session) {
      throw new Error("Debes iniciar sesión para registrarte en el evento.");
    }
    
    // Usamos el email seguro de la sesión en lugar del formulario
    const email = session.email as string;
    const userId = session.userId as string;

    await AttendeesService.registerAttendee({ eventId, name, email, phone, userId, attendeeType });
    revalidatePath(`/events/[slug]`, "page");
    revalidatePath(`/faculty-admin/events/[id]/attendees`, "page");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function confirmPayment(attendeeId: string, eventId: string) {
  try {
    await AttendeesService.confirmPayment(attendeeId);
    revalidatePath(`/faculty-admin/events/${eventId}/attendees`);
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function manualRegisterByAdmin(formData: FormData) {
  const eventId = formData.get("eventId") as string;
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const attendeeType = (formData.get("attendeeType") as "estudiante" | "foraneo") || "estudiante";
  
  // As it is manual by admin, we can set it as confirmado immediately if desired, or let them choose.
  const statusRaw = formData.get("status") as "registrado" | "confirmado" | "pago_pendiente";
  const status = statusRaw || "confirmado";

  try {
    await AttendeesService.registerAttendee({ eventId, name, email, phone, status, attendeeType });
    revalidatePath(`/faculty-admin/events/${eventId}/attendees`);
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}
