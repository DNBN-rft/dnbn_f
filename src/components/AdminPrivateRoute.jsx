import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const AdminPrivateRoute = ({ children }) => {
  const { isAdminAuthenticated, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminPrivateRoute;
