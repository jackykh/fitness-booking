import { Navigate, Outlet } from "react-router";

const ProtectedRoutes: React.FC<{ isLoggedIn: boolean }> = ({ isLoggedIn }) => {
  return isLoggedIn ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoutes;
