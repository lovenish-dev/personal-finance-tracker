import React, { useState } from 'react'
import { useAppDispatch } from '../../hooks/redux'
import { loginUser } from '../../api/auth.api';
import { setCredentials } from '../../store/slices/authSlice';

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
        <section>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button type="submit">Login</button>
            </form>
        </section>
    )
}
