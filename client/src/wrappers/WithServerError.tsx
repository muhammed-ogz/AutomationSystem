import type { JSX, ReactNode } from "react";
import ServerError from "../pages/errors/ServerError";

interface WithServerErrorProps {
  children: ReactNode;
  hasServerError?: boolean; // opsiyonel prop, default false
}

/**
 * Server tarafı hata durumunda 500 sayfasını gösterir,
 * yoksa içindeki çocukları render eder.
 */
const WithServerError = ({
  children,
  hasServerError = false,
}: WithServerErrorProps): JSX.Element => {
  if (hasServerError) {
    return <ServerError />;
  }

  return <>{children}</>;
};

export default WithServerError;
