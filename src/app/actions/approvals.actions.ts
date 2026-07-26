'use server';

import { getSession } from '@/lib/auth';
import { EventsService } from '@/services/events.service';
import { revalidatePath } from 'next/cache';

/**
 * Aprueba una propuesta de evento enviada por un departamento.
 * Solo ejecutable por `tenant_admin` (Decano) o `superadmin`.
 */
export async function approveEventAction(eventId: string) {
  const session = await getSession();
  const allowedRoles = ['tenant_admin', 'superadmin'];
  if (!session || !allowedRoles.includes(session.role as string)) {
    throw new Error('No autorizado: Solo el Decanato o Administrador de Facultad puede aprobar eventos.');
  }

  const approvedEvent = await EventsService.approveEvent(eventId);
  revalidatePath('/faculty-admin/requests');
  revalidatePath('/events');
  return { success: true, event: approvedEvent };
}

/**
 * Rechaza una propuesta de evento enviada por un departamento.
 * Solo ejecutable por `tenant_admin` o `superadmin`.
 */
export async function rejectEventAction(eventId: string) {
  const session = await getSession();
  const allowedRoles = ['tenant_admin', 'superadmin'];
  if (!session || !allowedRoles.includes(session.role as string)) {
    throw new Error('No autorizado: Solo el Decanato o Administrador de Facultad puede rechazar eventos.');
  }

  const rejectedEvent = await EventsService.rejectEvent(eventId);
  revalidatePath('/faculty-admin/requests');
  revalidatePath('/events');
  return { success: true, event: rejectedEvent };
}
