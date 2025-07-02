import "../assets/CSS/Login.css";
import {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { changeRole } from "../store/roleSlice";
import { useAuth } from "../context/AuthContext";

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { login, token } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // If already logged in, redirect to home
        if (token) {
            navigate("/");
        }
    }, [navigate, token]);

    async function sendLogInfo(e) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const success = await login({
                Email: email,
                Password: password
            });

            if (success) {
                navigate("/");
            }
        } catch (error) {
            setError("Invalid credentials. Please try again.");
            console.error("Login error:", error);
        }
    }

    return (
        <div className="login">
            <div className="loginTitle">login</div>
            <div><span>Email</span>
            <input 
                id="loginEmail" 
                type="email" 
                placeholder="Enter your email"
                value={email}
                onChange={(e)=>{setEmail(e.target.value);}}
            /></div>
            <div><span>password</span><input 
                id="loginPass" 
                type="password" 
                placeholder="Enter your password"
                value={password}
                onChange={(e)=>{setPassword(e.target.value);}}    
            /></div>
            <div className="loginButton"><button onClick={sendLogInfo}>Log In</button></div>
        </div>
    )
}

export default Login;