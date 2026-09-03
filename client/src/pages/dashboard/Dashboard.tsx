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
        <section className="space-y-8">
            {error && (
                <p className="rounded-md bg-red-100 p-4 text-red-700">
                    {error}
                </p>
            )}

            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">
                    Dashboard
                </h1>

                <p className="mt-1 text-gray-500">
                    Overview of your financial activity
                </p>
            </div>

            {/* Summary Cards */}
            {summary && (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

                    <div className="rounded-xl bg-white p-6 shadow-sm">
                        <p className="text-sm font-medium text-gray-500">
                            Total Income
                        </p>

                        <p className="mt-2 text-2xl font-bold text-green-600">
                            ₹{summary.totalIncome}
                        </p>
                    </div>

                    <div className="rounded-xl bg-white p-6 shadow-sm">
                        <p className="text-sm font-medium text-gray-500">
                            Total Expense
                        </p>

                        <p className="mt-2 text-2xl font-bold text-red-600">
                            ₹{summary.totalExpense}
                        </p>
                    </div>



                    <div className="rounded-xl bg-white p-6 shadow-sm">
                        <p className="text-sm font-medium text-gray-500">
                            Transactions
                        </p>

                        <p className="mt-2 text-2xl font-bold text-gray-900">
                            {summary.transactionCount}
                        </p>
                    </div>

                </div>
            )}

            {/* Bottom Section */}
            <div className="grid gap-8 lg:grid-cols-2">

                {/* Category Summary */}
                <div className="rounded-xl bg-white p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Category Summary
                    </h2>

                    <div className="mt-6 space-y-4">
                        {categorySummary.length === 0 ? (
                            <p className="text-gray-500">
                                No category summary available.
                            </p>
                        ) : (
                            categorySummary.map((catSummary) => (
                                <div
                                    key={`${catSummary.category}-${catSummary.type}`}
                                    className="flex items-center justify-between border-b border-gray-100 pb-4"
                                >
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {catSummary.category}
                                        </p>

                                        <p className="text-sm capitalize text-gray-500">
                                            {catSummary.type}
                                        </p>
                                    </div>

                                    <p className="font-semibold text-gray-900">
                                        ₹{Number(catSummary.total)}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="rounded-xl bg-white p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Recent Transactions
                    </h2>

                    <div className="mt-6 space-y-4">
                        {transcations.length === 0 ? (
                            <p className="text-gray-500">
                                No transactions available.
                            </p>
                        ) : (
                            transcations.map((transaction) => (
                                <div
                                    key={transaction.id}
                                    className="flex items-center justify-between border-b border-gray-100 pb-4"
                                >
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {transaction.description}
                                        </p>

                                        <p className="text-sm text-gray-500">
                                            {transaction.account_name}
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        <p
                                            className={`font-semibold ${transaction.type === "income"
                                                    ? "text-green-600"
                                                    : "text-red-600"
                                                }`}
                                        >
                                            {transaction.type === "income" ? "+" : "-"}₹
                                            {transaction.amount}
                                        </p>

                                        <p className="text-sm capitalize text-gray-500">
                                            {transaction.type}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>
        </section>
    );
}
