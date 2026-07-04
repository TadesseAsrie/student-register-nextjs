
import { z } from "zod";

// ---------- Base schemas (no refinements) ----------

export const studentBaseSchema = z.object({
  studentId: z.string().min(1, "Student ID required"),
  firstName: z.string().min(1, "First name required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name required"),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  dob: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  department: z.string().min(1, "Department required"),
  year: z.number().int().min(1).max(5),
  semester: z.number().int().min(1).max(2),
  address: z.string().optional(),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password required"),
});

// ---------- Refined schemas ----------

export const studentSchema = studentBaseSchema.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  },
);

export const updateStudentSchema = studentBaseSchema
  .omit({ password: true, confirmPassword: true, username: true })
  .partial();

// ---------- Other schemas ----------

export const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(6, "Current password required"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters"),
    confirmNewPassword: z.string().min(6, "Confirm new password required"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ["confirmNewPassword"],
  });

export const profileUpdateSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  username: z.string().min(3).optional(), // for admin
});

export const adminProfileUpdateSchema = z.object({
  username: z.string().min(3).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
});