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
