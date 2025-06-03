import { Route, Routes } from 'react-router-dom'
import './index.css'
import Login from './pages/Auth/Login'

function App() {

  return (
    <>
      {/* Default Layout içerisinde bir yönlendirme yapılacak */}
      <Routes>
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  )
}

export default App
