"use server";

import { AttendeesService } from "@/services/attendees.service";
import { revalidatePath } from "next/cache";

import { getSession } from "@/lib/auth";
import { uploadPaymentScreenshot } from "@/lib/supabase";
import { join } from "path";
import { mkdirSync } from "fs";

export async function registerForEvent(formData: FormData) {
  const eventId = formData.get("eventId") as string;
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const attendeeType = (formData.get("attendeeType") as "estudiante" | "foraneo") || "estudiante";
  const paymentReference = formData.get("paymentReference") as string | undefined;
  const screenshot = formData.get("screenshot") as File | null;

  try {
    const session = await getSession();
    if (!session) {
      throw new Error("Debes iniciar sesión para registrarte en el evento.");
    }
    
    if (session.role !== "user") {
      throw new Error("Solo los asistentes regulares pueden registrarse en los eventos. Tu cuenta tiene rol administrativo.");
    }
    
    // Usamos el email seguro de la sesión en lugar del formulario
    const email = session.email as string;
    const userId = session.userId as string;

    let screenshotUrl: string | null = null;
    if (screenshot && screenshot.size > 0) {
      try {
        screenshotUrl = await uploadPaymentScreenshot(screenshot, "reg-" + Date.now());
      } catch (e) {
        console.error("Supabase error, falling back", e);
      }

      if (!screenshotUrl) {
        const arrayBuffer = await screenshot.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const fileName = `payment_reg_${Date.now()}.webp`;
        const uploadDir = join(process.cwd(), "public", "uploads", "payments");
        
        try {
          mkdirSync(uploadDir, { recursive: true });
        } catch (e) {}
        
        const filePath = join(uploadDir, fileName);
        
        const sharp = (await import("sharp")).default;
        await sharp(buffer)
          .resize(800, null, { withoutEnlargement: true })
          .webp({ quality: 80 })
          .toFile(filePath);
          
        screenshotUrl = `/uploads/payments/${fileName}`;
      }
    }

    const newAttendee = await AttendeesService.registerAttendee({ eventId, name, email, phone, userId, attendeeType, paymentReference, paymentScreenshotUrl: screenshotUrl });
    revalidatePath(`/events/[slug]`, "page");
    revalidatePath(`/faculty-admin/events/[id]/attendees`, "page");
    return { success: true, ticketToken: newAttendee.ticketToken };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function confirmPayment(attendeeId: string, eventId: string) {
  try {
    const session = await getSession();
    if (!session || !session.userId) throw new Error("Unauthorized");

    await AttendeesService.confirmPayment(attendeeId, session.userId as string);
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
