import React, { type ChangeEvent, useState } from "react";
import {
  FaCamera,
  FaCheckCircle,
  FaEnvelope,
  FaExclamationCircle,
  FaEye,
  FaEyeSlash,
  FaGlobe,
  FaSave,
  FaShieldAlt,
  FaUser,
} from "react-icons/fa";

interface FormData {
  companyName: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  taxNumber: string;
  sector: string;
  employeeCount: string;
}

interface Tab {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

type ActiveTab = "basic" | "contact" | "security";

const EditProfile: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    companyName: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    taxNumber: "",
    sector: "",
    employeeCount: "",
  });

  const [showSensitiveInfo, setShowSensitiveInfo] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>("basic");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [savedChanges, setSavedChanges] = useState<boolean>(false);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setIsEditing(true);
  };

  const handleSave = (): void => {
    setSavedChanges(true);
    setIsEditing(false);
    setTimeout(() => setSavedChanges(false), 3000);
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          setProfileImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const tabs: Tab[] = [
    { id: "basic", label: "Temel Bilgiler", icon: FaUser },
    { id: "contact", label: "İletişim", icon: FaEnvelope },
    { id: "security", label: "Güvenlik", icon: FaShieldAlt },
  ];

  const securityTips: string[] = [
    "Güçlü ve benzersiz şifreler kullanın",
    "İki faktörlü kimlik doğrulamayı etkinleştirin",
    "Düzenli olarak güvenlik güncellemelerini takip edin",
    "Şüpheli aktiviteleri hemen bildirin",
  ];

  const infoItems: Array<{ color: string; text: string }> = [
    {
      color: "bg-blue-500",
      text: "Profil bilgileriniz SSL ile şifrelenir ve güvenli sunucularda saklanır.",
    },
    {
      color: "bg-green-500",
      text: "Değişiklikler anında etkili olur ve tüm sistemlerde senkronize edilir.",
    },
    {
      color: "bg-yellow-500",
      text: "E-posta adresiniz değiştirildiğinde doğrulama maili gönderilir.",
    },
    {
      color: "bg-purple-500",
      text: "Güvenlik nedeniyle bazı işlemler ek doğrulama gerektirebilir.",
    },
  ];

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl p-10 bg-gray-950 mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Profil Yönetimi
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Firma bilgilerinizi güncelleyin ve güvenlik ayarlarınızı yönetin
          </p>
        </div>

        {/* Success Message */}
        {savedChanges && (
          <div className="mb-6 p-4 bg-green-900/30 border border-green-500/50 rounded-xl flex items-center gap-3 animate-fade-in">
            <FaCheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
            <span className="text-green-300">
              Değişiklikler başarıyla kaydedildi!
            </span>
          </div>
        )}

        {/* Profile Image Section */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative group">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaUser className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
                )}
              </div>
              <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <FaCamera className="w-6 h-6 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-semibold text-white mb-2">
                {formData.companyName || "Firma Adınız"}
              </h2>
              <p className="text-gray-400 mb-3">
                {formData.email || "email@firma.com"}
              </p>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-900/30 text-blue-300 border border-blue-500/30">
                Aktif Üye
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden">
          <div className="flex flex-col sm:flex-row">
            <div className="sm:w-1/4 bg-gray-900/50 p-2">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as ActiveTab)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-xl transition-all duration-200 ${
                        activeTab === tab.id
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                          : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                      }`}
                    >
                      <IconComponent className="w-5 h-5 flex-shrink-0" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="flex-1 p-6 sm:p-8">
              {activeTab === "basic" && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                    <FaUser className="w-6 h-6" />
                    Temel Bilgiler
                  </h3>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">
                        Firma Adı *
                      </label>
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        placeholder="Firma adınızı girin"
                        className="w-full p-3 bg-gray-700/50 rounded-xl border border-gray-600/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">
                        Vergi Numarası
                      </label>
                      <input
                        type="text"
                        name="taxNumber"
                        value={formData.taxNumber}
                        onChange={handleInputChange}
                        placeholder="Vergi numaranızı girin"
                        className="w-full p-3 bg-gray-700/50 rounded-xl border border-gray-600/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">
                      Adres
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Firma adresinizi girin"
                      rows={3}
                      className="w-full p-3 bg-gray-700/50 rounded-xl border border-gray-600/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    />
                  </div>
                </div>
              )}

              {activeTab === "contact" && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                    <FaEnvelope className="w-6 h-6" />
                    İletişim Bilgileri
                  </h3>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">
                        E-posta Adresi *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="E-posta adresinizi girin"
                        className="w-full p-3 bg-gray-700/50 rounded-xl border border-gray-600/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">
                        Telefon Numarası
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+90 555 123 45 67"
                        className="w-full p-3 bg-gray-700/50 rounded-xl border border-gray-600/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div className="space-y-2 lg:col-span-2">
                      <label className="text-sm font-medium text-gray-300">
                        Web Sitesi
                      </label>
                      <div className="relative">
                        <FaGlobe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="url"
                          name="website"
                          value={formData.website}
                          onChange={handleInputChange}
                          placeholder="https://www.firmaniz.com"
                          className="w-full pl-11 pr-3 py-3 bg-gray-700/50 rounded-xl border border-gray-600/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "security" && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                    <FaShieldAlt className="w-6 h-6" />
                    Güvenlik Bilgileri
                  </h3>

                  <div className="space-y-6">
                    <div className="p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-xl">
                      <div className="flex items-start gap-3">
                        <FaExclamationCircle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-yellow-300 font-medium mb-1">
                            Hassas Bilgiler
                          </h4>
                          <p className="text-yellow-200/80 text-sm">
                            Aşağıdaki bilgiler güvenlik amacıyla saklanmaktadır.
                            Bu bilgileri kimseyle paylaşmayın.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-300">
                          Bağlı IP Adresi
                        </label>
                        <button
                          onClick={() =>
                            setShowSensitiveInfo(!showSensitiveInfo)
                          }
                          className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          {showSensitiveInfo ? (
                            <>
                              <FaEyeSlash className="w-4 h-4" />
                              Gizle
                            </>
                          ) : (
                            <>
                              <FaEye className="w-4 h-4" />
                              Göster
                            </>
                          )}
                        </button>
                      </div>
                      <input
                        type="text"
                        value={
                          showSensitiveInfo ? "102.143.4.22" : "•••.•••.•.••"
                        }
                        disabled
                        className="w-full p-3 bg-gray-700/30 rounded-xl border border-gray-600/50 text-gray-400 cursor-not-allowed"
                      />
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-lg font-medium text-white">
                        Güvenlik Önerileri
                      </h4>
                      <div className="space-y-3">
                        {securityTips.map((tip, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 p-3 bg-gray-700/20 rounded-lg"
                          >
                            <FaCheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-300 text-sm">{tip}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="mt-8 pt-6 border-t border-gray-700/50">
                <button
                  onClick={handleSave}
                  disabled={!isEditing}
                  className={`w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-medium transition-all duration-200 ${
                    isEditing
                      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40"
                      : "bg-gray-700/50 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <FaSave className="w-5 h-5" />
                  Değişiklikleri Kaydet
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 p-6 bg-gray-800/30 rounded-2xl border border-gray-700/50 backdrop-blur-sm">
          <h4 className="text-lg font-medium text-white mb-4">
            Önemli Bilgiler
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-400">
            {infoItems.map((item, index) => (
              <div key={index} className="flex items-start gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${item.color} flex-shrink-0 mt-2`}
                ></div>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default EditProfile;
