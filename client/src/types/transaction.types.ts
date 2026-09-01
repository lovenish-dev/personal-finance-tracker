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

export type TransactionFilters = {
    type?: TransactionType,
    accountId?: number,
    categoryId?: number,
    from?: string,
    to?: string,
    page?: number,
    limit?: number
}

export type CreateTransaction = {
    accountId: number,
    categoryId:number,
    amount: number,
    type:TransactionType,
    description: string,
    transactionDate: string
}

export type TransactionPagination = {
    page: number,
    limit: number,
    total: number,
    totalPages: number
}

export type TransactionState = {
    transcations: Transaction[],
    pagination: TransactionPagination;
    loading: boolean,
    error: string | null
}