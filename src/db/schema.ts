import { pgTable, uuid, varchar, text, timestamp, integer, boolean, pgEnum, jsonb, decimal } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import type { EventRequestMetadata } from '@/validations/requests';

export const organizerLevelEnum = pgEnum('organizer_level', ['academico', 'amateur', 'registrado']);
export const visibilityEnum = pgEnum('visibility', ['publico', 'privado']);
export const registrationStatusEnum = pgEnum('registration_status', ['registrado', 'confirmado', 'pago_pendiente']);
export const requestTypeEnum = pgEnum('request_type', ['soporte_academico', 'patrocinio', 'cobertura_prensa', 'derechos_transmision']);
export const attendeeTypeEnum = pgEnum('attendee_type', ['estudiante', 'foraneo']);

export const universities = pgTable('universities', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  slug: varchar('slug', { length: 300 }).unique(),
  description: text('description'),
  logoUrl: varchar('logo_url', { length: 500 }),
  createdAt: timestamp('created_at').defaultNow(),
});

export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  slug: varchar('slug', { length: 300 }).unique(),
  icon: varchar('icon', { length: 100 }), // for material symbols icon
  createdAt: timestamp('created_at').defaultNow(),
});

export const tenants = pgTable('tenants', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  slug: varchar('slug', { length: 300 }).unique(),
  description: text('description'),
  universityId: uuid('university_id').references(() => universities.id),
  categoryId: uuid('category_id').references(() => categories.id),
  createdAt: timestamp('created_at').defaultNow(),
});

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).notNull().default('user'), // roles: superadmin, tenant_admin, user
  tenantId: uuid('tenant_id').references(() => tenants.id), // Puede ser null para el superadmin global
  organizerLevel: organizerLevelEnum('organizer_level').default('academico'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const spaces = pgTable('spaces', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  capacity: integer('capacity').notNull(),
  tenantId: uuid('tenant_id').references(() => tenants.id).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const events = pgTable('events', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 350 }).unique(),
  description: text('description'),
  date: timestamp('date').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }), 
  imageUrl: varchar('image_url', { length: 500 }),
  duration: integer('duration').notNull().default(60),
  tenantId: uuid('tenant_id').references(() => tenants.id).notNull(),
  spaceId: uuid('space_id').references(() => spaces.id).notNull(),
  capacity: integer('capacity'),
  visibility: visibilityEnum('visibility').default('publico'),
  status: varchar('status', { length: 50 }).default('aprobado'), // roles: pendiente, aprobado, rechazado
  requiresIpProtection: boolean('requires_ip_protection').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export const attendees = pgTable('attendees', {
  id: uuid('id').primaryKey().defaultRandom(),
  eventId: uuid('event_id').references(() => events.id).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }).notNull(),
  status: registrationStatusEnum('status').default('registrado'),
  attendeeType: attendeeTypeEnum('attendee_type').default('estudiante'),
  userId: uuid('user_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
});

export const eventRequests = pgTable('event_requests', {
  id: uuid('id').primaryKey().defaultRandom(),
  eventId: uuid('event_id').references(() => events.id).notNull(),
  requestType: requestTypeEnum('request_type').notNull(),
  metadata: jsonb('metadata').$type<EventRequestMetadata>(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const systemSettings = pgTable('system_settings', {
  key: varchar('key', { length: 100 }).primaryKey(),
  value: text('value').notNull(),
  description: text('description'),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Configuración de Relaciones (Drizzle Relations)
export const universitiesRelations = relations(universities, ({ many }) => ({
  tenants: many(tenants),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  tenants: many(tenants),
}));

export const tenantsRelations = relations(tenants, ({ one, many }) => ({
  university: one(universities, {
    fields: [tenants.universityId],
    references: [universities.id],
  }),
  category: one(categories, {
    fields: [tenants.categoryId],
    references: [categories.id],
  }),
  users: many(users),
  spaces: many(spaces),
  events: many(events),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [users.tenantId],
    references: [tenants.id],
  }),
  attendees: many(attendees),
}));

export const spacesRelations = relations(spaces, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [spaces.tenantId],
    references: [tenants.id],
  }),
  events: many(events),
}));

export const eventsRelations = relations(events, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [events.tenantId],
    references: [tenants.id],
  }),
  space: one(spaces, {
    fields: [events.spaceId],
    references: [spaces.id],
  }),
  attendees: many(attendees),
  requests: many(eventRequests),
}));

export const attendeesRelations = relations(attendees, ({ one }) => ({
  event: one(events, {
    fields: [attendees.eventId],
    references: [events.id],
  }),
  user: one(users, {
    fields: [attendees.userId],
    references: [users.id],
  }),
}));

export const eventRequestsRelations = relations(eventRequests, ({ one }) => ({
  event: one(events, {
    fields: [eventRequests.eventId],
    references: [events.id],
  }),
}));
