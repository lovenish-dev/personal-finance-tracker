import { useState } from "react";
import { useAppDispatch } from "../../hooks/redux"
import { registerUser } from "../../api/auth.api";
import { setCredentials } from "../../store/slices/authSlice";
import { Link } from "react-router-dom";
import ButtonLoader from "../../components/ButtonLoader";

export default function Register() {
    const dispatch = useAppDispatch();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>){
        e.preventDefault()
        try{
            setIsSubmitting(true)
            if(password.trim() !== confirmPassword.trim()){ setError("Passwords do not match"); return}
            const response = await registerUser({name, email, password});
            dispatch(setCredentials(response.data));
            setTimeout(()=>{
              window.location.href= "/login"
            }, 1500)
        }catch(err){
            setError("Could not register user")
        } finally{
            setIsSubmitting(false)
        }
    }
return (
  <section className="flex min-h-screen items-center justify-center bg-gray-100 px-6">
    <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-sm">
      
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Create an account
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Start managing your finances today
        </p>
      </div>

      {error && (
        <p className="mb-5 rounded-md bg-red-100 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">

        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Name
          </label>

          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Email
          </label>

          <input
            type="email"
            id="email"
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
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            placeholder="Enter your password"
          />
        </div>

        <div>
          <label
            htmlFor="confirm-password"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Confirm Password
          </label>

          <input
            type="password"
            id="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            placeholder="Confirm your password"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-blue-600 px-4 py-2 flex justify-center cursor-pointer font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? <ButtonLoader /> : "Create Account"}
        </button>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:text-blue-700"
          >
            Login
          </Link>
        </p>

      </form>
    </div>
  </section>
);
}
