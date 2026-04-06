import { z } from "zod";

export const signUpSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters").max(20, "Name must be at most 20 characters"),
    username : z.string().min(3, "Username must be at least 3 characters").max(20, "Username must be at most 20 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters").max(20,"Password must be at most 20 characters").regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number"),
    confirmPassword: z.string().min(6).max(20),
});