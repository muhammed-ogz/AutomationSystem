import { motion } from "framer-motion";
import { useState } from "react";
import { AiOutlineDashboard } from "react-icons/ai";
import { BiLogOut } from "react-icons/bi";
import { FiSettings } from "react-icons/fi";
import { IoMdStats } from "react-icons/io";
import { MdOutlinePlaylistAdd } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const menuItems = [
  { name: "Ana Sayfa", icon: <AiOutlineDashboard />, link: "/dashboard" },
  {
    name: "Stok Takibi",
    icon: <IoMdStats />,
    subItems: [
      {
        name: "Stokları Listele",
        link: "/dashboard/products",
        icon: <IoMdStats />,
      },
      {
        name: "Stok Ekle",
        link: "/dashboard/products/add",
        icon: <MdOutlinePlaylistAdd />,
      },
    ],
  },
  { name: "Ayarlar", icon: <FiSettings />, link: "/dashboard/settings" },
  { name: "Çıkış Yap", icon: <BiLogOut />, link: "/logout" },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedItem, setExpandedItem] = useState<number | null>(null);
  const navigate = useNavigate();

  const toggleSubMenu = (idx: number) => {
    setExpandedItem(expandedItem === idx ? null : idx);
  };

  const handleNavigation = (link: string) => {
    if (link === "/logout") {
      // Logout işlemi - buraya logout logic'i ekleyebilirsiniz
      console.log("Logout işlemi");
      navigate("/login");
    } else {
      navigate(link);
    }
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
                    : handleNavigation(item.link!)
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
                      onClick={() => handleNavigation(subItem.link)}
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
