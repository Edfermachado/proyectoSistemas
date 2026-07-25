interface RateLimitRecord {
  count: number;
  resetTime: number;
}

/**
 * InMemoryRateLimiter proporciona control de tasa por clave (IP, email o usuario).
 * Utilizado para prevenir ataques de fuerza bruta (5 intentos por 15 min en login)
 * y saturación de registros (10 intentos por 15 min en inscripciones).
 */
export class InMemoryRateLimiter {
  private records = new Map<string, RateLimitRecord>();

  /**
   * Verifica si una clave ha excedido el límite en la ventana de tiempo especificada.
   */
  check(key: string, maxRequests: number, windowMs: number): { success: boolean; remaining: number; resetInSeconds: number } {
    const now = Date.now();
    const record = this.records.get(key);

    if (!record || now > record.resetTime) {
      this.records.set(key, { count: 1, resetTime: now + windowMs });
      return { success: true, remaining: maxRequests - 1, resetInSeconds: Math.ceil(windowMs / 1000) };
    }

    if (record.count >= maxRequests) {
      const resetInSeconds = Math.ceil((record.resetTime - now) / 1000);
      return { success: false, remaining: 0, resetInSeconds };
    }

    record.count += 1;
    return { success: true, remaining: maxRequests - record.count, resetInSeconds: Math.ceil((record.resetTime - now) / 1000) };
  }

  /**
   * Reinicia el contador para una clave específica (ej. tras login exitoso).
   */
  reset(key: string) {
    this.records.delete(key);
  }
}

export const authRateLimiter = new InMemoryRateLimiter();
export const regRateLimiter = new InMemoryRateLimiter();
