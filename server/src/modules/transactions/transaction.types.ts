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