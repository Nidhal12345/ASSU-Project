import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useEffect, useState } from "react";

interface PrivateRouteProps {
  allowedRoles?: string[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, role, isLoading, refreshAuth } = useAuth();
  const [retry, setRetry] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !retry) {
      refreshAuth().then(() => setRetry(true));
    }
  }, [isLoading, isAuthenticated, refreshAuth, retry]);

  if (isLoading || (!isAuthenticated && !retry)) {
    return <div>Chargement...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;