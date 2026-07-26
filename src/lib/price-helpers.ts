/**
 * Determina si un evento es gratuito considerando:
 * - Precios textuales: "FREE", "GRATIS", "0", vacíos o nulos
 * - Valores numéricos menores o iguales a 0 (ej. datos provenientes del seeder o errores de ingreso)
 */
export function isEventFree(price?: string | number | null): boolean {
  if (price === null || price === undefined || price === '') return true;
  
  if (typeof price === 'string') {
    const trimmed = price.trim().toUpperCase();
    if (trimmed === 'FREE' || trimmed === 'GRATIS' || trimmed === '0') return true;
  }

  const numericPrice = Number(price);
  if (!isNaN(numericPrice) && numericPrice <= 0) {
    return true;
  }

  return false;
}

/**
 * Formatea la etiqueta de precio para mostrar "GRATIS" o el valor numérico en dólares.
 */
export function formatEventPrice(price?: string | number | null): string {
  if (isEventFree(price)) {
    return 'GRATIS';
  }
  const numericPrice = Number(price);
  if (!isNaN(numericPrice)) {
    return `$${numericPrice.toFixed(2)}`;
  }
  return `$${price}`;
}
