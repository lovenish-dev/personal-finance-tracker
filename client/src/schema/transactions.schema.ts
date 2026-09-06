import { z } from 'zod'

export const createTransactionSchema = z.object({
    accountId: z.number().min(1, "Pick a valid account"),
    categoryId: z.number().min(1, "Pick a valid account"),
    type: z.enum(["income", "expense"], "Pick a valid type"),
    amount: z.number().min(1, "Add a valid transaction amount"),
    transactionDate: z.iso.date("Please add a valid date"),
    description: z.string().min(1, "Add a valid description"),
})

export const editTransactionSchema = createTransactionSchema.partial();