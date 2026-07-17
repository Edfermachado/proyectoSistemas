import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

export async function uploadPaymentScreenshot(file: File, attendeeId: string): Promise<string | null> {
  if (!supabase) {
    console.warn("Supabase not configured, falling back to local storage or returning null");
    return null; // The API route will fallback to local storage
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileName = `payment_${attendeeId}_${Date.now()}.webp`;

    const { data, error } = await supabase
      .storage
      .from('payments') // Make sure this bucket exists in Supabase
      .upload(fileName, buffer, {
        contentType: 'image/webp',
        upsert: true
      });

    if (error) {
      console.error("Supabase upload error:", error);
      throw error;
    }

    const { data: publicUrlData } = supabase.storage.from('payments').getPublicUrl(fileName);
    return publicUrlData.publicUrl;
  } catch (err) {
    console.error("Error uploading to Supabase:", err);
    throw err;
  }
}
