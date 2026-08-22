import { z } from 'zod';

export const transactionSchema = z.object({
    accountId: z.number().positive(),
    categoryId: z.number().positive(),
    amount: z.number().positive(),
    type: z.enum([ "income", "expense" ]),
    description: z.string().min(2),
    transactionDate: z.string()
})

export const TransactionFilterSchema = z.object({
    type: z.enum(["income", "expense"]).optional(),
    accountId: z.coerce.number().positive().optional(),
    categoryId: z.coerce.number().positive().optional(),
    from: z.iso.date().optional(),
    to: z.iso.date().optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100, "Maximum limit reached").optional()
})

export const updateTransactionSchema = transactionSchema.partial();