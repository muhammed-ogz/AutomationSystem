import { useState } from "react";
import { FaHome, FaUserCircle, FaBell, FaSearch, FaCog } from "react-icons/fa";
import { HiDocumentReport } from "react-icons/hi";
import { IoLogOut } from "react-icons/io5";
import { MdKeyboardArrowDown } from "react-icons/md";

const Navbar: React.FC = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // Örnek kullanıcı bilgileri
  const user = {
    name: "Ahmet Şahin",
    email: "ahmet.sahin@company.com",
    role: "Sistem Yöneticisi",
    avatar: "AS" 
  };
  
  const notifications = [
    { id: 1, message: "Yeni stok uyarısı", time: "5 dk önce", unread: true },
    { id: 2, message: "Rapor hazır", time: "15 dk önce", unread: true },
    { id: 3, message: "Sistem güncellemesi", time: "1 saat önce", unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <section id='navbar' className="bg-black border-b border-gray-600 shadow-lg">
      <div className='flex items-center justify-between py-3 px-6'>
        {/* Logo ve Başlık */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">AS</span>
          </div>
          <h1 className='text-xl font-semibold text-white'>Otomasyon Sistemi</h1>
        </div>

        {/* Arama Çubuğu */}
        <div className="hidden md:flex items-center bg-gray-800 rounded-lg px-3 py-2 w-96">
          <FaSearch className="text-gray-400 mr-3" />
          <input 
            type="text" 
            placeholder="Arama yapın..." 
            className="bg-transparent outline-none text-white placeholder-gray-400 w-full"
          />
        </div>

        {/* Sağ Taraf - Navigasyon ve Profil */}
        <div className='flex items-center space-x-4'>
          {/* Navigasyon Menüsü */}
          <nav className="hidden lg:flex space-x-2">
            <a href='/' className='flex items-center bg-gray-800 px-3 py-2 text-sm rounded-lg hover:bg-cyan-600 transition-colors duration-200 text-gray-300 hover:text-white'>
              <FaHome className="mr-2"/>Anasayfa
            </a>
          </nav>

          {/* Bildirimler */}
          <div className="relative">
            <button 
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="relative p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-200"
            >
              <FaBell className="text-gray-300 hover:text-white" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Bildirim Dropdown */}
            {isNotificationOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-50">
                <div className="p-4 border-b border-gray-700">
                  <h3 className="text-white font-semibold">Bildirimler</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div key={notification.id} className={`p-3 border-b border-gray-700 hover:bg-gray-700 ${notification.unread ? 'bg-gray-750' : ''}`}>
                      <p className={`text-sm ${notification.unread ? 'text-white' : 'text-gray-300'}`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                    </div>
                  ))}
                </div>
                <div className="p-3 text-center">
                  <button className="text-blue-400 hover:text-blue-300 text-sm">
                    Tümünü görüntüle
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Ayarlar */}
          <button 
          className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-200"
          onClick={() => (window.location.href = '/settings')}
          >
            <FaCog className="text-gray-300 hover:text-white" />
          </button>

          {/* Profil Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-3 bg-gray-800 px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">{user.avatar}</span>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-white text-sm font-medium">{user.name}</p>
                <p className="text-gray-400 text-xs">{user.role}</p>
              </div>
              <MdKeyboardArrowDown className={`text-gray-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Profil Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-50">
                <div className="p-4 border-b border-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">{user.avatar}</span>
                    </div>
                    <div>
                      <p className="text-white font-semibold">{user.name}</p>
                      <p className="text-gray-400 text-sm">{user.email}</p>
                      <p className="text-blue-400 text-xs">{user.role}</p>
                    </div>
                  </div>
                </div>
                
                <div className="py-2">
                  <a href="/profile" className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200">
                    <FaUserCircle className="mr-3" />
                    Profil Bilgileri
                  </a>
                  <a href="/account" className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200">
                    <FaCog className="mr-3" />
                    Hesap Ayarları
                  </a>
                  <hr className="border-gray-700 my-2" />
                  <a href="/logout" className="flex items-center px-4 py-2 text-red-400 hover:bg-gray-700 hover:text-red-300 transition-colors duration-200">
                    <IoLogOut className="mr-3" />
                    Çıkış Yap
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobil Navigasyon (İsteğe bağlı) */}
      <div className="lg:hidden px-6 pb-3">
        <div className="flex space-x-2">
          <a href='#' className='flex items-center bg-gray-800 px-3 py-2 text-sm rounded-lg hover:bg-cyan-600 transition-colors text-gray-300 hover:text-white'>
            <FaHome className="mr-2"/>Ana
          </a>
          <a href='#' className='flex items-center bg-gray-800 px-3 py-2 text-sm rounded-lg hover:bg-orange-600 transition-colors text-gray-300 hover:text-white'>
            <HiDocumentReport className="mr-2"/>Rapor
          </a>
        </div>
      </div>
    </section>
  );
};

export default Navbar;