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
    stock: z
      .string()
      .trim()
      .min(1, "Stock is required")
      .refine(
        (val) =>
          !isNaN(Number(val)) &&
          Number.isInteger(Number(val)) &&
          Number(val) >= 0,
        { message: "Stock must be a non-negative integer" }
      ),
    active: z.boolean(),
    hasOffer: z.boolean(),
    offer: z
      .object({
        title: z.string().trim(),
        discountPercent: z.string().trim(),
        validUntil: z.string().trim(),
        description: z.string().trim(),
      })
      .optional(),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (data.hasOffer) {
      if (!data.offer) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Offer details are required when hasOffer is true",
          path: ["offer"],
        });
        return;
      }

      if (data.offer.title.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Offer title is required",
          path: ["offer", "title"],
        });
      }

      if (data.offer.discountPercent.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Discount is required",
          path: ["offer", "discountPercent"],
        });
      } else if (
        isNaN(Number(data.offer.discountPercent)) ||
        Number(data.offer.discountPercent) <= 0
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Discount must be a positive number",
          path: ["offer", "discountPercent"],
        });
      }

      if (data.offer.validUntil.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Valid until date is required",
          path: ["offer", "validUntil"],
        });
      }

      if (data.offer.description.length < 10) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Offer description must be at least 10 characters",
          path: ["offer", "description"],
        });
      }
    }
  });

export type ProductCreateInput = z.infer<typeof ProductCreateSchema>;

// ✅ Zod Schema
export const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  active: z.boolean().optional(),
  imagepath: z.string().optional(),
});

export type CategoryFormData = z.infer<typeof categorySchema>;

export const mainSliderSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  sliderid: z.string().optional(),
  fromdate: z.string().min(1, "From date is required"),
  todate: z.string().min(1, "To date is required"),
  active: z.boolean(),
  imagepath: z.string().optional(),
});

export type MainSliderSchemaType = z.infer<typeof mainSliderSchema>;

// --- Zod Schema ---

export const FieldSchema = z.object({
  id: z.string(),
  srno: z.string().optional(),
  label: z.string().min(1, "Label is required"),
  value: z.string().min(1, "Value is required"),
});

export const SectionSchema = z.object({
  id: z.string(),
  srno: z.string().optional(),
  title: z.string().min(1, "Section title is required"),
  fields: z.array(FieldSchema).min(1),
});

export const ProductAdditionalInfoSchema = z.object({
  sections: z.array(SectionSchema).min(1),
});

export type ProductAdditionalInfoType = z.infer<
  typeof ProductAdditionalInfoSchema
>;

export const contactSchema = z.object({
  aboutemail: z.string().email("Please enter a valid email address."),
  description: z
    .string()
    .min(5, "Message should be at least 5 characters long."),
});

export type ContactFormData = z.infer<typeof contactSchema>;

export const reviewSchema = z.object({
  rating: z.number().min(1, { message: "Please select a rating." }).max(5),
  comment: z
    .string()
    .min(5, { message: "Comment must be at least 5 characters long." })
    .max(500, { message: "Comment cannot exceed 500 characters." }),
});

export type ReviewFormData = z.infer<typeof reviewSchema>;

export const userProfileSchema = z.object({
  username: z.string().min(2, "Username is required"),
  email: z.email("Invalid email address"),
  phone: z
    .string()
    .min(10, "Phone is required")
    .regex(/^[0-9+\-\s()]{10}$/, "Invalid phone number"),
  userimage: z.url("Invalid image URL").optional().or(z.literal("")),
  billingAddress: z.array(
    z.object({
      firstName: z.string().min(1, "First name required"),
      lastName: z.string().min(1, "Last name required"),
      address: z.string().min(1, "Address required"),
      city: z.string().min(1, "City required"),
      state: z.string().min(1, "State required"),
      zipCode: z
        .string()
        .regex(/^\d{6}$/, "Invalid ZIP code — must be 6 digits"),
      country: z.string().min(1, "Country required"),
      phoneNumber: z
        .string()
        .regex(/^[0-9+\-\s()]{10}$/, "Invalid phone number"),
      isPrimary: z.boolean(),
    })
  ),
});

export type UserProfileForm = z.infer<typeof userProfileSchema>;
