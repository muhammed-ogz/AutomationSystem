import { Route, Routes } from "react-router-dom";
import "./index.css";
import DefaultLayout from "./layout/DefaultLayout";
import Login from "./pages/Auth/Login";
import RegisterUser from "./pages/Auth/RegisterUser";
import Home from "./pages/Home/Home";
import AddProduct from "./pages/Product/AddProduct";
import EditProduct from "./pages/Product/EditProduct";
import ListProduct from "./pages/Product/ListProduct";
import Statistics from "./pages/Statistics/Statistics";

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
          <Route path="/products/edit/:id" element={<EditProduct />} />
          <Route path="/products/add" element={<AddProduct />} />
          <Route path="/statistics" element={<Statistics />} />
        </Routes>
      </DefaultLayout>
    </>
  );
}

export default App;
