import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const apiKey = localStorage.getItem("apiKey");

  if (!apiKey) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;