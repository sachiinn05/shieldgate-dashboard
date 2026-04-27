import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import API from "../services/api";

const ProtectedRoute = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await API.get("/api/stats/overview"); // protected route
        setIsAuth(true);
      } catch {
        setIsAuth(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuth === null) return null;

  return isAuth ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;