"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  Edit,
  MoreHorizontal,
  Package,
  PlusCircle,
  Search,
  Trash,
  ImageIcon,
  ShoppingBag,
  Filter,
  Store,
  Tag,
  AlertTriangle,
  ChevronDown,
  RefreshCw,
  X,
} from "lucide-react"
import axios from "axios"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Swal from "sweetalert2"
import { useTranslation } from "react-i18next"

export default function ProductsPage() {
  const { t } = useTranslation()
  const [isDropdownOpen, setIsDropdownOpen] = useState({})
  const [selectedStore, setSelectedStore] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [products, setProducts] = useState([])
  const [stores, setStores] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isFiltersVisible, setIsFiltersVisible] = useState(false)
  const navigate = useNavigate()
  const token = localStorage.getItem("token")
  const IDUser = localStorage.getItem("IDUser")
  const lang = localStorage.getItem("lang")

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

      // Fetch user's stores
      const storesResponse = await axios.get(`http://localhost:1337/api/users/${IDUser}?populate=boutiques`, {
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
          `http://localhost:1337/api/products?filters[boutique][id][$eq]=${store.id}&populate=*`,
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

  const toggleDropdown = (productId, event) => {
    // Close all other dropdowns first
    const newDropdownState = {}
    newDropdownState[productId] = !isDropdownOpen[productId]
    setIsDropdownOpen(newDropdownState)

    // Prevent event from bubbling up
    event.stopPropagation()
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsDropdownOpen({})
    }

    document.addEventListener("click", handleClickOutside)
    return () => {
      document.removeEventListener("click", handleClickOutside)
    }
  }, [])

  const handleDeleteProduct = async (productId) => {
    const result = await Swal.fire({
      title: "Êtes-vous sûr?",
      text: "Êtes-vous sûr de vouloir supprimer ce produit ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#6D28D9",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, supprimer!",
      cancelButtonText: "Annuler",
    })

    if (result.isConfirmed) {
      try {
        if (!token) {
          navigate("/login")
          return
        }

        await axios.delete(`http://localhost:1337/api/products/${productId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        // Update the products list after deletion
        setProducts((prevProducts) => prevProducts?.filter((product) => product.documentId !== productId))
        setIsDropdownOpen({})

        // Show success toast
        toast.success("Produit supprimé avec succès", {
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
          toast.error("Erreur lors de la suppression du produit. Veuillez réessayer.", {
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

  // Get unique categories from products
  const getUniqueCategories = () => {
    const categories = new Set()
    products.forEach((product) => {
      if (product && product.categories) {
        categories.add(product.categories)
      }
    })
    return Array.from(categories)
  }

  // Filtrage des produits
  const filteredProducts = products.filter((product) => {
    // Filter by store
    if (selectedStore !== "all" && product?.boutique?.id !== Number.parseInt(selectedStore)) {
      return false
    }

    // Filter by category
    if (selectedCategory !== "all" && product?.categories !== selectedCategory) {
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
    <div className="space-y-6 p-6 bg-white">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-[#6D28D9] p-3 rounded-lg shadow-lg">
          <ShoppingBag className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1e3a8a]">{t("product.products.title")}</h1>
          <p className="text-[#6D28D9]/70">{t("product.products.subtitle")}</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-4 items-center">
        <div className="relative flex-1">
          <div className="relative">
            <Search className={`absolute  top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 ${lang === "ar" ? "right-3" : "left-3"}`} />
            <input
              type="text"
              placeholder={t("product.products.search")}
              className={`w-full  py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:border-[#6D28D9] ${lang === "ar" ? "pl-4 pr-10" : "pl-10 pr-4"}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className={`absolute ${lang === "ar" ? "left-3" : "right-3"} top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600`}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => setIsFiltersVisible(!isFiltersVisible)}
            className="md:hidden inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <Filter className="mr-2 h-4 w-4" />
            Filtres {isFiltersVisible ? "▲" : "▼"}
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

      <div
        className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${
          isFiltersVisible || window.innerWidth >= 768 ? "block" : "hidden md:block"
        }`}
      >
        <div className="relative">
          <label className=" text-sm font-medium text-[#1e3a8a] mb-1 flex items-center">
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
            <div className={`absolute inset-y-0 ${lang === "ar" ? "left-0 pl-3" : "right-0 pr-3"} flex items-center  pointer-events-none `}>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="relative">
          <label className=" text-sm font-medium text-[#1e3a8a] mb-1 flex items-center">
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
              {getUniqueCategories().map((category) => (
                <option key={category} value={category}>
                  {t(`product.products.categories.${category}`) || category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
            <div className={`absolute inset-y-0 ${lang === "ar" ? "left-0 pl-3" : "right-0 pr-3"} flex items-center  pointer-events-none `}>
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

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-[#c8c2fd]/30">
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
        <div className="border border-[#c8c2fd]/30 shadow-lg rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y h-auto z-[50] divide-[#c8c2fd]/30">
              <thead className="bg-[#1e3a8a]">
                <tr>
                  <th className="px-6 py-3 text-start text-xs font-medium text-white uppercase tracking-wider">
                    {t("product.products.table.product")}
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider hidden md:table-cell">
                    {t("product.products.table.id")}
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                    {t("product.products.table.price")}
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                    {t("product.products.table.stock")}
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider hidden md:table-cell">
                    {t("product.products.table.category")}
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider hidden md:table-cell">
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
                              src={`http://localhost:1337${product.imgMain.url || product.imgMain?.url}`}
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
                    <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell text-center text-gray-500">{product.id}</td>
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
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-center hidden md:table-cell">
                      {product.categories &&
                      t(`product.products.categories.${product.categories}`) !==
                        `product.products.categories.${product.categorie}`
                        ? t(`product.products.categories.${product.categories}`)
                        : t("product.products.uncategorized")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center hidden md:table-cell">
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
                    <td className="px-6 py-4 whitespace-nowrap text-end">
                      <div className="relative">
                        <button
                          onClick={(e) => toggleDropdown(product.id, e)}
                          className="hover:text-[#c8c2fd] text-[#6D28D9] focus:outline-none p-1 rounded-full hover:bg-[#6D28D9]/10 transition-colors"
                        >
                          <MoreHorizontal className="h-5 w-5" />
                        </button>
                        {isDropdownOpen[product.id] && (
                          <div
                            className={`absolute origin-top-right ${
                              lang === "ar" ? "left-6" : "right-6"
                            } mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-[#c8c2fd] ring-opacity-5 z-[99]`}
                            
                          >
                            <div className="py-1">
                              <div className="px-4 py-2 text-start text-sm text-[#1e3a8a] font-medium border-b border-[#c8c2fd]/30">
                                {t("product.products.table.actions")}
                              </div>
                              <Link
                                to={`/controll/edit-product/${product.documentId}`}
                                className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-[#c8c2fd]/10 flex items-center"
                              >
                                <Edit className="mr-2 h-4 w-4 text-[#6D28D9]" />
                                {t("product.products.actions.edit")}
                              </Link>
                              <button
                                className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-[#c8c2fd]/10 flex items-center"
                                onClick={() => {
                                  setIsDropdownOpen({})
                                  // Logic for managing stock
                                }}
                              >
                                <Package className="mr-2 h-4 w-4 text-[#6D28D9]" />
                                {t("product.products.actions.manageStock")}
                              </button>
                              <div className="h-px bg-[#c8c2fd]/30"></div>
                              <button
                                className="w-full rounded-b-md px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                                onClick={() => handleDeleteProduct(product.documentId)}
                              >
                                <Trash className="mr-2 h-4 w-4" />
                                {t("product.products.actions.delete")}
                              </button>
                            </div>
                          </div>
                        )}
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
      )}
    </div>
  )
}
