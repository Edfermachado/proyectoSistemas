export const CARACAS_TIMEZONE = "America/Caracas";
export const VENEZUELA_LOCALE = "es-VE";

/**
 * Formatea una fecha u objeto Date al formato corto de fecha en Caracas, Venezuela.
 * Ejemplo: 25/07/2026
 */
export function formatDateCaracas(date: Date | string | number): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString(VENEZUELA_LOCALE, {
    timeZone: CARACAS_TIMEZONE,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/**
 * Formatea una fecha u objeto Date al formato de hora en Caracas, Venezuela.
 * Ejemplo: 05:30 p. m.
 */
export function formatTimeCaracas(date: Date | string | number): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleTimeString(VENEZUELA_LOCALE, {
    timeZone: CARACAS_TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Formatea una fecha u objeto Date al formato completo de fecha y hora en Caracas, Venezuela.
 */
export function formatDateTimeCaracas(date: Date | string | number): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleString(VENEZUELA_LOCALE, {
    timeZone: CARACAS_TIMEZONE,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Convierte un objeto Date o fecha actual a string ISO adaptado para inputs datetime-local (YYYY-MM-DDTHH:mm)
 * en el huso horario de Caracas (UTC-4).
 */
export function getCaracasDateTimeLocalString(date: Date = new Date()): string {
  const utcMs = date.getTime() + date.getTimezoneOffset() * 60000;
  const caracasMs = utcMs - 4 * 60 * 60000; // Caracas es UTC-4
  const caracasDate = new Date(caracasMs);
  return caracasDate.toISOString().slice(0, 16);
}
