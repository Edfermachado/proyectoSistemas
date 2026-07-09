"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventsRelations = exports.usersRelations = exports.tenantsRelations = exports.attendees = exports.events = exports.spaces = exports.users = exports.tenants = void 0;
var pg_core_1 = require("drizzle-orm/pg-core");
var drizzle_orm_1 = require("drizzle-orm");
exports.tenants = (0, pg_core_1.pgTable)('tenants', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    name: (0, pg_core_1.varchar)('name', { length: 255 }).notNull().unique(),
    description: (0, pg_core_1.text)('description'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
});
exports.users = (0, pg_core_1.pgTable)('users', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    email: (0, pg_core_1.varchar)('email', { length: 255 }).notNull().unique(),
    passwordHash: (0, pg_core_1.varchar)('password_hash', { length: 255 }).notNull(),
    role: (0, pg_core_1.varchar)('role', { length: 50 }).notNull().default('user'), // roles: superadmin, tenant_admin, user
    tenantId: (0, pg_core_1.uuid)('tenant_id').references(function () { return exports.tenants.id; }), // Puede ser null para el superadmin global
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
});
exports.spaces = (0, pg_core_1.pgTable)('spaces', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    name: (0, pg_core_1.varchar)('name', { length: 255 }).notNull(),
    capacity: (0, pg_core_1.integer)('capacity').notNull(),
    tenantId: (0, pg_core_1.uuid)('tenant_id').references(function () { return exports.tenants.id; }).notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
});
exports.events = (0, pg_core_1.pgTable)('events', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    title: (0, pg_core_1.varchar)('title', { length: 255 }).notNull(),
    description: (0, pg_core_1.text)('description'),
    date: (0, pg_core_1.timestamp)('date').notNull(),
    price: (0, pg_core_1.varchar)('price', { length: 50 }).default('FREE'),
    tenantId: (0, pg_core_1.uuid)('tenant_id').references(function () { return exports.tenants.id; }).notNull(),
    spaceId: (0, pg_core_1.uuid)('space_id').references(function () { return exports.spaces.id; }).notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
});
exports.attendees = (0, pg_core_1.pgTable)('attendees', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    userId: (0, pg_core_1.uuid)('user_id').references(function () { return exports.users.id; }).notNull(),
    eventId: (0, pg_core_1.uuid)('event_id').references(function () { return exports.events.id; }).notNull(),
    status: (0, pg_core_1.varchar)('status', { length: 50 }).default('confirmed'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
});
// Configuración de Relaciones (Drizzle Relations) para hacer queries anidados fácilmente
exports.tenantsRelations = (0, drizzle_orm_1.relations)(exports.tenants, function (_a) {
    var many = _a.many;
    return ({
        users: many(exports.users),
        spaces: many(exports.spaces),
        events: many(exports.events),
    });
});
exports.usersRelations = (0, drizzle_orm_1.relations)(exports.users, function (_a) {
    var one = _a.one, many = _a.many;
    return ({
        tenant: one(exports.tenants, {
            fields: [exports.users.tenantId],
            references: [exports.tenants.id],
        }),
        attendances: many(exports.attendees),
    });
});
exports.eventsRelations = (0, drizzle_orm_1.relations)(exports.events, function (_a) {
    var one = _a.one, many = _a.many;
    return ({
        tenant: one(exports.tenants, {
            fields: [exports.events.tenantId],
            references: [exports.tenants.id],
        }),
        space: one(exports.spaces, {
            fields: [exports.events.spaceId],
            references: [exports.spaces.id],
        }),
        attendees: many(exports.attendees),
    });
});
