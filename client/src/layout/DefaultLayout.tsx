import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Sidebar from '../components/Sidebar'
import type { ReactNode } from 'react'

const DefaultLayout:React.FC<{children : ReactNode}> = ({children}) => {
  return (
    <>
        <div>
            <Navbar/>
            <Sidebar/>
            <div>{children}</div>
            <Footer/>
        </div>
    </>
  )
}

export default DefaultLayout