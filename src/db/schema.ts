import { pgTable, uuid, varchar, text, timestamp, integer, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const tenants = pgTable('tenants', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).notNull().default('user'), // roles: superadmin, tenant_admin, user
  tenantId: uuid('tenant_id').references(() => tenants.id), // Puede ser null para el superadmin global
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
  description: text('description'),
  date: timestamp('date').notNull(),
  price: varchar('price', { length: 50 }).default('FREE'),
  tenantId: uuid('tenant_id').references(() => tenants.id).notNull(),
  spaceId: uuid('space_id').references(() => spaces.id).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const attendees = pgTable('attendees', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  eventId: uuid('event_id').references(() => events.id).notNull(),
  status: varchar('status', { length: 50 }).default('confirmed'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Configuración de Relaciones (Drizzle Relations) para hacer queries anidados fácilmente
export const tenantsRelations = relations(tenants, ({ many }) => ({
  users: many(users),
  spaces: many(spaces),
  events: many(events),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [users.tenantId],
    references: [tenants.id],
  }),
  attendances: many(attendees),
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
}));
