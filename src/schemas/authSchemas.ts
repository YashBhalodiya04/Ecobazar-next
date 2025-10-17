// src/schemas/authSchema.ts
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;

export const signupSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .max(15, "Phone number too long"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignUpSchemaType = z.infer<typeof signupSchema>;

export const ProductCreateSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required"),

    description: z
      .string()
      .trim()
      .min(10, "Description must be at least 10 characters"),

    price: z
      .string()
      .trim()
      .min(1, "Price is required")
      .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: "Price must be a positive number",
      }),

    image: z.string().trim().url("Image must be a valid URL"),

    category: z.string().trim().min(1, "Category is required"),

    stock: z
      .string()
      .trim()
      .min(1, "Stock is required")
      .refine(
        (val) =>
          !isNaN(Number(val)) &&
          Number.isInteger(Number(val)) &&
          Number(val) >= 0,
        {
          message: "Stock must be a non-negative integer",
        }
      ),
  })
  .strict();

export type ProductCreateInput = z.infer<typeof ProductCreateSchema>;

// 🔹 Zod validation schema
export const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  image: z.string().min(1, "Image is required"),
  active: z.boolean().default(true),
});

export type CategoryFormData = z.infer<typeof categorySchema>;
