"use client"

import axios from "axios"
import {
  Lock,
  MailIcon,
  PenBox,
  SaveAll,
  Eye,
  EyeOff,
  Camera,
  User,
  Info,
  AlertTriangle,
  CheckCircle,
  Loader,
  X,
  Check,
  Store,
  Package,
  BarChart,
  CreditCard,
} from "lucide-react"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
export default function Profile() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [isEditing, setIsEditing] = useState(true)
  const language = localStorage.getItem("lang")
  const userRole = localStorage.getItem("role")
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    oldPassword: "",
    photo: null,
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  })
  const [previewUrl, setPreviewUrl] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [passwordFocused, setPasswordFocused] = useState(false)

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get("https://useful-champion-e28be6d32c.strapiapp.com/api/users/me?populate=photo", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      setUser(response.data)
      setFormData({
        username: response.data.username,
        email: response.data.email,
        password: "",
        confirmPassword: "",
        oldPassword: "",
        photo: null,
      })
      if (response.data.photo) {
        setPreviewUrl(`${response.data.photo.url}`)
      } else {
        setPreviewUrl(`https://api.dicebear.com/7.x/initials/svg?seed=${response.data.username}&backgroundColor=c8c2fd`)
      }
    } catch (err) {
      setError("Échec de la récupération des données utilisateur")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError(t("dashboard.invalidFile"))
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        setError(t("dashboard.fileTooLarge"))
        return
      }

      const preview = URL.createObjectURL(file)
      setPreviewUrl(preview)

      setFormData((prev) => ({
        ...prev,
        photo: file,
      }))
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (name === "password") {
      checkPasswordRequirements(value)
      setPasswordFocused(true)
    }
  }

  const checkPasswordRequirements = (password) => {
    setPasswordRequirements({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    })
  }

  const verifyOldPassword = async () => {
    try {
      await axios.post("https://useful-champion-e28be6d32c.strapiapp.com/api/auth/local", {
        identifier: user.email,
        password: formData.oldPassword,
      })
      return true
    } catch {
      return false
    }
  }

  const validateForm = async () => {
    if (!formData.oldPassword) {
      setError(t("dashboard.oldPasswordRequired"))
      return false
    }

    const isOldPasswordValid = await verifyOldPassword()
    if (!isOldPasswordValid) {
      setError(t("dashboard.incorrectOldPassword"))
      return false
    }

    if (formData.password) {
      if (formData.password !== formData.confirmPassword) {
        setError(t("dashboard.passwordsDontMatch"))
        return false
      }

      const requirements = Object.values(passwordRequirements)
      if (!requirements.every((req) => req)) {
        setError(t("dashboard.passwordRequirementsNotMet"))
        return false
      }
    }
    return true
  }

  const handleUpdate = async () => {
    setError("")
    setSuccess("")
    setIsUploading(true)

    if (!(await validateForm())) {
      setIsUploading(false)
      return
    }

    try {
      let photoId = null

      // Handle photo upload if a new photo is selected
      if (formData.photo) {
        const uploadFormData = new FormData()
        uploadFormData.append("files", formData.photo)

        const uploadResponse = await axios.post("https://useful-champion-e28be6d32c.strapiapp.com/api/upload", uploadFormData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        })

        if (uploadResponse.data && uploadResponse.data[0]) {
          photoId = uploadResponse.data[0].id
          console.log("Uploaded photo ID:", photoId)
        } else {
          throw new Error(t("dashboard.uploadFailed"))
        }
      }

      // Prepare the update data
      const updateData = {
        username: formData.username,
        email: formData.email,
      }

      if (formData.password) {
        updateData.password = formData.password
      }

      if (photoId) {
        updateData.photo = photoId
      }

      // Update user data
      const response = await axios.put(`https://useful-champion-e28be6d32c.strapiapp.com/api/users/${user.id}`, updateData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      })

      if (response.data) {
        // Fetch updated user data with photo
        const updatedUserResponse = await axios.get("https://useful-champion-e28be6d32c.strapiapp.com/api/users/me?populate=photo", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })

        setUser(updatedUserResponse.data)
        setIsEditing(true)
        setSuccess(t("dashboard.updateSuccess"))
        setFormData((prev) => ({
          ...prev,
          password: "",
          confirmPassword: "",
          oldPassword: "",
          photo: null,
        }))
      } else {
        throw new Error(t("dashboard.updateError"))
      }
    } catch (err) {
      console.error("Update error:", err)
      console.error("Error response:", err.response?.data)
      if (err.response) {
        if (err.response.data?.error?.message) {
          setError(err.response.data.error.message)
        } else if (err.response.data?.error) {
          setError(err.response.data.error)
        } else {
          setError(t("dashboard.updateError"))
        }
      } else if (err.message) {
        setError(err.message)
      } else {
        setError(t("dashboard.unexpectedError"))
      }
    } finally {
      setIsUploading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6D28D9]"></div>
          <p className="text-[#6D28D9] font-medium">{t("profile.loading")}</p>
        </div>
      </div>
    )
  }
  const lang = localStorage.getItem("lang")

  return (
    <div className="py-10 grid gap-4 px-6 md:px-10 bg-white">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-[#6D28D9] p-3 rounded-lg shadow-lg">
          <User className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1e3a8a]">{t("profile.title")}</h1>
          <p className="text-[#6D28D9]/70">{t("profile.personalInfo")}</p>
        </div>
      </div>

      <div className="bg-[#c8c2fd]/10 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-2 text-[#6D28D9]">
          <Info className="h-5 w-5" />
          <p className="text-sm">{t("profile.updateInfo")}</p>
        </div>
      </div>

      <div className="border mt-5 space-y-6 px-6 md:px-10 py-6 rounded-lg shadow-xs border-[#c8c2fd]/30 bg-white">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
            <AlertTriangle className={`h-5 w-5 ${language === "ar" ? "ml-2" : "mr-2"} flex-shrink-0 mt-0.5`} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-start">
            <CheckCircle className={`h-5 w-5 ${language === "ar" ? "ml-2" : "mr-2"} flex-shrink-0 mt-0.5`} />
            <span>{success}</span>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start md:items-center">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#c8c2fd]/30 shadow-xs">
              <img
                src={previewUrl || "/placeholder.svg"}
                alt={t("profile.profilePhoto")}
                className="w-full h-full object-cover"
              />
            </div>
            {!isEditing && (
              <label
                htmlFor="photo-upload"
                className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <Camera className="w-6 h-6 text-white" />
              </label>
            )}
            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={isEditing}
            />
          </div>

          <div className="grid w-full grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1">
              <label className="text-sm font-medium text-[#1e3a8a] flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{t("profile.name")}</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="username"
                  disabled={isEditing}
                  value={formData.username}
                  onChange={handleInputChange}
                  className={`w-full py-2 px-3 rounded-md outline-none transition-all duration-200 ${
                    !isEditing
                      ? "border-2 border-[#c8c2fd] focus:ring-2 focus:ring-[#6D28D9] focus:border-[#6D28D9]"
                      : "border border-gray-200 bg-gray-50"
                  }`}
                  placeholder={t("profile.name")}
                />
                {isEditing && <div className="absolute inset-0 bg-gray-100 opacity-50 rounded-md"></div>}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-[#1e3a8a] flex items-center gap-2">
                <MailIcon className="h-4 w-4" />
                <span>{t("profile.email")}</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  disabled={isEditing}
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full py-2 px-3 rounded-md outline-none transition-all duration-200 ${
                    !isEditing
                      ? "border-2 border-[#c8c2fd] focus:ring-2 focus:ring-[#6D28D9] focus:border-[#6D28D9]"
                      : "border border-gray-200 bg-gray-50"
                  }`}
                  placeholder={t("profile.email")}
                />
                {isEditing && <div className="absolute inset-0 bg-gray-100 opacity-50 rounded-md"></div>}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-[#1e3a8a] flex items-center gap-2">
                <Lock className="h-4 w-4" />
                <span>{t("profile.oldPassword")}</span>
              </label>
              <div className="relative">
                <input
                  type={showOldPassword ? "text" : "password"}
                  name="oldPassword"
                  disabled={isEditing}
                  value={formData.oldPassword}
                  onChange={handleInputChange}
                  className={`w-full py-2 px-3 rounded-md outline-none transition-all duration-200 ${
                    !isEditing
                      ? "border-2 border-[#c8c2fd] focus:ring-2 focus:ring-[#6D28D9] focus:border-[#6D28D9]"
                      : "border border-gray-200 bg-gray-50"
                  }`}
                  placeholder={t("profile.oldPassword")}
                />
                {!isEditing && (
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className={`absolute top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#6D28D9] ${
                      language === "ar" ? "left-3" : "right-3"
                    }`}
                  >
                    {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                )}
                {isEditing && <div className="absolute inset-0 bg-gray-100 opacity-50 rounded-md"></div>}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-[#1e3a8a] flex items-center gap-2">
                <Lock className="h-4 w-4" />
                <span>{t("profile.newPassword")}</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  disabled={isEditing}
                  value={formData.password}
                  onChange={handleInputChange}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  className={`w-full py-2 px-3 rounded-md outline-none transition-all duration-200 ${
                    !isEditing
                      ? "border-2 border-[#c8c2fd] focus:ring-2 focus:ring-[#6D28D9] focus:border-[#6D28D9]"
                      : "border border-gray-200 bg-gray-50"
                  }`}
                  placeholder={t("profile.newPassword")}
                />
                {!isEditing && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#6D28D9] ${
                      language === "ar" ? "left-3" : "right-3"
                    }`}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                )}
                {isEditing && <div className="absolute inset-0 bg-gray-100 opacity-50 rounded-md"></div>}
                {/* Password Requirements Tooltip */}
                {!isEditing && passwordFocused && formData.password && (
                  <div className="absolute z-20 bg-gray-900/95 backdrop-blur-sm border border-purple-300/30 rounded-lg p-4 shadow-xl max-w-xs mt-2">
                    <div className="text-xs space-y-2">
                      <div className={`flex items-center space-x-2 ${passwordRequirements.length ? 'text-green-400' : 'text-red-400'}`}>
                        {passwordRequirements.length ? <span>✓</span> : <span>✗</span>}
                        <span>{t('passwordMinLength')}</span>
                      </div>
                      <div className={`flex items-center space-x-2 ${passwordRequirements.uppercase ? 'text-green-400' : 'text-red-400'}`}>
                        {passwordRequirements.uppercase ? <span>✓</span> : <span>✗</span>}
                        <span>{t('passwordUppercase')}</span>
                      </div>
                      <div className={`flex items-center space-x-2 ${passwordRequirements.lowercase ? 'text-green-400' : 'text-red-400'}`}>
                        {passwordRequirements.lowercase ? <span>✓</span> : <span>✗</span>}
                        <span>{t('passwordLowercase')}</span>
                      </div>
                      <div className={`flex items-center space-x-2 ${passwordRequirements.number ? 'text-green-400' : 'text-red-400'}`}>
                        {passwordRequirements.number ? <span>✓</span> : <span>✗</span>}
                        <span>{t('passwordNumber')}</span>
                      </div>
                      <div className={`flex items-center space-x-2 ${passwordRequirements.special ? 'text-green-400' : 'text-red-400'}`}>
                        {passwordRequirements.special ? <span>✓</span> : <span>✗</span>}
                        <span>{t('passwordSpecial')}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-medium text-[#1e3a8a] flex items-center gap-2">
                <Lock className="h-4 w-4" />
                <span>{t("profile.confirmPassword")}</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  disabled={isEditing}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full py-2 px-3 rounded-md outline-none transition-all duration-200 ${
                    !isEditing
                      ? "border-2 border-[#c8c2fd] focus:ring-2 focus:ring-[#6D28D9] focus:border-[#6D28D9]"
                      : "border border-gray-200 bg-gray-50"
                  }`}
                  placeholder={t("profile.confirmPassword")}
                />
                {!isEditing && (
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className={`absolute top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#6D28D9] ${
                      language === "ar" ? "left-3" : "right-3"
                    }`}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                )}
                {isEditing && <div className="absolute inset-0 bg-gray-100 opacity-50 rounded-md"></div>}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4 border-t border-[#c8c2fd]/20 w-full">
          {isEditing ? (
            <button
              onClick={() => setIsEditing(false)}
              className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#6D28D9] hover:bg-[#6D28D9]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6D28D9] transition-colors disabled:opacity-50"
            >
              <PenBox className={`h-4 w-4 ${language === "ar" ? "ml-2" : "mr-2"}`} />
              {t("profile.update")}
            </button>
          ) : (
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <button
                onClick={() => {
                  setIsEditing(true)
                  setFormData((prev) => ({
                    ...prev,
                    password: "",
                    confirmPassword: "",
                    oldPassword: "",
                    photo: null,
                  }))
                  if (user?.photo) {
                    setPreviewUrl(`${user.photo.url}`)
                  } else {
                    setPreviewUrl(
                      `https://api.dicebear.com/7.x/initials/svg?seed=${user.username}&backgroundColor=c8c2fd`,
                    )
                  }
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c8c2fd] transition-colors"
                disabled={isUploading}
              >
                <X className={`h-4 w-4 ${language === "ar" ? "ml-2" : "mr-2"}`} />
                {t("profile.cancel")}
              </button>
              <button
                onClick={handleUpdate}
                disabled={isUploading}
                className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#6D28D9] hover:bg-[#6D28D9]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6D28D9] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isUploading ? (
                  <>
                    <Loader className={`h-4 w-4 ${language === "ar" ? "ml-2" : "mr-2"} animate-spin`} />
                    {t("profile.uploading")}
                  </>
                ) : (
                  <>
                    <SaveAll className={`h-4 w-4 ${language === "ar" ? "ml-2" : "mr-2"}`} />
                    {t("profile.save")}
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
      {userRole === "user" && (
        <div className="mb-8 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-100">
          <div className="flex items-start space-x-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Store className="h-6 w-6 text-purple-700" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-purple-900 mb-2">{t("profile.becomeOwner.title")}</h2>
              <p className="text-gray-600 mb-4">
                {t("profile.becomeOwner.description")}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg border border-purple-100">
                  <div className="flex items-center space-x-2 mb-2">
                    <Store className="h-5 w-5 text-purple-600" />
                    <h3 className="font-medium text-purple-900">{t("profile.becomeOwner.storeManagement.title")}</h3>
                  </div>
                  <p className="text-sm text-gray-600">{t("profile.becomeOwner.storeManagement.description")}</p>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-purple-100">
                  <div className="flex items-center space-x-2 mb-2">
                    <Package className="h-5 w-5 text-purple-600" />
                    <h3 className="font-medium text-purple-900">{t("profile.becomeOwner.productControl.title")}</h3>
                  </div>
                  <p className="text-sm text-gray-600">{t("profile.becomeOwner.productControl.description")}</p>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-purple-100">
                  <div className="flex items-center space-x-2 mb-2">
                    <BarChart className="h-5 w-5 text-purple-600" />
                    <h3 className="font-medium text-purple-900">{t("profile.becomeOwner.analytics.title")}</h3>
                  </div>
                  <p className="text-sm text-gray-600">{t("profile.becomeOwner.analytics.description")}</p>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-purple-100">
                  <div className="flex items-center space-x-2 mb-2">
                    <CreditCard className="h-5 w-5 text-purple-600" />
                    <h3 className="font-medium text-purple-900">{t("profile.becomeOwner.paymentProcessing.title")}</h3>
                  </div>
                  <p className="text-sm text-gray-600">{t("profile.becomeOwner.paymentProcessing.description")}</p>
                </div>
              </div>

              <button
                onClick={() => navigate("/to-owner")}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
              >
                <Store className={`h-5 w-5 ${lang === "ar" ? "ml-2" : "mr-2"}`} />
                {t("profile.becomeOwner.button")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
