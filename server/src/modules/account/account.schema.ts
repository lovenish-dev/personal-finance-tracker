import { z } from 'zod';

export const accountSchema = z.object({
    name: z.string().min(2, "Name should be at-least 2 characters"),
    type: z.enum(["bank","cash","creadit_card"]),
    balance: z.number().min(0, "Balance cannot be negative")
})

export const updateAccountSchema = z.object({
   name: z.string().min(2).optional(),
   type: z.enum(["bank","cash","creadit_card"]).optional()
})