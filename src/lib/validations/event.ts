/**
 * Event validation schemas using Zod
 */

import { z } from "zod";

/** Event location schema */
const eventLocationSchema = z.object({
  type: z.enum(["online", "offline", "hybrid"]),
  venue: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  coordinates: z
    .object({
      latitude: z.number(),
      longitude: z.number(),
    })
    .optional(),
  onlineUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  onlinePlatform: z.string().optional(),
});

/** Event settings schema */
const eventSettingsSchema = z.object({
  allowComments: z.boolean().default(true),
  allowGuests: z.boolean().default(false),
  requireApproval: z.boolean().default(false),
  sendReminders: z.boolean().default(true),
  reminderTiming: z.array(z.number()).default([24, 1]),
});

/** Create event form schema */
export const createEventSchema = z
  .object({
    title: z
      .string()
      .min(1, "Title is required")
      .min(3, "Title must be at least 3 characters")
      .max(100, "Title must be less than 100 characters"),
    description: z
      .string()
      .min(1, "Description is required")
      .min(10, "Description must be at least 10 characters")
      .max(5000, "Description must be less than 5000 characters"),
    coverImage: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    timezone: z.string().min(1, "Timezone is required"),
    location: eventLocationSchema,
    visibility: z.enum(["public", "private", "unlisted"]).default("private"),
    maxAttendees: z.number().int().positive().optional(),
    categories: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    settings: eventSettingsSchema.optional(),
  })
  .refine(
    (data) => {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return end > start;
    },
    {
      message: "End date must be after start date",
      path: ["endDate"],
    }
  )
  .refine(
    (data) => {
      const start = new Date(data.startDate);
      return start > new Date();
    },
    {
      message: "Start date must be in the future",
      path: ["startDate"],
    }
  )
  .refine(
    (data) => {
      if (data.location.type === "offline" || data.location.type === "hybrid") {
        return !!data.location.venue;
      }
      return true;
    },
    {
      message: "Venue is required for offline/hybrid events",
      path: ["location", "venue"],
    }
  )
  .refine(
    (data) => {
      if (data.location.type === "online" || data.location.type === "hybrid") {
        return !!data.location.onlineUrl;
      }
      return true;
    },
    {
      message: "Online URL is required for online/hybrid events",
      path: ["location", "onlineUrl"],
    }
  );

export type CreateEventFormValues = z.infer<typeof createEventSchema>;

/** Update event form schema (similar but dates can be in past for ongoing events) */
export const updateEventSchema = z
  .object({
    title: z
      .string()
      .min(3, "Title must be at least 3 characters")
      .max(100, "Title must be less than 100 characters")
      .optional(),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters")
      .max(5000, "Description must be less than 5000 characters")
      .optional(),
    coverImage: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    timezone: z.string().optional(),
    location: eventLocationSchema.optional(),
    visibility: z.enum(["public", "private", "unlisted"]).optional(),
    maxAttendees: z.number().int().positive().optional(),
    categories: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    settings: eventSettingsSchema.optional(),
    status: z
      .enum(["draft", "published", "ongoing", "completed", "cancelled"])
      .optional(),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        const start = new Date(data.startDate);
        const end = new Date(data.endDate);
        return end > start;
      }
      return true;
    },
    {
      message: "End date must be after start date",
      path: ["endDate"],
    }
  );

export type UpdateEventFormValues = z.infer<typeof updateEventSchema>;

/** Invitation form schema */
export const createInvitationSchema = z.object({
  eventId: z.string().min(1, "Event is required"),
  recipientEmail: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  message: z
    .string()
    .max(500, "Message must be less than 500 characters")
    .optional(),
  expiresAt: z.string().optional(),
});

export type CreateInvitationFormValues = z.infer<typeof createInvitationSchema>;

/** Bulk invitation form schema */
export const bulkInvitationSchema = z.object({
  eventId: z.string().min(1, "Event is required"),
  emails: z
    .string()
    .min(1, "At least one email is required")
    .transform((val) =>
      val
        .split(/[,\n]/)
        .map((e) => e.trim())
        .filter((e) => e.length > 0)
    )
    .refine(
      (emails) => emails.every((email) => z.string().email().safeParse(email).success),
      { message: "All entries must be valid email addresses" }
    ),
  message: z
    .string()
    .max(500, "Message must be less than 500 characters")
    .optional(),
});

export type BulkInvitationFormValues = z.infer<typeof bulkInvitationSchema>;
