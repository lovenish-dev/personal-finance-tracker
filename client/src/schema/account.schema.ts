import { z } from "zod"

export const createAccountSchema = z.object({
    name: z.string().min(3, "At-least 3 characters are required"),
    type:z.enum(["bank", "cash", "credit card"], "Pick one type please"),
    balance: z.number().min(100, "Minimum 100 rupees are requried")
})

export const editAccountSchema = z.object({
    name: z.string().min(1, "Name is required").optional(),
    type: z.enum(["bank", "cash", "credit card"]).optional()
})
