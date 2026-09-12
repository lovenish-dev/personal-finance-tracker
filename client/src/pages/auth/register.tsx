import { useState } from "react";
import { useAppDispatch } from "../../hooks/redux"
import { registerUser } from "../../api/auth.api";
import { setCredentials } from "../../store/slices/authSlice";
import { Link } from "react-router-dom";
import ButtonLoader from "../../components/ButtonLoader";
import { registerSchema } from "../../schema/auth.schema";
import { Toaster } from "react-hot-toast";
import { showErrorToast, showSuccessToast } from "../../utils/toast";
import { RiEyeCloseLine, RiEyeLine } from "@remixicon/react";

export default function Register() {
  const dispatch = useAppDispatch();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()

    const result = registerSchema.safeParse({ name, email, password, confirmPassword });

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
      const response = await registerUser({ name, email, password });
      dispatch(setCredentials(response.data));

      setTimeout(() => {
        window.location.href = "/login"
      }, 1500)

      showSuccessToast("User Registered, you can login now");
    } catch (err) {
      showErrorToast("Could not register user");
    } finally {
      setIsSubmitting(false)
    }
  }

  function togglePasswordVisibility(){
    setShowPassword(prev => !prev)
  }
  function toggleConfirmPasswordVisibility(){
    setShowConfirmPassword(prev => !prev)
  }
  return (
    <section className="flex min-h-screen items-center justify-center bg-gray-100 px-6">
      <Toaster />
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-sm">

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Create an account
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Start managing your finances today
          </p>
        </div>

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
            {formErrors.name && (
              <p className="mt-1 text-sm text-red-600">
                {formErrors.name}
              </p>
            )}
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
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="Enter your password"
              />
              <p className='text-gray-700 absolute top-2.5 right-2' onClick={togglePasswordVisibility}>{showPassword ? <RiEyeCloseLine /> : <RiEyeLine />}</p>
            </div>
            {formErrors.password && (
              <p className="mt-1 text-sm text-red-600">
                {formErrors.password}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirm-password"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>

            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="Confirm your password"
              />
              <p className='text-gray-700 absolute top-2.5 right-2' onClick={toggleConfirmPasswordVisibility}>{showConfirmPassword ? <RiEyeCloseLine /> : <RiEyeLine />}</p>
            </div>
            {formErrors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">
                {formErrors.confirmPassword}
              </p>
            )}
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
