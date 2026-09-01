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
    <main>
      {error && <p>{error}</p>}
      <h1>Transactions</h1>
      <form onSubmit={handleSubmit}>
        <select value={accountId} onChange={(e) => setAccountId(Number(e.target.value))}>
          {accounts.map((account) => (
            <option key={account.id} value={account.id}>{account.name}</option>
          ))}
        </select>
        <select value={categoryId} onChange={(e) => setCategoryId(Number(e.target.value))}>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
        <select value={type} onChange={e => setType(e.target.value as TransactionType)}>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
        <textarea value={description} onChange={e => setDescription(e.target.value)}></textarea>
        <input type="date" value={transactionDate} onChange={e => setTransactionDate(e.target.value)} />
        <input type="submit" value="Submit" />
      </form>
      <div>
        <select
          value={filterType}
          onChange={(e) =>
            setFilterType(e.target.value as TransactionType | "")
          }
        >
          <option value="">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <select
          value={filterAccountId}
          onChange={(e) =>
            setFilterAccountId(
              e.target.value === "" ? "" : Number(e.target.value)
            )
          }
        >
          <option value="">All Accounts</option>

          {accounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.name}
            </option>
          ))}
        </select>

        <select
          value={filterCategoryId}
          onChange={(e) =>
            setFilterCategoryId(
              e.target.value === "" ? "" : Number(e.target.value)
            )
          }
        >
          <option value="">All Categories</option>

          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={filterFrom}
          onChange={(e) => setFilterFrom(e.target.value)}
        />

        <input
          type="date"
          value={filterTo}
          onChange={(e) => setFilterTo(e.target.value)}
        />

        <button type="button" onClick={handleFilter}>
          Apply Filters
        </button>
      </div>
      Pagination
      {pagination.totalPages > 1 && (
        <div>
          <button onClick={handlePreviousPage} disabled={page === 1}>← Previous</button>
          <span>
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button onClick={handleNextPage} disabled={page === pagination.totalPages}> Next →</button>
        </div>
      )}
      {transcations.length === 0 ? (
        <p>No Transaction exists</p>
      ) : (
        transcations.map((transaction) => (
          <div key={transaction.id}>
            {editId === transaction.id ? (
              <form onSubmit={(e) => handleUpdateTransaction(e, transaction.id)}>
                <select value={editAccountId} onChange={(e) => setEditAccountId(Number(e.target.value))}>
                  {accounts.map((account) => (
                    <option key={account.id} value={account.id}>{account.name}</option>
                  ))}
                </select>
                <select value={editCategoryId} onChange={(e) => setEditCategoryId(Number(e.target.value))}>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
                <select value={editType} onChange={e => setEditType(e.target.value as TransactionType)}>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
                <input type="number" value={editAmount} onChange={(e) => setEditAmount(Number(e.target.value))} />
                <textarea value={editDescription} onChange={e => setEditDescription(e.target.value)}></textarea>
                <input type="date" value={editTransactionDate} onChange={e => setEditTransactionDate(e.target.value)} />
                <input type="submit" value="Submit" />
                <button onClick={() => setEditId(null)}>Cancel</button>
              </form>
            ) : (
              <>
                <h1>{transaction.description}</h1>
                <p>{transaction.type}</p>
                <p>{transaction.account_name}</p>
                <p>{transaction.category_name}</p>
                <p>{transaction.amount}</p>
                <p>{new Date(transaction.transaction_date).toLocaleDateString()}</p>
                <button onClick={() => handleDelete(transaction.id)}>Delete</button>
                <button onClick={() => handleEdit(transaction)}>Edit</button>
              </>
            )}
          </div>
        )
        )
      )}

    </main>
  )
}
