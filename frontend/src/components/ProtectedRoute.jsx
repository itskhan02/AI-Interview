import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const { userData } = useSelector((state) => state.user);

  const token = localStorage.getItem("token");

  if (!userData && !token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
