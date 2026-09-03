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
    <section className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                    Categories
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                    Organize your income and expenses into categories.
                </p>
            </div>

            {/* Error */}
            {error && (
                <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            {/* Create Category */}
            <div className="mb-10 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-5 text-lg font-semibold text-gray-900">
                    Create Category
                </h2>

                <form
                    onSubmit={handleCreateCategory}
                    className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                >
                    <div>
                        <label
                            htmlFor="categoryName"
                            className="mb-1.5 block text-sm font-medium text-gray-700"
                        >
                            Category Name
                        </label>

                        <input
                            type="text"
                            id="categoryName"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Food, Salary"
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="categoryType"
                            className="mb-1.5 block text-sm font-medium text-gray-700"
                        >
                            Type
                        </label>

                        <select
                            id="categoryType"
                            value={type}
                            onChange={(e) =>
                                setType(e.target.value as CategoryType)
                            }
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        >
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                        </select>
                    </div>

                    <div className="flex items-end">
                        <button
                            type="submit"
                            className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Add Category
                        </button>
                    </div>
                </form>
            </div>

            {/* Categories */}
            <div>
                <h2 className="mb-4 text-xl font-semibold text-gray-900">
                    Your Categories
                </h2>

                {categories.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-gray-300 bg-white py-12 text-center">
                        <p className="text-gray-500">
                            No categories exist.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {categories.map((category) => (
                            <div
                                key={category.id}
                                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                            >
                                {editId === category.id ? (
                                    /* Edit Category */
                                    <form
                                        onSubmit={(e) =>
                                            handleUpdateCategory(
                                                e,
                                                category.id
                                            )
                                        }
                                        className="space-y-4"
                                    >
                                        <div>
                                            <label
                                                htmlFor={`edit-name-${category.id}`}
                                                className="mb-1.5 block text-sm font-medium text-gray-700"
                                            >
                                                Category Name
                                            </label>

                                            <input
                                                type="text"
                                                id={`edit-name-${category.id}`}
                                                value={editname}
                                                onChange={(e) =>
                                                    setEditName(
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                            />
                                        </div>

                                        <div>
                                            <label
                                                htmlFor={`edit-type-${category.id}`}
                                                className="mb-1.5 block text-sm font-medium text-gray-700"
                                            >
                                                Type
                                            </label>

                                            <select
                                                id={`edit-type-${category.id}`}
                                                value={editType}
                                                onChange={(e) =>
                                                    setEditType(
                                                        e.target.value as CategoryType
                                                    )
                                                }
                                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                            >
                                                <option value="income">
                                                    Income
                                                </option>
                                                <option value="expense">
                                                    Expense
                                                </option>
                                            </select>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                type="submit"
                                                className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                                            >
                                                Save
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setEditId(null)
                                                }
                                                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <>
                                        {/* Category Info */}
                                        <div className="mb-6">
                                            <div className="flex items-start justify-between gap-3">
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {category.name}
                                                </h3>

                                                <span
                                                    className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                                                        category.type ===
                                                        "income"
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-red-100 text-red-700"
                                                    }`}
                                                >
                                                    {category.type}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Dates */}
                                        <div className="mb-6 space-y-2 rounded-lg bg-gray-50 p-3">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">
                                                    Created
                                                </span>

                                                <span className="font-medium text-gray-700">
                                                    {new Date(
                                                        category.created_at
                                                    ).toLocaleDateString(
                                                        "en-GB",
                                                        {
                                                            day: "numeric",
                                                            month: "short",
                                                            year: "numeric",
                                                        }
                                                    )}
                                                </span>
                                            </div>

                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">
                                                    Updated
                                                </span>

                                                <span className="font-medium text-gray-700">
                                                    {new Date(
                                                        category.updated_at
                                                    ).toLocaleDateString(
                                                        "en-GB",
                                                        {
                                                            day: "numeric",
                                                            month: "short",
                                                            year: "numeric",
                                                        }
                                                    )}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => {
                                                    setEditId(category.id);
                                                    setEditName(
                                                        category.name
                                                    );
                                                    setEditType(
                                                        category.type
                                                    );
                                                }}
                                                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                onClick={() =>
                                                    handledeleteCategory(
                                                        category.id
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
