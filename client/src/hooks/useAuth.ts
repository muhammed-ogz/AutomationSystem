import { useEffect, useState } from "react";

/**
 * Kullanıcının auth durumunu ve companyId bilgisini döner.
 */
export interface AuthState {
  /** Kullanıcı yetkili mi? */
  isAuthenticated: boolean;
  /** Kullanıcının bağlı olduğu şirket ID’si */
  companyId: string | null;
}

/**
 * Auth durumunu sessionStorage üzerinden okuyan hook.
 * - Login sonrası sessionStorage’a companyId yazılır.
 * - Logout’ta temizlenir.
 * - Route’larda kontrol etmek için kullanılabilir.
 */
export const useAuth = (): AuthState => {
  const [companyId, setCompanyId] = useState<string | null>(
    sessionStorage.getItem("companyId")
  );

  useEffect(() => {
    /**
     * storage event, başka tablarda companyId değiştiğinde çalışır.
     */
    const handleStorage = () => {
      setCompanyId(sessionStorage.getItem("companyId"));
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  return {
    isAuthenticated: companyId !== null,
    companyId,
  };
};
