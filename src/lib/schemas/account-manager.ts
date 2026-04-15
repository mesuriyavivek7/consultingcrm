import { z } from "zod";

export const createAccountManagerSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name must be at most 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "First name can only contain letters"),

  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name must be at most 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Last name can only contain letters"),

  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(64, "Password must be at most 64 characters"),

  mobileNo: z
    .string()
    .min(1, "Mobile number is required")
    .regex(/^\d{10}$/, "Mobile number must be exactly 10 digits"),

  status: z.enum(["ACTIVE", "INACTIVE"]),
});

export type CreateAccountManagerFormValues = z.infer<
  typeof createAccountManagerSchema
>;

// Edit schema — includes status, no password
export const editAccountManagerSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name must be at most 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "First name can only contain letters"),

  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name must be at most 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Last name can only contain letters"),

  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),

  mobileNo: z
    .string()
    .min(1, "Mobile number is required")
    .regex(/^\d{10}$/, "Mobile number must be exactly 10 digits"),

  status: z.enum(["ACTIVE", "INACTIVE"]),
});

export type EditAccountManagerFormValues = z.infer<
  typeof editAccountManagerSchema
>;
