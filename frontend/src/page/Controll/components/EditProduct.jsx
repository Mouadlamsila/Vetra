"use client"

import { useState, useEffect } from "react"
import {
  Upload,
  FileText,
  ImageIcon,
  DollarSign,
  Package,
  Truck,
  Save,
  X,
  Info,
  AlertTriangle,
  ShoppingBag,
  Layers,
  BarChart2,
  Box,
  Tag,
  Store,
  Edit,
  Loader,
  Check,
  ChevronDown,
} from "lucide-react"
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Swal from "sweetalert2"
import { useTranslation } from "react-i18next"

export default function EditProduct() {
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
  const [pageLoading, setPageLoading] = useState(true)
  const [mainImagePreview, setMainImagePreview] = useState(null)
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState([])
  const navigate = useNavigate()
  const { id } = useParams()
  const IDUser = localStorage.getItem("IDUser")
  const [additionalImageLoading, setAdditionalImageLoading] = useState(false)
  const [mainImageLoading, setMainImageLoading] = useState(false)
  const lang = localStorage.getItem("lang")

  useEffect(() => {
    const fetchData = async () => {
      try {
        setPageLoading(true)
        const token = localStorage.getItem("token")
        if (!token) {
          throw new Error("Token non trouvé. Veuillez vous connecter.")
        }

        // Fetch categories
        const categoriesResponse = await axios.get('https://stylish-basket-710b77de8f.strapiapp.com/api/categorie-products', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setCategories(categoriesResponse.data.data)

        // Fetch stores
        const storesResponse = await axios.get(`https://stylish-basket-710b77de8f.strapiapp.com/api/users/${IDUser}?populate=boutiques`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setStores(storesResponse.data.boutiques || [])

        // Fetch product data
        const productResponse = await axios.get(`https://stylish-basket-710b77de8f.strapiapp.com/api/products/${id}?populate=*`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const product = productResponse.data.data

        // Set image previews if available
        if (product.imgMain?.url) {
          setMainImagePreview(`${product.imgMain.url}`)
        }

        if (product.imgsAdditional && product.imgsAdditional.length > 0) {
          const previews = product.imgsAdditional.map((img) => `${img.url}`)
          setAdditionalImagePreviews(previews)
        }

        setFormData({
          name: product.name || "",
          description: product.description || "",
          categories: product.category?.id || "",
          boutique: product.boutique?.id || null,
          tags: product.tags || "",
          prix: product.prix || 0,
          comparePrice: product.comparePrice || 0,
          cost: product.cost || 0,
          sku: product.sku || "",
          stock: product.stock || 0,
          lowStockAlert: product.lowStockAlert || 0,
          weight: product.weight || 0,
          dimensions: product.dimensions || [
            {
              length: 0,
              width: 0,
              height: 0,
              unit: "cm",
            },
          ],
          shippingClass: product.shippingClass || "",
          imgMain: product.imgMain?.id || null,
          imgsAdditional: product.imgsAdditional?.map((img) => img.id) || [],
        })
      } catch (err) {
        console.error("Error fetching data:", err)
        setError(t("product.editProduct.fetchError"))
      } finally {
        setPageLoading(false)
      }
    }

    fetchData()
  }, [id, IDUser, t])

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
      setFormData((prev) => ({
        ...prev,
        boutique: value,
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

      // Set appropriate loading state
      if (isMain) {
        setMainImageLoading(true)
      } else {
        setAdditionalImageLoading(true)
      }

      const uploadResponse = await axios.post("https://stylish-basket-710b77de8f.strapiapp.com/api/upload", formData, {
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
        setMainImagePreview(URL.createObjectURL(files[0]))
        setMainImageLoading(false)
      } else {
        setFormData((prev) => ({
          ...prev,
          imgsAdditional: [...prev.imgsAdditional, uploadResponse.data[0].id],
        }))
        setAdditionalImagePreviews((prev) => [...prev, URL.createObjectURL(files[0])])
        setAdditionalImageLoading(false)
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
      // Reset loading states on error
      if (isMain) {
        setMainImageLoading(false)
      } else {
        setAdditionalImageLoading(false)
      }

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

  const handleRemoveImage = (index) => {
    if (index === -1) {
      // Remove main image
      setFormData((prev) => ({
        ...prev,
        imgMain: null,
      }))
      setMainImagePreview(null)
    } else {
      // Remove additional image
      setFormData((prev) => ({
        ...prev,
        imgsAdditional: prev.imgsAdditional.filter((_, i) => i !== index),
      }))
      setAdditionalImagePreviews((prev) => prev.filter((_, i) => i !== index))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Token non trouvé. Veuillez vous connecter.")
      }

      if (!formData.name || !formData.description || !formData.categories || !formData.boutique) {
        throw new Error("Veuillez remplir tous les champs obligatoires")
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

      await axios.put(`https://stylish-basket-710b77de8f.strapiapp.com/api/products/${id}`, productData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      toast.success(t("product.editProduct.success"))

      await Swal.fire({
        title: t("product.editProduct.successTitle"),
        text: t("product.editProduct.successText"),
        icon: "success",
        confirmButtonText: t("product.editProduct.successConfirm"),
        confirmButtonColor: "#6D28D9",
      })

      navigate("/controll/products")
    } catch (err) {
      setError(err.message || "Failed to update product")
      console.error("Error updating product:", err)
      toast.error(t("product.editProduct.error"))
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async () => {
    const result = await Swal.fire({
      title: t("product.editProduct.cancelTitle"),
      text: t("product.editProduct.cancelText"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#6D28D9",
      cancelButtonColor: "#d33",
      confirmButtonText: t("product.editProduct.cancelConfirm"),
      cancelButtonText: t("product.editProduct.cancelCancel"),
    })

    if (result.isConfirmed) {
      navigate("/controll/products")
    }
  }

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6D28D9]"></div>
          <p className="text-[#6D28D9] font-medium">{t("product.editProduct.loading")}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6 bg-white">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-[#6D28D9] p-3 rounded-lg shadow-lg">
          <Edit className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1e3a8a]">{t("product.editProduct.title")}</h1>
          <p className="text-[#6D28D9]/70">{t("product.editProduct.description")}</p>
        </div>
      </div>

      <div className="bg-[#c8c2fd]/10 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-2 text-[#6D28D9]">
          <Info className="h-5 w-5" />
          <p className="text-sm">{t("product.editProduct.productInfoDesc")}</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
          <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

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
          <span>{t("product.editProduct.info")}</span>
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
          <span>{t("product.editProduct.images")}</span>
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
          <span>{t("product.editProduct.pricing")}</span>
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
          <span>{t("product.editProduct.shipping")}</span>
        </button>
      </div>

      {activeTab === "info" && (
        <div className="bg-white rounded-lg shadow-lg border border-[#c8c2fd]/30 overflow-hidden">
          <div className="bg-[#1e3a8a] px-6 py-4 flex items-center space-x-2">
            <FileText className="h-5 w-5 text-white" />
            <h2 className="text-lg font-medium text-white">{t("product.editProduct.productInfo")}</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="product-name"
                  className="flex items-center space-x-2 text-sm font-medium text-[#1e3a8a] mb-1"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>{t("product.editProduct.productName")}</span>
                </label>
                <input
                  type="text"
                  id="product-name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="block py-3 px-4 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:border-[#6D28D9] sm:text-sm"
                  placeholder={t("product.editProduct.productNamePlaceholder")}
                />
              </div>

              <div>
                <label
                  htmlFor="product-description"
                  className="flex items-center space-x-2 text-sm font-medium text-[#1e3a8a] mb-1"
                >
                  <FileText className="h-4 w-4" />
                  <span>{t("product.editProduct.description")}</span>
                </label>
                <textarea
                  id="product-description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="block py-3 px-4 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:border-[#6D28D9] sm:text-sm"
                  placeholder={t("product.editProduct.descriptionPlaceholder")}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="product-category"
                    className="flex items-center space-x-2 text-sm font-medium text-[#1e3a8a] mb-1"
                  >
                    <Tag className="h-4 w-4" />
                    <span>{t("product.editProduct.category")}</span>
                  </label>
                  <div className="relative">
                    <select
                      id="product-category"
                      name="categories"
                      value={formData.categories}
                      onChange={handleInputChange}
                      className="block py-3 px-4 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:border-[#6D28D9] sm:text-sm appearance-none"
                    >
                      <option value="">{t("product.editProduct.selectCategory")}</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    <div className={`absolute inset-y-0  ${lang === 'ar' ? 'left-0 pl-3' : 'right-0 pr-3'} flex items-center  pointer-events-none`}>
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
                    <span>{t("product.editProduct.store")}</span>
                  </label>
                  <div className="relative">
                    <select
                      id="product-store"
                      name="boutique"
                      value={formData.boutique}
                      onChange={handleInputChange}
                      className="block py-3 px-4 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:border-[#6D28D9] sm:text-sm appearance-none"
                    >
                      <option value="">{t("product.editProduct.selectStore")}</option>
                      {stores.map((store) => (
                        <option key={store.id} value={store.id}>
                          {store.nom}
                        </option>
                      ))}
                    </select>
                    <div className={`absolute inset-y-0 ${lang === 'ar' ? 'left-0 pl-3' : 'right-0 pr-3'} flex items-center pointer-events-none`}>
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
                  <span>{t("product.editProduct.tags")}</span>
                </label>
                <input
                  type="text"
                  id="product-tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  className="block py-3 px-4 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:border-[#6D28D9] sm:text-sm"
                  placeholder={t("product.editProduct.tagsPlaceholder")}
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
            <h2 className="text-lg font-medium text-white">{t("product.editProduct.productImages")}</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-[#1e3a8a] mb-1">
                  <ImageIcon className="h-4 w-4" />
                  <span>{t("product.editProduct.mainImage")}</span>
                </label>
                <div className="mt-1 border-2 border-dashed border-[#c8c2fd] rounded-lg p-8 flex flex-col items-center justify-center gap-2 bg-[#c8c2fd]/5 transition-all hover:bg-[#c8c2fd]/10">
                  {mainImagePreview ? (
                    <div className="mb-4 relative">
                      <img
                        src={mainImagePreview || "/placeholder.svg"}
                        alt="Main product"
                        className="max-h-48 object-contain rounded-md shadow-md"
                      />
                      <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md">
                        <Check className="h-4 w-4 text-green-500" />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(-1)}
                        className="absolute top-2 left-2 bg-white text-red-500 rounded-full p-1.5 shadow-md hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    mainImageLoading ? (
                      <div className="w-24 h-24 bg-[#6D28D9]/10 rounded-full flex items-center justify-center mb-4">
                        <Loader className="h-10 w-10 text-[#6D28D9] animate-spin" />
                      </div>
                    ) : (
                      <div className="w-24 h-24 bg-[#6D28D9]/10 rounded-full flex items-center justify-center mb-4">
                        <ImageIcon className="h-10 w-10 text-[#6D28D9]" />
                      </div>
                    )
                  )}
                  <div className="text-center">
                    <p className="text-sm font-medium text-[#6D28D9]">
                      {t("product.editProduct.mainImageDescription")}
                    </p>
                    <p className="text-xs text-[#6D28D9]/70">{t("product.editProduct.mainImageSize")}</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, true)}
                    className="hidden"
                    id="main-image"
                    disabled={mainImageLoading}
                  />
                  <label
                    htmlFor="main-image"
                    className={`mt-2 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#6D28D9] hover:bg-[#6D28D9]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6D28D9] cursor-pointer transition-colors ${mainImageLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {mainImageLoading ? (
                      <>
                        <Loader className="h-4 w-4 mr-2 animate-spin" />
                        {t("product.editProduct.uploading")}
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        {t("product.editProduct.uploadMainImage")}
                      </>
                    )}
                  </label>
                </div>
              </div>

              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-[#1e3a8a] mb-1">
                  <Layers className="h-4 w-4" />
                  <span>{t("product.editProduct.additionalImages")}</span>
                </label>
                <div className="mt-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {additionalImagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview || "/placeholder.svg"}
                        alt={`Additional ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-[#c8c2fd]/30 shadow-md group-hover:opacity-75 transition-opacity"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-2 right-2 bg-white text-red-500 rounded-full p-1.5 shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  {additionalImagePreviews.length < 3 && (
                    <div className="border-2 border-dashed border-[#c8c2fd] rounded-lg p-4 flex flex-col items-center justify-center gap-2 bg-[#c8c2fd]/5 transition-all hover:bg-[#c8c2fd]/10">
                      <div className="w-12 h-12 bg-[#6D28D9]/10 rounded-full flex items-center justify-center mb-2">
                        {additionalImageLoading ? (
                          <Loader className="h-6 w-6 text-[#6D28D9] animate-spin" />
                        ) : (
                          <Upload className="h-6 w-6 text-[#6D28D9]" />
                        )}
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-[#6D28D9]/70">
                          {additionalImageLoading
                            ? t("product.editProduct.uploading")
                            : t("product.editProduct.additionalImageDescription", {
                              index: additionalImagePreviews.length + 1,
                            })}
                        </p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e)}
                        className="hidden"
                        id={`additional-image-${additionalImagePreviews.length}`}
                        disabled={additionalImageLoading}
                      />
                      <label
                        htmlFor={`additional-image-${additionalImagePreviews.length}`}
                        className={`mt-2 inline-flex items-center px-3 py-1.5 border border-[#6D28D9] rounded-md text-xs font-medium text-[#6D28D9] bg-white hover:bg-[#6D28D9]/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6D28D9] cursor-pointer transition-colors ${additionalImageLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        {additionalImageLoading ? (
                          <>
                            <Loader className="h-3 w-3 mr-1 animate-spin" />
                            {t("product.editProduct.uploading")}
                          </>
                        ) : (
                          <>
                            <Upload className="h-3 w-3 mr-1" />
                            {t("product.editProduct.addAdditionalImage")}
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
            <h2 className="text-lg font-medium text-white">{t("product.editProduct.productPricing")}</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="product-price"
                  className="flex items-center space-x-2 text-sm font-medium text-[#1e3a8a] mb-1"
                >
                  <DollarSign className="h-4 w-4" />
                  <span>{t("product.editProduct.price")}</span>
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
                    placeholder={t("product.editProduct.pricePlaceholder")}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="product-compare-price"
                  className="flex items-center space-x-2 text-sm font-medium text-[#1e3a8a] mb-1"
                >
                  <BarChart2 className="h-4 w-4" />
                  <span>{t("product.editProduct.comparePrice")}</span>
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
                    placeholder={t("product.editProduct.comparePricePlaceholder")}
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
                  <span>{t("product.editProduct.cost")}</span>
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
                    placeholder={t("product.editProduct.costPlaceholder")}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="product-sku"
                  className="flex items-center space-x-2 text-sm font-medium text-[#1e3a8a] mb-1"
                >
                  <Box className="h-4 w-4" />
                  <span>{t("product.editProduct.sku")}</span>
                </label>
                <input
                  type="text"
                  id="product-sku"
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  className="block py-3 px-4 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:border-[#6D28D9] sm:text-sm"
                  placeholder={t("product.editProduct.skuPlaceholder")}
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
                  <span>{t("product.editProduct.stock")}</span>
                </label>
                <input
                  type="number"
                  id="product-stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  min="0"
                  className="block py-3 px-4 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:border-[#6D28D9] sm:text-sm"
                  placeholder={t("product.editProduct.stockPlaceholder")}
                />
              </div>

              <div>
                <label
                  htmlFor="product-low-stock"
                  className="flex items-center space-x-2 text-sm font-medium text-[#1e3a8a] mb-1"
                >
                  <AlertTriangle className="h-4 w-4" />
                  <span>{t("product.editProduct.lowStockAlert")}</span>
                </label>
                <input
                  type="number"
                  id="product-low-stock"
                  name="lowStockAlert"
                  value={formData.lowStockAlert}
                  onChange={handleInputChange}
                  min="0"
                  className="block py-3 px-4 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:border-[#6D28D9] sm:text-sm"
                  placeholder={t("product.editProduct.lowStockAlertPlaceholder")}
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
            <h2 className="text-lg font-medium text-white">{t("product.editProduct.productShipping")}</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="product-weight"
                  className="flex items-center space-x-2 text-sm font-medium text-[#1e3a8a] mb-1"
                >
                  <Package className="h-4 w-4" />
                  <span>{t("product.editProduct.weight")}</span>
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
                  placeholder={t("product.editProduct.weightPlaceholder")}
                />
              </div>

              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-[#1e3a8a] mb-1">
                  <Box className="h-4 w-4" />
                  <span>{t("product.editProduct.dimensions")}</span>
                </label>
                <div className="mt-1 flex gap-2">
                  <input
                    type="number"
                    placeholder={t("product.editProduct.lengthPlaceholder")}
                    name="dimensions.length"
                    value={formData.dimensions[0].length}
                    onChange={handleInputChange}
                    className="block w-full py-3 px-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:border-[#6D28D9] sm:text-sm"
                  />
                  <input
                    type="number"
                    placeholder={t("product.editProduct.widthPlaceholder")}
                    name="dimensions.width"
                    value={formData.dimensions[0].width}
                    onChange={handleInputChange}
                    className="block w-full py-3 px-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:border-[#6D28D9] sm:text-sm"
                  />
                  <input
                    type="number"
                    placeholder={t("product.editProduct.heightPlaceholder")}
                    name="dimensions.height"
                    value={formData.dimensions[0].height}
                    onChange={handleInputChange}
                    className="block w-full py-3 px-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:border-[#6D28D9] sm:text-sm"
                  />
                  <div className="w-full relative">
                    <select
                      name="dimensions.unit"
                      value={formData.dimensions[0].unit}
                      onChange={handleInputChange}
                      className="relative block w-full py-3 appearance-none px-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:border-[#6D28D9] sm:text-sm"
                    >
                      <option value="cm">{t("product.editProduct.cm")}</option>
                      <option value="m">{t("product.editProduct.m")}</option>
                      <option value="mm">{t("product.editProduct.mm")}</option>
                      <option value="in">{t("product.editProduct.in")}</option>
                      <option value="ft">{t("product.editProduct.ft")}</option>
                    </select>
                    <div className={`absolute inset-y-0 ${lang === "ar" ? "left-0 pl-3" : "right-0 pr-3"} flex items-center  pointer-events-none `}>
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="product-shipping-class"
                className="flex items-center space-x-2 text-sm font-medium text-[#1e3a8a] mb-1"
              >
                <Truck className="h-4 w-4" />
                <span>{t("product.editProduct.shippingClass")}</span>
              </label>
              <div className="relative">
                <select
                  id="product-shipping-class"
                  name="shippingClass"
                  value={formData.shippingClass}
                  onChange={handleInputChange}
                  className="block py-3 px-4 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:border-[#6D28D9] sm:text-sm appearance-none"
                >
                  <option value="">{t("product.editProduct.selectShippingClass")}</option>
                  <option value="standard">{t("product.editProduct.standard")}</option>
                  <option value="express">{t("product.editProduct.express")}</option>
                  <option value="free">{t("product.editProduct.free")}</option>
                  <option value="local_pickup">{t("product.editProduct.localPickup")}</option>
                  <option value="heavy">{t("product.editProduct.heavy")}</option>
                  <option value="fragile">{t("product.editProduct.fragile")}</option>
                  <option value="international">{t("product.editProduct.international")}</option>
                </select>
                <div className={`absolute inset-y-0 ${lang === 'ar' ? 'left-0' : 'right-0'} flex items-center pr-3 pointer-events-none `}>
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
          <X className={`h-4 w-4  ${lang === 'ar' ? 'ml-2' : 'mr-2'} `} />
          {t("product.editProduct.cancel")}
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#6D28D9] hover:bg-[#6D28D9]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c8c2fd] disabled:opacity-50 transition-colors"
        >
          {loading ? (
            <>
              <Loader className={`h-4 w-4 ${lang === 'ar' ? 'ml-2' : 'mr-2'} animate-spin`} />
              {t("product.editProduct.updating")}
            </>
          ) : (
            <>
              <Save className={`h-4 w-4 ${lang === 'ar' ? 'ml-2' : 'mr-2'}`} />
              {t("product.editProduct.update")}
            </>
          )}
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
