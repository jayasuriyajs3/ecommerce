import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const savedProducts = sessionStorage.getItem("products");
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      const defaultProducts = [
        { id: 1, name: "Premium Shoes", image: "src/images/pro4.jpg", price: "2499", quantity: 0 },
        { id: 2, name: "Comfy Sneakers", image: "src/images/pro3.jpg", price: "1999", quantity: 0 },
        { id: 3, name: "Running Shoes", image: "src/images/pro2.jpg", price: "1499", quantity: 0 },
      ];
      setProducts(defaultProducts);
      sessionStorage.setItem("products", JSON.stringify(defaultProducts));
    }
  }, []);

  const goToProducts = () => {
    navigate("/products");
  };

  const topThree = products.slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg">
            Welcome to Havox
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-100">
            Unleash your shopping potential with premium footwear
          </p>
          <button
            onClick={goToProducts}
            className="bg-white text-indigo-600 px-8 py-4 rounded-full text-lg font-semibold shadow-2xl hover:shadow-xl hover:scale-105 transform transition-all duration-300"
          >
            Shop Now →
          </button>
        </div>
      </div>

      {/* Featured Products Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-3">Featured Collection</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-600 to-pink-600 mx-auto rounded-full"></div>
          <p className="text-gray-600 mt-4 text-lg">Handpicked premium shoes just for you</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {topThree.map((item, index) => (
            <div
              key={item.id}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden"
            >
              <div className="relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  New
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{item.name}</h3>
                <p className="text-gray-600 mb-4">Premium Quality</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-indigo-600">₹{item.price}</span>
                  <button
                    onClick={goToProducts}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-300"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16 px-4 mt-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Step Up Your Style?
          </h2>
          <p className="text-xl mb-8 text-gray-100">
            Explore our full collection and find your perfect pair
          </p>
          <button
            onClick={goToProducts}
            className="bg-white text-indigo-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 shadow-xl"
          >
            Browse All Products
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;



