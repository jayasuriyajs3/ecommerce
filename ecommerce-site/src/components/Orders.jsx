import { useState, useEffect } from "react";
import axios from "axios";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  // Lightweight JWT payload parser (no external deps)
  const getRoleFromToken = () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) return null;
      const parts = token.split(".");
      if (parts.length !== 3) return null;
      const payload = JSON.parse(atob(parts[1]));
      return payload?.role || null;
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const token = sessionStorage.getItem("token");
        console.log("Token from session storage:", token);
        const { data } = await axios.get("http://localhost:3000/orders", {
          headers: {
            Authorization: token,
          },
        });
        console.log("Orders fetched from API:", data.orders);
        setOrders(data.orders || []);
        const role = getRoleFromToken();
        setIsAdmin(role === "admin");
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId, status) => {
    try {
      setUpdatingId(orderId);
      const token = sessionStorage.getItem("token");
      await axios.put(`http://98.84.104.5:3000/orders/${orderId}/status`, { status }, {
        headers: { Authorization: token },
      });
      // Refresh orders after update
      const { data } = await axios.get("http://localhost:3000/orders", {
        headers: { Authorization: token },
      });
      setOrders(data.orders || []);
    } catch (error) {
      alert(error.response?.data?.error || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Your Order History</h1>

      {orders.length === 0 ? (
        <p className="text-lg text-gray-600">You have no orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-gray-100 px-6 py-4 border-b">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">Order ID: {order._id}</p>
                    <p className="text-lg font-semibold">
                      Date: {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-sm mt-1">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        order.status === "delivered" ? "bg-green-100 text-green-800" :
                        order.status === "shipped" ? "bg-blue-100 text-blue-800" :
                        order.status === "processing" ? "bg-yellow-100 text-yellow-800" :
                        order.status === "cancelled" ? "bg-red-100 text-red-800" :
                        "bg-gray-100 text-gray-800"
                      }`}>
                        {order.status.toUpperCase()}
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    {isAdmin && (
                      <div className="flex items-center gap-2">
                        <select
                          className="border rounded px-2 py-1 text-sm"
                          defaultValue={order.status}
                          onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                          disabled={updatingId === order._id}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        {updatingId === order._id && (
                          <span className="text-xs text-gray-500">Updating…</span>
                        )}
                      </div>
                    )}
                    <p className="text-2xl font-bold text-indigo-600">₹{order.pricing.total}</p>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left font-semibold text-sm">Product</th>
                      <th className="px-6 py-3 text-center font-semibold text-sm">Qty</th>
                      <th className="px-6 py-3 text-right font-semibold text-sm">Price</th>
                      <th className="px-6 py-3 text-right font-semibold text-sm">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.products.map((item, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <span className="font-semibold text-sm">{item.product.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center text-sm">{item.quantity}</td>
                        <td className="px-6 py-4 text-right text-sm">₹{item.price}</td>
                        <td className="px-6 py-4 text-right font-semibold text-sm">
                          ₹{item.price * item.quantity}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-gray-50 px-6 py-4 border-t">
                <div className="flex justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-sm mb-2">Shipping Address:</h3>
                    <p className="text-sm text-gray-600">{order.shippingAddress.fullName}</p>
                    <p className="text-sm text-gray-600">{order.shippingAddress.addressLine1}</p>
                    {order.shippingAddress.addressLine2 && (
                      <p className="text-sm text-gray-600">{order.shippingAddress.addressLine2}</p>
                    )}
                    <p className="text-sm text-gray-600">
                      {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}
                    </p>
                    <p className="text-sm text-gray-600">Phone: {order.shippingAddress.phone}</p>
                  </div>
                  <div className="flex gap-12">
                    <div>
                      <p className="text-gray-600 text-sm">Subtotal</p>
                      <p className="font-semibold">₹{order.pricing.subtotal}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Shipping</p>
                      <p className="font-semibold">₹{order.pricing.shipping}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Discount</p>
                      <p className="font-semibold">-₹{order.pricing.discount}</p>
                    </div>
                    <div className="border-l-2 border-gray-300 pl-4">
                      <p className="text-gray-600 text-sm">Total</p>
                      <p className="text-xl font-bold text-indigo-600">₹{order.pricing.total}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;