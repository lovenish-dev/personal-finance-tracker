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
    const [editType, seteditType] = useState<AccountType | "">("bank")
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
            seteditType("")
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
            setType("")
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
        <section>
            {error && <p>{error}</p>}
            <h1>Accounts</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Account Name" />
                <select value={type} onChange={(e) => setType(e.target.value as AccountType)}>
                    <option value="bank">Bank</option>
                    <option value="cash">Cash</option>
                    <option value="credit card">Credit Card</option>
                </select>
                <input type="number" id="balance" value={balance} onChange={(e) => setBalance(+e.target.value)} placeholder="Balance" />
                <input type="submit" value="Submit" />
            </form>
            {accounts.length === 0 ? (
                <p>No accounts found.</p>
            ) : (
                accounts.map((account) => (
                    <div key={account.id}>
                        {editingId === account.id ? (
                            <form onSubmit={(e) => handleUpdateAccount(e, account.id)}>
                                <input type="text" name="accountName" id="accountName" value={editname} onChange={(e) => setEditName(e.target.value)} />
                                <select name="type" id="type" value={editType} onChange={(e) => seteditType(e.target.value as AccountType)}>
                                    <option value="bank">Bank</option>
                                    <option value="cash">Cash</option>
                                    <option value="credit card">Credit Card</option>
                                </select>
                                <button type="submit">Save</button>
                                <button onClick={() => setEditingId(null)}>Cancel</button>
                            </form>
                        ) : (
                            <>
                                <h2>{account.name}</h2>
                                <p>{account.type}</p>
                                <p>Balance: ₹{account.balance}</p>
                                <button onClick={()=>handleDeleteAccount(account.id)}>Delete</button>

                                <button
                                    onClick={() => {
                                        setEditingId(account.id);
                                        setEditName(account.name);
                                    }}
                                >
                                    Edit
                                </button>
                            </>
                        )}
                    </div>
                ))
            )}
        </section>
    )
}
