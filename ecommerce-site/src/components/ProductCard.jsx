const ProductCard = ({ name, image, price, quantity, onAddToCart, onIncrement, onDecrement }) => {
  const hasQuantity = quantity > 0;

  return (
    <div className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden h-full flex flex-col">
      {/* Image Container */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 h-64">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {hasQuantity && (
          <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
            In Cart: {quantity}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors">
          {name}
        </h3>

        <p className="text-gray-500 text-sm mb-3">Premium Quality Footwear</p>

        <div className="flex items-baseline gap-2 mb-6">
          <span className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            ₹{price}
          </span>
          <span className="text-gray-400 line-through text-sm">₹{parseInt(price) + 500}</span>
        </div>

        {/* Action Buttons */}
        <div className="mt-auto">
          {hasQuantity ? (
            <div className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
              <button
                onClick={onDecrement}
                className="bg-white text-gray-700 w-10 h-10 rounded-lg shadow-md hover:shadow-lg hover:bg-red-50 hover:text-red-600 transition-all duration-200 flex items-center justify-center font-bold"
              >
                −
              </button>
              <span className="font-bold text-xl text-gray-800">{quantity}</span>
              <button
                onClick={onIncrement}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white w-10 h-10 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center justify-center font-bold"
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={onAddToCart}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transform transition-all duration-300"
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
