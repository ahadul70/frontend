import React from "react";
import { Navigate, useLocation } from "react-router";
import useAuth from "../Context/useAuth";


export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation();

  if (loading) {
    return <span className="loading loading-bars loading-xl"></span>;
  }

  if (user) {
    return children;
  }

  // Pass the attempted path as `from` in state
  return <Navigate to="/auth/login" state={{ from: location.pathname }} replace />;
}
