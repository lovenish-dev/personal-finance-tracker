import { z } from 'zod'

export const createCategorySchema = z.object({
    name: z.string().min(3, "At-Least 3 characters are required"),
    type: z.enum(["income", "expense"], "Pick one valid type")
})

export const editCategorySchema = z.object({
    name: z.string().min(3, "At-Least 3 characters are required").optional(),
    type: z.enum(["income", "expense"], "Pick one valid type").optional()
})