import { Route, Routes } from 'react-router-dom'
import './index.css'
import Login from './pages/Auth/Login'
import RegisterUser from './pages/Auth/RegisterUser'

function App() {

  return (
    <>
      {/* Default Layout içerisinde bir yönlendirme yapılacak */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterUser />} />
      </Routes>
    </>
  )
}

export default App
