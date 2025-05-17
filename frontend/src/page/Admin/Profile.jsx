"use client"

import { useState, useEffect } from "react"
import { User, Mail, Phone, MapPin, Calendar, Lock, Edit, Save, Camera, CheckCircle } from "lucide-react"
import axios from "axios"
import { useTranslation } from 'react-i18next'

export default function Profile() {
  const { t } = useTranslation()
  const [user, setUser] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    country: "",
    postalCode: "",
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [activeTab, setActiveTab] = useState("profile")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [passwordError, setPasswordError] = useState("")
  const id = localStorage.getItem("IDUser")

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:1337/api/users/${id}?populate=*`)
        const userData = response.data
        setUser(userData)
        setFormData({
          username: userData.username || "",
          email: userData.email || "",
          phone: userData.phone || "",
          addressLine1: userData.adress?.addressLine1 || "",
          addressLine2: userData.adress?.addressLine2 || "",
          city: userData.adress?.city || "",
          country: userData.adress?.country || "",
          postalCode: userData.adress?.postalCode || "",
        })
        if (userData.photo) {
          setPreviewUrl(`http://localhost:1337${userData.photo.url}`)
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      }
    }
    fetchUser()
  }, [id])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({ ...prev, [name]: value }))
    setPasswordError("")
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await axios.put(`http://localhost:1337/api/users/${id}`, {
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
      })

      if (user.adress) {
        await axios.put(`http://localhost:1337/api/adresses/${user.adress.documentId}`, {
          data: {
            addressLine1: formData.addressLine1,
            addressLine2: formData.addressLine2,
            city: formData.city,
            country: formData.country,
            postalCode: formData.postalCode,
          }
        })
      }

      if (selectedFile) {
        const formData = new FormData()
        formData.append("files", selectedFile)
        const uploadResponse = await axios.post("http://localhost:1337/api/upload", formData)
        
        if (uploadResponse.data[0]) {
          await axios.put(`http://localhost:1337/api/users/${id}`, {
            photo: uploadResponse.data[0].id,
          })
        }
      }

      const response = await axios.get(`http://localhost:1337/api/users/${id}?populate=*`)
      setUser(response.data)
      setEditMode(false)
      showSuccessMessage(t('profileAdmin.messages.updateSuccess'))
    } catch (error) {
      console.error("Error updating profile:", error)
      showSuccessMessage(t('profileAdmin.messages.updateError'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setPasswordError("")

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError(t('profileAdmin.password.errors.mismatch'))
      setIsSubmitting(false)
      return
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError(t('profileAdmin.password.errors.minLength'))
      setIsSubmitting(false)
      return
    }

    try {
      const verifyResponse = await axios.post("http://localhost:1337/api/auth/local", {
        identifier: user.email,
        password: passwordData.currentPassword,
      })

      if (!verifyResponse.data.jwt) {
        setPasswordError(t('profileAdmin.password.errors.incorrect'))
        setIsSubmitting(false)
        return
      }

      await axios.put(`http://localhost:1337/api/users/${id}`, {
        password: passwordData.newPassword,
      })

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
      showSuccessMessage(t('profileAdmin.messages.passwordSuccess'))
    } catch (error) {
      console.error("Error updating password:", error)
      if (error.response?.status === 400) {
        setPasswordError(t('profileAdmin.password.errors.incorrect'))
      } else {
        showSuccessMessage(t('profileAdmin.messages.passwordError'))
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const showSuccessMessage = (message) => {
    setSuccessMessage(message)
    setTimeout(() => {
      setSuccessMessage("")
    }, 3000)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t('profileAdmin.title')}</h1>
          <p className="text-gray-500">{t('profileAdmin.subtitle')}</p>
        </div>
      </div>

      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
          <CheckCircle className="h-5 w-5 mr-2" />
          {successMessage}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="md:w-64 flex-shrink-0 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4">
            <div className="flex flex-col space-y-1">
              <button
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${activeTab === "profile" ? "bg-[#c8c2fd] text-[#6D28D9]" : "text-gray-700 hover:bg-gray-100"}`}
                onClick={() => setActiveTab("profile")}
              >
                <User className="mr-2 h-4 w-4" />
                {t('profileAdmin.personalInfo.title')}
              </button>
              <button
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${activeTab === "password" ? "bg-[#c8c2fd] text-[#6D28D9]" : "text-gray-700 hover:bg-gray-100"}`}
                onClick={() => setActiveTab("password")}
              >
                <Lock className="mr-2 h-4 w-4" />
                {t('profileAdmin.password.title')}
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            {/* Profile Information */}
            {activeTab === "profile" && user && (
              <div>
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-800">{t('profileAdmin.personalInfo.title')}</h2>
                    {!editMode && (
                      <button
                        className="flex items-center text-sm text-[#6D28D9] hover:text-[#5b21b6]"
                        onClick={() => setEditMode(true)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        {t('profileAdmin.personalInfo.edit')}
                      </button>
                    )}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex flex-col md:flex-row gap-8">
                    {/* Avatar Section */}
                    <div className="flex flex-col items-center">
                      <div className="relative">
                        {previewUrl ? (
                          <img
                            src={previewUrl}
                            alt={user.username}
                            className="h-32 w-32 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-32 w-32 rounded-full bg-[#c8c2fd] flex items-center justify-center text-[#6D28D9] text-4xl font-bold">
                            {user.username?.charAt(0)}
                          </div>
                        )}
                        {editMode && (
                          <label className="absolute bottom-0 right-0 bg-[#6D28D9] text-white p-2 rounded-full hover:bg-[#5b21b6] cursor-pointer">
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={handleFileChange}
                            />
                            <Camera className="h-4 w-4" />
                          </label>
                        )}
                      </div>
                      <p className="mt-2 text-sm text-gray-500">{user.role?.name || "User"}</p>
                    </div>

                    {/* Profile Details */}
                    <div className="flex-1">
                      {editMode ? (
                        <form onSubmit={handleProfileSubmit}>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                {t('profileAdmin.personalInfo.username')}
                              </label>
                              <input
                                id="username"
                                name="username"
                                type="text"
                                value={formData.username}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:border-[#6D28D9]"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                {t('profileAdmin.personalInfo.email')}
                              </label>
                              <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:border-[#6D28D9]"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                {t('profileAdmin.personalInfo.phone')}
                              </label>
                              <input
                                id="phone"
                                name="phone"
                                type="text"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:border-[#6D28D9]"
                              />
                            </div>
                            <div className="space-y-2">
                              <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700">
                                {t('profileAdmin.editMode.addressLine1')}
                              </label>
                              <input
                                id="addressLine1"
                                name="addressLine1"
                                type="text"
                                value={formData.addressLine1}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:border-[#6D28D9]"
                              />
                            </div>
                            <div className="space-y-2">
                              <label htmlFor="addressLine2" className="block text-sm font-medium text-gray-700">
                                {t('profileAdmin.editMode.addressLine2')}
                              </label>
                              <input
                                id="addressLine2"
                                name="addressLine2"
                                type="text"
                                value={formData.addressLine2}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:border-[#6D28D9]"
                              />
                            </div>
                            <div className="space-y-2">
                              <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                                {t('profileAdmin.editMode.city')}
                              </label>
                              <input
                                id="city"
                                name="city"
                                type="text"
                                value={formData.city}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:border-[#6D28D9]"
                              />
                            </div>
                            <div className="space-y-2">
                              <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                                {t('profileAdmin.editMode.country')}
                              </label>
                              <input
                                id="country"
                                name="country"
                                type="text"
                                value={formData.country}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:border-[#6D28D9]"
                              />
                            </div>
                            <div className="space-y-2">
                              <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                                {t('profileAdmin.editMode.postalCode')}
                              </label>
                              <input
                                id="postalCode"
                                name="postalCode"
                                type="text"
                                value={formData.postalCode}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:border-[#6D28D9]"
                              />
                            </div>
                          </div>
                          <div className="mt-6 flex justify-end space-x-3">
                            <button
                              type="button"
                              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                              onClick={() => {
                                setEditMode(false)
                                setFormData({
                                  username: user.username || "",
                                  email: user.email || "",
                                  phone: user.phone || "",
                                  addressLine1: user.adress?.addressLine1 || "",
                                  addressLine2: user.adress?.addressLine2 || "",
                                  city: user.adress?.city || "",
                                  country: user.adress?.country || "",
                                  postalCode: user.adress?.postalCode || "",
                                })
                              }}
                              disabled={isSubmitting}
                            >
                              {t('profileAdmin.editMode.cancel')}
                            </button>
                            <button
                              type="submit"
                              className="px-4 py-2 bg-[#6D28D9] text-white rounded-md hover:bg-[#5b21b6] flex items-center"
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? (
                                <span>{t('profileAdmin.editMode.saving')}</span>
                              ) : (
                                <>
                                  <Save className="mr-2 h-4 w-4" />
                                  {t('profileAdmin.editMode.save')}
                                </>
                              )}
                            </button>
                          </div>
                        </form>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex items-center">
                            <User className="h-5 w-5 text-gray-400 mr-2" />
                            <div>
                              <p className="text-sm text-gray-500">{t('profileAdmin.personalInfo.username')}</p>
                              <p className="font-medium">{user.username}</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Mail className="h-5 w-5 text-gray-400 mr-2" />
                            <div>
                              <p className="text-sm text-gray-500">{t('profileAdmin.personalInfo.email')}</p>
                              <p className="font-medium">{user.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Phone className="h-5 w-5 text-gray-400 mr-2" />
                            <div>
                              <p className="text-sm text-gray-500">{t('profileAdmin.personalInfo.phone')}</p>
                              <p className="font-medium">{user.phone || t('profileAdmin.personalInfo.phoneNotSet')}</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                            <div>
                              <p className="text-sm text-gray-500">{t('profileAdmin.personalInfo.address')}</p>
                              <p className="font-medium">
                                {user.adress
                                  ? `${user.adress.addressLine1}, ${user.adress.addressLine2}, ${user.adress.city}, ${user.adress.country}, ${user.adress.postalCode}`
                                  : t('profileAdmin.personalInfo.addressNotSet')}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                            <div>
                              <p className="text-sm text-gray-500">{t('profileAdmin.personalInfo.registrationDate')}</p>
                              <p className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Password Change */}
            {activeTab === "password" && (
              <div>
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-800">{t('profileAdmin.password.title')}</h2>
                </div>
                <div className="p-6">
                  <form onSubmit={handlePasswordSubmit}>
                    <div className="space-y-4 max-w-md">
                      <div className="space-y-2">
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                          {t('profileAdmin.password.currentPassword')}
                        </label>
                        <input
                          id="currentPassword"
                          name="currentPassword"
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:border-[#6D28D9]"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                          {t('profileAdmin.password.newPassword')}
                        </label>
                        <input
                          id="newPassword"
                          name="newPassword"
                          type="password"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:border-[#6D28D9]"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                          {t('profileAdmin.password.confirmPassword')}
                        </label>
                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:border-[#6D28D9]"
                          required
                        />
                      </div>
                      {passwordError && (
                        <div className="text-red-500 text-sm mt-2">{passwordError}</div>
                      )}
                      <div className="pt-4">
                        <button
                          type="submit"
                          className="px-4 py-2 bg-[#6D28D9] text-white rounded-md hover:bg-[#5b21b6] flex items-center"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <span>{t('profileAdmin.password.updating')}</span>
                          ) : (
                            <>
                              <Lock className="mr-2 h-4 w-4" />
                              {t('profileAdmin.password.update')}
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
