import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";

import HomeLayout from "./components/HomeLayout.jsx";
import Home from "./components/Home.jsx";
import ProductList from "./components/ProductList.jsx";
import CartPage from "./components/CartPage.jsx";
import Orders from "./components/Orders.jsx";
import LoginForm from "./components/LoginForm.jsx";
import AddProductForm from "./components/AddProductForm.jsx";
import AdminPanel from "./components/AdminPanel.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { ToastContainer } from "react-toastify";

createRoot(document.getElementById("root")).render(
  <>
    <ToastContainer/>
    <BrowserRouter>
      <Routes>
        <Route element={<HomeLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/orders" element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          } />
          <Route path="/admin-panel" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminPanel />
            </ProtectedRoute>
          } />
        </Route>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/admin" element={
          <ProtectedRoute requireAdmin={true}>
            <div className="bg-gray-100 min-h-screen">
              <div className="max-w-5xl mx-auto p-6">
                <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
                <AddProductForm />
              </div>
            </div>
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  </>
);

