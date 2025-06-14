import { AiFillGithub, AiFillLinkedin, AiOutlineMail } from 'react-icons/ai'
import { FaDiscord } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="bg-gray-200 py-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* 1. Sistem Bilgileri */}
        <div>
          <h4 className="text-xl font-semibold mb-4">Otomasyon Sistemi</h4>
          <p className="text-sm leading-relaxed">
            Yüksek performans, güvenilir süreç yönetimi ve 7/24 izleme.
            Sunucularımız <span className="font-medium">uptime</span> rekoru kırıyor!
          </p>
        </div>

        {/* 2. Hızlı Linkler */}
        <div>
          <h4 className="text-xl font-semibold mb-4">Hızlı Linkler</h4>
          <ul className="space-y-2 text-sm">
            <li className="hover:underline cursor-pointer">Dashboard</li>
            <li className="hover:underline cursor-pointer">Raporlar</li>
            <li className="hover:underline cursor-pointer">Ayarlar</li>
            <li className="hover:underline cursor-pointer">Destek</li>
          </ul>
        </div>

        {/* 3. İletişim & Sosyal */}
        <div>
          <h4 className="text-xl font-semibold mb-4">Bize Ulaşın</h4>
          <div className="flex items-center space-x-4 text-2xl">
            <a href="mailto:destek@otomasyon.com" className="hover:text-white">
              <AiOutlineMail />
            </a>
            <a href="https://github.com/otomasyon" className="hover:text-white">
              <AiFillGithub />
            </a>
            <a href="https://linkedin.com/company/otomasyon" className="hover:text-white">
              <AiFillLinkedin />
            </a>
            <a href="https://discord.gg/otomasyon" className="hover:text-white">
              <FaDiscord />
            </a>
          </div>
        </div>
      </div>

      {/* Alt bilgi satırı */}
      <div className="mt-10 border-t border-gray-800 pt-6 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Otomasyon A.Ş. — Tüm hakları saklıdır.
      </div>
    </footer>
)
}
