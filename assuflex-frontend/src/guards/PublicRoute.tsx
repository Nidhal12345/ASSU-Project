import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

const PublicRoute = () => {
  const { isAuthenticated, isLoading, role } = useAuth();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const redirectParam = params.get("redirect");
  const quoteId = params.get("id");


  if (isLoading) {
    return <div>Chargement...</div>;
  }

if (isAuthenticated) {
    if (role === "ROLE_CLIENT" && redirectParam === "quote") {
      return <Navigate to={`/FileUpload/${quoteId}`} replace />;
    }
}
  if (isAuthenticated) {
    if (role === "ROLE_GESTIONNAIRE") {
      return <Navigate to="/gestionnaire" replace />;
    }
    if (role === "ROLE_CLIENT") {
      return <Navigate to="/client" replace />;
    }
    if (role === "ROLE_ADMIN") {
      return <Navigate to="/admin" replace />;
    }
    if (role === "ROLE_INTEGRATEUR") {
      return <Navigate to="/integrateur" replace />;
    }
  }

  return <Outlet />;
};

export default PublicRoute;