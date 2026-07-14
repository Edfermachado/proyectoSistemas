"use server";

import { AttendeesService } from "@/services/attendees.service";
import { revalidatePath } from "next/cache";

import { getSession } from "@/lib/auth";

export async function registerForEvent(formData: FormData) {
  const eventId = formData.get("eventId") as string;
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;

  try {
    const session = await getSession();
    const userId = session && session.role === "user" ? (session.userId as string) : undefined;

    await AttendeesService.registerAttendee({ eventId, name, email, phone, userId });
    revalidatePath(`/events/${eventId}`);
    revalidatePath(`/faculty-admin/events/${eventId}/attendees`);
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
  
  // As it is manual by admin, we can set it as confirmado immediately if desired, or let them choose.
  const statusRaw = formData.get("status") as "registrado" | "confirmado" | "pago_pendiente";
  const status = statusRaw || "confirmado";

  try {
    await AttendeesService.registerAttendee({ eventId, name, email, phone, status });
    revalidatePath(`/faculty-admin/events/${eventId}/attendees`);
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}
