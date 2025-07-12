import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./index.css";

import DefaultLayout from "./layout/DefaultLayout";

// Pages
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
import NotFound from "./pages/errors/NotFound";

// Wrappers
import type { JSX } from "react";
import RequireCompany from "./wrappers/RequireCompany";
import RequireNoAuth from "./wrappers/RequireNoAuth";
import WithServerError from "./wrappers/WithServerError";

/**
 * DefaultLayout içinde Outlet ile child route'ları renderlar.
 */
const LayoutWrapper = (): JSX.Element => {
  return (
    <DefaultLayout>
      <Outlet />
    </DefaultLayout>
  );
};

/**
 * Uygulamanın ana bileşeni.
 */
const App = (): JSX.Element => {
  return (
    <>
      <ToastContainer />
      <Routes>
        {/* Login / Register */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route
          path="/login"
          element={
            <RequireNoAuth>
              <Login />
            </RequireNoAuth>
          }
        />
        <Route
          path="/register"
          element={
            <RequireNoAuth>
              <RegisterUser />
            </RequireNoAuth>
          }
        />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <RequireCompany>
              <LayoutWrapper />
            </RequireCompany>
          }
        >
          <Route index element={<Home />} />
          <Route path="products" element={<ListProduct />} />
          <Route path="products/edit/:id" element={<EditProduct />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="statistics" element={<Statistics />} />
          <Route
            path="revenue"
            element={
              <WithServerError>
                <Revenue />
              </WithServerError>
            }
          />
          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<Profile />} />
          <Route path="account" element={<EditProfile />} />
          <Route path="report" element={<Report />} />
        </Route>

        {/* Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
