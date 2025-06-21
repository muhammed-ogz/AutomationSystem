import { Outlet, Route, Routes } from "react-router-dom";
import "./index.css";
import DefaultLayout from "./layout/DefaultLayout";
import Login from "./pages/Auth/Login";
import RegisterUser from "./pages/Auth/RegisterUser";
import Home from "./pages/Home/Home";
import AddProduct from "./pages/Product/AddProduct";
import EditProduct from "./pages/Product/EditProduct";
import ListProduct from "./pages/Product/ListProduct";
import EditProfile from "./pages/Profile/EditProfile";
import Profile from "./pages/Profile/Profile";
import Report from "./pages/Report/Report";
import Revenue from "./pages/Revenue/Revenue";
import Settings from "./pages/Settings/Settings";
import Statistics from "./pages/Statistics/Statistics";

// Layout wrapper component
const LayoutWrapper = () => {
  return (
    <DefaultLayout>
      <Outlet />
    </DefaultLayout>
  );
};

function App() {
  return (
    <Routes>
      {/* Login ve Register doğrudan render edilir */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<RegisterUser />} />

      {/* DefaultLayout içine sarılı rotalar */}
      <Route path="/" element={<LayoutWrapper />}>
        <Route index element={<Home />} />
        <Route path="products" element={<ListProduct />} />
        <Route path="products/edit/:id" element={<EditProduct />} />
        <Route path="products/add" element={<AddProduct />} />
        <Route path="statistics" element={<Statistics />} />
        <Route path="revenue" element={<Revenue />} />
        <Route path="settings" element={<Settings />} />
        <Route path="profile" element={<Profile />} />
        <Route path="account" element={<EditProfile />} />
        <Route path="report" element={<Report />} />
      </Route>
    </Routes>
  );
}

export default App;
