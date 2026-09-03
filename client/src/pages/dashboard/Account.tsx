import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux"
import { addAccount, removeAccount, setAccount, setError, setLoading, updateAccount, } from "../../store/slices/accountSlice";
import { createAccount, deleteAccount, getAccounts, updateAccount as updateAccountApi } from "../../api/account.api";
import type { AccountType } from "../../types/account.types";

export default function Account() {
    const dispatch = useAppDispatch();

    const { accounts, error, loading } = useAppSelector((state) => state.account);

    const [name, setName] = useState("")
    const [type, setType] = useState<AccountType>("bank")
    const [balance, setBalance] = useState(0)
    const [editingId, setEditingId] = useState<number | null>(null)
    const [editType, seteditType] = useState<AccountType>("bank")
    const [editname, setEditName] = useState("")

    useEffect(() => {
        async function fetchAccounts() {
            try {
                dispatch(setLoading(true));
                const response = await getAccounts();
                dispatch(setAccount(response.data))
            } catch (err) {
                dispatch(setError("Failed to fetch accounts"))
            } finally {
                dispatch(setLoading(false))
            }
        }
        fetchAccounts()
    }, [dispatch])

    async function handleUpdateAccount(e: React.SubmitEvent<HTMLFormElement>, id: number) {
        e.preventDefault()
        try {
            const response = await updateAccountApi(id, { name: editname, type: editType })
            dispatch(updateAccount(response.data));

            setEditingId(null);
            setEditName("");
        } catch (err) {
            dispatch(setError("Failed to update Account"))
        }
    }

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        try {
            const response = await createAccount({ name, type, balance: Number(balance) })
            dispatch(addAccount(response.data));

            setName("")
            setBalance(0)
        } catch (err) {
            dispatch(setError("Failed to create account"))
        }
    }

    async function handleDeleteAccount(id: number){
        try{
            dispatch(setLoading(true))
            const response = await deleteAccount(id);
            dispatch(removeAccount(response.data.id))
        }catch(err){
            dispatch(setError("Failed to delete account"))
        }
    }

    if (loading) {
        return <p>Loading...</p>
    }


return (
    <section className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                    Accounts
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                    Manage your bank, cash and credit card accounts.
                </p>
            </div>

            {/* Error */}
            {error && (
                <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            {/* Add Account */}
            <div className="mb-10 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-5 text-lg font-semibold text-gray-900">
                    Add New Account
                </h2>

                <form
                    onSubmit={handleSubmit}
                    className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
                >
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Account Name"
                        className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />

                    <select
                        value={type}
                        onChange={(e) =>
                            setType(e.target.value as AccountType)
                        }
                        className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                        <option value="bank">Bank</option>
                        <option value="cash">Cash</option>
                        <option value="credit card">Credit Card</option>
                    </select>

                    <input
                        type="number"
                        id="balance"
                        value={balance}
                        onChange={(e) => setBalance(+e.target.value)}
                        placeholder="Balance"
                        className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />

                    <button
                        type="submit"
                        className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Add Account
                    </button>
                </form>
            </div>

            {/* Accounts */}
            <div>
                <h2 className="mb-4 text-xl font-semibold text-gray-900">
                    Your Accounts
                </h2>

                {accounts.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-gray-300 bg-white py-12 text-center">
                        <p className="text-gray-500">
                            No accounts found.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {accounts.map((account) => (
                            <div
                                key={account.id}
                                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                            >
                                {editingId === account.id ? (
                                    <form onSubmit={(e) => handleUpdateAccount(e, account.id)} className="space-y-4">
                                        <input
                                            type="text"
                                            name="accountName"
                                            id="accountName"
                                            value={editname}
                                            onChange={(e) =>
                                                setEditName(e.target.value)
                                            }
                                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        />

                                        <select
                                            name="type"
                                            id="type"
                                            value={editType}
                                            onChange={(e) =>
                                                seteditType(
                                                    e.target.value as AccountType
                                                )
                                            }
                                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        >
                                            <option value="bank">
                                                Bank
                                            </option>
                                            <option value="cash">
                                                Cash
                                            </option>
                                            <option value="credit card">
                                                Credit Card
                                            </option>
                                        </select>

                                        <div className="flex gap-2">
                                            <button
                                                type="submit"
                                                className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                                            >
                                                Save
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setEditingId(null)
                                                }
                                                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <>
                                        {/* Account Header */}
                                        <div className="mb-5 flex items-start justify-between">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {account.name}
                                                </h3>

                                                <span className="mt-1 inline-block rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium capitalize text-gray-600">
                                                    {account.type}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Balance */}
                                        <div className="mb-6">
                                            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                                Balance
                                            </p>

                                            <p className="mt-1 text-2xl font-bold text-gray-900">
                                                {new Intl.NumberFormat('en-US', {style: 'currency', currency:'INR' }).format(account.balance)}
                                            </p>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => {
                                                    setEditingId(account.id);
                                                    setEditName(account.name);
                                                    seteditType(account.type);
                                                }}
                                                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                onClick={() =>
                                                    handleDeleteAccount(
                                                        account.id
                                                    )
                                                }
                                                className="flex-1 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    </section>
)
}
