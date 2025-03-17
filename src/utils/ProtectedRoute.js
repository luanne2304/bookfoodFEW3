import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
    const privateKey = localStorage.getItem("privateKey");

    // Nếu chưa có privateKey, redirect về trang Login
    if (!privateKey) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />; // Cho phép truy cập route bên trong
};

export default ProtectedRoute;
