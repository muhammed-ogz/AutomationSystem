import type { JSX, ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";
import UnauthorizedEntry from "../pages/errors/UnauthorizedEntry";

interface RequireCompanyProps {
  children: ReactNode;
}

const RequireCompany = ({ children }: RequireCompanyProps): JSX.Element => {
  const { companyId } = useAuth();

  if (!companyId) {
    return <UnauthorizedEntry />;
  }

  return <>{children}</>;
};

export default RequireCompany;
