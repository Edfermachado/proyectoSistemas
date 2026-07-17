import { NextResponse } from "next/server";
import { db } from "@/db";
import { attendees, events } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { uploadPaymentScreenshot } from "@/lib/supabase";
import sharp from "sharp";
import { join } from "path";
import { mkdirSync } from "fs";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const attendeeId = formData.get("attendeeId") as string;
    const paymentReference = formData.get("paymentReference") as string;
    const screenshot = formData.get("screenshot") as File | null;

    if (!attendeeId || !paymentReference) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Verify attendee belongs to user
    const attendee = await db.query.attendees.findFirst({
      where: eq(attendees.id, attendeeId),
    });

    if (!attendee || attendee.userId !== session.id) {
      return NextResponse.json({ error: "Not found or forbidden" }, { status: 404 });
    }

    let screenshotUrl = null;

    if (screenshot && screenshot.size > 0) {
      try {
        // Tratar de subir a Supabase primero
        screenshotUrl = await uploadPaymentScreenshot(screenshot, attendeeId);
      } catch (e) {
        console.error("Supabase error, falling back", e);
      }

      // Fallback local if Supabase fails or is not configured
      if (!screenshotUrl) {
        const arrayBuffer = await screenshot.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const fileName = `payment_${attendeeId}_${Date.now()}.webp`;
        const uploadDir = join(process.cwd(), "public", "uploads", "payments");
        
        try {
          mkdirSync(uploadDir, { recursive: true });
        } catch (e) {}
        
        const filePath = join(uploadDir, fileName);
        
        await sharp(buffer)
          .resize(800, null, { withoutEnlargement: true }) // Reduce file size
          .webp({ quality: 80 })
          .toFile(filePath);
          
        screenshotUrl = `/uploads/payments/${fileName}`;
      }
    }

    await db.update(attendees)
      .set({
        paymentReference,
        paymentScreenshotUrl: screenshotUrl,
        // Mantener el estado en pago_pendiente hasta que el admin lo valide
      })
      .where(eq(attendees.id, attendeeId));

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("[POST /api/payments]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
