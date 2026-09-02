import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux"
import { getCategorySummary, getDashboardSummary } from "../../api/dashboard.api";
import { setCategorySummary, setDashboardSummary, setError, setLoading } from "../../store/slices/dashboardSlice";
import { getTransactions } from "../../api/transaction.api";
import { setTransactions } from "../../store/slices/transactionSlice";

export default function Dashboard() {
    const dispatch = useAppDispatch();
    const { categorySummary, error, loading, summary } = useAppSelector(state => state.dashboard);
    const { transcations } = useAppSelector(state => state.transaction);

    useEffect(() => {
        async function fetchRecentTransactions() {
            try {
                const response = await getTransactions({ page: 1, limit: 5 });
                dispatch(setTransactions(response.data.transactions))
            } catch (err) {
                dispatch(setError("Could not fetch recent transactions"))
            }
        }
        fetchRecentTransactions()
    }, [])

    useEffect(() => {
        async function fetchDashboardSummary() {
            try {
                dispatch(setLoading(true))
                const response = await getDashboardSummary();
                dispatch(setDashboardSummary(response.data))
            } catch (err) {
                dispatch(setError("Could not fetch DashboardSummary"))
            } finally {
                dispatch(setLoading(false))
            }
        }
        fetchDashboardSummary()
    }, [])
    useEffect(() => {
        async function fetchCategorySummary() {
            try {
                dispatch(setLoading(true))
                const response = await getCategorySummary();
                dispatch(setCategorySummary(response.data))
            } catch (err) {
                dispatch(setError("Could not fetch category summary"))
            } finally {
                dispatch(setLoading(false))
            }
        }
        fetchCategorySummary()
    }, [])

    if (loading) {
        return <p>Loading...</p>
    }
    return (
        <section className="dashboard" style={{ display: 'flex', gap: '3em' }}>
            {error && <p>{error}</p>}
            {summary && (<div className="dashboard-summary">
                <h1>Dashboard Summary</h1>
                Total Expense: {summary?.totalExpense} <br />
                Total Income:  {summary?.totalIncome} <br />
                Transaction Count: {summary?.transactionCount} <br />
            </div>)}

            <div className="category-summary">
                <h1>Category Summary</h1>
                {categorySummary.length === 0 ? <p>No Category Summary</p> : categorySummary.map((catSummary) => (
                    <div key={catSummary.category + Math.random()}>
                        <br />
                        Category Name: {catSummary.category} <br />
                        Type: {catSummary.type} <br />
                        Total: {catSummary.total} <br />
                    </div>
                ))}
            </div>
            <div className="recent-transactions">
                <h1>Recent Transactions</h1>
                {transcations.length === 0 ? (
                    <p>No Transactions here</p>
                ) : (
                    transcations.map((transaction) => (
                        <div key={transaction.id} style={{ display: 'flex', alignItems: 'center', justifyContent: "space-between" }}>
                            <div>
                                <p>{transaction.description}</p>
                                <b>Bank:- {transaction.account_name}</b>
                            </div>
                            <div>
                                <p>{transaction.amount}</p>
                                <p>{transaction.type}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </section>
    )
}
