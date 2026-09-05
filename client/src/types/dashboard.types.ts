export type DashboardSummary = {
    totalIncome: number,
    totalExpense: number,
    transactionCount: number
}

export type CategorySummary = {
    category: string,
    type: "income" | "expense",
    total: string,
}

export type DashboardState = {
    summary: DashboardSummary | null,
    categorySummary: CategorySummary[],
    monthlySummary: MonthlySummary[],
    loading: boolean,
    error: string | null
}

export type MonthlySummary = {
    month: string,
    income: number,
    expense: number,
}