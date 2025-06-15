import { FaHome, FaUserCircle } from "react-icons/fa"
import { HiDocumentReport } from "react-icons/hi"
import { IoIosNotifications } from "react-icons/io"
import { IoLogOut } from "react-icons/io5"

const Navbar = () => {
  return (
    <section id='navbar' className="border-b border-gray-800">
      <div className='flex py-4 px-10'>
        <h1 className='text-2xl'>Automation System</h1>
        <div className='ml-auto'>
        <ul className='flex space-x-2'>
          <li><a href='#' className='flex bg-gray-800 px-2 py-2 text-sm rounded-lg hover:bg-cyan-400'><FaHome className="mt-1 mr-2"/>Anasayfa</a></li>
          <li><a href='#' className='flex bg-gray-800 px-2 py-2 text-sm rounded-lg hover:bg-orange-400'><HiDocumentReport className="mt-1 mr-2"/>Raporlar</a></li>
          <li><a href='#' className='flex bg-gray-800 px-2 py-2 text-sm rounded-lg hover:bg-gray-400'><IoIosNotifications className="mt-1 mr-2"/>Bildirimler</a></li>
          <li><a href='#' className='flex bg-gray-800 px-2 py-2 text-sm rounded-lg hover:bg-yellow-400'><FaUserCircle className="mt-1 mr-2" />Profil</a></li>
          <li><a href='#' className='flex bg-gray-800 px-2 py-2 text-sm rounded-lg hover:bg-red-400'><IoLogOut className="mt-1 mr-2" />Çıkış yap</a></li>
        </ul>
        </div>
      </div>
    </section>
  )
}

export default Navbar