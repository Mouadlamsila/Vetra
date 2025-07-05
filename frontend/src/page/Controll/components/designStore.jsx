import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Settings, Palette, Package, Save } from "lucide-react";

export default function DesignStore() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("general");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [store, setStore] = useState(null);
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        status: "active",
        bannerImage: "",
        primaryColor: "#6D28D9",
        font: "Inter",
        visibleProducts: []
    });

    useEffect(() => {
        const fetchStoreData = async () => {
            try {
                const response = await axios.get(`https://stylish-basket-710b77de8f.strapiapp.com/api/boutiques/${id}`);
                const storeData = response.data.data;
                
                if (!storeData) {
                    throw new Error("Store data not found");
                }

                setStore(storeData);
                setFormData(prev => ({
                    ...prev,
                    name: storeData.nom || "",
                    description: storeData.description || "",
                    status: storeData.statusBoutique || "active",
                    bannerImage: storeData.bannerImage || "",
                    primaryColor: storeData.primaryColor || "#6D28D9",
                    font: storeData.font || "Inter"
                }));

                // Fetch products
                const productsResponse = await axios.get(
                    `https://stylish-basket-710b77de8f.strapiapp.com/api/products?filters[boutique][documentId][$eq]=${id}`
                );
                setProducts(productsResponse.data.data || []);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching store data:", error);
                setError(error.message);
                setLoading(false);
            }
        };

        if (id) {
            fetchStoreData();
        }
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleProductToggle = (productId) => {
        setFormData(prev => ({
            ...prev,
            visibleProducts: prev.visibleProducts.includes(productId)
                ? prev.visibleProducts.filter(id => id !== productId)
                : [...prev.visibleProducts, productId]
        }));
    };

    const handleSave = async () => {
        try {
            await axios.put(`https://stylish-basket-710b77de8f.strapiapp.com/api/boutiques/${id}`, {
                data: {
                    nom: formData.name,
                    description: formData.description,
                    statusBoutique: formData.status,
                    bannerImage: formData.bannerImage,
                    primaryColor: formData.primaryColor,
                    font: formData.font,
                    visibleProducts: formData.visibleProducts
                }
            });
            // Show success message or redirect
        } catch (error) {
            console.error("Error saving store data:", error);
            setError(error.message);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6D28D9]"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 text-center">
                <div className="bg-red-50 text-red-700 p-4 rounded-md">
                    {error}
                </div>
                <button 
                    onClick={() => navigate('/controll/stores')}
                    className="mt-4 px-4 py-2 bg-[#6D28D9] text-white rounded-lg hover:bg-[#6D28D9]/90 transition-colors"
                >
                    Back to Stores
                </button>
            </div>
        );
    }

    if (!store) {
        return (
            <div className="p-6 text-center">
                <div className="bg-yellow-50 text-yellow-700 p-4 rounded-md">
                    Store not found
                </div>
                <button 
                    onClick={() => navigate('/controll/stores')}
                    className="mt-4 px-4 py-2 bg-[#6D28D9] text-white rounded-lg hover:bg-[#6D28D9]/90 transition-colors"
                >
                    Back to Stores
                </button>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar Navigation */}
            <div className="w-64 bg-white border-r border-gray-200 p-4">
                <h2 className="text-xl font-bold mb-6 text-gray-800">Store Design</h2>
                <nav className="space-y-2">
                    <button
                        onClick={() => setActiveTab("general")}
                        className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                            activeTab === "general" ? "bg-[#6D28D9] text-white" : "text-gray-600 hover:bg-gray-100"
                        }`}
                    >
                        <Settings size={20} />
                        General Settings
                    </button>
                    <button
                        onClick={() => setActiveTab("design")}
                        className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                            activeTab === "design" ? "bg-[#6D28D9] text-white" : "text-gray-600 hover:bg-gray-100"
                        }`}
                    >
                        <Palette size={20} />
                        Design Settings
                    </button>
                    <button
                        onClick={() => setActiveTab("products")}
                        className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                            activeTab === "products" ? "bg-[#6D28D9] text-white" : "text-gray-600 hover:bg-gray-100"
                        }`}
                    >
                        <Package size={20} />
                        Product Visibility
                    </button>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-4xl mx-auto">
                    {activeTab === "general" && (
                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold text-gray-800">General Settings</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Store Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6D28D9] focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows="4"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6D28D9] focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Status
                                    </label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6D28D9] focus:border-transparent"
                                    >
                                        <option value="active">Active</option>
                                        <option value="pending">Pending</option>
                                        <option value="suspended">Suspended</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "design" && (
                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold text-gray-800">Design Settings</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Banner Image
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            // Handle file upload
                                        }}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6D28D9] focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Primary Color
                                    </label>
                                    <input
                                        type="color"
                                        name="primaryColor"
                                        value={formData.primaryColor}
                                        onChange={handleInputChange}
                                        className="w-full h-12 px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6D28D9] focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Font
                                    </label>
                                    <select
                                        name="font"
                                        value={formData.font}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6D28D9] focus:border-transparent"
                                    >
                                        <option value="Inter">Inter</option>
                                        <option value="Roboto">Roboto</option>
                                        <option value="Open Sans">Open Sans</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "products" && (
                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold text-gray-800">Product Visibility</h3>
                            <div className="space-y-4">
                                {products.map((product) => (
                                    <div key={product.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                                        <div>
                                            <h4 className="font-medium text-gray-800">{product.attributes.nom}</h4>
                                            <p className="text-sm text-gray-500">{product.attributes.description}</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.visibleProducts.includes(product.id)}
                                                onChange={() => handleProductToggle(product.id)}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#6D28D9]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6D28D9]"></div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Save Button */}
                    <div className="mt-8">
                        <button
                            onClick={handleSave}
                            className="w-full sm:w-auto bg-[#6D28D9] text-white px-6 py-3 rounded-lg hover:bg-[#6D28D9]/90 transition-colors flex items-center justify-center gap-2"
                        >
                            <Save size={20} />
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
