import { z } from "zod";

export const userSchema = z.object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),
});

export type UserFormData = z.infer<typeof userSchema>;
