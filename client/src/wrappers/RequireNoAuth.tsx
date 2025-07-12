import type { JSX, ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface RequireNoAuthProps {
  children: ReactNode;
}

const RequireNoAuth = ({ children }: RequireNoAuthProps): JSX.Element => {
  const token = sessionStorage.getItem("token");
  const companyId = sessionStorage.getItem("companyId");

  if (token && companyId) {
    // Giriş yapmışsa dashboarda gönder
    return <Navigate to="/dashboard" replace />;
  }

  // Yoksa çocukları renderla (login/register sayfası)
  return <>{children}</>;
};

export default RequireNoAuth;
