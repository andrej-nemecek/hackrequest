import { z } from "zod";

export const userSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),
});

export type UserFormData = z.infer<typeof userSchema>;

export const ticketSchema = z.object({
  summary: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  type: z.enum(["bug", "consultation", "feature"]),
  email: z.string().email("Invalid email address"),
  projectId: z.string().uuid("Invalid project ID"),
});

export type TicketFormData = z.infer<typeof ticketSchema>;
