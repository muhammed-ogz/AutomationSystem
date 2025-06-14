import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Sidebar from '../components/Sidebar'
import type { ReactNode } from 'react'

const DefaultLayout:React.FC<{children : ReactNode}> = ({children}) => {
  return (
    <>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <div className="flex flex-1">
            <Sidebar />
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