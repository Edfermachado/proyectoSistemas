import { z } from "zod";

// --- EVENTOS ---
export const EventCreateSchema = z.object({
  title: z.string().min(3, "El título es muy corto"),
  slug: z.string().min(2, "Slug inválido").optional(),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
  date: z.coerce.date({ invalid_type_error: "Fecha inválida" }),
  price: z.string().min(1, "El precio es obligatorio"),
  tenantId: z.string().uuid("Facultad inválida"),
  spaceId: z.string().uuid("Espacio inválido"),
  imageUrl: z.string().url("URL de imagen inválida").optional().or(z.literal('')),
}).passthrough();

export const EventUpdateSchema = EventCreateSchema.partial().passthrough();

// --- TENANTS (FACULTADES) ---
export const TenantCreateSchema = z.object({
  name: z.string().min(3),
  slug: z.string().min(2),
  description: z.string().optional(),
  universityId: z.string().uuid(),
  categoryId: z.string().uuid(),
}).passthrough();

export const TenantUpdateSchema = TenantCreateSchema.partial().passthrough();

// --- USUARIOS / MANAGERS ---
export const ManagerCreateSchema = z.object({
  email: z.string().email("Correo inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  tenantId: z.string().uuid("Facultad inválida"),
}).passthrough();

// --- CATEGORÍAS ---
export const CategoryCreateSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  icon: z.string().min(2),
}).passthrough();

// --- PAGOS ---
export const PaymentReportSchema = z.object({
  eventId: z.string().uuid("ID de evento inválido"),
  referenceId: z.string().min(4, "Referencia muy corta"),
  bankName: z.string().min(2, "Banco inválido"),
  amount: z.string().min(1),
}).passthrough();

export const PaymentVerifySchema = z.object({
  paymentId: z.string().uuid("Pago inválido"),
  status: z.enum(["aprobado", "rechazado"]),
  notes: z.string().optional(),
}).passthrough();
