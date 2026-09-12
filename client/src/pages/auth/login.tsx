import React, { useState } from 'react'
import { useAppDispatch } from '../../hooks/redux'
import { loginUser } from '../../api/auth.api';
import { setCredentials } from '../../store/slices/authSlice';
import { Link } from 'react-router-dom';
import ButtonLoader from '../../components/ButtonLoader';
import { loginSchema } from '../../schema/auth.schema';
import { Toaster } from 'react-hot-toast';
import { showErrorToast, showSuccessToast } from '../../utils/toast';
import { RiEyeCloseLine, RiEyeLine } from '@remixicon/react';

export default function Login() {
    const dispatch = useAppDispatch();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [formErrors, setFormErrors] = useState<Record<string, string>>({})
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    function togglePasswordVisibility() {
        setShowPassword((prev) => !prev)
    }

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        const result = loginSchema.safeParse({
            email, password
        })

        if (!result.success) {
            const errors: Record<string, string> = {};

            for (const issue of result.error.issues) {
                const field = issue.path[0];

                if (typeof field === "string") {
                    errors[field] = issue.message;
                }
            }

            setFormErrors(errors);
            return;
        }

        setFormErrors({});

        try {
            setIsSubmitting(true)
            const response = await loginUser({ email, password })
            dispatch(setCredentials({
                user: response.data.user,
                token: response.data.token
            }));
            setTimeout(() => { window.location.href = "/dashboard" }, 1500)
            showSuccessToast("Logged in successfully")
        } catch (err) {
            showErrorToast("Login failed")
            console.log("Login Failed: ", err)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <section className="flex min-h-screen items-center justify-center bg-gray-100 px-6">
            <Toaster />
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
                        {formErrors.email && (
                            <p className="mt-1 text-sm text-red-600">
                                {formErrors.email}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Password
                        </label>

                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                placeholder="Enter your password"
                            />
                            <p className='text-gray-700 absolute top-2.5 right-2' onClick={togglePasswordVisibility}>{showPassword ? <RiEyeCloseLine /> : <RiEyeLine />  }</p>
                        </div>
                        {formErrors.password && (
                            <p className="mt-1 text-sm text-red-600">
                                {formErrors.password}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium flex justify-center text-white transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                        {isSubmitting ? <ButtonLoader /> : "Login"}
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
