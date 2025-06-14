import { useState } from 'react';
import { motion } from 'framer-motion';
import { AiOutlineDashboard } from 'react-icons/ai';
import { FiSettings }       from 'react-icons/fi';
import { IoMdStats }        from 'react-icons/io';
import { BiLogOut }         from 'react-icons/bi';
import { TbLayoutSidebarLeftCollapseFilled, TbLayoutSidebarLeftExpand } from 'react-icons/tb';

const menuItems = [
  { name: 'Ana Sayfa', icon: <AiOutlineDashboard />, link: '/' },
  { name: 'Ürünler', icon: <IoMdStats />, link: '/products' },
  { name: 'Ayarlar',  icon: <FiSettings />, link: '/settings' },
  { name: 'Çıkış Yap',    icon: <BiLogOut />, link: '/logout' }
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <motion.div
      animate={{ width: isOpen ? 270 : 60 }}
      transition={{ damping: 20 }}
      className="h-screen bg-gray-200 flex flex-col"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-10 py-3 w-10 self-end focus:outline-none text-2xl"
      >
        {isOpen ? <TbLayoutSidebarLeftCollapseFilled /> : <TbLayoutSidebarLeftExpand />}
      </button>

      <nav className="flex-1">
        {menuItems.map((item, idx) => (
          <motion.div
            key={idx}
            className="flex items-center bg-gray-400 rounded-e-lg my-2 cursor-pointer p-4 hover:bg-gray-500 transition-colors"
            whileHover={{ scale: 1.05 }}
            onClick={() => window.location.href = item.link}
          >
            <div className="text-xl">{item.icon}</div>
            {isOpen && <span className="ml-4">{item.name}</span>}
          </motion.div>
        ))}
      </nav>
    </motion.div>
  );
}
