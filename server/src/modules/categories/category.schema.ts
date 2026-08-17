import { z } from 'zod';

export const categorySchema = z.object({
    name: z.string().min(4, "At least 4 characters required"),
    type: z.enum(['income', 'expense'])
})