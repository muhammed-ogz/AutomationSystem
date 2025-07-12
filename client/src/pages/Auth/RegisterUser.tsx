import { useState } from "react";
import {
  AiFillCheckCircle,
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineLoading3Quarters,
} from "react-icons/ai";
import { BsMailbox } from "react-icons/bs";
import {
  FaBuilding,
  FaEnvelope,
  FaGlobe,
  FaKey,
  FaLock,
  FaMapMarkerAlt,
  FaPhone,
  FaUser,
} from "react-icons/fa";
import { MdLocationCity } from "react-icons/md";
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
  onFocus?: () => void; // onFocus özelliği eklendi
}

// InputField component moved outside of RegisterUser
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
  onFocus,
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
        onFocus={() => {
          setFocusedField(id);
          onFocus?.();
        }}
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

const RegisterUser: React.FC = () => {
  const [companyName, setCompanyName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [district, setDistrict] = useState<string>("");
  const [postalCode, setPostalCode] = useState<string>("");
  const [fullAddress, setFullAddress] = useState<string>("");
  const [taxNumber, setTaxNumber] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showPasswordConfirm, setShowPasswordConfirm] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [focusedField, setFocusedField] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (!companyName || !email || !password) {
      toast.error("Lütfen tüm alanları doldurun.");
      setIsLoading(false);
      return;
    }
    if (password.length < 6) {
      toast.error("Şifre en az 6 karakter olmalıdır.");
      setIsLoading(false);
      return;
    }
    if (password !== passwordConfirm) {
      toast.error("Şifreler eşleşmiyor.");
      setIsLoading(false);
      return;
    }
    const passwordRegex =
      /^(?=.*[a-zıöüşçğ])(?=.*[A-ZİÖÜŞÇĞ])(?=.*\d)(?=.*[!@#$%^&*\(\)\-_\+=\[\]{};:'",.<>?/])[a-zA-ZıİöÖüÜşŞçÇğĞ\d!@#$%^&*\(\)\-_\+=\[\]{};:'",.<>?/]{6,}$/;
    if (!passwordRegex.test(password)) {
      toast.error(
        "Şifre en az bir büyük harf, bir küçük harf, bir rakam ve bir özel karakter içermelidir."
      );
      setIsLoading(false);
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Geçersiz email formatı.");
      setIsLoading(false);
      return;
    }

    // FormData yerine JSON kullanın
    const requestData = {
      name: companyName,
      email: email,
      password: password,
      phone: phoneNumber,
      taxNumber: taxNumber,
      address: {
        country: country,
        city: city,
        district: district,
        postalCode: postalCode,
        fullAddress: fullAddress,
      },
    };

    console.log("Request Data:", requestData);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_SERVER}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.log("Kayıt hatası:", errorData);
        toast.error("Kayıt işlemi başarısız. : " + errorData.message);
        setIsLoading(false);
        return;
      }

      const data = await res.json();
      console.log("Kayıt başarılı:", data);
      if (res.ok) {
        toast.success("Kayıt başarılı! Giriş ekranına yönlendiriliyorsunuz...");
        setTimeout(() => {
          window.location.href = "/login"; // Başarılı kayıt sonrası yönlendirme
        }, 2000);
      }
      setIsLoading(false);

      // Form verilerini temizle
      setCompanyName("");
      setEmail("");
      setPassword("");
      setPasswordConfirm("");
      setCountry("");
      setCity("");
      setDistrict("");
      setPostalCode("");
      setFullAddress("");
      setTaxNumber("");
      setPhoneNumber("");
    } catch (error) {
      console.error("Kayıt işlemi sırasında bir hata oluştu:", error);
      toast.error("Kayıt işlemi sırasında bir hata oluştu.");
      setIsLoading(false);
    }
  };
  return (
    <section id="RegisterUser" className="flex min-h-screen">
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
            Kayıt Ol
          </h2>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div
              className="animate-slideInFromRight"
              style={{ animationDelay: "0.1s" }}
            >
              <InputField
                icon={FaBuilding}
                label="Firma Adı"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                id="companyName"
                placeholder="Firma adınızı girin"
                focusedField={focusedField}
                setFocusedField={setFocusedField}
              />
            </div>

            <div
              className="animate-slideInFromLeft"
              style={{ animationDelay: "0.2s" }}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                className="animate-slideInFromRight"
                style={{ animationDelay: "0.3s" }}
              >
                <InputField
                  icon={FaGlobe}
                  label="Ülke"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  id="country"
                  placeholder="Ülke adınızı girin"
                  focusedField={focusedField}
                  setFocusedField={setFocusedField}
                />
              </div>

              <div
                className="animate-slideInFromLeft"
                style={{ animationDelay: "0.4s" }}
              >
                <InputField
                  icon={MdLocationCity}
                  label="Şehir"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  id="city"
                  placeholder="Şehir adınızı girin"
                  focusedField={focusedField}
                  setFocusedField={setFocusedField}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                className="animate-slideInFromRight"
                style={{ animationDelay: "0.5s" }}
              >
                <InputField
                  icon={FaMapMarkerAlt}
                  label="İlçe"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  id="district"
                  placeholder="İlçe adınızı girin"
                  focusedField={focusedField}
                  setFocusedField={setFocusedField}
                />
              </div>

              <div
                className="animate-slideInFromLeft"
                style={{ animationDelay: "0.6s" }}
              >
                <InputField
                  icon={BsMailbox}
                  label="Posta Kodu"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  id="postalCode"
                  placeholder="Posta kodunuzu girin"
                  focusedField={focusedField}
                  setFocusedField={setFocusedField}
                />
              </div>
            </div>

            <div
              className="animate-slideInFromRight"
              style={{ animationDelay: "0.7s" }}
            >
              <InputField
                icon={FaMapMarkerAlt}
                label="Tam Adres"
                value={fullAddress}
                onChange={(e) => setFullAddress(e.target.value)}
                id="fullAddress"
                placeholder="Tam adresinizi girin"
                focusedField={focusedField}
                setFocusedField={setFocusedField}
              />
            </div>

            <div
              className="animate-slideInFromRight"
              style={{ animationDelay: "0.7s" }}
            >
              <InputField
                icon={FaMapMarkerAlt}
                label="Vergi Numarası"
                value={taxNumber}
                onChange={(e) => setTaxNumber(e.target.value)}
                id="taxNumber"
                placeholder="Vergi numaranızı girin"
                focusedField={focusedField}
                setFocusedField={setFocusedField}
              />
            </div>

            <div
              className="animate-slideInFromLeft"
              style={{ animationDelay: "0.8s" }}
            >
              <InputField
                icon={FaPhone}
                label="Telefon Numarası"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                id="phoneNumber"
                placeholder="İletişim numaranızı girin"
                focusedField={focusedField}
                setFocusedField={setFocusedField}
                onFocus={() => {
                  if (!phoneNumber.startsWith("+90")) {
                    setPhoneNumber("+90");
                  }
                }}
              />
            </div>

            <div
              className="animate-slideInFromRight"
              style={{ animationDelay: "0.9s" }}
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
              className="animate-slideInFromLeft"
              style={{ animationDelay: "1s" }}
            >
              <InputField
                icon={FaKey}
                label="Şifreyi Tekrar Girin"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                id="passwordConfirm"
                placeholder="Şifrenizi tekrar girin"
                showToggle={true}
                showValue={showPasswordConfirm}
                onToggleShow={() =>
                  setShowPasswordConfirm(!showPasswordConfirm)
                }
                focusedField={focusedField}
                setFocusedField={setFocusedField}
              />
            </div>

            <div
              className="animate-slideInFromBottom"
              style={{ animationDelay: "1.1s" }}
            >
              <button
                type="submit"
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
                    Kayıt Yapılıyor...
                  </>
                ) : (
                  <>
                    <AiFillCheckCircle className="animate-pulse text-xl group-hover:animate-bounce" />
                    Kayıt Ol
                  </>
                )}
                {/* Button shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </button>
            </div>
          </form>

          <div
            className="mt-6 text-center animate-fadeIn"
            style={{ animationDelay: "1.2s" }}
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

export default RegisterUser;
