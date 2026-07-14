import { z } from 'zod';

export const SponsorshipSchema = z.object({
  companyName: z.string().min(2),
  contributionAmount: z.number().positive().optional(),
  contactEmail: z.string().email(),
  requestedAssets: z.array(z.string()).optional(),
});

export const PressSchema = z.object({
  mediaOutlet: z.string().min(2),
  journalistName: z.string().min(2),
  credentialsId: z.string().optional(),
  equipmentDetails: z.string().optional(),
});

export const AcademicSupportSchema = z.object({
  department: z.string(),
  requiredEquipment: z.array(z.string()),
});

export const BroadcastingRightsSchema = z.object({
  platform: z.string(),
  exclusivity: z.boolean(),
  estimatedAudience: z.number().optional(),
});

export const EventRequestMetadataSchema = z.union([
  SponsorshipSchema,
  PressSchema,
  AcademicSupportSchema,
  BroadcastingRightsSchema
]);

export type EventRequestMetadata = z.infer<typeof EventRequestMetadataSchema>;
