import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux"
import { createCategory, getCategories, deleteCategory as deleteSingleCategory, updateCategory as updateSingleCategory } from "../../api/category.api";
import { addCategories, modifyCategory, removeCategory, setCategories, setError, setLoading } from "../../store/slices/categorySlice";
import type { CategoryType } from "../../types/category.types";

export default function Category() {
    const dispatch = useAppDispatch();
    const [name, setName] = useState("");
    const [editname, setEditName] = useState("");
    const [type, setType] = useState<CategoryType>("income")
    const [editType, setEditType] = useState<CategoryType>("income")
    const [editId, setEditId] = useState<number | null>(0)

    const { categories, error, loading } = useAppSelector(state => state.category);

    useEffect(() => {
        async function fetchCategories() {
            try {
                dispatch(setLoading(true))
                const response = await getCategories();
                dispatch(setCategories(response.data))
            } catch (err) {
                dispatch(setError("Failed to fetch categories"))
            } finally {
                dispatch(setLoading(false));
            }
        }
        fetchCategories()

    }, [dispatch])

    async function handleCreateCategory(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault()
        try {
            const response = await createCategory({ name, type });
            dispatch(addCategories(response.data))
        } catch (err) {
            dispatch(setError("Couldn't fetch categories"))
        }
        console.log(categories)
    }

    async function handledeleteCategory(id: number) {
        try {
            const response = await deleteSingleCategory(id);
            dispatch(removeCategory(response.data.id))
        } catch (err) {
            dispatch(setError("Could not delete category"))
        }
    }


    async function handleUpdateCategory(e: React.SubmitEvent<HTMLFormElement>, id: number) {
        e.preventDefault();
        try {
            const response = await updateSingleCategory(id, { name: editname, type: editType });
            dispatch(modifyCategory(response.data))
            
            setEditName("")
            setEditId(null)
        } catch (err) {
            dispatch(setError("Could not update category"))
        }
    }

    if (loading) {
        return <>Loading....</>
    }

    return (
        <section>
            {error && <p>{error}</p>}
            <h1>Categories</h1>
            <form onSubmit={handleCreateCategory}>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                <select value={type} onChange={(e) => setType(e.target.value as CategoryType)}>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                </select>
                <input type="submit" value="Submit" />
            </form>
            {categories.length === 0 ? (
                <p>No categories Exists</p>
            ) : (
                categories.map((category) => (
                    <div key={category.id}>
                        {editId === category.id ? (
                            <form onSubmit={(e) => handleUpdateCategory(e, category.id)}>
                                <input type="text" id="name" value={editname} onChange={(e) => setEditName(e.target.value)} />
                                <select value={editType} onChange={(e) => setEditType(e.target.value as CategoryType)} >
                                    <option value="income">Income</option>
                                    <option value="expense">Expense</option>
                                </select>
                                <input type="submit" value="Submit" />
                                <button onClick={() => setEditId(null)}>Cancel</button>
                            </form>
                        ) : (
                            <>
                                <h2>{category.name}</h2>
                                <p>{category.type}</p>
                                <div className="dates" style={{ display: "flex", gap: "1em" }}>
                                    <p>{new Date(category.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</p>
                                    <p>{new Date(category.updated_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</p>
                                </div>
                                <button onClick={() => handledeleteCategory(category.id)}>Delete</button>
                                <button onClick={() => { setEditId(category.id); setEditName(category.name); setEditType(category.type) }}>Edit</button>
                            </>
                        )}
                    </div>
                ))
            )}
        </section>
    )
}
