type Release = () => void;

/**
 * KeyedMutex implementa exclusión mutua asíncrona por clave.
 * Esto permite serializar operaciones concurrentes sobre un mismo recurso (ej. eventId o spaceId)
 * dentro de la instancia del servidor Node.js sin bloquear operaciones sobre otros recursos.
 */
export class KeyedMutex {
  private locks = new Map<string, Promise<void>>();

  /**
   * Adquiere un bloqueo para una clave dada. Devuelve una función para liberar el bloqueo.
   */
  async acquire(key: string): Promise<Release> {
    let release: Release = () => {};
    const newLock = new Promise<void>((resolve) => {
      release = resolve;
    });

    const currentLock = this.locks.get(key) || Promise.resolve();
    const combinedLock = currentLock.then(() => newLock);
    this.locks.set(key, combinedLock);

    await currentLock;

    return () => {
      release();
      if (this.locks.get(key) === combinedLock) {
        this.locks.delete(key);
      }
    };
  }

  /**
   * Ejecuta una función de manera exclusiva bajo una clave dada.
   */
  async runExclusive<T>(key: string, fn: () => Promise<T>): Promise<T> {
    const release = await this.acquire(key);
    try {
      return await fn();
    } finally {
      release();
    }
  }
}

// Instancias exportadas para concurrencia en eventos y espacios
export const eventMutex = new KeyedMutex();
export const spaceMutex = new KeyedMutex();
