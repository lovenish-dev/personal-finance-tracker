export type TransactionType = "income" | "expense";

export type CreateTransactionBody = {
    accountId:number,
    categoryId: number,
    amount: number,
    type:TransactionType,
    description:string,
    transactionDate:string
}

export type UpdateTransactionBody = {
     accountId?: number,
     categoryId?: number,
     amount?: number
     type?: TransactionType,
     description?: string,
     transactionDate?:string
}

export type TransactionFilters = {
    type?: TransactionType | undefined,
    accountId?: number | undefined,
    categoryId?: number | undefined,
    from? : string | undefined,
    to?: string | undefined,    
    page?: number | undefined,
    limit?: number | undefined
}
 