
import { Navigate, Outlet } from "react-router-dom";

export default function PublicRoute() {
  const token = sessionStorage.getItem("department_token");

  if (token) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
