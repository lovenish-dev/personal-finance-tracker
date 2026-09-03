import React, { useState } from 'react'
import { useAppDispatch } from '../../hooks/redux'
import { loginUser } from '../../api/auth.api';
import { setCredentials } from '../../store/slices/authSlice';
import { Link } from 'react-router-dom';

export default function Login() {
    const dispatch = useAppDispatch();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        try {
            const response = await loginUser({ email, password })
            dispatch(setCredentials({
                user: response.data.user,
                token: response.data.token
            }));
            console.log("Login Successfully: ", response.data.user, response.data.token);
        } catch (err) {
            console.log("Login Failed: ", err)
        }
    }

    return (
        <section className="flex min-h-screen items-center justify-center bg-gray-100 px-6">
            <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-sm">

                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Welcome back
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        Sign in to manage your finances
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">

                    <div>
                        <label
                            htmlFor="email"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Email
                        </label>

                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Password
                        </label>

                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            placeholder="Enter your password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
                    >
                        Login
                    </button>
                    <p className="text-center text-sm text-gray-500">
                        New to the application?{" "}
                        <Link
                            to="/register"
                            className="font-medium text-blue-600 hover:text-blue-700"
                        >
                            Register
                        </Link>
                    </p>
                </form>
            </div>
        </section>
    );
}
