import { z } from 'zod';

export const transactionSchema = z.object({
    accountId: z.number().positive(),
    categoryId: z.number().positive(),
    amount: z.number().positive(),
    type: z.enum([ "income", "expense" ]),
    description: z.string().min(2),
    transactionDate: z.string()
})

export const updateTransactionSchema = transactionSchema.partial();