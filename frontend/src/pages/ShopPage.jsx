import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Cards = () => {
    const { addToCart, cart, removeFromCart } = useCart();
    const navigate = useNavigate();
    const [cards, setCards] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [newProduct, setNewProduct] = useState({
        title: "",
        description: "",
        price: "",
        image: "",
    });

    useEffect(() => {
        fetchCards();
    }, []);

    const fetchCards = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/cards");
            setCards(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleChange = (e) => {
        setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/api/cards", newProduct);
            setCards([...cards, response.data]); // Update UI with new product
            setShowForm(false); // Close the form
            setNewProduct({ title: "", description: "", price: "", image: "" }); // Reset form fields
        } catch (error) {
            console.error("Error adding product:", error);
        }
    };

    const buyNow = (item) => {
        navigate(`/buy/${item._id}`, { state: { item } });
    };

    return (
        <div className="min-h-screen bg-gray-100 p-10">
            <h1 className="text-3xl font-bold text-center mb-6">Featured Products</h1>
            <div>
                <ul className="flex gap-5 p-2">
                    <li>Sort by</li>
                    <li>Popularity</li>
                    <li>Price - Low to High</li>
                    <li>Price - High to Low</li>
                    <li>Relevance</li>
                </ul>
            </div>
            <div className="flex justify-end">
                <button
                    className="mt-4 bg-green-400 text-white px-4 py-2 rounded-md"
                    onClick={() => setShowForm(true)}
                >
                    Add Product
                </button>
            </div>

            {/* Product Form Modal */}
            {showForm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                            <input
                                type="text"
                                name="title"
                                value={newProduct.title}
                                onChange={handleChange}
                                placeholder="Title"
                                className="border p-2 rounded-md"
                                required
                            />
                            <textarea
                                name="description"
                                value={newProduct.description}
                                onChange={handleChange}
                                placeholder="Description"
                                className="border p-2 rounded-md"
                                required
                            />
                            <input
                                type="number"
                                name="price"
                                value={newProduct.price}
                                onChange={handleChange}
                                placeholder="Price"
                                className="border p-2 rounded-md"
                                required
                            />
                            <input
                                type="text"
                                name="image"
                                value={newProduct.image}
                                onChange={handleChange}
                                placeholder="Image URL"
                                className="border p-2 rounded-md"
                                required
                            />
                            <div className="flex justify-between">
                                <button
                                    type="button"
                                    className="bg-gray-300 px-4 py-2 rounded-md"
                                    onClick={() => setShowForm(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {cards.map((card) => (
                    <div key={card._id} className="bg-white shadow-lg rounded-lg p-5 text-center flex flex-col justify-between items-center">
                        <img src={card.image} alt={card.title} className="w-full h-56 object-cover rounded-lg mb-4" />
                        <h2 className="text-xl font-semibold">{card.title}</h2>
                        <p className="text-gray-600">{card.description}</p>
                        <p className="text-lg font-bold mt-2">Rs. {card.price}</p>

                        <button
                            className="mt-4 bg-yellow-400 text-black px-4 py-2 rounded-lg hover:bg-yellow-500 transition"
                            onClick={() => buyNow(card)}
                        >
                            Buy Now
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Cards;
