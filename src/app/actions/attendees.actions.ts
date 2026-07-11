"use server";

import { AttendeesService } from "@/services/attendees.service";
import { revalidatePath } from "next/cache";

export async function registerForEvent(formData: FormData) {
  const eventId = formData.get("eventId") as string;
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;

  try {
    await AttendeesService.registerAttendee({ eventId, name, email, phone });
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
  
  // As it is manual by admin, we can set it as confirmed immediately if desired, or let them choose.
  const status = formData.get("status") as "pending" | "confirmed" || "confirmed";

  try {
    await AttendeesService.registerAttendee({ eventId, name, email, phone, status });
    revalidatePath(`/faculty-admin/events/${eventId}/attendees`);
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}
