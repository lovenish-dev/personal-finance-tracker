import { useState } from "react";
import { useAppDispatch } from "../../hooks/redux"
import { registerUser } from "../../api/auth.api";
import { setCredentials } from "../../store/slices/authSlice";
import { Link } from "react-router-dom";

export default function Register() {
    const dispatch = useAppDispatch();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>){
        e.preventDefault()
        try{
            setLoading(true)
            if(password.trim() !== confirmPassword.trim()){ setError("Passwords do not match"); return}
            const response = await registerUser({name, email, password});
            dispatch(setCredentials(response.data));
            setTimeout(()=>{
              window.location.href= "/login"
            }, 1500)
        }catch(err){
            setError("Could not register user")
        } finally{
            setLoading(false)
        }
    }
  return (
    <>
        <h1>Register</h1>
        {error && <p>{error}</p>}
        <form onSubmit={handleSubmit}>
            <input type="text" id="name" value={name} onChange={e => setName(e.target.value)}/> <br />
            <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)}/> <br />
            <input type="text" id="password"  value={password} onChange={e => setPassword(e.target.value)}/> <br />
            <input type="text" id="confirm-password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} /> <br />
            <button type="submit" disabled={loading} >Submit</button>

            <Link to="/login">Login</Link>
        </form>
    </>
  )
}
