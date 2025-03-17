import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
    const [privateKey, setPrivateKey] = useState("");
    const navigate = useNavigate();

    const handleLogin = () => {
        if (privateKey.length === 64) {
            localStorage.setItem("privateKey", privateKey);
            navigate("/"); // Chuyển hướng về trang chính
        } else {
            alert("Private Key không hợp lệ!");
        }
    };

    return (
        <div>
            <h2>Nhập Private Key</h2>
            <input 
                type="text" 
                value={privateKey} 
                onChange={(e) => setPrivateKey(e.target.value)} 
                placeholder="Nhập private key"
            />
            <button onClick={handleLogin}>Xác nhận</button>
        </div>
    );
}

export default Login;
