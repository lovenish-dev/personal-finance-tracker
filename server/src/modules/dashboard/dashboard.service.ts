import { fetchCategorySummary, fetchDashboardSummary } from "./dashboard.respository.js";

export async function getDashboardSummaryService(userId: number){
     const result = await fetchDashboardSummary(userId);
     
     const totalIncome = Number(result.total_income);
     const totalExpense = Number(result.total_expense);

     const balance = totalIncome - totalExpense;

     return {totalExpense, totalIncome, balance, transactionCount: Number(result.transaction_count)}
}

export async function getCategorySummaryService(userId: number){
     const result = await fetchCategorySummary(userId);
     return result.map((row)=> ({
          category: row.category,
          type: row.type,
          total: Number(row.total)
     }));
}