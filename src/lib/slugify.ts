/**
 * Converts a string to a URL-friendly slug.
 * Handles Spanish characters (accents, ñ) correctly.
 */
export function slugify(text: string): string {
  return text
    .normalize("NFD")                          // Decompose accented characters: á → a + ́
    .replace(/[\u0300-\u036f]/g, "")           // Remove diacritic marks
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")                  // Remove non-word chars except spaces and hyphens
    .replace(/[\s_]+/g, "-")                   // Replace spaces/underscores with hyphens
    .replace(/^-+|-+$/g, "");                  // Trim leading/trailing hyphens
}

/**
 * Generates a unique slug by appending a short random suffix if needed.
 */
export function slugifyUnique(text: string): string {
  const base = slugify(text);
  const suffix = Math.random().toString(36).slice(2, 6); // e.g. "k3f2"
  return `${base}-${suffix}`;
}
