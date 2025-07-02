import "../assets/CSS/Register.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
    const navigate = useNavigate();
    const { login, token } = useAuth();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phnNumber, setPhnNumber] = useState("");
    const [thana, setThana] = useState("");
    const [district, setDistrict] = useState("");
    const [pass, setPass] = useState("");
    const [address, setAddress] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        // If already logged in, redirect to home
        if (token) {
            navigate("/");
        }
    }, [navigate, token]);

    async function sendRegInfo(e) {
        e.preventDefault();
        setError("");

        if (!name || !email || !phnNumber || !pass || !address || !thana || !district) {
            setError("All fields are required");
            return;
        }

        try {
            const regInfo = {
                Name: name,
                Email: email,
                Phone: phnNumber,
                Password: pass,
                Address: address + ", " + thana + ", " + district,
                UserType: ["affected"],
                Available: true,
                Community: [],
                CreationTime: new Date().toISOString()
            };

            const response = await fetch("http://localhost:5001/api/v1/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(regInfo)
            });

            const data = await response.json();

            if (response.ok) {
                // Try to automatically log in after successful registration
                const loginSuccess = await login({
                    Email: email,
                    Password: pass
                });

                if (loginSuccess) {
                    navigate("/");
                } else {
                    setError("Login failed after registration. Please try again.");
                }
            } else {
                setError(data.error || "Registration failed. Please try again.");
            }
        } catch (err) {
            console.error("Registration error:", err);
            setError("An error occurred during registration. Please try again.");
        }
    }

    return (
        <div class="RegForm">
            <div className="RegTitle">Fill Up The Form</div>
            <div className="RegName">
                <label>Name</label>
                <input 
                    type="text" 
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e)=>{setName(e.target.value);}}
                />
            </div>
            <div className="RegEmail">
                <label>Email</label>
                <input 
                    type="text" 
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e)=>{setEmail(e.target.value);}}
                />
            </div>
            <div className="RegPhoneNumber">
                <label>Phone number</label>
                <input 
                    type="text" 
                    placeholder="Enter your phone number"
                    value={phnNumber}
                    onChange={(e)=>{setPhnNumber(e.target.value);}}
                />
            </div>
            <div className="RegThana">
                <label>Thana</label>
                <input 
                    type="text" 
                    placeholder="Enter your thana"
                    value={thana}
                    onChange={(e)=>{setThana(e.target.value);}}
                />
            </div>
            <div className="RegDistrict">
                <label>District</label>
                <input 
                    type="text" 
                    placeholder="Enter your district"
                    value={district}
                    onChange={(e)=>{setDistrict(e.target.value);}}
                />
            </div>
            <div className="RegAddress">
                <label>Address</label>
                <input 
                    type="text" 
                    placeholder="Enter your address"
                    value={address}
                    onChange={(e)=>{setAddress(e.target.value);}}
                />
            </div>
            <div className="RegPassword">
                <label>Password</label>
                <input 
                    type="password" 
                    placeholder="Give a password"
                    value={pass}
                    onChange={(e)=>{setPass(e.target.value);}}        
                />
            </div>
            <div className="RegButton" onClick={sendRegInfo}>Register</div>
        </div>
    )
}

export default Register;