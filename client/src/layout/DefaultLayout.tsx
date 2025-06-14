import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Sidebar from '../components/Sidebar'
import { useState, type ReactNode } from 'react'

const DefaultLayout:React.FC<{children : ReactNode}> = ({children}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  return (
    <>
        <div className="flex bg-black text-white flex-col min-h-screen">
          <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
          <div className="flex flex-1">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={()=> setIsSidebarOpen(!isSidebarOpen)}/>
            <div className="flex-1">
              {children}
            </div>
          </div>
          <Footer />
        </div>
    </>
  )
}

export default DefaultLayout