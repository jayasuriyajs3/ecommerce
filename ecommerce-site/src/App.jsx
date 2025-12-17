// import { useEffect, useMemo, useState } from "react";
// import { Navigate, Route, Routes } from "react-router-dom";
// import Header from "./components/Header";
// import Footer from "./components/Footer";
// import ProductList from "./components/ProductList";
// import AddProductForm from "./components/AddProductForm";
// import CartPage from "./components/CartPage";
// import Orders from "./components/Orders";
// import LoginForm from "./components/LoginForm";
// import Home from "./components/Home";

// const App = () => {
//   const [products, setProducts] = useState(() => {
//     const savedProducts = sessionStorage.getItem("products");
//     if (savedProducts) {
//       return JSON.parse(savedProducts);
//     }

//     return [
//       {
//         id: 1,
//         name: "Premium Shoes",
//         image: "src/images/pro4.jpg",
//         price: "2499",
//         quantity: 0,
//       },
//       {
//         id: 2,
//         name: "Comfy Sneakers",
//         image: "src/images/pro3.jpg",
//         price: "1999",
//         quantity: 0,
//       },
//       {
//         id: 3,
//         name: "Running Shoes",
//         image: "src/images/pro2.jpg",
//         price: "1499",
//         quantity: 0,
//       },
//       {
//         id: 4,
//         name: "Trail Boots",
//         image: "src/images/pro1.jpg",
//         price: "2999",
//         quantity: 0,
//       },
//     ];
//   });

//   const [auth, setAuth] = useState(() => ({
//     isLoggedIn: sessionStorage.getItem("isLoggedIn") === "true",
//     role: sessionStorage.getItem("role") || "user",
//   }));

//   useEffect(() => {
//     sessionStorage.setItem("products", JSON.stringify(products));
//   }, [products]);

//   useEffect(() => {
//     sessionStorage.setItem("isLoggedIn", auth.isLoggedIn ? "true" : "false");
//     sessionStorage.setItem("role", auth.role);
//   }, [auth]);

//   const handleAddProduct = (newProduct) => {
//     setProducts((prev) => [...prev, newProduct]);
//   };

//   const updateProductQuantity = (productId, change) => {
//     setProducts((prev) =>
//       prev.map((product) => {
//         if (product.id !== productId) return product;

//         const currentQty = product.quantity || 0;
//         const nextQty = Math.max(0, currentQty + change);

//         return { ...product, quantity: nextQty };
//       })
//     );
//   };

//   const handleAddToCart = (productId) => {
//     updateProductQuantity(productId, 1);
//   };

//   const handleIncrement = (productId) => {
//     updateProductQuantity(productId, 1);
//   };

//   const handleDecrement = (productId) => {
//     updateProductQuantity(productId, -1);
//   };

//   const handleLogin = (role = "user") => {
//     setAuth({ isLoggedIn: true, role });
//   };

//   const featuredProducts = useMemo(() => products.slice(0, 3), [products]);

//   const ProtectedRoute = ({ children }) =>
//     auth.isLoggedIn ? children : <Navigate to="/login" replace />;

//   const AdminRoute = ({ children }) => {
//     if (!auth.isLoggedIn) return <Navigate to="/login" replace />;
//     if (auth.role !== "admin") return <Navigate to="/" replace />;
//     return children;
//   };

//   return (
//     <div className="bg-gray-100 min-h-screen flex flex-col">
//       <Header />

//       <main className="flex-1">
//         <Routes>
//           <Route
//             path="/"
//             element={<Home products={featuredProducts} />}
//           />

//           <Route
//             path="/products"
//             element={
//               <ProductList
//                 products={products}
//                 onAddToCart={handleAddToCart}
//                 onIncrement={handleIncrement}
//                 onDecrement={handleDecrement}
//               />
//             }
//           />

//           <Route
//             path="/cart"
//             element={
//               <CartPage
//                 products={products}
//                 onUpdateQuantity={updateProductQuantity}
//               />
//             }
//           />

//           <Route
//             path="/orders"
//             element={
//               <ProtectedRoute>
//                 <Orders />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/admin"
//             element={
//               <AdminRoute>
//                 <div className="max-w-5xl mx-auto p-6">
//                   <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
//                   <AddProductForm onAdd={handleAddProduct} />
//                 </div>
//               </AdminRoute>
//             }
//           />

//           <Route
//             path="/login"
//             element={<LoginForm onLogin={handleLogin} />}
//           />

//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
//       </main>

//       <Footer />
//     </div>
//   );
// };

// export default App;
