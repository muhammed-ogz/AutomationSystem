import React, { useState } from 'react';
import { 
  FaBell, 
  FaEnvelope, 
  FaSms, 
  FaMoon, 
  FaSun, 
  FaDesktop,
  FaWarehouse,
  FaCog,
  FaSave,
  FaCheck
} from 'react-icons/fa';
import type { IconType } from 'react-icons';

// Type Definitions
interface StockNotifications {
  sms: boolean;
  email: boolean;
  criticalLevel: number;
}

type NotificationFrequency = 'daily' | 'weekly' | 'monthly';
type Theme = 'light' | 'dark' | 'system';

interface SettingsState {
  stockNotifications: StockNotifications;
  notificationFrequency: NotificationFrequency;
  theme: Theme;
  emailAddress: string;
  phoneNumber: string;
  saved: boolean;
}

interface ToggleSwitchProps {
  isOn: boolean;
  onToggle: () => void;
  label: string;
  icon: IconType;
}

interface FrequencyCardProps {
  value: NotificationFrequency;
  label: string;
  isSelected: boolean;
  onClick: (value: NotificationFrequency) => void;
  icon: IconType;
}

interface ThemeCardProps {
  value: Theme;
  label: string;
  isSelected: boolean;
  onClick: (value: Theme) => void;
  icon: IconType;
}

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<SettingsState>({
    stockNotifications: {
      sms: true,
      email: false,
      criticalLevel: 10
    },
    notificationFrequency: 'daily',
    theme: 'dark',
    emailAddress: '',
    phoneNumber: '',
    saved: false
  });

  const handleStockNotificationToggle = (field: keyof StockNotifications): void => {
    setSettings(prev => ({
      ...prev,
      stockNotifications: {
        ...prev.stockNotifications,
        [field]: typeof prev.stockNotifications[field] === 'boolean' 
          ? !prev.stockNotifications[field] 
          : prev.stockNotifications[field]
      }
    }));
  };

  const handleCriticalLevelChange = (value: number): void => {
    setSettings(prev => ({
      ...prev,
      stockNotifications: {
        ...prev.stockNotifications,
        criticalLevel: value
      }
    }));
  };

  const handleNotificationFrequencyChange = (frequency: NotificationFrequency): void => {
    setSettings(prev => ({
      ...prev,
      notificationFrequency: frequency
    }));
  };

  const handleThemeChange = (theme: Theme): void => {
    setSettings(prev => ({
      ...prev,
      theme
    }));
  };

  const handleInputChange = (field: 'emailAddress' | 'phoneNumber', value: string): void => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = (): void => {
    setSettings(prev => ({ ...prev, saved: true }));
    setTimeout(() => {
      setSettings(prev => ({ ...prev, saved: false }));
    }, 2000);
  };

  const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ isOn, onToggle, label, icon: Icon }) => (
    <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-blue-500/30 transition-all duration-300 group">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-all duration-300">
          <Icon className="text-blue-400 text-lg" />
        </div>
        <span className="text-gray-300 font-medium">{label}</span>
      </div>
      <button
        onClick={onToggle}
        className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        style={{ backgroundColor: isOn ? '#3B82F6' : '#374151' }}
        type="button"
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
            isOn ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  const FrequencyCard: React.FC<FrequencyCardProps> = ({ value, label, isSelected, onClick, icon: Icon }) => (
    <button
      onClick={() => onClick(value)}
      className={`p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 transform ${
        isSelected
          ? 'border-blue-500 bg-blue-500/20 shadow-lg shadow-blue-500/25'
          : 'border-gray-700/50 bg-gray-800/30 hover:border-blue-500/50'
      }`}
      type="button"
    >
      <div className="flex flex-col items-center space-y-2">
        <Icon className={`text-2xl ${isSelected ? 'text-blue-400' : 'text-gray-400'}`} />
        <span className={`font-medium ${isSelected ? 'text-blue-300' : 'text-gray-300'}`}>
          {label}
        </span>
      </div>
    </button>
  );

  const ThemeCard: React.FC<ThemeCardProps> = ({ value, label, isSelected, onClick, icon: Icon }) => (
    <button
      onClick={() => onClick(value)}
      className={`p-6 rounded-xl border-2 transition-all duration-300 hover:scale-105 transform ${
        isSelected
          ? 'border-purple-500 bg-purple-500/20 shadow-lg shadow-purple-500/25'
          : 'border-gray-700/50 bg-gray-800/30 hover:border-purple-500/50'
      }`}
      type="button"
    >
      <div className="flex flex-col items-center space-y-3">
        <Icon className={`text-3xl ${isSelected ? 'text-purple-400' : 'text-gray-400'}`} />
        <span className={`font-medium ${isSelected ? 'text-purple-300' : 'text-gray-300'}`}>
          {label}
        </span>
      </div>
    </button>
  );

  return (
    <section id='settings' className="m-10">
      <div className="p-10 rounded-2xl text-gray-300 bg-gradient-to-br from-gray-950 to-gray-900 min-h-screen border border-gray-800/50">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center space-x-4 mb-8">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
              <FaCog className="text-white text-2xl" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Ayarlar
            </h1>
          </div>

          {/* Stok Bildirimleri */}
          <div className="mb-8 p-6 bg-gray-800/30 rounded-2xl border border-gray-700/50 backdrop-blur-sm">
            <div className="flex items-center space-x-3 mb-6">
              <FaWarehouse className="text-orange-400 text-xl" />
              <h2 className="text-2xl font-semibold text-gray-200">Stok Bildirimleri</h2>
            </div>
            
            <div className="space-y-4 mb-6">
              <ToggleSwitch
                isOn={settings.stockNotifications.sms}
                onToggle={() => handleStockNotificationToggle('sms')}
                label="SMS Bildirimi"
                icon={FaSms}
              />
              <ToggleSwitch
                isOn={settings.stockNotifications.email}
                onToggle={() => handleStockNotificationToggle('email')}
                label="E-posta Bildirimi"
                icon={FaEnvelope}
              />
            </div>

            <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
              <label htmlFor="criticalLevel" className="block text-sm font-medium text-gray-300 mb-2">
                Kritik Stok Seviyesi
              </label>
              <input
                id="criticalLevel"
                type="number"
                min="0"
                value={settings.stockNotifications.criticalLevel}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  handleCriticalLevelChange(parseInt(e.target.value) || 0)
                }
                className="w-full p-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                placeholder="Minimum stok adedi"
              />
            </div>
          </div>

          {/* Bildirim Tercihleri */}
          <div className="mb-8 p-6 bg-gray-800/30 rounded-2xl border border-gray-700/50 backdrop-blur-sm">
            <div className="flex items-center space-x-3 mb-6">
              <FaBell className="text-green-400 text-xl" />
              <h2 className="text-2xl font-semibold text-gray-200">Bildirim Sıklığı</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FrequencyCard
                value="daily"
                label="Günlük"
                isSelected={settings.notificationFrequency === 'daily'}
                onClick={handleNotificationFrequencyChange}
                icon={FaBell}
              />
              <FrequencyCard
                value="weekly"
                label="Haftalık"
                isSelected={settings.notificationFrequency === 'weekly'}
                onClick={handleNotificationFrequencyChange}
                icon={FaBell}
              />
              <FrequencyCard
                value="monthly"
                label="Aylık"
                isSelected={settings.notificationFrequency === 'monthly'}
                onClick={handleNotificationFrequencyChange}
                icon={FaBell}
              />
            </div>
          </div>

          {/* Tema Seçenekleri */}
          <div className="mb-8 p-6 bg-gray-800/30 rounded-2xl border border-gray-700/50 backdrop-blur-sm">
            <div className="flex items-center space-x-3 mb-6">
              <FaMoon className="text-purple-400 text-xl" />
              <h2 className="text-2xl font-semibold text-gray-200">Tema Seçenekleri</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ThemeCard
                value="light"
                label="Açık Tema"
                isSelected={settings.theme === 'light'}
                onClick={handleThemeChange}
                icon={FaSun}
              />
              <ThemeCard
                value="dark"
                label="Koyu Tema"
                isSelected={settings.theme === 'dark'}
                onClick={handleThemeChange}
                icon={FaMoon}
              />
              <ThemeCard
                value="system"
                label="Sistem"
                isSelected={settings.theme === 'system'}
                onClick={handleThemeChange}
                icon={FaDesktop}
              />
            </div>
          </div>

          {/* İletişim Bilgileri */}
          <div className="mb-8 p-6 bg-gray-800/30 rounded-2xl border border-gray-700/50 backdrop-blur-sm">
            <h2 className="text-2xl font-semibold text-gray-200 mb-6">İletişim Bilgileri</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="emailAddress" className="block text-sm font-medium text-gray-300 mb-2">
                  E-posta Adresi
                </label>
                <input
                  id="emailAddress"
                  type="email"
                  value={settings.emailAddress}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    handleInputChange('emailAddress', e.target.value)
                  }
                  className="w-full p-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                  placeholder="ornek@email.com"
                />
              </div>
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-300 mb-2">
                  Telefon Numarası
                </label>
                <input
                  id="phoneNumber"
                  type="tel"
                  value={settings.phoneNumber}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    handleInputChange('phoneNumber', e.target.value)
                  }
                  className="w-full p-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                  placeholder="+90 5XX XXX XX XX"
                />
              </div>
            </div>
          </div>

          {/* Kaydet Butonu */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className={`flex items-center space-x-3 px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                settings.saved
                  ? 'bg-green-500 text-white shadow-lg shadow-green-500/25'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/25'
              }`}
              type="button"
            >
              {settings.saved ? (
                <>
                  <FaCheck className="text-lg" />
                  <span>Kaydedildi!</span>
                </>
              ) : (
                <>
                  <FaSave className="text-lg" />
                  <span>Ayarları Kaydet</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Settings;