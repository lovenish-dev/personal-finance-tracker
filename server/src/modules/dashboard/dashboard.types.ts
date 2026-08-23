export type DashboardSummary = {
    totalIncome: number,
    totalExpense: number,
    balance: number,
    transactionCount:number
}

export type CategorySummary = {
    category: string,
    type: "income" | "expense",
    total: number 
}