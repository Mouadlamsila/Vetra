"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Swal from "sweetalert2"
import axios from "axios"
import { useTranslation } from "react-i18next"
import {
  Store,
  Upload,
  FileText,
  MapPin,
  Building,
  Tag,
  Home,
  Map,
  Save,
  X,
  Info,
  AlertTriangle,
  ImageIcon,
  Check,
  Edit,
  Loader,
} from "lucide-react"

export default function EditStore() {
  const { t } = useTranslation()
  const [formData, setFormData] = useState({
    nom: "",
    description: "",
    emplacement: "",
    category: "other",
    statusBoutique: "pending",
    location: [
      {
        addressLine1: "",
        addressLine2: "",
        city: "",
        postalCode: "",
        country: "",
        isDefault: true,
      },
    ],
  })
  const [logo, setLogo] = useState(null)
  const [logoPreview, setLogoPreview] = useState(null)
  const [banniere, setBanniere] = useState(null)
  const [bannierePreview, setBannierePreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [logoLoading, setLogoLoading] = useState(false)
  const [banniereLoading, setBanniereLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const navigate = useNavigate()
  const { id } = useParams()
  const token = localStorage.getItem("token")
  const lang = localStorage.getItem("lang")
  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        setPageLoading(true)
        const response = await axios.get(`https://useful-champion-e28be6d32c.strapiapp.com/api/boutiques/${id}?populate=*`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })


        const store = response.data.data
        console.log(store)

        setFormData({
          nom: store.nom || "",
          description: store.description || "",
          emplacement: store.emplacement || "",
          category: store.category || "other",
          statusBoutique: store.statusBoutique || "pending",
          location: [
            {
              addressLine1: store.location[0].addressLine1 || "",
              addressLine2: store.location[0].addressLine2 || "",
              city: store.location[0].city || "",
              postalCode: store.location[0].postalCode || "",
              country: store.location[0].country || "",
              isDefault: true,
            },
          ],
        })

        if (store.logo) {
          setLogo(store.logo)
          setLogoPreview(`${store.logo.url}`)
        }
        if (store.banniere) {
          setBanniere(store.banniere)
          setBannierePreview(`${store.banniere.url}`)
        }
      } catch (err) {
        console.error("Error fetching store data:", err)
        setError(t("store.editStore.errorFetch"))
        toast.error(t("store.editStore.errorFetch"), {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })
      } finally {
        setPageLoading(false)
      }
    }

    fetchStoreData()
  }, [id, token])
console.log(formData)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name.startsWith("location.")) {
      const field = name.split(".")[1]
      setFormData((prev) => ({
        ...prev,
        location: [
          {
          ...prev.location[0],
            [field]: value,
          },
        ],
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setLogoLoading(true)
    const formData = new FormData()
    formData.append("files", file)

    try {
      const uploadResponse = await axios.post("https://useful-champion-e28be6d32c.strapiapp.com/api/upload", formData, {
          headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })

      setLogo(uploadResponse.data[0])
      setLogoPreview(URL.createObjectURL(file))
      setLogoLoading(false)

      toast.success(t("store.editStore.successUploadLogo"), {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    } catch (err) {
      setError(t("store.editStore.errorUploadLogo"))
      setLogoLoading(false)
      console.error("Error uploading logo:", err)
      toast.error(t("store.editStore.errorUploadLogo"), {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    }
  }

  const handleBanniereUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setBanniereLoading(true)
    const formData = new FormData()
    formData.append("files", file)

    try {
      const uploadResponse = await axios.post("https://useful-champion-e28be6d32c.strapiapp.com/api/upload", formData, {
          headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })

      setBanniere(uploadResponse.data[0])
      setBannierePreview(URL.createObjectURL(file))
      setBanniereLoading(false)

      toast.success(t("store.editStore.successUploadBanniere"), {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    } catch (err) {
      setError(t("store.editStore.errorUploadBanniere"))
      setBanniereLoading(false)
      console.error("Error uploading banniere:", err)
      toast.error(t("store.editStore.errorUploadBanniere"), {
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
      if (!formData.nom || !formData.description || !formData.category || !formData.emplacement) {
        throw new Error(t("store.editStore.errorRequired"))
      }

      const storeData = {
        data: {
          nom: formData.nom,
          description: formData.description,
          emplacement: formData.emplacement,
          category: formData.category,
          statusBoutique: formData.statusBoutique,
          location: formData.location,
          logo: logo ? logo.id : null,
          banniere: banniere ? banniere.id : null,
        },
        }

      console.log("Submitting Store Data:", JSON.stringify(storeData, null, 2))

      const response = await axios.put(`https://useful-champion-e28be6d32c.strapiapp.com/api/boutiques/${id}`, storeData, {
          headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      toast.success(t("store.editStore.successUpdate"), {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })

      await Swal.fire({
        title: t("store.editStore.successTitle"),
        text: t("store.editStore.successText"),
        icon: "success",
        confirmButtonText: t("store.editStore.successConfirm"),
        confirmButtonColor: "#6D28D9",
      })

      navigate("/controll/stores")
    } catch (err) {
      console.error("Error updating store:", err)
      console.error("Error details:", err.response?.data)
      setError(err.message || t("store.editStore.errorUpdate"))
      toast.error(err.response?.data?.error?.message || t("store.editStore.errorUpdate"), {
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
    const result = await Swal.fire({
      title: t("store.editStore.cancelTitle"),
      text: t("store.editStore.cancelText"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#6D28D9",
      cancelButtonColor: "#d33",
      confirmButtonText: t("store.editStore.cancelConfirm"),
      cancelButtonText: t("store.editStore.cancelCancel"),
    })
    
    if (result.isConfirmed) {
      navigate("/controll/stores")
    }
  }

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6D28D9]"></div>
          <p className="text-[#6D28D9] font-medium">{t('store.editStore.loading')}</p>
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
          <h1 className="text-3xl font-bold tracking-tight text-[#1e3a8a]">{t("store.editStore.title")}</h1>
          <p className="text-[#6D28D9]/70">{t("store.editStore.subtitle")}</p>
        </div>
      </div>

      <div className="bg-[#c8c2fd]/10 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-2 text-[#6D28D9]">
          <Info className="h-5 w-5" />
          <p className="text-sm">{t("store.editStore.storeInfoDesc")}</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
          <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="rounded-lg border border-[#c8c2fd]/30 bg-white text-card-foreground shadow-lg overflow-hidden"
      >
        <div className="bg-[#1e3a8a] px-6 py-4 flex items-center space-x-2">
          <Store className="h-5 w-5 text-white" />
          <h3 className="text-lg font-medium text-white">{t("store.editStore.storeInfo")}</h3>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="store-name"
                className="flex items-center space-x-2 text-sm font-medium text-[#1e3a8a] mb-1"
              >
                <Store className="h-4 w-4" />
                <span>{t("store.createStore.storeName")}</span>
              </label>
              <input
                type="text"
                id="store-name"
                name="nom"
                value={formData?.nom}
                onChange={handleInputChange}
                className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:border-[#6D28D9] sm:text-sm"
                placeholder={t("store.createStore.storeNamePlaceholder")}
                required
              />
            </div>

            <div>
              <label
                htmlFor="store-category"
                className="flex items-center space-x-2 text-sm font-medium text-[#1e3a8a] mb-1"
              >
                <Tag className="h-4 w-4" />
                <span>{t("store.createStore.category")}</span>
              </label>
              <div className="relative">
              <select
                id="store-category"
                name="category"
                value={formData?.category}
                onChange={handleInputChange}
                 
                  className={`block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#6D28D9] appearance-none focus:border-[#6D28D9] sm:text-sm ${lang === "ar" ? "" : ""}`}
                required
              >
                  <option value="fashion">{t("store.createStore.categories.fashion")}</option>
                  <option value="electronics">{t("store.createStore.categories.electronics")}</option>
                  <option value="home">{t("store.createStore.categories.home")}</option>
                  <option value="beauty">{t("store.createStore.categories.beauty")}</option>
                  <option value="food">{t("store.createStore.categories.food")}</option>
                  <option value="other">{t("store.createStore.categories.other")}</option>
              </select>
                <div className={`absolute inset-y-0  flex items-center  pointer-events-none ${lang === "ar" ? "left-0 pl-3" : "right-0 pr-3"} `}>
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="store-description"
                className="flex items-center space-x-2 text-sm font-medium text-[#1e3a8a] mb-1"
              >
                <FileText className="h-4 w-4" />
                <span>{t("store.createStore.description")}</span>
              </label>
              <textarea
                id="store-description"
                name="description"
                value={formData?.description}
                onChange={handleInputChange}
                rows={4}
                className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:border-[#6D28D9] sm:text-sm"
                placeholder={t("store.createStore.descriptionPlaceholder")}
                required
              />
            </div>

            <div>
              <label
                htmlFor="store-address"
                className="flex items-center space-x-2 text-sm font-medium text-[#1e3a8a] mb-1"
              >
                <MapPin className="h-4 w-4" />
                <span>{t("store.createStore.location")}</span>
              </label>
              <input
                type="text"
                id="store-address"
                name="emplacement"
                value={formData?.emplacement}
                onChange={handleInputChange}
                className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:border-[#6D28D9] sm:text-sm"
                placeholder={t("store.createStore.locationPlaceholder")}
                required
              />
            </div>

            <div>
              <label
                htmlFor="location.addressLine1"
                className="flex items-center space-x-2 text-sm font-medium text-[#1e3a8a] mb-1"
              >
                <Home className="h-4 w-4" />
                <span>{t("store.createStore.address.line1")}</span>
              </label>
              <input
                id="location.addressLine1"
                name="location.addressLine1"
                value={formData?.location[0]?.addressLine1}
                onChange={handleInputChange}
                className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:border-[#6D28D9] sm:text-sm"
                placeholder={t("store.createStore.address.line1Placeholder")}
              />
            </div>

            <div>
              <label
                htmlFor="location.addressLine2"
                className="flex items-center space-x-2 text-sm font-medium text-[#1e3a8a] mb-1"
              >
                <Building className="h-4 w-4" />
                <span>{t("store.createStore.address.line2")}</span>
              </label>
              <input
                id="location.addressLine2"
                name="location.addressLine2"
                value={formData?.location[0]?.addressLine2}
                onChange={handleInputChange}
                className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:border-[#6D28D9] sm:text-sm"
                placeholder={t("store.createStore.address.line2Placeholder")}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
            <div>
                <label
                  htmlFor="location.city"
                  className="flex items-center space-x-2 text-sm font-medium text-[#1e3a8a] mb-1"
                >
                  <Building className="h-4 w-4" />
                  <span>{t("store.createStore.address.city")}</span>
              </label>
              <input
                id="location.city"
                name="location.city"
                value={formData?.location[0]?.city}
                onChange={handleInputChange}
                  className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:border-[#6D28D9] sm:text-sm"
                  placeholder={t("store.createStore.address.cityPlaceholder")}
              />
            </div>

            <div>
                <label
                  htmlFor="location.postalCode"
                  className="flex items-center space-x-2 text-sm font-medium text-[#1e3a8a] mb-1"
                >
                  <MapPin className="h-4 w-4" />
                  <span>{t("store.createStore.address.postalCode")}</span>
              </label>
              <input
                id="location.postalCode"
                name="location.postalCode"
                value={formData?.location[0]?.postalCode}
                onChange={handleInputChange}
                  className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:border-[#6D28D9] sm:text-sm"
                  placeholder={t("store.createStore.address.postalCodePlaceholder")}
              />
              </div>
            </div>

            <div>
              <label
                htmlFor="location.country"
                className="flex items-center space-x-2 text-sm font-medium text-[#1e3a8a] mb-1"
              >
                <Map className="h-4 w-4" />
                <span>{t("store.createStore.address.country")}</span>
              </label>
              <input
                id="location.country"
                name="location.country"
                value={formData?.location[0]?.country}
                onChange={handleInputChange}
                className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:border-[#6D28D9] sm:text-sm"
                placeholder={t("store.createStore.address.countryPlaceholder")}
              />
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center space-x-2 text-sm font-medium text-[#1e3a8a] mb-1">
                <ImageIcon className="h-4 w-4" />
                <span>{t("store.createStore.logo")}</span>
              </label>
              <div className="mt-1 flex flex-col sm:flex-row items-start gap-4">
                <div className="relative w-24 h-24 border-2 border-[#c8c2fd] rounded-lg overflow-hidden bg-[#c8c2fd]/5 flex items-center justify-center">
                  {logoLoading ? (
                    <Loader className="h-8 w-8 text-[#6D28D9] animate-spin" />
                  ) : logoPreview ? (
                    <>
                      <img
                        src={logoPreview || "/placeholder.svg"}
                        alt={t("store.createStore.logo")}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md">
                        <Check className="h-3 w-3 text-green-500" />
                      </div>
                    </>
                  ) : (
                    <Store className="h-10 w-10 text-[#6D28D9]/40" />
                  )}
                </div>
                <div className="flex flex-col space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                  id="store-logo"
                  disabled={logoLoading}
                />
                <label
                  htmlFor="store-logo"
                    className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#6D28D9] hover:bg-[#6D28D9]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6D28D9] cursor-pointer ${
                      logoLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                >
                    <Upload className={`h-4 w-4 ${lang === "ar" ? "ml-2" : "mr-2 "}`} />
                    {logoLoading ? t("store.editStore.updating") : t("store.createStore.upload")}
                </label>
                  {logo && (
                    <button
                      type="button"
                      onClick={() => {
                        setLogo(null)
                        setLogoPreview(null)
                      }}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c8c2fd]"
                    >
                      <X className={`h-4 w-4  ${lang === "ar" ? "ml-2" : "mr-2"}`} />
                      {t("store.editStore.removeLogo")}
                    </button>
                  )}
                  </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center space-x-2 text-sm font-medium text-[#1e3a8a] mb-1">
                <ImageIcon className="h-4 w-4" />
                <span>{t("store.createStore.banner")}</span>
              </label>
              <div className="mt-1 flex flex-col space-y-4">
                <div className="relative w-full h-32 border-2 border-[#c8c2fd] rounded-lg overflow-hidden bg-[#c8c2fd]/5 flex items-center justify-center">
                  {banniereLoading ? (
                    <Loader className="h-8 w-8 text-[#6D28D9] animate-spin" />
                  ) : bannierePreview ? (
                    <>
                      <img
                        src={bannierePreview || "/placeholder.svg"}
                        alt={t("store.createStore.banner")}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md">
                        <Check className="h-3 w-3 text-green-500" />
                      </div>
                    </>
                  ) : (
                    <ImageIcon className="h-10 w-10 text-[#6D28D9]/40" />
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBanniereUpload}
                  className="hidden"
                  id="store-banniere"
                  disabled={banniereLoading}
                />
                <label
                  htmlFor="store-banniere"
                    className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#6D28D9] hover:bg-[#6D28D9]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6D28D9] cursor-pointer ${
                      banniereLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                >
                    <Upload className={`h-4 w-4 ${lang === "ar" ? "ml-2" : "mr-2"}`} />
                    {banniereLoading ? t("store.editStore.updating") : t("store.createStore.upload")}
                </label>
                  {banniere && (
                    <button
                      type="button"
                      onClick={() => {
                        setBanniere(null)
                        setBannierePreview(null)
                      }}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c8c2fd]"
                    >
                      <X className={`h-4 w-4 ${lang === "ar" ? "ml-2" : "mr-2"}`} />
                      {t("store.editStore.removeBanner")}
                    </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

        <div className="w-full items-center flex justify-end p-6 gap-2 border-t border-[#c8c2fd]/30 bg-gray-50">
        <button
          type="button"
          onClick={handleCancel}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c8c2fd]"
        >
            <X className={`h-4 w-4 ${lang === "ar" ? "ml-2" : "mr-2"}`} />
            {t("store.createStore.cancel")}
        </button>
        <button
            type="submit"
          disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#6D28D9] hover:bg-[#6D28D9]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6D28D9] disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader className={`h-4 w-4 ${lang === "ar" ? "ml-2" : "mr-2"} animate-spin`} />
                {t("store.editStore.updating")}
              </>
            ) : (
              <>
                <Save className={`h-4 w-4 ${lang === "ar" ? "ml-2" : "mr-2"}`} />
                {t("store.editStore.update")}
              </>
            )}
        </button>
        </div>
      </form>
    </div>
  )
} 
