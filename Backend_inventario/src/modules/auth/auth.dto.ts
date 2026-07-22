import { z } from "zod";

export const loginSchema = z.object({
  usr_username: z.string().trim().min(3).max(50),
  usr_password: z.string().min(6).max(255)
});

export type LoginDto = z.infer<typeof loginSchema>;
