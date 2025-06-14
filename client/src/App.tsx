import { Route, Routes } from 'react-router-dom'
import './index.css'
import Login from './pages/Auth/Login'
import RegisterUser from './pages/Auth/RegisterUser'
import DefaultLayout from './layout/DefaultLayout'
import Home from './pages/Home/Home'
import ListProduct from './pages/Home/Product/ListProduct'

function App() {

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterUser />} />
      </Routes>
      <DefaultLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<RegisterUser />} />
          <Route path="/products" element={<ListProduct />} />
        </Routes>
      </DefaultLayout>
    </>
  )
}

export default App
