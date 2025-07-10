import { useState } from "react";
import {
  AiFillCheckCircle,
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineLoading3Quarters,
} from "react-icons/ai";
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import { toast } from "react-toastify";

interface InputFieldProps {
  icon: React.ComponentType<{ className?: string; size?: number }>;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  id: string;
  placeholder: string;
  showToggle?: boolean;
  showValue?: boolean;
  onToggleShow?: () => void;
  focusedField: string;
  setFocusedField: (field: string) => void;
}

// InputField component moved outside of Login
const InputField: React.FC<InputFieldProps> = ({
  icon: Icon,
  label,
  type = "text",
  value,
  onChange,
  id,
  placeholder,
  showToggle = false,
  showValue = false,
  onToggleShow,
  focusedField,
  setFocusedField,
}) => (
  <div className="group relative">
    <label
      className="block text-gray-700 mb-2 font-medium transition-all duration-300 group-hover:text-gray-800 transform group-hover:translate-x-1"
      htmlFor={id}
    >
      {label}
    </label>
    <div
      className={`
      flex items-center rounded-lg bg-gray-100 transition-all duration-300 shadow-sm px-4 py-3
      relative overflow-hidden
      ${
        focusedField === id
          ? "bg-gray-200 shadow-lg ring-2 ring-gray-300 scale-105"
          : "hover:bg-gray-200 hover:shadow-md hover:scale-102"
      }
      transform
    `}
    >
      <Icon
        className={`
        text-gray-400 mr-3 transition-all duration-300 text-lg
        ${
          focusedField === id
            ? "text-gray-600 transform scale-110 animate-pulse"
            : "group-hover:text-gray-500 group-hover:scale-105"
        }
      `}
      />
      <input
        type={showToggle ? (showValue ? "text" : "password") : type}
        value={value}
        onChange={onChange}
        onFocus={() => setFocusedField(id)}
        onBlur={() => setFocusedField("")}
        id={id}
        className="w-full outline-none bg-transparent placeholder-gray-400 text-gray-700 transition-all duration-200"
        placeholder={placeholder}
      />
      {showToggle && (
        <button
          type="button"
          onClick={onToggleShow}
          className="ml-2 text-gray-400 hover:text-gray-600 transition-all duration-200 transform hover:scale-110 active:scale-95"
        >
          {showValue ? (
            <AiOutlineEyeInvisible size={18} className="animate-bounce" />
          ) : (
            <AiOutlineEye size={18} className="hover:animate-pulse" />
          )}
        </button>
      )}
      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
    </div>
  </div>
);

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState("");

  const handleSubmit = async () => {
    setIsLoading(true);

    // Temel validasyonlar
    if (!email || !password) {
      toast.error("Lütfen tüm alanları doldurun.");
      setIsLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Geçersiz email formatı.");
      setIsLoading(false);
      return;
    }

    const requestData = {
      email: email.trim(),
      password: password.trim(),
    };

    try {
      console.log("Login attempt for:", email);

      const res = await fetch(`${import.meta.env.VITE_API_SERVER}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const responseData = await res.json();
      console.log("Login response:", responseData);
      console.log("Response keys:", Object.keys(responseData));
      console.log("Response data field:", responseData.data);
      console.log("Response data type:", typeof responseData.data);

      // HTTP durum kodlarına göre hata yönetimi
      if (res.status === 404) {
        toast.error("Firma bulunamadı. Lütfen e-mail adresinizi kontrol edin.");
        setIsLoading(false);
        return;
      }

      if (res.status === 401) {
        toast.error("Geçersiz şifre. Lütfen şifrenizi kontrol edin.");
        setIsLoading(false);
        return;
      }

      if (res.status === 400) {
        toast.error(responseData.message || "Geçersiz istek.");
        setIsLoading(false);
        return;
      }

      if (res.status === 500) {
        toast.error(responseData.message || "Sunucu hatası oluştu.");
        setIsLoading(false);
        return;
      }

      if (!res.ok) {
        const errorMessage =
          responseData.message || `HTTP Error: ${res.status}`;
        toast.error(errorMessage);
        console.error("Login failed with status:", res.status, responseData);
        setIsLoading(false);
        return;
      }

      // Başarılı giriş kontrolü
      if (res.status === 200 && responseData.success) {
        toast.success("Giriş başarılı!");

        // Backend'den gelen data objesi içindeki bilgileri al
        const { data } = responseData;
        const { token, companyId, name, dbName, avatar, redirectTo } = data;

        // Console'da bilgileri göster
        console.log("Login successful:", {
          token,
          companyId,
          name,
          dbName,
          redirectTo,
        });

        // SessionStorage'a kaydet
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("avatar", avatar);
        sessionStorage.setItem("companyId", companyId.toString());
        sessionStorage.setItem("companyName", name); // Firma adını kaydet
        sessionStorage.setItem("dbName", dbName);
        sessionStorage.setItem("email", email.trim());

        // Kullanıcıya firma adını göster
        toast.info(`${name} şirketi için giriş yapıldı`);

        // Yönlendirme
        setTimeout(() => {
          const redirectUrl = redirectTo || "/dashboard";
          console.log("Redirecting to:", redirectUrl);
          window.location.href = redirectUrl;
        }, 2000);
      } else {
        // Backend success: false döndü
        toast.error(responseData.message || "Giriş başarísız.");
        console.error("Login failed:", responseData);
      }
    } catch (error: any) {
      console.error("Giriş hatası:", error);

      // Network veya diğer hatalar için detaylı error handling
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        toast.error(
          "Sunucuya bağlanılamıyor. Lütfen sunucunun çalıştığından emin olun."
        );
      } else if (error.name === "SyntaxError") {
        toast.error("Sunucudan geçersiz yanıt alındı.");
      } else {
        toast.error("Giriş sırasında bir hata oluştu. Lütfen tekrar deneyin.");
      }

      // Geliştirme ortamında detaylı hata bilgisi
      if (process.env.NODE_ENV === "development") {
        console.error("Detailed error:", {
          name: error.name,
          message: error.message,
          stack: error.stack,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="login" className="flex min-h-screen">
      {/* Masaüstünde görünen, mobilde gizli sol bölge */}
      <div
        className="
          hidden md:block md:w-1/2
          bg-[url('/images/login/bg-login.png')]
          bg-cover bg-center relative
        "
      >
        {/* Overlay gradient for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
      </div>

      {/* Form alanı: Tam genişlik mobilde, yarı genişlik masaüstünde */}
      <div
        className="
          w-full md:w-1/2 flex flex-col items-center justify-center
          bg-[url('/images/login/bg-login.png')] bg-cover bg-center
          md:bg-gray-200 md:bg-none p-4 relative
        "
      >
        {/* Background overlay for mobile */}
        <div className="absolute inset-0 bg-black/30 md:hidden"></div>

        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 transform transition-all duration-500 hover:shadow-3xl relative z-10 animate-slideUp">
          {/* Header Section */}
          <div className="flex justify-center mb-8">
            <div className="text-center transform transition-all duration-300 hover:scale-105">
              <div className="text-3xl font-bold text-gray-600 mb-2 bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text animate-fadeIn">
                Automation System
              </div>
              <div className="h-1 w-16 bg-gradient-to-r from-gray-400 to-gray-600 mx-auto rounded-full animate-expandWidth"></div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center mb-8 flex items-center justify-center gap-3 text-gray-700 animate-slideInFromLeft">
            <FaUser className="text-gray-600 animate-bounce" />
            Giriş Yap
          </h2>

          <div className="space-y-6">
            {/* Form olarak çalışacak div */}
            <div
              className="animate-slideInFromRight"
              style={{ animationDelay: "0.1s" }}
            >
              <InputField
                icon={FaEnvelope}
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id="email"
                placeholder="Email adresinizi girin"
                focusedField={focusedField}
                setFocusedField={setFocusedField}
              />
            </div>

            <div
              className="animate-slideInFromLeft"
              style={{ animationDelay: "0.2s" }}
            >
              <InputField
                icon={FaLock}
                label="Şifre"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="password"
                placeholder="Şifrenizi girin"
                showToggle={true}
                showValue={showPassword}
                onToggleShow={() => setShowPassword(!showPassword)}
                focusedField={focusedField}
                setFocusedField={setFocusedField}
              />
            </div>

            <div
              className="animate-slideInFromBottom"
              style={{ animationDelay: "0.3s" }}
            >
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className={`
                  w-full bg-gray-600 text-white py-3 rounded-lg font-semibold
                  transition-all duration-300 flex items-center justify-center gap-3
                  transform hover:scale-105 hover:shadow-xl active:scale-95
                  ${
                    isLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "hover:bg-gray-700 hover:shadow-gray-600/25"
                  }
                  relative overflow-hidden group
                `}
              >
                {isLoading ? (
                  <>
                    <AiOutlineLoading3Quarters className="animate-spin text-xl" />
                    Giriş Yapılıyor...
                  </>
                ) : (
                  <>
                    <AiFillCheckCircle className="animate-pulse text-xl group-hover:animate-bounce" />
                    Giriş Yap
                  </>
                )}
                {/* Button shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </button>
            </div>
          </div>

          <div
            className="mt-6 text-center animate-fadeIn"
            style={{ animationDelay: "0.4s" }}
          >
            <a
              href="#"
              className="
                font-medium px-4 py-2 rounded-lg text-sm text-gray-600
                hover:text-gray-800 hover:bg-gray-100 transition-all duration-300
                transform hover:scale-105 inline-block relative overflow-hidden group
              "
            >
              <span className="relative z-10">Şifrenizi mi unuttunuz?</span>
              <div className="absolute inset-0 bg-gray-100 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </a>
          </div>
          <div
            className="text-center animate-fadeIn"
            style={{ animationDelay: "0.4s" }}
          >
            <a
              href="/register"
              className="
                font-medium px-4 py-2 rounded-lg text-sm text-gray-600
                hover:text-gray-800 hover:bg-gray-100 transition-all duration-300
                transform hover:scale-105 inline-block relative overflow-hidden group
              "
            >
              <span className="relative z-10">Kayıt Olun !</span>
              <div className="absolute inset-0 bg-gray-100 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </a>
          </div>
        </div>
      </div>

      {/* Custom CSS Animations */}
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(50px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideInFromLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInFromBottom {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes expandWidth {
          from {
            width: 0;
          }
          to {
            width: 4rem;
          }
        }

        .animate-slideUp {
          animation: slideUp 0.6s ease-out;
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out;
        }

        .animate-slideInFromLeft {
          animation: slideInFromLeft 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-slideInFromRight {
          animation: slideInFromRight 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-slideInFromBottom {
          animation: slideInFromBottom 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-expandWidth {
          animation: expandWidth 1s ease-out 0.5s forwards;
          width: 0;
        }

        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }
      `}</style>
    </section>
  );
};

export default Login;
