import { motion } from 'framer-motion';
import { AiOutlineDashboard } from 'react-icons/ai';
import { FiSettings }       from 'react-icons/fi';
import { IoMdStats }        from 'react-icons/io';
import { BiLogOut }         from 'react-icons/bi';

interface SidebarProps {
  isOpen?: boolean;
  toggleSidebar: () => void;
}

const menuItems = [
  { name: 'Ana Sayfa', icon: <AiOutlineDashboard />, link: '/' },
  { name: 'Ürünler', icon: <IoMdStats />, link: '/products' },
  { name: 'Ayarlar',  icon: <FiSettings />, link: '/settings' },
  { name: 'Çıkış Yap',    icon: <BiLogOut />, link: '/logout' }
];


export default function Sidebar({ isOpen }: SidebarProps) {

  return (
    <motion.div
      animate={{ width: isOpen ? 250 : 80 }}
      transition={{ damping: 20 }}
      className="h-screen border-r border-gray-800 bg-black text-white flex flex-col p-4"
    >
      {/* Menü Öğeleri */}
      <nav className="flex-1">
        {menuItems.map((item, idx) => (
          <motion.div
            key={idx}
            className={`flex items-center ${
              isOpen ? 'justify-start' : 'justify-center'
            } p-3 my-2 rounded-lg bg-gray-800 hover:bg-gray-600 transition-all cursor-pointer`}
            onClick={() => window.location.href = item.link}
          >
            <div className="text-xl">{item.icon}</div>
            {isOpen && <span className="ml-4 text-sm">{item.name}</span>}
          </motion.div>
        ))}
      </nav>
    </motion.div>
  );
}
