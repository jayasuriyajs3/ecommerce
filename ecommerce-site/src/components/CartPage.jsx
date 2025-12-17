import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const navigate = useNavigate();

  // Form state for checkout
  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    phone: "",
  });

  const [billingAddress, setBillingAddress] = useState({
    fullName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    phone: "",
  });

  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("cod");

  // Fetch cart items from API
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const { data } = await axios.get("http://localhost:3000/cart", {
          headers: {
            Authorization: token,
          },
        });
        // New cart shape: { cart: { products: [{ product: {...}, quantity }] } } or array when formatted
        const serverCart = data.cart;
        let normalized = [];
        if (Array.isArray(serverCart)) {
          // Already formatted array of items
          normalized = serverCart.map(i => ({
            id: i.id || i.product?.id || i.product?._id,
            name: i.name || i.product?.name,
            price: i.price || i.product?.price,
            description: i.description || i.product?.description || "",
            image: i.image || i.product?.image || "",
            quantity: i.quantity || 1,
          }));
        } else if (serverCart?.products) {
          normalized = serverCart.products.map(item => ({
            id: item.product.id || item.product._id,
            name: item.product.name,
            price: item.product.price,
            description: item.product.description || "",
            image: item.product.image || "",
            quantity: item.quantity,
          }));
        }
        setCartItems(normalized);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cart:", error);
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const updateQuantityAPI = async (id, newQuantity) => {
    try {
      const token = sessionStorage.getItem("token");
      const { data } = await axios.put(`http://98.84.104.5:3000/cart/${id}`, {
        quantity: newQuantity,
      }, {
        headers: {
          Authorization: token,
        },
      });

      setCartItems(data.cart || []);
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  const increaseQty = (id) => {
    const item = cartItems.find((i) => i.id === id);
    if (item) {
      updateQuantityAPI(id, item.quantity + 1);
    }
  };

  const decreaseQty = (id) => {
    const item = cartItems.find((i) => i.id === id);
    if (item && item.quantity > 1) {
      updateQuantityAPI(id, item.quantity - 1);
    } else if (item && item.quantity === 1) {
      removeItem(id);
    }
  };

  const removeItem = async (id) => {
    try {
      const token = sessionStorage.getItem("token");
      const { data } = await axios.delete(`http://98.84.104.5:3000/cart/${id}`, {
        headers: {
          Authorization: token,
        },
      });
      setCartItems(data.cart || []);
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const subtotal = cartItems.reduce(
    (total, item) => total + parseInt(item.price) * item.quantity,
    0
  );
  const shipping = cartItems.length > 0 ? 49 : 0;
  const discount = 100;
  const total = subtotal + shipping - discount;

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    setShowCheckoutModal(true);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setOrderLoading(true);

    try {
      const token = sessionStorage.getItem("token");

      // Prepare order data
      const orderData = {
        products: cartItems.map(item => ({
          product: item.id,
          quantity: item.quantity,
        })),
        shippingAddress,
        billingAddress: sameAsShipping ? shippingAddress : billingAddress,
        pricing: {
          subtotal,
          shipping,
          discount,
          total,
        },
        paymentMethod,
      };

      // Create order
      const { data } = await axios.post("http://localhost:3000/orders", orderData, {
        headers: {
          Authorization: token,
        },
      });

      setOrderLoading(false);
      setShowCheckoutModal(false);
      alert("Order placed successfully! Order ID: " + data.order._id);
      
      // Clear cart items in UI
      setCartItems([]);
      
      // Navigate to orders page - orders will be fetched on mount
      navigate("/orders");
    } catch (error) {
      console.error("Error placing order:", error);
      setOrderLoading(false);
      alert("Failed to place order. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex gap-6 p-10 flex-1">
      
        <div className="w-2/3 bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-5">Your Cart</h2>

        {cartItems.length === 0 && (
          <p className="text-gray-500 text-center py-10">Your cart is empty</p>
        )}

        {cartItems.map((item) => (
          <div 
            key={item.id}
            className="flex justify-between items-center border-b py-4"
          >
            <img 
              src={item.image} 
              alt={item.name} 
              className="w-24 h-24 rounded-md" 
            />

            <div className="flex flex-col flex-1 ml-4">
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <p className="text-gray-600">₹{item.price}</p>

             
              <div className="flex items-center mt-2">
                <button 
                  className="px-3 py-1 bg-gray-300 rounded-l"
                  onClick={() => decreaseQty(item.id)}
                >
                  -
                </button>

                <span className="px-4 py-1 bg-gray-100">
                  {item.quantity}
                </span>

                <button 
                  className="px-3 py-1 bg-gray-300 rounded-r"
                  onClick={() => increaseQty(item.id)}
                >
                  +
                </button>
              </div>
            </div>

            
            <button 
              className="text-red-600 font-semibold hover:underline"
              onClick={() => removeItem(item.id)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      
      <div className="w-1/3 bg-white p-6 rounded-xl shadow h-fit">
        <h2 className="text-2xl font-bold mb-5">Order Summary</h2>

        <div className="flex justify-between py-2">
          <span>Subtotal</span>
          <span>₹{subtotal}</span>
        </div>

        <div className="flex justify-between py-2">
          <span>Shipping</span>
          <span>₹{shipping}</span>
        </div>

        <div className="flex justify-between py-2">
          <span>Discount</span>
          <span>-₹{discount}</span>
        </div>

        <hr className="my-3" />

        <div className="flex justify-between font-bold text-xl">
          <span>Total</span>
          <span>₹{total}</span>
        </div>

        <button 
          onClick={handleCheckout}
          className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition"
        >
          Proceed to Checkout
        </button>
      </div>

    </div>

    {/* Checkout Modal */}
    {showCheckoutModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
            <h2 className="text-2xl font-bold">Complete Your Order</h2>
            <button
              onClick={() => setShowCheckoutModal(false)}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          <form onSubmit={handlePlaceOrder} className="p-6">
            {/* Shipping Address */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">Shipping Address</h3>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={shippingAddress.fullName}
                  onChange={(e) => setShippingAddress({...shippingAddress, fullName: e.target.value})}
                  className="col-span-2 p-2 border rounded"
                  required
                />
                <input
                  type="text"
                  placeholder="Address Line 1"
                  value={shippingAddress.addressLine1}
                  onChange={(e) => setShippingAddress({...shippingAddress, addressLine1: e.target.value})}
                  className="col-span-2 p-2 border rounded"
                  required
                />
                <input
                  type="text"
                  placeholder="Address Line 2 (Optional)"
                  value={shippingAddress.addressLine2}
                  onChange={(e) => setShippingAddress({...shippingAddress, addressLine2: e.target.value})}
                  className="col-span-2 p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="City"
                  value={shippingAddress.city}
                  onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                  className="p-2 border rounded"
                  required
                />
                <input
                  type="text"
                  placeholder="State"
                  value={shippingAddress.state}
                  onChange={(e) => setShippingAddress({...shippingAddress, state: e.target.value})}
                  className="p-2 border rounded"
                  required
                />
                <input
                  type="text"
                  placeholder="Postal Code"
                  value={shippingAddress.postalCode}
                  onChange={(e) => setShippingAddress({...shippingAddress, postalCode: e.target.value})}
                  className="p-2 border rounded"
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={shippingAddress.phone}
                  onChange={(e) => setShippingAddress({...shippingAddress, phone: e.target.value})}
                  className="p-2 border rounded"
                  required
                />
              </div>
            </div>

            {/* Billing Address Checkbox */}
            <div className="mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={sameAsShipping}
                  onChange={(e) => setSameAsShipping(e.target.checked)}
                  className="mr-2"
                />
                <span>Billing address same as shipping address</span>
              </label>
            </div>

            {/* Billing Address (if different) */}
            {!sameAsShipping && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-4">Billing Address</h3>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={billingAddress.fullName}
                    onChange={(e) => setBillingAddress({...billingAddress, fullName: e.target.value})}
                    className="col-span-2 p-2 border rounded"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Address Line 1"
                    value={billingAddress.addressLine1}
                    onChange={(e) => setBillingAddress({...billingAddress, addressLine1: e.target.value})}
                    className="col-span-2 p-2 border rounded"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Address Line 2 (Optional)"
                    value={billingAddress.addressLine2}
                    onChange={(e) => setBillingAddress({...billingAddress, addressLine2: e.target.value})}
                    className="col-span-2 p-2 border rounded"
                  />
                  <input
                    type="text"
                    placeholder="City"
                    value={billingAddress.city}
                    onChange={(e) => setBillingAddress({...billingAddress, city: e.target.value})}
                    className="p-2 border rounded"
                    required
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={billingAddress.state}
                    onChange={(e) => setBillingAddress({...billingAddress, state: e.target.value})}
                    className="p-2 border rounded"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Postal Code"
                    value={billingAddress.postalCode}
                    onChange={(e) => setBillingAddress({...billingAddress, postalCode: e.target.value})}
                    className="p-2 border rounded"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={billingAddress.phone}
                    onChange={(e) => setBillingAddress({...billingAddress, phone: e.target.value})}
                    className="p-2 border rounded"
                    required
                  />
                </div>
              </div>
            )}

            {/* Payment Method */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">Payment Method</h3>
              <div className="space-y-2">
                <label className="flex items-center p-3 border rounded cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <span>Cash on Delivery (COD)</span>
                </label>
                <label className="flex items-center p-3 border rounded cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <span>Credit/Debit Card</span>
                </label>
                <label className="flex items-center p-3 border rounded cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="upi"
                    checked={paymentMethod === "upi"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <span>UPI</span>
                </label>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-semibold mb-3">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>₹{shipping}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount:</span>
                  <span>-₹{discount}</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span className="text-indigo-600">₹{total}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setShowCheckoutModal(false)}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={orderLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400"
                disabled={orderLoading}
              >
                {orderLoading ? "Processing..." : "Place Order"}
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
    </div>
  );
};

export default CartPage;
