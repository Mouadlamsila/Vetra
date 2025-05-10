import axios from "axios";
import { ChartColumn, ChevronLeft, ChevronRight, Package, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Step2() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const language = localStorage.getItem("lang") || "en";
    const userRole = localStorage.getItem("role");
    const userId = localStorage.getItem("IDUser");
    const token = localStorage.getItem("token");
    
    const [stores, setStores] = useState([]);
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userAuthenticated, setUserAuthenticated] = useState(false);

    // Check if user is logged in with valid ID
    useEffect(() => {
        const isAuthenticated = userId && userId !== "undefined" && userId !== "null";
        setUserAuthenticated(isAuthenticated);
        
        if (!isAuthenticated) {
            setIsLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                setIsLoading(true);
        
                if (!token) {
                    navigate("/login");
                    return;
                }
        
                // Fetch user's stores
                const storesResponse = await axios.get(`http://localhost:1337/api/users/${userId}?populate=boutiques`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
        
                const userStores = storesResponse.data.boutiques || [];
                setStores(userStores);
        
                // Fetch products for each store
                const allProducts = [];
                for (const store of userStores) {
                    const productsResponse = await axios.get(
                        `http://localhost:1337/api/products?filters[boutique][id][$eq]=${store.id}&populate=*`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        },
                    );
        
                    if (productsResponse.data.data) {
                        allProducts.push(...productsResponse.data.data);
                    }
                }
        
                setProducts(allProducts);
                setError(null);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to load data");
                toast.error("Failed to load data", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [userId, token, navigate]);
    

    // Direction chevron based on language
    const DirectionChevron = language === "ar" ? ChevronLeft : ChevronRight;

    // Step 1: Add Product Step
    const renderAddProductStep = () => {
        // Not logged in or not an owner or no stores created
        const isDisabled = !userAuthenticated || userRole !== "Owner" || stores.length === 0;
        
        if (isDisabled) {
            return (
                <div className="flex justify-between border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 opacity-70">
                    <div className="flex gap-2 sm:gap-2.5 items-center">
                        <Package className="text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                        <p className="text-sm sm:text-base text-gray-400">{t('addProduct')}</p>
                    </div>
                    <p className="text-gray-400 text-xs sm:text-sm px-2 py-1 bg-gray-200 rounded-sm">{t('add')}</p>
                </div>
            );
        }

        return (
            <Link to="/controll/AddProduct" className="block">
                <div className="flex justify-between border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 hover:border-purple-500 transition-colors">
                    <div className="flex gap-2 sm:gap-2.5 items-center">
                        <Package className="text-[#6D28D9] w-4 h-4 sm:w-5 sm:h-5" />
                        <p className="text-sm sm:text-base">{t('addProduct')}</p>
                    </div>
                    <p className="text-white text-xs sm:text-sm px-2 py-1 bg-[#6D28D9] rounded-sm">{t('add')}</p>
                </div>
            </Link>
        );
    };

    // Step 2: Manage Categories Step
    const renderManageCategoriesStep = () => {
        // Not logged in or not an owner or no stores created
        const isDisabled = !userAuthenticated || userRole !== "Owner" || stores.length === 0 || products.length === 0;
        
        if (isDisabled) {
            return (
                <div className="flex justify-between border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 opacity-70">
                    <div className="flex gap-2 sm:gap-2.5 items-center">
                        <ShoppingBag className="text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                        <p className="text-sm sm:text-base text-gray-400">{t('manageCategories')}</p>
                    </div>
                    <DirectionChevron className="text-gray-300 w-4 h-4 sm:w-5 sm:h-5" />
                </div>
            );
        }

        return (
            <Link to="/controll/Categories" className="block">
                <div className="flex justify-between border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 hover:border-purple-500 transition-colors">
                    <div className="flex gap-2 sm:gap-2.5 items-center">
                        <ShoppingBag className="text-[#6D28D9] w-4 h-4 sm:w-5 sm:h-5" />
                        <p className="text-sm sm:text-base">{t('manageCategories')}</p>
                    </div>
                    <DirectionChevron className="text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                </div>
            </Link>
        );
    };

    // Step 3: Orders Step
    const renderOrdersStep = () => {
        // Not logged in or not an owner or no stores created or no products
        const isDisabled = !userAuthenticated || userRole !== "Owner" || stores.length === 0 || products.length === 0;
        
        if (isDisabled) {
            return (
                <div className="flex justify-between border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 opacity-70">
                    <div className="flex gap-2 sm:gap-2.5 items-center">
                        <ChartColumn className="text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                        <p className="text-sm sm:text-base text-gray-400">{t('statistics')}</p>
                    </div>
                    <DirectionChevron className="text-gray-300 w-4 h-4 sm:w-5 sm:h-5" />
                </div>
            );
        }

        return (
            <Link to="/controll/Stats" className="block">
                <div className="flex justify-between border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 hover:border-purple-500 transition-colors">
                    <div className="flex gap-2 sm:gap-2.5 items-center">
                        <ChartColumn className="text-[#6D28D9] w-4 h-4 sm:w-5 sm:h-5" />
                        <p className="text-sm sm:text-base">{t('statistics')}</p>
                    </div>
                    <DirectionChevron className="text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                </div>
            </Link>
        );
    };

    // Error display component
    const renderError = () => {
        if (!error) return null;
        
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg mb-4">
                {error}
            </div>
        );
    };
    
    return (
        <div id="step2" className="p-4 sm:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-4 sm:px-5">
                <div className="space-y-3 max-w-2xl mx-auto lg:mx-0">
                    <div className="flex items-center gap-4">
                        <h1 className="bg-[#6D28D9] flex w-8 h-8 sm:w-12 sm:h-12 rounded-full text-white items-center justify-center text-xl sm:text-2xl">2</h1>
                        <p className="text-[#6D28D9] text-2xl sm:text-3xl font-medium">{t('step2Title')}</p>
                    </div>
                    <p className="text-gray-500 text-base sm:text-lg">{t('step2Description')}</p>
                    <div className="space-y-4">
                        <div className="flex gap-4 sm:gap-5 items-start">
                            <div className="text-[#6D28D9] rounded-full bg-[#c8c2fd] w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 flex justify-center items-center">
                                <Package className="w-4 h-4 sm:w-5 sm:h-5" />
                            </div>
                            <div>
                                <h2 className="text-base sm:text-lg font-medium">{t('easyProductAddition')}</h2>
                                <p className="text-base sm:text-lg text-gray-500">{t('easyProductAdditionDesc')}</p>
                            </div>
                        </div>
                        <div className="flex gap-4 sm:gap-5 items-start">
                            <div className="text-[#6D28D9] rounded-full bg-[#c8c2fd] w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 flex justify-center items-center">
                                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                            </div>
                            <div>
                                <h2 className="text-base sm:text-lg font-medium">{t('categoryOrganization')}</h2>
                                <p className="text-base sm:text-lg text-gray-500">{t('categoryOrganizationDesc')}</p>
                            </div>
                        </div>
                        <div className="flex gap-4 sm:gap-5 items-start">
                            <div className="text-[#6D28D9] rounded-full bg-[#c8c2fd] w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 flex justify-center items-center">
                                <ChartColumn className="w-4 h-4 sm:w-5 sm:h-5" />
                            </div>
                            <div>
                                <h2 className="text-base sm:text-lg font-medium">{t('statistics')}</h2>
                                <p className="text-base sm:text-lg text-gray-500">{t('statisticsDesc')}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex w-full justify-center items-center">
                    <div className="bg-white border border-[#c8c2fd] shadow p-4 sm:p-6 rounded-xl w-full max-w-md">
                        <div className="flex w-full justify-between pb-4">
                            <h2 className="text-xl sm:text-2xl font-medium">{t('productManagement')}</h2>
                            <p className="bg-[#c8c2fd] px-2 py-0.5 text-[#6D28D9] rounded-lg text-sm sm:text-base">{t('step2')}</p>
                        </div>
                        {renderError()}
                        <div className="space-y-3 sm:space-y-4">
                            {renderAddProductStep()}
                            {renderManageCategoriesStep()}
                            {renderOrdersStep()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}