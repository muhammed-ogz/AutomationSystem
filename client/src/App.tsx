import { Route, Routes } from 'react-router-dom'
import './index.css'
import Login from './pages/Auth/Login'
import RegisterUser from './pages/Auth/RegisterUser'
import DefaultLayout from './layout/DefaultLayout'
import Home from './pages/Home/Home'

function App() {

  return (
    <>
      {/* Default Layout içerisinde bir yönlendirme yapılacak */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterUser />} />
      </Routes>
      <DefaultLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<RegisterUser />} />
        </Routes>
      </DefaultLayout>
    </>
  )
}

export default App
