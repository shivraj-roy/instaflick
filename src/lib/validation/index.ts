import { z } from "zod";

export const signupValidation = z.object({
   name: z
      .string()
      .min(3, { message: "Name must be at least 3 characters long" }),
   username: z.string().min(2).max(50),
   email: z.string().email({ message: "Invalid email address" }),
   password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
   // .regex(/[a-z]/, {
   //    message: "Password must contain at least one lowercase letter",
   // })
   // .regex(/[A-Z]/, {
   //    message: "Password must contain at least one uppercase letter",
   // })
   // .regex(/[0-9]/, { message: "Password must contain at least one number" })
   // .regex(
   //    /[@$!%*?&]/,
   //    "Password must contain at least one special character"
   // ),
});

export const signinValidation = z.object({
   email: z.string().email({ message: "Invalid email address" }),
   password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
});

export const postValidation = z.object({
   caption: z
      .string()
      .min(5, {
         message: "Caption must be at least 5 characters.",
      })
      .max(1000, { message: "Exceeds the limit..." })
      .optional(),
   file: z.custom<File[]>(),
   // .any()
   // .refine((file) => file?.length > 0, {
   //    message: "Please select a file.",
   // })
   // .refine((file) => file?.length <= 1, {
   //    message: "Please select only one file.",
   // })
   // .refine((file) => file?.[0]?.size <= 5 * 1024 * 1024, {
   //    message: "File size must be less than 5MB.",
   // }),
   location: z
      .string()
      .min(2, { message: "Must be at least 2 character." })
      .optional(),
   tags: z.string().optional(),
   // .refine(
   //    (tags) => {
   //       const tagsArray = tags?.split(",").map((tag) => tag.trim());
   //       return tagsArray?.every((tag) => tag.startsWith("#"));
   //    },
   //    {
   //       message: "Tags must start with a #",
   //    }
   // ),
});
