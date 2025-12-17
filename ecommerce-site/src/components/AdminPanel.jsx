import { useState, useEffect } from "react";
import axios from "axios";

const AdminPanel = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
  });

  // Fetch products
  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/products");
      setProducts(Array.isArray(data) ? data : data.products || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      alert("Failed to fetch products");
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        console.log("No token found, orders will be empty");
        setOrders([]);
        setOrdersLoading(false);
        return;
      }
      const { data } = await axios.get("http://localhost:3000/orders", {
        headers: { Authorization: token },
      });
      const ordersList = data?.orders || [];
      // Ensure all orders have required fields
      const sanitizedOrders = ordersList.map(order => ({
        ...order,
        products: order.products || [],
        pricing: order.pricing || { total: 0 },
        status: order.status || "pending"
      }));
      setOrders(sanitizedOrders);
      setOrdersLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error?.response?.data || error.message);
      const msg = error?.response?.data?.error || error?.response?.data?.message || error.message;
      alert(`Failed to fetch orders: ${msg}`);
      setOrders([]);
      setOrdersLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      setUpdatingOrderId(orderId);
      const token = sessionStorage.getItem("token");
      await axios.put(`http://localhost:3000/orders/${orderId}/status`, { status }, {
        headers: { Authorization: token },
      });
      await fetchOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
      alert(error.response?.data?.error || "Failed to update order status");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product.id);
    setForm({
      name: product.name,
      price: product.price,
      description: product.description || "",
      image: product.image,
    });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem("token");
      await axios.put(
        `http://localhost:3000/products/${editingProduct}`,
        form,
        {
          headers: { Authorization: token },
        }
      );
      
      alert("Product updated successfully!");
      setEditingProduct(null);
      setForm({ name: "", price: "", description: "", image: "" });
      fetchProducts(); // Refresh the list
    } catch (error) {
      console.error("Error updating product:", error);
      alert(error.response?.data?.message || "Failed to update product");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const token = sessionStorage.getItem("token");
      await axios.delete(`http://localhost:3000/products/${id}`, {
        headers: { Authorization: token },
      });
      
      alert("Product deleted successfully!");
      fetchProducts(); // Refresh the list
    } catch (error) {
      console.error("Error deleting product:", error);
      alert(error.response?.data?.message || "Failed to delete product");
    }
  };

  const handleCancel = () => {
    setEditingProduct(null);
    setForm({ name: "", price: "", description: "", image: "" });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Admin Panel
        </h1>

        {/* Editing Form */}
        {editingProduct && (
          <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
            <h2 className="text-xl font-bold mb-4">Edit Product</h2>
            <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="name"
                placeholder="Product Name"
                value={form.name}
                onChange={handleChange}
                className="border p-2 rounded"
                required
              />
              <input
                name="price"
                placeholder="Price"
                value={form.price}
                onChange={handleChange}
                className="border p-2 rounded"
                type="number"
                required
              />
              <input
                name="image"
                placeholder="Image URL"
                value={form.image}
                onChange={handleChange}
                className="border p-2 rounded md:col-span-2"
                required
              />
              <textarea
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
                className="border p-2 rounded md:col-span-2"
                rows="3"
              />
              <div className="md:col-span-2 flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Orders Management */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-10">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-bold">Orders</h2>
            <button onClick={fetchOrders} className="text-sm px-3 py-1 border rounded hover:bg-gray-50">Refresh</button>
          </div>
          {ordersLoading ? (
            <div className="p-6">Loading orders…</div>
          ) : (
            <table className="w-full">
              <thead className="bg-indigo-600 text-white">
                <tr>
                  <th className="p-3 text-left">Order ID</th>
                  <th className="p-3 text-left">User</th>
                  <th className="p-3 text-left">Items</th>
                  <th className="p-3 text-left">Total</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-center">Update</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o._id} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-sm">{o._id}</td>
                    <td className="p-3 text-sm">{o.user?.email || o.user || "Unknown"}</td>
                    <td className="p-3 text-sm">{(o.products || []).reduce((sum, p) => sum + (p?.quantity || 0), 0)} items</td>
                    <td className="p-3 font-semibold text-indigo-600">₹{o.pricing?.total || 0}</td>
                    <td className="p-3 text-sm">{o.status || "pending"}</td>
                    <td className="p-3 text-center">
                      <select
                        className="border rounded px-2 py-1 text-sm"
                        value={o.status || "pending"}
                        onChange={(e) => updateOrderStatus(o._id, e.target.value)}
                        disabled={updatingOrderId === o._id}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      {updatingOrderId === o._id && (
                        <div className="text-xs text-gray-500 mt-1">Updating…</div>
                      )}
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr><td className="p-6" colSpan="6">No orders found</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="p-4 text-left">Image</th>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Price</th>
                <th className="p-4 text-left">Description</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id}
                  className={`border-b hover:bg-gray-50 ${
                    editingProduct === product.id ? "bg-blue-50" : ""
                  }`}
                >
                  <td className="p-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </td>
                  <td className="p-4 font-semibold">{product.name}</td>
                  <td className="p-4 text-indigo-600 font-bold">₹{product.price}</td>
                  <td className="p-4 text-sm text-gray-600">
                    {product.description?.substring(0, 50)}
                    {product.description?.length > 50 ? "..." : ""}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => handleEdit(product)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {products.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            No products found
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
