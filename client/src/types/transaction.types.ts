export type TransactionType = "income" | "expense"
export type Transaction = {
    id: number,
    user_id: number,
    account_id: number,
    category_id: number,
    amount: number,
    type: TransactionType,
    account_name: string,
    category_name: string,
    transaction_date:string,
    description: string,
    created_at: string,
    updated_at: string,
}

export type CreateTransaction = {
    accountId: number,
    categoryId:number,
    amount: number,
    type:TransactionType,
    description: string,
    transactionDate: string
}

export type TransactionState = {
    transcations: Transaction[],
    loading: boolean,
    error: string | null
}