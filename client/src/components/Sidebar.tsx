import { motion } from "framer-motion";
import { useState } from "react";
import { AiOutlineDashboard } from "react-icons/ai";
import { BiLogOut } from "react-icons/bi";
import { FiSettings } from "react-icons/fi";
import { IoMdStats } from "react-icons/io";
import { MdOutlinePlaylistAdd } from "react-icons/md";

const menuItems = [
  { name: "Ana Sayfa", icon: <AiOutlineDashboard />, link: "/" },
  {
    name: "Stok Takibi",
    icon: <IoMdStats />,
    subItems: [
      { name: "Stokları Listele", link: "/products", icon: <IoMdStats /> },
      {
        name: "Stok Ekle",
        link: "/products/add",
        icon: <MdOutlinePlaylistAdd />,
      },
    ],
  },
  { name: "Ayarlar", icon: <FiSettings />, link: "/settings" },
  { name: "Çıkış Yap", icon: <BiLogOut />, link: "/logout" },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedItem, setExpandedItem] = useState(null);

  const toggleSubMenu = (idx: any) => {
    setExpandedItem(expandedItem === idx ? null : idx);
  };

  return (
    <div
      className="relative h-screen border-r border-gray-800 bg-black text-white flex flex-col p-4"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => {
        setIsOpen(false);
        setExpandedItem(null);
      }}
    >
      <motion.div
        animate={{ width: isOpen ? 250 : 80 }}
        transition={{ damping: 20 }}
      >
        {/* Menü Öğeleri */}
        <nav className="flex-1">
          {menuItems.map((item, idx) => (
            <div key={idx} className="mb-2">
              <motion.div
                className={`flex items-center ${
                  isOpen ? "justify-start" : "justify-center"
                } p-3 rounded-lg bg-gray-800 hover:bg-gray-600 transition-all cursor-pointer`}
                onClick={() =>
                  item.subItems
                    ? toggleSubMenu(idx)
                    : (window.location.href = item.link)
                }
              >
                <div className="text-xl">{item.icon}</div>
                {isOpen && <span className="ml-4 text-sm">{item.name}</span>}
              </motion.div>
              {/* Alt Menü */}
              {item.subItems && expandedItem === idx && isOpen && (
                <div className="ml-8 mt-2 flex flex-col gap-2">
                  {item.subItems.map((subItem, subIdx) => (
                    <button
                      key={subIdx}
                      className="text-sm flex items-center bg-gray-700 hover:bg-gray-500 transition-all cursor-pointer text-gray-300 hover:text-white p-2 rounded-lg"
                      onClick={() => (window.location.href = subItem.link)}
                    >
                      {subItem.icon}
                      <span className="ml-2 text-sm">{subItem.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </motion.div>
    </div>
  );
}
