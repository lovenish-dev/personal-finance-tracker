import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux"
import { createTransaction, deleteTrasaction, getTransactions, updateTransaction } from "../../api/transaction.api";
import type { TransactionType } from "../../types/transaction.types"
import { setTransactions, setError, setLoading, addTransactions, removeTransaction, modifyTransaction, setPagination } from "../../store/slices/transactionSlice";
import { getAccounts } from "../../api/account.api";
import { setAccount, setError as setAccountError, setLoading as setAccountLoading } from "../../store/slices/accountSlice";
import { setCategories, setError as setCategoryError, setLoading as setCategoryLoading } from "../../store/slices/categorySlice";
import { getCategories } from "../../api/category.api";

export default function Transaction() {
  const dispatch = useAppDispatch();

  const [accountId, setAccountId] = useState(0);
  const [categoryId, setCategoryId] = useState(0);
  const [editId, setEditId] = useState<number | null>(null);
  const [amount, setAmount] = useState(0);
  const [type, setType] = useState<TransactionType>("income");
  const [description, setDescription] = useState("");
  const [transactionDate, setTransactionDate] = useState("");

  const [editAccountId, setEditAccountId] = useState(0);
  const [editCategoryId, setEditCategoryId] = useState(0);
  const [editAmount, setEditAmount] = useState(0);
  const [editType, setEditType] = useState<TransactionType>("income");
  const [editDescription, setEditDescription] = useState("");
  const [editTransactionDate, setEditTransactionDate] = useState("");

  const [filterType, setFilterType] = useState<TransactionType | "">("");
  const [filterAccountId, setFilterAccountId] = useState<number | "">("");
  const [filterCategoryId, setFilterCategoryId] = useState<number | "">("");
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");
  const [page, setPage] = useState(1);

  const { transcations, error, loading, pagination } = useAppSelector(state => state.transaction);
  const { accounts } = useAppSelector(state => state.account);
  const { categories } = useAppSelector(state => state.category);


  async function fetchTransactions(pageNumber = 1) {
    try {
      dispatch(setLoading(true));
      const response = await getTransactions({
        type: filterType || undefined,
        accountId: filterAccountId || undefined,
        categoryId: filterCategoryId || undefined,
        from: filterFrom || undefined,
        to: filterTo || undefined,
        page: pageNumber,
        limit: 10
      });
      dispatch(setTransactions(response.data.transactions));
      dispatch(setPagination(response.data.pagination));
    } catch (err) {
      dispatch(setError("Could not fetch transactions"));
    } finally {
      dispatch(setLoading(false))
    }
  }

  useEffect(() => {
    fetchTransactions();
  }, [dispatch])

  useEffect(() => {
    async function fetchAccounts() {
      try {
        dispatch(setAccountLoading(true))
        const response = await getAccounts();
        dispatch(setAccount(response.data))
      } catch (err) {
        dispatch(setAccountError("Could not fetch accounts"))
      } finally {
        dispatch(setAccountLoading(false))
      }
    }
    fetchAccounts()
  }, [dispatch])

  useEffect(() => {
    async function fetchCategories() {
      try {
        dispatch(setCategoryLoading(true))
        const response = await getCategories();
        dispatch(setCategories(response.data))
      } catch (err) {
        dispatch(setCategoryError("Could not fetch accounts"))
      } finally {
        dispatch(setCategoryLoading(false))
      }
    }
    fetchCategories()
  }, [dispatch])

  useEffect(() => {
    if (accounts.length > 0 && accountId === 0) {
      setAccountId(accounts[0].id);
    }
  }, [accounts, accountId])

  useEffect(() => {
    if (categories.length > 0 && categoryId === 0) {
      setCategoryId(categories[0].id);
    }
  }, [categories, categoryId])

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    try {
      const response = await createTransaction({ accountId, categoryId, amount, type, description, transactionDate });
      dispatch(addTransactions(response.data));
    } catch (err) {
      dispatch(setError("Could not create transaction"))
    }
  }

  async function handleDelete(id: number) {
    try {
      const response = await deleteTrasaction(id);
      dispatch(removeTransaction(id))
      return response.data
    } catch (err) {
      dispatch(setError("Could not delete transaction"))
    }
  }

  async function handleUpdateTransaction(e: React.SubmitEvent<HTMLFormElement>, id: number) {
    e.preventDefault()
    try {
      const response = await updateTransaction(id, { accountId: editAccountId, categoryId: editCategoryId, amount: editAmount, type: editType, description: editDescription, transactionDate: editTransactionDate });
      dispatch(modifyTransaction(response.data.transaction))
      setEditId(null)
    } catch (err) {
      dispatch(setError("Could not update transaction"))
    }
  }

  async function handleFilter() {
    try {
      setPage(1)
      dispatch(setLoading(true));

      const response = await getTransactions({
        type: filterType || undefined,
        accountId: filterAccountId || undefined,
        categoryId: filterCategoryId || undefined,
        from: filterFrom || undefined,
        to: filterTo || undefined,
        page: 1,
        limit: 10
      })

      dispatch(setTransactions(response.data.transactions));
      dispatch(setPagination(response.data.pagination))
    } catch (err) {
      dispatch(setError("Could not filter Trnasactions"));
    } finally {
      dispatch(setLoading(false))
    }
  }

  async function handleNextPage() {
    if (page >= pagination.totalPages) return;

    const nextPage = page + 1;
    setPage(nextPage);
    await fetchTransactions(nextPage)
  }
  async function handlePreviousPage() {
    if (page <= 1) return;

    const previousPage = page - 1;
    setPage(previousPage);
    await fetchTransactions(previousPage)
  }

  function handleEdit(transaction: typeof transcations[number]) {
    setEditId(transaction.id);
    setEditAccountId(transaction.account_id);
    setEditCategoryId(transaction.category_id);
    setEditAmount(Number(transaction.amount));
    setEditType(transaction.type);
    setEditDescription(transaction.description);
    setEditTransactionDate(transaction.transaction_date);
  }

  if (loading) {
    return <>Loading.....</>
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Transactions
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Track and manage your income and expenses.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Add Transaction */}
        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-semibold text-gray-900">
            Add Transaction
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Account
              </label>

              <select
                value={accountId}
                onChange={(e) =>
                  setAccountId(Number(e.target.value))
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Category
              </label>

              <select
                value={categoryId}
                onChange={(e) =>
                  setCategoryId(Number(e.target.value))
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Type
              </label>

              <select
                value={type}
                onChange={(e) =>
                  setType(e.target.value as TransactionType)
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Amount
              </label>

              <input
                type="number"
                value={amount}
                onChange={(e) =>
                  setAmount(Number(e.target.value))
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Date
              </label>

              <input
                type="date"
                value={transactionDate}
                onChange={(e) =>
                  setTransactionDate(e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-1">
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Description
              </label>

              <textarea
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                rows={1}
                placeholder="What was this transaction for?"
                className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <button
                type="submit"
                className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
              >
                Add Transaction
              </button>
            </div>
          </form>
        </div>

        {/* Filters */}
        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Filter Transactions
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Narrow down your transactions.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {/* Type */}
            <select
              value={filterType}
              onChange={(e) =>
                setFilterType(
                  e.target.value as TransactionType | ""
                )
              }
              className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>

            {/* Account */}
            <select
              value={filterAccountId}
              onChange={(e) =>
                setFilterAccountId(
                  e.target.value === ""
                    ? ""
                    : Number(e.target.value)
                )
              }
              className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">All Accounts</option>

              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </select>

            {/* Category */}
            <select
              value={filterCategoryId}
              onChange={(e) =>
                setFilterCategoryId(
                  e.target.value === ""
                    ? ""
                    : Number(e.target.value)
                )
              }
              className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">All Categories</option>

              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            {/* From */}
            <input
              type="date"
              value={filterFrom}
              onChange={(e) =>
                setFilterFrom(e.target.value)
              }
              className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            {/* To */}
            <input
              type="date"
              value={filterTo}
              onChange={(e) =>
                setFilterTo(e.target.value)
              }
              className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <button
            type="button"
            onClick={handleFilter}
            className="mt-4 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Apply Filters
          </button>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mb-6 flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
            <button
              onClick={handlePreviousPage}
              disabled={page === 1}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              ← Previous
            </button>

            <span className="text-sm font-medium text-gray-600">
              Page{" "}
              <span className="text-gray-900">
                {pagination.page}
              </span>{" "}
              of{" "}
              <span className="text-gray-900">
                {pagination.totalPages}
              </span>
            </span>

            <button
              onClick={handleNextPage}
              disabled={
                page === pagination.totalPages
              }
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next →
            </button>
          </div>
        )}

        {/* Transactions */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Transaction History
            </h2>
 
          </div>

          {transcations.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white py-12 text-center">
              <p className="text-gray-500">
                No transactions found.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {transcations.map((transaction) => (
                <div
                  key={transaction.id}
                  className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                >
                  {editId === transaction.id ? (
                    /* Edit Transaction */
                    <form
                      onSubmit={(e) =>
                        handleUpdateTransaction(
                          e,
                          transaction.id
                        )
                      }
                      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                    >
                      <select
                        value={editAccountId}
                        onChange={(e) =>
                          setEditAccountId(
                            Number(
                              e.target.value
                            )
                          )
                        }
                        className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      >
                        {accounts.map(
                          (account) => (
                            <option
                              key={account.id}
                              value={account.id}
                            >
                              {account.name}
                            </option>
                          )
                        )}
                      </select>

                      <select
                        value={editCategoryId}
                        onChange={(e) =>
                          setEditCategoryId(
                            Number(
                              e.target.value
                            )
                          )
                        }
                        className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      >
                        {categories.map(
                          (category) => (
                            <option
                              key={category.id}
                              value={
                                category.id
                              }
                            >
                              {category.name}
                            </option>
                          )
                        )}
                      </select>

                      <select
                        value={editType}
                        onChange={(e) =>
                          setEditType(
                            e.target.value as TransactionType
                          )
                        }
                        className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      >
                        <option value="income">
                          Income
                        </option>
                        <option value="expense">
                          Expense
                        </option>
                      </select>

                      <input
                        type="number"
                        value={editAmount}
                        onChange={(e) =>
                          setEditAmount(
                            Number(
                              e.target.value
                            )
                          )
                        }
                        className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />

                      <input
                        type="date"
                        value={
                          editTransactionDate
                        }
                        onChange={(e) =>
                          setEditTransactionDate(
                            e.target.value
                          )
                        }
                        className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />

                      <textarea
                        value={editDescription}
                        onChange={(e) =>
                          setEditDescription(
                            e.target.value
                          )
                        }
                        className="resize-none rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />

                      <div className="flex gap-2 sm:col-span-2 lg:col-span-3">
                        <button
                          type="submit"
                          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                        >
                          Save Changes
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setEditId(null)
                          }
                          className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* Transaction Display */
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                      {/* Left */}
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="truncate text-lg font-semibold text-gray-900">
                            {transaction.description}
                          </h3>

                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${transaction.type ===
                                "income"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                              }`}
                          >
                            {transaction.type}
                          </span>
                        </div>

                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                          <span>
                            {transaction.account_name}
                          </span>

                          <span>
                            {transaction.category_name}
                          </span>

                          <span>
                            {new Date(
                              transaction.transaction_date
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* Right */}
                      <div className="flex flex-col items-start gap-3 sm:items-end">
                        <p
                          className={`text-xl font-bold ${transaction.type ===
                              "income"
                              ? "text-green-600"
                              : "text-red-600"
                            }`}
                        >
                          {transaction.type ===
                            "income"
                            ? "+"
                            : "-"}
                          ₹
                          {transaction.amount}
                        </p>

                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              handleEdit(
                                transaction
                              )
                            }
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(
                                transaction.id
                              )
                            }
                            className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
