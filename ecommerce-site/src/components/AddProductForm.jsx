import { useState } from "react";
import axios from "axios";

const AddProductForm = () => {
  const [form, setForm] = useState({
    name: "",
    image: "",
    price: "",
    description: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post("http://localhost:3000/products", {
        name: form.name,
        price: form.price,
        description: form.description,
        image: form.image,
      });

      setForm({
        name: "",
        image: "",
        price: "",
        description: "",
      });

      alert(data.message || "Product added successfully!");
    } catch (error) {
      alert("Error adding product: " + (error.message || error));
    }
  };

    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow mt-10">
            <h2 className="text-lg font-bold mb-4 text-center">Add Product</h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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

                <textarea
                    name="description"
                    placeholder="Product Description"
                    value={form.description}
                    onChange={handleChange}
                    className="border p-2 rounded"
                    rows="3"
                />

                <input
                    name="image"
                    placeholder="Image URL"
                    value={form.image}
                    onChange={handleChange}
                    className="border p-2 rounded"
                    required
                />

                <button
                    type="submit"
                    className="bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                    Add Product
                </button>
            </form>
        </div>
    );
};

export default AddProductForm;
