import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { db } from '@/db';
import { universities, tenants, departments, spaces, users, events, attendees, scanLogs, paymentAuditLogs } from '@/db/schema';
import { eq, inArray } from 'drizzle-orm';
import { EventsService } from '@/services/events.service';
import { AttendeesService } from '@/services/attendees.service';
import { POST as scanQRHandler } from '@/app/api/tickets/validate/route';
import { getSession } from '@/lib/auth';
import * as bcrypt from 'bcryptjs';

// Mock getSession to simulate different logged in users
vi.mock('@/lib/auth', () => ({
  getSession: vi.fn(),
}));

describe('Complete System Flow Integration Test', () => {
  let universityId: string;
  let tenantId: string;
  let departmentId: string;
  let spaceId: string;
  
  let superadminId: string;
  let decanoId: string;
  let gestorId: string;
  let accessControlId: string;
  let normalUserId: string;

  let eventId: string;
  let attendeeId: string;
  let ticketToken: string;

  beforeAll(async () => {
    // 1. Setup Test Infrastructure
    const [uni] = await db.insert(universities).values({
      name: 'Test University ' + Date.now(),
      slug: 'test-uni-' + Date.now(),
    }).returning();
    universityId = uni.id;

    const [tenant] = await db.insert(tenants).values({
      name: 'Test Faculty ' + Date.now(),
      slug: 'test-faculty-' + Date.now(),
      universityId: uni.id,
    }).returning();
    tenantId = tenant.id;

    const [dept] = await db.insert(departments).values({
      name: 'Test Dept',
      slug: 'test-dept-' + Date.now(),
      tenantId: tenant.id,
    }).returning();
    departmentId = dept.id;

    const [space] = await db.insert(spaces).values({
      name: 'Test Space',
      capacity: 100,
      universityId: uni.id,
    }).returning();
    spaceId = space.id;

    const dummyPassword = await bcrypt.hash('password', 10);

    // Create users
    const [decano] = await db.insert(users).values({
      name: 'Test Decano',
      email: `decano-${Date.now()}@test.com`,
      passwordHash: dummyPassword,
      role: 'tenant_admin',
      tenantId: tenant.id,
    }).returning();
    decanoId = decano.id;

    const [gestor] = await db.insert(users).values({
      name: 'Test Gestor',
      email: `gestor-${Date.now()}@test.com`,
      passwordHash: dummyPassword,
      role: 'event_manager',
      tenantId: tenant.id,
      departmentId: dept.id,
    }).returning();
    gestorId = gestor.id;

    const [access] = await db.insert(users).values({
      name: 'Test Access',
      email: `access-${Date.now()}@test.com`,
      passwordHash: dummyPassword,
      role: 'access_control',
      tenantId: tenant.id,
    }).returning();
    accessControlId = access.id;

    const [normal] = await db.insert(users).values({
      name: 'Test Normal User',
      email: `user-${Date.now()}@test.com`,
      passwordHash: dummyPassword,
      role: 'user',
    }).returning();
    normalUserId = normal.id;
  });

  afterAll(async () => {
    // Teardown
    if (eventId) {
      await db.delete(scanLogs).where(eq(scanLogs.eventId, eventId));
      if (attendeeId) {
        await db.delete(paymentAuditLogs).where(eq(paymentAuditLogs.attendeeId, attendeeId));
      }
      await db.delete(attendees).where(eq(attendees.eventId, eventId));
      await db.delete(events).where(eq(events.id, eventId));
    }
    
    await db.delete(users).where(inArray(users.id, [decanoId, gestorId, accessControlId, normalUserId]));
    await db.delete(spaces).where(eq(spaces.id, spaceId));
    await db.delete(departments).where(eq(departments.id, departmentId));
    await db.delete(tenants).where(eq(tenants.id, tenantId));
    await db.delete(universities).where(eq(universities.id, universityId));
  });

  it('1. Gestor should be able to create an event (pendiente_aprobacion)', async () => {
    const newEvent = await EventsService.createEvent({
      title: 'Test Integration Event',
      description: 'Test desc',
      date: new Date(Date.now() + 86400000), // Tomorrow
      duration: 120,
      price: '50.00',
      tenantId,
      departmentId,
      spaceId,
      managerId: gestorId,
      capacity: 50,
    });

    expect(newEvent).toBeDefined();
    expect(newEvent.status).toBe('pendiente_aprobacion');
    expect(newEvent.price).toBe('50.00');
    eventId = newEvent.id;
  });

  it('2. Decano should approve the event', async () => {
    const approvedEvent = await EventsService.approveEvent(eventId);
    expect(approvedEvent).toBeDefined();
    expect(approvedEvent.status).toBe('aprobado');
  });

  it('3. Normal user should register for the event (pago_pendiente)', async () => {
    const newAttendee = await AttendeesService.registerAttendee({
      eventId,
      name: 'Test Attendee',
      email: 'attendee-test@test.com',
      phone: '12345678',
      userId: normalUserId,
      paymentReference: 'REF123456',
    });

    expect(newAttendee).toBeDefined();
    expect(newAttendee.status).toBe('pago_pendiente');
    expect(newAttendee.ticketToken).toBeDefined();
    
    attendeeId = newAttendee.id;
    ticketToken = newAttendee.ticketToken as string;
  });

  it('4. Gestor verifies payment (confirmado) and generates audit log', async () => {
    const verifiedAttendee = await AttendeesService.confirmPayment(attendeeId, gestorId);
    
    expect(verifiedAttendee.status).toBe('confirmado');
    expect(verifiedAttendee.paymentVerifiedBy).toBe(gestorId);

    // Verify Audit Log
    const logs = await db.query.paymentAuditLogs.findMany({
      where: eq(paymentAuditLogs.attendeeId, attendeeId)
    });
    
    expect(logs.length).toBe(1);
    expect(logs[0].action).toBe('APROBADO');
    expect(logs[0].performedBy).toBe(gestorId);
  });

  it('5. QR Scan is successful via Route Handler', async () => {
    // Mock the session for access_control
    vi.mocked(getSession).mockResolvedValue({
      id: accessControlId,
      userId: accessControlId,
      role: 'access_control',
      tenantId: tenantId
    } as any);

    // Mock Next Request
    const request = new Request('http://localhost:3000/api/tickets/validate', {
      method: 'POST',
      body: JSON.stringify({ token: ticketToken }),
    });

    const response = await scanQRHandler(request);
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.success).toBe(true);

    // Verify DB
    const registration = await db.query.attendees.findFirst({
      where: eq(attendees.id, attendeeId)
    });
    expect(registration?.scannedAt).toBeDefined();

    // Verify Scan Log
    const scans = await db.query.scanLogs.findMany({
      where: eq(scanLogs.attendeeId, attendeeId)
    });
    expect(scans.length).toBe(1);
    expect(scans[0].scannedBy).toBe(accessControlId);
  });

  it('6. QR Scan fails on second attempt (already scanned)', async () => {
    // Mock Next Request
    const request = new Request('http://localhost:3000/api/tickets/validate', {
      method: 'POST',
      body: JSON.stringify({ token: ticketToken }),
    });

    const response = await scanQRHandler(request);
    expect(response.status).toBe(409); // Conflict

    const body = await response.json();
    expect(body.error).toContain('Entrada ya utilizada');
  });

  it('7. Payment Rejection updates status to registrado', async () => {
    // For coverage, reject payment
    const rejectedAttendee = await AttendeesService.rejectPayment(attendeeId, gestorId);
    
    expect(rejectedAttendee.status).toBe('registrado');
    
    // Verify Audit Log
    const logs = await db.query.paymentAuditLogs.findMany({
      where: eq(paymentAuditLogs.attendeeId, attendeeId)
    });
    
    // Should have 2 logs (APROBADO and RECHAZADO)
    expect(logs.length).toBe(2);
    const rejectLog = logs.find(l => l.action === 'RECHAZADO');
    expect(rejectLog).toBeDefined();
    expect(rejectLog?.performedBy).toBe(gestorId);
  });

});
