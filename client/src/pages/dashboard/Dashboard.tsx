import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux"
import { getCategorySummary, getDashboardSummary, getMonthlySummary } from "../../api/dashboard.api";
import { setCategorySummary, setDashboardSummary, setError, setLoading, setMonthlySummary } from "../../store/slices/dashboardSlice";
import { getTransactions } from "../../api/transaction.api";
import { setTransactions } from "../../store/slices/transactionSlice";
import formatCurrency from "../../utils/formatCurrency";
import Loading from "../../components/Loading";
import {
    PieChart, Pie, Tooltip, Legend, ResponsiveContainer, Sector, LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
} from 'recharts'
import type { PieSectorShapeProps } from "recharts";

const CustomPieShape = (props: PieSectorShapeProps) => {
    const { index } = props;

    return (
        <Sector
            {...props}
            fill={COLORS[index % COLORS.length]}
        />
    );
};

const COLORS = [
    "#14B8A6",
    "#EF4444",
    "#F97316",
    "#F59E0B",
    "#84CC16",
    "#22C55E",
    "#10B981",
    "#06B6D4",
    "#EAB308",
    "#0EA5E9",
    "#3B82F6",
    "#6366F1",
    "#8B5CF6",
    "#A855F7",
    "#D946EF",
    "#EC4899",
    "#F43F5E",
];

export default function Dashboard() {
    const dispatch = useAppDispatch();
    const { categorySummary, monthlySummary, error, loading, summary } = useAppSelector(state => state.dashboard);
    const { transcations } = useAppSelector(state => state.transaction);
    const expenseData = categorySummary.filter((item) => item.type === 'expense').map((item, index) => ({
        name: item.category,
        value: Number(item.total),
        fill: COLORS[index % COLORS.length]
    }))
 

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
        async function fetchMonthlySummary() {
            try {
                const response = await getMonthlySummary();
                dispatch(setMonthlySummary(response.data))
            } catch (err) {
                dispatch(setError("Could not fetch monthly summary"))
            }
        }
        fetchMonthlySummary()
    }, [dispatch])

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
        return <Loading />
    }

    return (
        <section className="space-y-8">
            {error && (<p className="rounded-md bg-red-100 p-4 text-red-700">{error}</p>)}

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
                            {formatCurrency(summary.totalIncome)}
                        </p>
                    </div>

                    <div className="rounded-xl bg-white p-6 shadow-sm">
                        <p className="text-sm font-medium text-gray-500">
                            Total Expense
                        </p>

                        <p className="mt-2 text-2xl font-bold text-red-600">
                            {formatCurrency(summary.totalExpense)}
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
                        Category Expense Summary
                    </h2>

                    <div className="mt-6 space-y-4">
                        {categorySummary.length === 0 ? (
                            <p className="text-gray-500 mb-5">
                                No category summary available.
                            </p>
                        ) : (
                            <div className="mt-6 h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={expenseData}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            fill="orange"
                                            outerRadius={140}
                                            shape={CustomPieShape}
                                            label
                                        />

                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </div>
                </div>

                <div className="rounded-xl bg-white p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Income vs Expense
                    </h2>
                    <div className="mt-6 space-y-4 h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={monthlySummary}>
                                <CartesianGrid strokeDasharray="3 3" />

                                <XAxis dataKey="month" />

                                <YAxis />

                                <Tooltip />

                                <Legend />

                                <Line
                                    type="monotone"
                                    dataKey="income"
                                    name="Income"
                                    stroke="#16a34a"
                                    strokeWidth={2}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="expense"
                                    name="Expense"
                                    stroke="#dc2626"
                                    strokeWidth={2}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="rounded-xl bg-white p-6 shadow-sm w-full">
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
                                            {transaction.type === "income" ? "+" : "-"}
                                            {formatCurrency(transaction.amount)}
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
