"use client"

import { useState } from "react"
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
} from "lucide-react"
import ShinyButton from "../../../blocks/TextAnimations/ShinyButton/ShinyButton"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"

export default function AddStorePage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [boutique, setBoutique] = useState({
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

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name.startsWith("location.")) {
      const field = name.split(".")[1]
      setBoutique((prev) => ({
        ...prev,
        location: [
          {
            ...prev.location[0],
            [field]: value,
          },
        ],
      }))
    } else {
      setBoutique((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleFileChange = (e, type) => {
    const file = e.target.files[0]
    if (!file) return

    if (type === "logo") {
      setLogo(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result)
      }
      reader.readAsDataURL(file)
    } else {
      setBanniere(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setBannierePreview(reader.result)
      }
      reader.readAsDataURL(file)
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

      console.log("Récupération des informations utilisateur...")
      const userResponse = await axios.get("http://localhost:1337/api/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      console.log("Informations utilisateur:", userResponse.data)

      if (!boutique.nom || !boutique.description || !boutique.category || !boutique.emplacement) {
        throw new Error("Veuillez remplir tous les champs obligatoires")
      }

      const requestData = {
        data: {
          nom: boutique.nom,
          description: boutique.description,
          emplacement: boutique.emplacement,
          category: boutique.category,
          statusBoutique: boutique.statusBoutique,
          location: boutique.location,
          owner: userResponse.data.documentId,
        },
      }

      console.log("Données de la requête:", JSON.stringify(requestData, null, 2))

      const response = await axios({
        method: "POST",
        url: "http://localhost:1337/api/boutiques",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: requestData,
      })

      console.log("Réponse de Strapi:", response.data)

      if (response.data.data?.id) {
        const boutiqueId = response.data.data.id

        if (logo) {
          console.log("Upload du logo...")
          const logoFormData = new FormData()
          logoFormData.append("ref", "api::boutique.boutique")
          logoFormData.append("refId", boutiqueId)
          logoFormData.append("field", "logo")
          logoFormData.append("files", logo)

          const logoResponse = await axios.post("http://localhost:1337/api/upload", logoFormData, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          })
          console.log("Logo uploadé:", logoResponse.data)
        }

        if (banniere) {
          console.log("Upload de la bannière...")
          const banniereFormData = new FormData()
          banniereFormData.append("ref", "api::boutique.boutique")
          banniereFormData.append("refId", boutiqueId)
          banniereFormData.append("field", "banniere")
          banniereFormData.append("files", banniere)

          const banniereResponse = await axios.post("http://localhost:1337/api/upload", banniereFormData, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          })
          console.log("Bannière uploadée:", banniereResponse.data)
        }

        console.log("Création de la boutique terminée avec succès")
        navigate("/controll/stores")
      }
    } catch (error) {
      console.error("Erreur complète:", error)
      console.error("Détails de l'erreur:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      })
      setError(error.response?.data?.error?.message || error.message || "Erreur lors de la création de la boutique")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 p-6 bg-white">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-[#6D28D9] p-3 rounded-lg shadow-lg">
          <Store className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1e3a8a]">{t("store.createStore.title")}</h1>
          <p className="text-[#6D28D9]/70">{t("store.createStore.subtitle")}</p>
        </div>
      </div>

      <div className="bg-[#c8c2fd]/10 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-2 text-[#6D28D9]">
          <Info className="h-5 w-5" />
          <p className="text-sm">Remplissez les informations de votre boutique pour commencer à vendre.</p>
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
          <FileText className="h-5 w-5 text-white" />
          <h3 className="text-lg font-medium text-white">{t("store.createStore.storeInfo")}</h3>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <label htmlFor="nom" className="flex items-center space-x-2 text-sm font-medium text-[#1e3a8a] mb-1">
              <Store className="h-4 w-4" />
              <span>{t("store.createStore.storeName")}</span>
            </label>
            <input
              id="nom"
              name="nom"
              value={boutique.nom}
              onChange={handleInputChange}
              placeholder={t("store.createStore.storeNamePlaceholder")}
              className="w-full h-11 px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:border-[#6D28D9] transition-all duration-200 placeholder:text-gray-400"
              required
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="description"
              className="flex items-center space-x-2 text-sm font-medium text-[#1e3a8a] mb-1"
            >
              <FileText className="h-4 w-4" />
              <span>{t("store.createStore.description")}</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={boutique.description}
              onChange={handleInputChange}
              placeholder={t("store.createStore.descriptionPlaceholder")}
              className="w-full min-h-[100px] px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:border-[#6D28D9] transition-all duration-200 placeholder:text-gray-400 resize-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="category"
                  className="flex items-center space-x-2 text-sm font-medium text-[#1e3a8a] mb-1"
                >
                  <Tag className="h-4 w-4" />
                  <span>{t("store.createStore.category")}</span>
                </label>
                <div className="relative">
                  <select
                    id="category"
                    name="category"
                    value={boutique.category}
                    onChange={handleInputChange}
                    className="w-full h-11 px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:border-[#6D28D9] transition-all duration-200 appearance-none cursor-pointer"
                    required
                  >
                    <option value="">{t("store.createStore.selectCategory")}</option>
                    <option value="fashion">{t("store.createStore.categories.fashion")}</option>
                    <option value="electronics">{t("store.createStore.categories.electronics")}</option>
                    <option value="home">{t("store.createStore.categories.home")}</option>
                    <option value="beauty">{t("store.createStore.categories.beauty")}</option>
                    <option value="food">{t("store.createStore.categories.food")}</option>
                    <option value="other">{t("store.createStore.categories.other")}</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="emplacement"
                  className="flex items-center space-x-2 text-sm font-medium text-[#1e3a8a] mb-1"
                >
                  <MapPin className="h-4 w-4" />
                  <span>{t("store.createStore.location")}</span>
                </label>
                <input
                  id="emplacement"
                  name="emplacement"
                  value={boutique.emplacement}
                  onChange={handleInputChange}
                  placeholder={t("store.createStore.locationPlaceholder")}
                  className="w-full h-11 px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:border-[#6D28D9] transition-all duration-200 placeholder:text-gray-400"
                  required
                />
              </div>
              <div className="space-y-2">
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
                  value={boutique.location[0].country}
                  onChange={handleInputChange}
                  placeholder={t("store.createStore.address.countryPlaceholder")}
                  className="w-full h-11 px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:border-[#6D28D9] transition-all duration-200 placeholder:text-gray-400"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
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
                  value={boutique.location[0].addressLine1}
                  onChange={handleInputChange}
                  placeholder={t("store.createStore.address.line1Placeholder")}
                  className="w-full h-11 px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:border-[#6D28D9] transition-all duration-200 placeholder:text-gray-400"
                />
              </div>

              <div className="space-y-2">
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
                  value={boutique.location[0].addressLine2}
                  onChange={handleInputChange}
                  placeholder={t("store.createStore.address.line2Placeholder")}
                  className="w-full h-11 px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:border-[#6D28D9] transition-all duration-200 placeholder:text-gray-400"
                />
              </div>


              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
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
                    value={boutique.location[0].city}
                    onChange={handleInputChange}
                    placeholder={t("store.createStore.address.cityPlaceholder")}
                    className="w-full h-11 px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:border-[#6D28D9] transition-all duration-200 placeholder:text-gray-400"
                  />
                </div>

                <div className="space-y-2">
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
                    value={boutique.location[0].postalCode}
                    onChange={handleInputChange}
                    placeholder={t("store.createStore.address.postalCodePlaceholder")}
                    className="w-full h-11 px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:border-[#6D28D9] transition-all duration-200 placeholder:text-gray-400"
                  />
                </div>
              </div>

              
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-medium text-[#1e3a8a] mb-1">
                <ImageIcon className="h-4 w-4" />
                <span>{t("store.createStore.logo")}</span>
              </label>
              <div className="border-2 relative border-dashed border-[#c8c2fd] rounded-lg p-6 flex flex-col items-center justify-center gap-2 hover:border-[#6D28D9] transition-colors duration-200 bg-[#c8c2fd]/5">
                {logoPreview ? (
                  <div className="relative mb-4">
                    <img
                      src={logoPreview || "/placeholder.svg"}
                      alt="Logo preview"
                      className="h-24 w-24 object-cover rounded-full border-2 border-[#6D28D9]"
                    />
                    <div className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md">
                      <Check className="h-4 w-4 text-green-500" />
                    </div>
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-[#6D28D9]/10 rounded-full flex items-center justify-center mb-2">
                    <Store className="h-8 w-8 text-[#6D28D9]" />
                  </div>
                )}
                <div className="text-center">
                  <p className="text-sm font-medium text-[#6D28D9]">{t("store.createStore.logoDesc")}</p>
                  <p className="text-xs text-[#6D28D9]/70">{t("store.createStore.logoFormat")}</p>
                </div>
                <label
                  htmlFor="logo"
                  className="inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors duration-200 h-9 px-4 py-2 bg-[#6D28D9] text-white hover:bg-[#6D28D9]/90 cursor-pointer"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {t("store.createStore.upload")}
                </label>
                <input
                  type="file"
                  id="logo"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, "logo")}
                  accept="image/*"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-medium text-[#1e3a8a] mb-1">
                <ImageIcon className="h-4 w-4" />
                <span>{t("store.createStore.banner")}</span>
              </label>
              <div className="border-2 border-dashed border-[#c8c2fd] rounded-lg p-6 flex flex-col items-center justify-center gap-2 hover:border-[#6D28D9] transition-colors duration-200 bg-[#c8c2fd]/5">
                {bannierePreview ? (
                  <div className="relative mb-4 w-full">
                    <img
                      src={bannierePreview || "/placeholder.svg"}
                      alt="Banner preview"
                      className="w-full h-32 object-cover rounded-lg border-2 border-[#6D28D9]"
                    />
                    <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md">
                      <Check className="h-4 w-4 text-green-500" />
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-24 bg-[#6D28D9]/10 rounded-lg flex items-center justify-center mb-2">
                    <ImageIcon className="h-8 w-8 text-[#6D28D9]" />
                  </div>
                )}
                <div className="text-center">
                  <p className="text-sm font-medium text-[#6D28D9]">{t("store.createStore.bannerDesc")}</p>
                  <p className="text-xs text-[#6D28D9]/70">{t("store.createStore.bannerFormat")}</p>
                </div>
                <label
                  htmlFor="banniere"
                  className="inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors duration-200 h-9 px-4 py-2 bg-[#6D28D9] text-white hover:bg-[#6D28D9]/90 cursor-pointer"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {t("store.createStore.upload")}
                </label>
                <input
                  type="file"
                  id="banniere"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, "banniere")}
                  accept="image/*"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="w-full items-center flex justify-end p-6 gap-2 border-t border-[#c8c2fd]/30 bg-gray-50">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="inline-flex h-11 items-center justify-center rounded-lg text-sm font-medium transition-colors duration-200 px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 hover:border-[#c8c2fd]"
          >
            <X className="h-4 w-4 mr-2" />
            {t("store.createStore.cancel")}
          </button>
          <ShinyButton rounded={true} className="w-full sm:w-auto" type="submit" disabled={loading}>
            <div className="flex items-center space-x-2">
              <p className="text-sm sm:text-base">
                {loading ? t("store.createStore.creating") : t("store.createStore.create")}
              </p>
              <Save className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </ShinyButton>
        </div>
      </form>
    </div>
  )
}
