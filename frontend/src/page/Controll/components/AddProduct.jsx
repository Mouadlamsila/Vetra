"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Swal from "sweetalert2"
import { useTranslation } from "react-i18next"
import {
  Upload,
  Store,
  Tag,
  FileText,
  ImageIcon,
  DollarSign,
  Package,
  Truck,
  Save,
  X,
  ShoppingBag,
  Layers,
  BarChart2,
  Box,
  AlertTriangle,
  Check,
  Info,
  Loader,
} from "lucide-react"

export default function AddProductPage() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState("info")
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    categories: "",
    boutique: null,
    tags: "",
    prix: 0,
    comparePrice: 0,
    cost: 0,
    sku: "",
    stock: 0,
    lowStockAlert: 0,
    weight: 0,
    dimensions: [
      {
        length: 0,
        width: 0,
        height: 0,
        unit: "cm",
      },
    ],
    shippingClass: "",
    imgMain: null,
    imgsAdditional: [],
  })
  const [stores, setStores] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [productId, setProductId] = useState(null)
  // Image Upload States
  const [imgMain, setImgMain] = useState(null)
  const [imgsAdditional, setImgsAdditional] = useState([])
  // Image Upload Loading States
  const [loadingImgMain, setLoadingImgMain] = useState(false)
  const [loadingImgsAdditional, setLoadingImgsAdditional] = useState(false)

  const navigate = useNavigate()
  const { id } = useParams()
  const IDUser = localStorage.getItem("IDUser")
  const lang = localStorage.getItem("lang")
  useEffect(() => {
    // Fetch stores when component mounts
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          throw new Error("Token non trouvé. Veuillez vous connecter.")
        }

        // Fetch categories
        const categoriesResponse = await axios.get('http://localhost:1337/api/categorie-products', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setCategories(categoriesResponse.data.data)

        const response = await axios.get(`http://localhost:1337/api/users/${IDUser}?populate=boutiques`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setStores(response.data.boutiques)
      } catch (err) {
        setError("Failed to fetch stores")
        console.error("Error fetching stores:", err)
        toast.error("Erreur lors du chargement des boutiques", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })
      }
    }
    fetchData()

    // Check if we're in edit mode
    if (id) {
      setIsEditMode(true)
      setProductId(id)
      fetchProductData(id)
    }
  }, [id])
  const fetchProductData = async (productId) => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Token non trouvé. Veuillez vous connecter.")
      }

      const response = await axios.get(`http://localhost:1337/api/products/${productId}?populate=*`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const product = response.data.data

      // Map the product data to our form structure
      setFormData({
        name: product.attributes.name || "",
        description: product.attributes.description || "",
        categories: product.attributes.categories || "",
        boutique: product.attributes.boutique?.data?.id || null,
        tags: product.attributes.tags || "",
        prix: product.attributes.prix || 0,
        comparePrice: product.attributes.comparePrice || 0,
        cost: product.attributes.cost || 0,
        sku: product.attributes.sku || "",
        stock: product.attributes.stock || 0,
        lowStockAlert: product.attributes.lowStockAlert || 0,
        weight: product.attributes.weight || 0,
        dimensions: product.attributes.dimensions || [
          {
            length: 0,
            width: 0,
            height: 0,
            unit: "cm",
          },
        ],
        shippingClass: product.attributes.shippingClass || "",
        imgMain: product.attributes.imgMain || null,
        imgsAdditional: product.attributes.imgsAdditional || [],
      })

      toast.info("Données du produit chargées", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    } catch (err) {
      console.error("Error fetching product:", err)
      setError("Erreur lors du chargement du produit")
      toast.error("Erreur lors du chargement du produit", {
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

  const handleInputChange = (e) => {
    const { name, value, type } = e.target
    if (name.startsWith("dimensions.")) {
      const dimension = name.split(".")[1]
      setFormData((prev) => ({
        ...prev,
        dimensions: [
          {
            ...prev.dimensions[0],
            [dimension]: dimension === "unit" ? value : Number(value),
          },
        ],
      }))
    } else if (name === "boutique") {
      // Handle store selection
      const selectedOption = Number(e.target.value)
      setFormData((prev) => ({
        ...prev,
        boutique: selectedOption,
      }))
    } else {
      if (type === "number") {
        setFormData((prev) => ({
          ...prev,
          [name]: Number(value),
        }))
      } else {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }))
      }
    }
  }

  const handleImageUpload = async (e, isMain = false) => {
    const files = e.target.files
    if (!files.length) return

    const formData = new FormData()
    formData.append("files", files[0])

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Token non trouvé. Veuillez vous connecter.")
      }

      if (isMain) {
        setLoadingImgMain(true)
      } else {
        setLoadingImgsAdditional(true)
      }

      const uploadResponse = await axios.post("http://localhost:1337/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })

      if (isMain) {
        setFormData((prev) => ({
          ...prev,
          imgMain: uploadResponse.data[0].id,
        }))
        setImgMain(uploadResponse.data[0].url)
        setLoadingImgMain(false)
      } else {
        setFormData((prev) => ({
          ...prev,
          imgsAdditional: [...prev.imgsAdditional, uploadResponse.data[0].id],
        }))
        setImgsAdditional([...imgsAdditional, uploadResponse.data[0].url])

        setLoadingImgsAdditional(false)
      }

      toast.success("Image téléchargée avec succès", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    } catch (err) {
      setError("Failed to upload image")
      console.error("Error uploading image:", err)
      toast.error("Erreur lors du téléchargement de l'image", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error(t('product.createProduct.errorToken'))
      }

      if (!formData.name || !formData.description || !formData.categories || !formData.boutique) {
        throw new Error(t('product.createProduct.errorRequired'))
      }

      const productData = {
        data: {
          name: formData.name,
          description: formData.description,
          category: formData.categories,
          boutique: formData.boutique,
          tags: formData.tags,
          prix: Number(formData.prix),
          comparePrice: Number(formData.comparePrice),
          cost: Number(formData.cost),
          sku: formData.sku,
          stock: Number(formData.stock),
          lowStockAlert: Number(formData.lowStockAlert),
          weight: Number(formData.weight),
          dimensions: formData.dimensions.map((dim) => ({
            length: Number(dim.length),
            width: Number(dim.width),
            height: Number(dim.height),
            unit: dim.unit,
          })),
          shippingClass: formData.shippingClass,
          imgMain: formData.imgMain,
          imgsAdditional: formData.imgsAdditional,
        },
      }

      await axios.post("http://localhost:1337/api/products", productData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      toast.success(t('product.createProduct.success'), {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })

      await Swal.fire({
        title: t('product.createProduct.successTitle'),
        text: t('product.createProduct.successText'),
        icon: "success",
        confirmButtonText: t('product.createProduct.successConfirm'),
        confirmButtonColor: "#6D28D9",
      })

      navigate("/controll/products")
    } catch (err) {
      setError(err.message || "Failed to create product")
      console.error("Error creating product:", err)
      toast.error(t('product.createProduct.error'), {
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

  const handleCancel = async () => {
    if (formData.name || formData.description || formData.categories || formData.boutique) {
      const result = await Swal.fire({
        title: t('product.createProduct.cancelTitle'),
        text: t('product.createProduct.cancelText'),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#6D28D9",
        cancelButtonColor: "#d33",
        confirmButtonText: t('product.createProduct.cancelConfirm'),
        cancelButtonText: t('product.createProduct.cancelCancel'),
      })

      if (result.isConfirmed) {
        navigate("/controll/products")
      }
    } else {
      navigate("/controll/products")
    }
  }

  return (
    <div className="space-y-6 p-6 bg-white">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-[#6D28D9] p-3 rounded-lg shadow-lg">
          <ShoppingBag className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1e3a8a]">{t("product.createProduct.title")}</h1>
          <p className="text-[#6D28D9]/70">{t("product.createProduct.subtitle")}</p>
        </div>
      </div>

      <div className="bg-[#c8c2fd]/10 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-2 text-[#6D28D9]">
          <Info className="h-5 w-5" />
          <p className="text-sm">{t("product.createProduct.productInfoDesc")}</p>
        </div>
      </div>

      <div className="flex overflow-x-auto space-x-2 pb-2 mb-4">
        <button
          type="button"
          onClick={() => setActiveTab("info")}
          className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all ${activeTab === "info"
            ? "bg-[#6D28D9] text-white shadow-md"
            : "bg-white text-gray-600 border border-gray-200 hover:border-[#c8c2fd] hover:text-[#6D28D9]"
            }`}
        >
          <FileText className="h-5 w-5" />
          <span>{t("product.createProduct.storeInfo")}</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("images")}
          className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all ${activeTab === "images"
            ? "bg-[#6D28D9] text-white shadow-md"
            : "bg-white text-gray-600 border border-gray-200 hover:border-[#c8c2fd] hover:text-[#6D28D9]"
            }`}
        >
          <ImageIcon className="h-5 w-5" />
          <span>{t("product.createProduct.mainImage")}</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("pricing")}
          className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all ${activeTab === "pricing"
            ? "bg-[#6D28D9] text-white shadow-md"
            : "bg-white text-gray-600 border border-gray-200 hover:border-[#c8c2fd] hover:text-[#6D28D9]"
            }`}
        >
          <DollarSign className="h-5 w-5" />
          <span>{t("product.createProduct.price")}</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("shipping")}
          className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all ${activeTab === "shipping"
            ? "bg-[#6D28D9] text-white shadow-md"
            : "bg-white text-gray-600 border border-gray-200 hover:border-[#c8c2fd] hover:text-[#6D28D9]"
            }`}
        >
          <Truck className="h-5 w-5" />
          <span>{t("product.createProduct.shippingClass")}</span>
        </button>
      </div>

      {activeTab === "info" && (
        <div className="bg-white rounded-lg shadow-lg border border-[#c8c2fd]/30 overflow-hidden">
          <div className="bg-[#1e3a8a] px-6 py-4 flex items-center space-x-2">
            <FileText className="h-5 w-5 text-white" />
            <h2 className="text-lg font-medium text-white">{t("product.createProduct.storeInfo")}</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="product-name"
                  className="flex items-center space-x-2 text-sm font-medium text-[#1e3a8a] mb-1"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>{t("product.createProduct.productName")}</span>
                </label>
                <input
                  type="text"
                  id="product-name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="block py-3 px-4 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:border-[#6D28D9] sm:text-sm"
                  placeholder={t("product.createProduct.productNamePlaceholder")}
                />
              </div>

              <div>
                <label
                  htmlFor="product-description"
                  className="flex items-center space-x-2 text-sm font-medium text-[#1e3a8a] mb-1"
                >
                  <FileText className="h-4 w-4" />
                  <span>{t("product.createProduct.description")}</span>
                </label>
                <textarea
                  id="product-description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="block py-3 px-4 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:border-[#6D28D9] sm:text-sm"
                  placeholder={t("product.createProduct.descriptionPlaceholder")}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="product-category"
                    className="flex items-center space-x-2 text-sm font-medium text-[#1e3a8a] mb-1"
                  >
                    <Layers className="h-4 w-4" />
                    <span>{t("product.createProduct.category")}</span>
                  </label>
                  <div className="relative">
                    <select
                      id="product-category"
                      name="categories"
                      value={formData.categories}
                      onChange={handleInputChange}
                      className="block py-3 px-4 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:border-[#6D28D9] sm:text-sm appearance-none"
                    >
                      <option value="">{t("product.createProduct.selectCategory")}</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    <div className={`absolute inset-y-0 flex items-center  pointer-events-none ${lang === "ar" ? "left-0 pl-3" : "right-0 pr-3"}`}>
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="product-store"
                    className="flex items-center space-x-2 text-sm font-medium text-[#1e3a8a] mb-1"
                  >
                    <Store className="h-4 w-4" />
                    <span>{t("product.createProduct.store")}</span>
                  </label>
                  <div className="relative">
                    <select
                      id="product-store"
                      name="boutique"
                      value={formData.boutique || ""}
                      onChange={handleInputChange}
                      className="block py-3 px-4 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:border-[#6D28D9] sm:text-sm appearance-none"
                    >
                      <option value="">{t("product.createProduct.selectStore")}</option>
                      {stores && stores.length > 0 ? (
                        stores.map((store) => (
                          <option key={store.id} value={store.id}>
                            {store.nom || `Boutique ${store.id}`}
                          </option>
                        ))
                      ) : (
                        <option value="" disabled>
                          {t("product.products.noProducts")}
                        </option>
                      )}
                    </select>
                    <div className={`absolute inset-y-0 flex items-center  pointer-events-none ${lang === "ar" ? "left-0 pl-3" : "right-0 pr-3"}`}>
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="product-tags"
                  className="flex items-center space-x-2 text-sm font-medium text-[#1e3a8a] mb-1"
                >
                  <Tag className="h-4 w-4" />
                  <span>{t("product.createProduct.tags")}</span>
                </label>
                <input
                  type="text"
                  id="product-tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  className="block py-3 px-4 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:border-[#6D28D9] sm:text-sm"
                  placeholder={t("product.createProduct.tagsPlaceholder")}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "images" && (
        <div className="bg-white rounded-lg shadow-lg border border-[#c8c2fd]/30 overflow-hidden">
          <div className="bg-[#1e3a8a] px-6 py-4 flex items-center space-x-2">
            <ImageIcon className="h-5 w-5 text-white" />
            <h2 className="text-lg font-medium text-white">{t("product.createProduct.mainImage")}</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-[#1e3a8a] mb-1">
                  <ImageIcon className="h-4 w-4" />
                  <span>{t("product.createProduct.mainImageLabel")}</span>
                </label>
                <div className="mt-1 border-2 border-dashed border-[#c8c2fd] rounded-lg p-8 flex flex-col items-center justify-center gap-2 bg-[#c8c2fd]/5 transition-all hover:bg-[#c8c2fd]/10">

                  {loadingImgMain ? (
                    <div className="w-22 h-22 bg-[#6D28D9]/10 rounded-full flex items-center justify-center mb-2">
                      <Loader className="h-10 w-10 animate-spin text-[#6D28D9]" />
                    </div>

                  ) : imgMain ? (
                    <div className="relative group">
                      <img
                        src={`http://localhost:1337${imgMain}`}
                        alt="Main Image"
                        className="w-full h-32 object-cover rounded-lg border border-[#c8c2fd]/30 shadow-md group-hover:opacity-75 transition-opacity"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, imgMain: null }));
                          setImgMain(null);
                        }}
                        className="absolute top-2 right-2 bg-white text-red-500 rounded-full p-1.5 shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center flex flex-col justify-center items-center ">
                      <div className="w-22 h-22 bg-[#6D28D9]/10 rounded-full flex items-center justify-center mb-2">
                        <ImageIcon className="h-10 w-10 text-[#6D28D9]" />
                      </div>
                      <p className="text-sm font-medium text-[#6D28D9]">{t("product.createProduct.mainImageDrop")}</p>
                      <p className="text-xs text-[#6D28D9]/70">{t("product.createProduct.mainImageFormat")}</p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, true)}
                    className="hidden"
                    id="main-image"
                  />
                  <label
                    htmlFor="main-image"
                    className="mt-2 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#6D28D9] hover:bg-[#6D28D9]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6D28D9] cursor-pointer transition-colors"
                  >
                    <Upload className={`h-4 w-4 ${lang === "ar" ? "ml-2" : "mr-2"}`} />
                    {t("product.createProduct.mainImageUpload")}
                  </label>
                </div>
              </div>

              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-[#1e3a8a] mb-1">
                  <Layers className="h-4 w-4" />
                  <span>{t("product.createProduct.additionalImages")}</span>
                </label>
                <div className="mt-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {imgsAdditional?.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={`http://localhost:1337${img}`}
                        alt={`Additional ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-[#c8c2fd]/30 shadow-md group-hover:opacity-75 transition-opacity"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            imgsAdditional: prev.imgsAdditional.filter((_, i) => i !== index),
                          }));
                          setImgsAdditional(imgsAdditional.filter((_, i) => i !== index));
                        }}
                        className="absolute top-2 right-2 bg-white text-red-500 rounded-full p-1.5 shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  {formData.imgsAdditional.length < 3 && (
                    <div className="border-2 border-dashed border-[#c8c2fd] rounded-lg p-4 flex flex-col items-center justify-center gap-2 bg-[#c8c2fd]/5 transition-all hover:bg-[#c8c2fd]/10">
                      <div className="w-12 h-12 bg-[#6D28D9]/10 rounded-full flex items-center justify-center mb-2">
                        {loadingImgsAdditional ? (
                          <Loader className="h-6 w-6 text-[#6D28D9] animate-spin" />
                        ) : (
                          <Upload className="h-6 w-6 text-[#6D28D9]" />
                        )}
                      </div>
                      <div className="text-center">
                        {loadingImgsAdditional ? (
                          <p className="text-xs text-[#6D28D9]/70">{t("product.createProduct.uploading")}</p>
                        ) : (
                          <p className="text-xs text-[#6D28D9]/70">{t("product.createProduct.additionalImage")}</p>
                        )}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e)}
                        className="hidden"
                        id="additional-image"
                      />
                      <label
                        htmlFor="additional-image"
                        className="mt-2 inline-flex items-center px-3 py-1.5 border border-[#6D28D9] rounded-md text-xs font-medium text-[#6D28D9] bg-white hover:bg-[#6D28D9]/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6D28D9] cursor-pointer transition-colors"
                      >
                        {loadingImgsAdditional ? (
                          <>
                            <Loader className={`h-3 w-3 text-center animate-spin`} />
                          </>
                        ) : (
                          <>
                            <Upload className={`h-3 w-3 ${lang === "ar" ? "ml-1"  : "mr-1"}`} />
                            {t("product.createProduct.additionalImageUpload")}
                          </>
                        )}  
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "pricing" && (
        <div className="bg-white rounded-lg shadow-lg border border-[#c8c2fd]/30 overflow-hidden">
          <div className="bg-[#1e3a8a] px-6 py-4 flex items-center space-x-2">
            <DollarSign className="h-5 w-5 text-white" />
            <h2 className="text-lg font-medium text-white">{t("product.createProduct.price")}</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="product-price"
                  className="flex items-center space-x-2 text-sm font-medium text-[#1e3a8a] mb-1"
                >
                  <DollarSign className="h-4 w-4" />
                  <span>{t("product.createProduct.priceLabel")}</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    id="product-price"
                    name="prix"
                    value={formData.prix}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="block py-3 pl-10 pr-4 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:border-[#6D28D9] sm:text-sm"
                    placeholder={t("product.createProduct.pricePlaceholder")}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="product-compare-price"
                  className="flex items-center space-x-2 text-sm font-medium text-[#1e3a8a] mb-1"
                >
                  <BarChart2 className="h-4 w-4" />
                  <span>{t("product.createProduct.comparePriceLabel")}</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    id="product-compare-price"
                    name="comparePrice"
                    value={formData.comparePrice}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="block py-3 pl-10 pr-4 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:border-[#6D28D9] sm:text-sm"
                    placeholder={t("product.createProduct.comparePricePlaceholder")}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="product-cost"
                  className="flex items-center space-x-2 text-sm font-medium text-[#1e3a8a] mb-1"
                >
                  <DollarSign className="h-4 w-4" />
                  <span>{t("product.createProduct.costLabel")}</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    id="product-cost"
                    name="cost"
                    value={formData.cost}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="block py-3 pl-10 pr-4 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:border-[#6D28D9] sm:text-sm"
                    placeholder={t("product.createProduct.costPlaceholder")}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="product-sku"
                  className="flex items-center space-x-2 text-sm font-medium text-[#1e3a8a] mb-1"
                >
                  <Box className="h-4 w-4" />
                  <span>{t("product.createProduct.skuLabel")}</span>
                </label>
                <input
                  type="text"
                  id="product-sku"
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  className="block py-3 px-4 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:border-[#6D28D9] sm:text-sm"
                  placeholder={t("product.createProduct.skuPlaceholder")}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="product-stock"
                  className="flex items-center space-x-2 text-sm font-medium text-[#1e3a8a] mb-1"
                >
                  <Layers className="h-4 w-4" />
                  <span>{t("product.createProduct.stockLabel")}</span>
                </label>
                <input
                  type="number"
                  id="product-stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  min="0"
                  className="block py-3 px-4 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:border-[#6D28D9] sm:text-sm"
                  placeholder={t("product.createProduct.stockPlaceholder")}
                />
              </div>

              <div>
                <label
                  htmlFor="product-low-stock"
                  className="flex items-center space-x-2 text-sm font-medium text-[#1e3a8a] mb-1"
                >
                  <AlertTriangle className="h-4 w-4" />
                  <span>{t("product.createProduct.lowStockLabel")}</span>
                </label>
                <input
                  type="number"
                  id="product-low-stock"
                  name="lowStockAlert"
                  value={formData.lowStockAlert}
                  onChange={handleInputChange}
                  min="0"
                  className="block py-3 px-4 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:border-[#6D28D9] sm:text-sm"
                  placeholder={t("product.createProduct.lowStockPlaceholder")}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "shipping" && (
        <div className="bg-white rounded-lg shadow-lg border border-[#c8c2fd]/30 overflow-hidden">
          <div className="bg-[#1e3a8a] px-6 py-4 flex items-center space-x-2">
            <Truck className="h-5 w-5 text-white" />
            <h2 className="text-lg font-medium text-white">{t("product.createProduct.shippingClass")}</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="product-weight"
                  className="flex items-center space-x-2 text-sm font-medium text-[#1e3a8a] mb-1"
                >
                  <Package className="h-4 w-4" />
                  <span>{t("product.createProduct.weightLabel")}</span>
                </label>
                <input
                  type="number"
                  id="product-weight"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="block py-3 px-4 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:border-[#6D28D9] sm:text-sm"
                  placeholder={t("product.createProduct.weightPlaceholder")}
                />
              </div>

              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-[#1e3a8a] mb-1">
                  <Box className="h-4 w-4" />
                  <span>{t("product.createProduct.dimensionsLabel")}</span>
                </label>
                <div className="mt-1 flex gap-2">
                  <input
                    type="number"
                    placeholder={t("product.createProduct.lengthPlaceholder")}
                    name="dimensions.length"
                    value={formData.dimensions[0].length}
                    onChange={handleInputChange}
                    className="block w-full py-3 px-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:border-[#6D28D9] sm:text-sm"
                  />
                  <input
                    type="number"
                    placeholder={t("product.createProduct.widthPlaceholder")}
                    name="dimensions.width"
                    value={formData.dimensions[0].width}
                    onChange={handleInputChange}
                    className="block w-full py-3 px-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:border-[#6D28D9] sm:text-sm"
                  />
                  <input
                    type="number"
                    placeholder={t("product.createProduct.heightPlaceholder")}
                    name="dimensions.height"
                    value={formData.dimensions[0].height}
                    onChange={handleInputChange}
                    className="block w-full py-3 px-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:border-[#6D28D9] sm:text-sm"
                  />
                  <select
                    name="dimensions.unit"
                    value={formData.dimensions[0].unit}
                    onChange={handleInputChange}
                    className="block w-full py-3 px-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:border-[#6D28D9] sm:text-sm"
                  >
                    <option value="cm">{t("product.createProduct.cm")}</option>
                    <option value="m">{t("product.createProduct.m")}</option>
                    <option value="mm">{t("product.createProduct.mm")}</option>
                    <option value="in">{t("product.createProduct.in")}</option>
                    <option value="ft">{t("product.createProduct.ft")}</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="product-shipping-class"
                className="flex items-center space-x-2 text-sm font-medium text-[#1e3a8a] mb-1"
              >
                <Truck className="h-4 w-4" />
                <span>{t("product.createProduct.shippingClassLabel")}</span>
              </label>
              <div className="relative">
                <select
                  id="product-shipping-class"
                  name="shippingClass"
                  value={formData.shippingClass}
                  onChange={handleInputChange}
                  className="block py-3 px-4 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:border-[#6D28D9] sm:text-sm appearance-none"
                >
                  <option value="">{t("product.createProduct.selectShippingClass")}</option>
                  <option value="standard">{t("product.createProduct.standard")}</option>
                  <option value="express">{t("product.createProduct.express")}</option>
                  <option value="free">{t("product.createProduct.free")}</option>
                  <option value="local_pickup">{t("product.createProduct.localPickup")}</option>
                  <option value="heavy">{t("product.createProduct.heavy")}</option>
                  <option value="fragile">{t("product.createProduct.fragile")}</option>
                  <option value="international">{t("product.createProduct.international")}</option>
                </select>
                <div className={`absolute inset-y-0 ${lang === "ar" ? "left-0 pl-3" : "right-0 pr-3"} flex items-center  pointer-events-none`}>
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2 mt-6">
        <button
          type="button"
          onClick={handleCancel}
          className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c8c2fd] transition-colors"
        >
          <X className={lang === "ar" ? "h-4 w-4 ml-2" : "h-4 w-4 mr-2"} />
          {t("product.createProduct.cancel")}
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#6D28D9] hover:bg-[#6D28D9]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c8c2fd] disabled:opacity-50 transition-colors"
        >
          <Save className={lang === "ar" ? "h-4 w-4 ml-2" : "h-4 w-4 mr-2"} />
          {loading ? t("product.createProduct.creating") : t("product.createProduct.create")}
        </button>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md border border-red-200 flex items-start">
          <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}
