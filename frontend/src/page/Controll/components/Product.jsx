"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  PlusCircle,
  Search,
  ShoppingBag,
  Filter,
  X,
  RefreshCw,
  Info,
  AlertTriangle,
  ChevronDown,
  Store,
  Tag,
  ImageIcon,
  PencilLine,
  PackageX,
} from "lucide-react"
import axios from "axios"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Swal from "sweetalert2"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

export default function ProductsPage() {
  const { t } = useTranslation()
  const [selectedStore, setSelectedStore] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [products, setProducts] = useState([])
  const [stores, setStores] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isFiltersVisible, setIsFiltersVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [translatedCategories, setTranslatedCategories] = useState([])
  const navigate = useNavigate()
  const token = localStorage.getItem("token")
  const IDUser = localStorage.getItem("IDUser")
  const lang = localStorage.getItem("lang")

  // Check if mobile on mount and when window resizes
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Initial check
    checkIfMobile()

    // Add event listener
    window.addEventListener("resize", checkIfMobile)

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  // Fetch products and stores from the backend
  useEffect(() => {
    fetchData()
  }, [navigate, token, IDUser])

  const fetchData = async () => {
    try {
      setLoading(true)

      if (!token) {
        navigate("/login")
        return
      }

      // Fetch categories
      const categoriesResponse = await axios.get('https://useful-champion-e28be6d32c.strapiapp.com/api/categories', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setCategories(categoriesResponse.data.data)

      // Fetch user's stores
      const storesResponse = await axios.get(`https://useful-champion-e28be6d32c.strapiapp.com/api/users/${IDUser}?populate=boutiques`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const userStores = storesResponse.data.boutiques || []
      setStores(userStores)

      // Fetch products for each store
      const allProducts = []
      for (const store of userStores) {
        const productsResponse = await axios.get(
          `https://useful-champion-e28be6d32c.strapiapp.com/api/products?filters[boutique][id][$eq]=${store.id}&populate=*`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )

        if (productsResponse.data.data) {
          allProducts.push(...productsResponse.data.data)
        }
      }

      setProducts(allProducts)
      setError(null)
    } catch (err) {
      console.error("Error fetching data:", err)
      setError("Erreur lors du chargement des données")
      toast.error("Erreur lors du chargement des données", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProduct = async (productId) => {
    const result = await Swal.fire({
      title: t('product.products.swal.deleteTitle'),
      text: t('product.products.swal.deleteText'),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#6D28D9",
      cancelButtonColor: "#d33",
      confirmButtonText: t('product.products.swal.confirmButtonText'),
      cancelButtonText: t('product.products.swal.cancelButtonText'),
    })

    if (result.isConfirmed) {
      try {
        if (!token) {
          navigate("/login")
          return
        }

        await axios.delete(`https://useful-champion-e28be6d32c.strapiapp.com/api/products/${productId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        // Update the products list after deletion
        setProducts((prevProducts) => prevProducts?.filter((product) => product.documentId !== productId))

        // Show success toast
        toast.success(t('product.products.swal.successText'), {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })
      } catch (err) {
        console.error("Error deleting product:", err)
        if (err.response && err.response.status === 401) {
          navigate("/login")
        } else {
          toast.error(t('product.products.swal.errorText'), {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          })
        }
      }
    }
  }

  // Filtrage des produits
  const filteredProducts = products.filter((product) => {
    // Filter by store
    if (selectedStore !== "all" && product?.boutique?.id !== Number.parseInt(selectedStore)) {
      return false
    }

    // Filter by category
    if (selectedCategory !== "all" && product?.category?.id !== Number.parseInt(selectedCategory)) {
      return false
    }

    // Filter by search query
    return (
      product?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      false ||
      product?.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      false ||
      product?.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      false
    )
  })

  const resetFilters = () => {
    setSelectedStore("all")
    setSelectedCategory("all")
    setSearchQuery("")
  }

  // Get categories that have products
  const getCategoriesWithProducts = () => {
    const categoryIds = new Set()
    products.forEach(product => {
      if (product.category?.id) {
        categoryIds.add(product.category.id)
      }
    })
    return categories.filter(category => categoryIds.has(category.id))
  }

  // --- CATEGORY TRANSLATION LOGIC ---
  // Helper to get translation from Lingva Translate
  const translateCategory = async (text, targetLang) => {
    try {
      const response = await axios.get(
        `https://lingva.ml/api/v1/en/${targetLang}/${encodeURIComponent(text)}`
      );
      if (response.data && response.data.translation) {
        return response.data.translation;
      }
      return text;
    } catch (error) {
      console.error('Translation error:', error);
      return text;
    }
  };

  // Get translated category name (with caching)
  const getTranslatedCategoryName = async (cat) => {
    const lang = localStorage.getItem('lang') || 'en';
    if (!cat?.name || lang === 'en') return cat?.name || '';
    // Use localStorage cache
    let cache = {};
    try {
      cache = JSON.parse(localStorage.getItem('categoryTranslations') || '{}');
    } catch (e) {
      cache = {};
    }
    if (!cat.id) return cat.name;
    if (!cache[cat.id]) cache[cat.id] = {};
    if (cache[cat.id][lang]) {
      return cache[cat.id][lang];
    }
    // Not cached, fetch translation
    const translated = await translateCategory(cat.name, lang);
    // Only cache if translation is different
    if (translated && translated !== cat.name) {
      cache[cat.id][lang] = translated;
      localStorage.setItem('categoryTranslations', JSON.stringify(cache));
      return translated;
    } else {
      // Fallback to original name
      return cat.name;
    }
  };

  // Effect to translate categories when they change or language changes
  useEffect(() => {
    const lang = localStorage.getItem('lang') || 'en';
    if (lang === 'en' || categories.length === 0) {
      setTranslatedCategories(categories);
      return;
    }
    let isMounted = true;
    Promise.all(
      categories.map(async (cat) => ({
        ...cat,
        name: await getTranslatedCategoryName(cat),
      }))
    ).then((translated) => {
      if (isMounted) setTranslatedCategories(translated);
    });
    return () => { isMounted = false; };
  }, [categories, localStorage.getItem('lang')]);

  // Mobile product card component
  const ProductCard = ({ product }) => (
    <div className="bg-white rounded-lg shadow-sm border border-[#c8c2fd]/30 p-4 mb-3">
      <div className="flex items-start gap-3 mb-3">
        {product?.imgMain ? (
          <div className="w-16 h-16 rounded-lg overflow-hidden border border-[#c8c2fd]/30 shadow-sm flex-shrink-0">
            <img
              src={`${product.imgMain.url || product.imgMain?.url}`}
              alt={product?.name || "Product"}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-16 h-16 rounded-lg bg-[#c8c2fd]/10 flex items-center justify-center flex-shrink-0">
            <ImageIcon className="h-6 w-6 text-[#6D28D9]/60" />
          </div>
        )}
        <div className="flex-1">
          <div className="font-medium text-[#1e3a8a]">{product?.name || t("product.products.noName")}</div>
          <div className="text-xs text-gray-500">SKU: {product?.sku || "N/A"}</div>
          <div className="font-medium text-[#6D28D9] mt-1">{product?.prix?.toFixed(2) || "0.00"} €</div>
        </div>
        <span
          className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
            product.stock === 0
              ? "bg-red-100 text-red-800"
              : product.stock <= product.lowStockAlert
                ? "bg-yellow-100 text-yellow-800"
                : "bg-green-100 text-green-800"
          }`}
        >
          {product.stock === 0
            ? t("product.products.status.outOfStock")
            : product.stock <= product.lowStockAlert
              ? t("product.products.status.lowStock")
              : t("product.products.status.inStock")}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
        <div>
          <p className="text-gray-500">{t("product.products.table.stock")}</p>
          <p className="font-medium">{product?.stock || 0}</p>
        </div>
        <div>
          <p className="text-gray-500">{t("product.products.table.category")}</p>
          <p className="font-medium">
            {product.category ? (translatedCategories.find(cat => cat.id === product.category.id)?.name || categories.find(cat => cat.id === product.category.id)?.name) : t("product.products.uncategorized")}
          </p>
        </div>
        <div>
          <p className="text-gray-500">{t("product.products.table.store")}</p>
          <p className="font-medium">{product?.boutique?.nom || t("product.products.unassigned")}</p>
        </div>
        <div>
          <p className="text-gray-500">ID</p>
          <p className="font-medium">{product.id}</p>
        </div>
      </div>

      <div className="flex justify-end space-x-2 border-t border-gray-100 pt-3">
        <Link
          to={`/controll/edit-product/${product.documentId}`}
          className="inline-flex items-center px-2 py-1 text-sm text-blue-500 rounded hover:bg-blue-50"
        >
          <PencilLine className="h-4 w-4 mr-1" />
          {t("product.products.actions.edit")}
        </Link>
        <button
          onClick={() => handleDeleteProduct(product.documentId)}
          className="inline-flex items-center px-2 py-1 text-sm text-red-500 rounded hover:bg-red-50"
        >
          <PackageX className="h-4 w-4 mr-1" />
          {t("product.products.actions.delete")}
        </button>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6D28D9]"></div>
          <p className="text-[#6D28D9] font-medium">{t("product.products.loading")}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center justify-center space-x-2">
          <AlertTriangle className="h-5 w-5" />
          <span>{error}</span>
        </div>
        <div className="mt-4 space-x-4">
          <button
            onClick={() => fetchData()}
            className="px-4 py-2 bg-[#6D28D9] text-white rounded-lg hover:bg-[#6D28D9]/90 transition-colors inline-flex items-center"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Réessayer
          </button>
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Se connecter
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4 md:p-6 bg-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:space-x-3 mb-6">
        <div className="bg-[#6D28D9] p-3 rounded-lg shadow-lg mb-3 md:mb-0">
          <ShoppingBag className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#1e3a8a]">
            {t("product.products.title")}
          </h1>
          <p className="text-[#6D28D9]/70">{t("product.products.subtitle")}</p>
        </div>
      </div>

      {/* Info Banner (optional) */}
      <div className="bg-[#c8c2fd]/10 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-2 text-[#6D28D9]">
          <Info className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm">{t("product.products.infoMessage") || "Manage your products inventory here."}</p>
        </div>
      </div>

      {/* Search and Add Product */}
      <div className="flex flex-col gap-4">
        <div className="relative w-full">
          <div className="relative">
            <Search
              className={`absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 ${
                lang === "ar" ? "right-3" : "left-3"
              }`}
            />
            <input
              type="text"
              placeholder={t("product.products.search")}
              className={`w-full py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:border-[#6D28D9] ${
                lang === "ar" ? "pl-4 pr-10" : "pl-10 pr-4"
              }`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className={`absolute ${
                  lang === "ar" ? "left-3" : "right-3"
                } top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600`}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 w-full">
          <button
            onClick={() => setIsFiltersVisible(!isFiltersVisible)}
            className="md:hidden inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <Filter className="mr-2 h-4 w-4" />
            {t("product.products.filters") || "Filters"} {isFiltersVisible ? "▲" : "▼"}
          </button>

          <Link
            to="/controll/AddProduct"
            className="inline-flex items-center px-4 py-2 bg-[#6D28D9] text-white rounded-lg hover:bg-[#6D28D9]/90 transition-colors shadow-sm"
          >
            <PlusCircle className={`h-4 w-4 ${lang === "ar" ? "ml-2" : "mr-2"}`} />
            {t("product.products.createProduct")}
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${isFiltersVisible || !isMobile ? "block" : "hidden"}`}>
        <div className="relative">
          <label className="text-sm font-medium text-[#1e3a8a] mb-1 flex items-center">
            <Store className={`h-4 w-4 ${lang === "ar" ? "ml-1" : "mr-1"}`} />
            {t("product.products.filterByStore")}
          </label>
          <div className="relative">
            <select
              value={selectedStore}
              onChange={(e) => setSelectedStore(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:border-[#6D28D9]"
            >
              <option value="all">{t("product.products.allStores")}</option>
              {stores &&
                stores.map((store) => (
                  <option key={store.id} value={store.id}>
                    {store?.nom || `Boutique ${store.id}`}
                  </option>
                ))}
            </select>
            <div
              className={`absolute inset-y-0 ${
                lang === "ar" ? "left-0 pl-3" : "right-0 pr-3"
              } flex items-center pointer-events-none`}
            >
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="relative">
          <label className="text-sm font-medium text-[#1e3a8a] mb-1 flex items-center">
            <Tag className={`h-4 w-4 ${lang === "ar" ? "ml-1" : "mr-1"}`} />
            {t("product.products.filterByCategory")}
          </label>
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:border-[#6D28D9]"
            >
              <option value="all">{t("product.products.allCategories")}</option>
              {getCategoriesWithProducts().map((category) => (
                <option key={category.id} value={category.id}>
                  {translatedCategories.find(c => c.id === category.id)?.name || category.name}
                </option>
              ))}
            </select>
            <div
              className={`absolute inset-y-0 ${
                lang === "ar" ? "left-0 pl-3" : "right-0 pr-3"
              } flex items-center pointer-events-none`}
            >
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="flex items-end">
          <button
            onClick={resetFilters}
            className="inline-flex items-center px-4 py-2 border border-[#6D28D9] text-[#6D28D9] rounded-lg hover:bg-[#6D28D9]/10 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${lang === "ar" ? "ml-2" : "mr-2"}`} />
            {t("product.products.resetFilters")}
          </button>
        </div>
      </div>

      {/* No Results */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-8 md:py-12 bg-gray-50 rounded-lg border border-[#c8c2fd]/30">
          <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">{t("product.products.noProductsFound")}</h3>
          <p className="text-gray-500 mb-4">{t("product.products.tryDifferentFilters")}</p>
          <div className="flex justify-center space-x-3">
            <button
              onClick={resetFilters}
              className="inline-flex items-center px-4 py-2 border border-[#6D28D9] text-[#6D28D9] rounded-lg hover:bg-[#6D28D9]/10 transition-colors"
            >
              <RefreshCw className={`h-4 w-4 ${lang === "ar" ? "ml-2" : "mr-2"}`} />
              {t("product.products.resetFilters")}
            </button>
            <Link
              to="/controll/AddProduct"
              className="inline-flex items-center px-4 py-2 bg-[#6D28D9] text-white rounded-lg hover:bg-[#6D28D9]/90 transition-colors"
            >
              <PlusCircle className={`h-4 w-4 ${lang === "ar" ? "ml-2" : "mr-2"}`} />
              {t("product.products.createProduct")}
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Mobile View - Cards */}
          <div className="md:hidden mt-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
            <div className="bg-gray-50 px-4 py-3 border border-[#c8c2fd]/30 rounded-lg text-sm text-gray-500 text-center">
              {filteredProducts.length} {t("product.products.productsFound")}
            </div>
          </div>

          {/* Desktop View - Table */}
          <div className="hidden md:block border border-[#c8c2fd]/30 shadow-lg rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y h-auto z-[50] divide-[#c8c2fd]/30">
                <thead className="bg-[#1e3a8a]">
                  <tr>
                    <th className="px-6 py-3 text-start text-xs font-medium text-white uppercase tracking-wider">
                      {t("product.products.table.product")}
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                      {t("product.products.table.id")}
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                      {t("product.products.table.price")}
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                      {t("product.products.table.stock")}
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                      {t("product.products.table.category")}
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                      {t("product.products.table.store")}
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                      {t("product.products.table.status")}
                    </th>
                    <th className="px-6 py-3 text-end text-xs font-medium text-white uppercase tracking-wider">
                      {t("product.products.table.actions")}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-[#c8c2fd]/30">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-[#c8c2fd]/5 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-start gap-3">
                          {product?.imgMain ? (
                            <div className="w-12 h-12 rounded-lg overflow-hidden border border-[#c8c2fd]/30 shadow-sm">
                              <img
                                src={`${product.imgMain.url || product.imgMain?.url}`}
                                alt={product?.name || "Product"}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-[#c8c2fd]/10 flex items-center justify-center">
                              <ImageIcon className="h-6 w-6 text-[#6D28D9]/60" />
                            </div>
                          )}
                          <div>
                            <div className="font-medium text-[#1e3a8a]">
                              {product?.name || t("product.products.noName")}
                            </div>
                            <div className="text-xs text-gray-500">SKU: {product?.sku || "N/A"}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-gray-500">{product.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="font-medium text-[#6D28D9]">{product?.prix?.toFixed(2) || "0.00"} €</div>
                        {product?.comparePrice > 0 && (
                          <div className="text-xs text-gray-500 line-through">{product.comparePrice.toFixed(2)} €</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="font-medium">{product?.stock || 0}</div>
                        {product?.lowStockAlert && (
                          <div className="text-xs text-gray-500">
                            {t("product.products.lowStockAlert")}: {product.lowStockAlert}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-center">
                        {product.category ? (translatedCategories.find(cat => cat.id === product.category.id)?.name || categories.find(cat => cat.id === product.category.id)?.name) : t("product.products.uncategorized")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {product?.boutique?.nom || t("product.products.unassigned")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            product.stock === 0
                              ? "bg-red-100 text-red-800"
                              : product.stock <= product.lowStockAlert
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                          }`}
                        >
                          {product.stock === 0
                            ? t("product.products.status.outOfStock")
                            : product.stock <= product.lowStockAlert
                              ? t("product.products.status.lowStock")
                              : t("product.products.status.inStock")}
                        </span>
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap h-full flex justify-end items-center">
                        <div className="flex h-full items-center gap-2">
                          <Link
                            to={`/controll/edit-product/${product.documentId}`}
                            className="cursor-pointer h-full text-blue-500 focus:outline-none p-1 rounded-full hover:bg-blue-500/10 transition-colors"
                          >
                            <PencilLine className="h-5 w-5" />
                          </Link>
                          <button
                            onClick={() => handleDeleteProduct(product.documentId)}
                            className="cursor-pointer h-full text-red-500 focus:outline-none p-1 rounded-full hover:bg-red-500/10 transition-colors"
                          >
                            <PackageX className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-gray-50 px-6 py-3 border-t border-[#c8c2fd]/30 text-sm text-gray-500">
              {filteredProducts.length} {t("product.products.productsFound")}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
