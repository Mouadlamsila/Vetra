"use client"

import { useState, useEffect } from "react"
import { CheckIcon, ChevronRightIcon, ChevronLeftIcon } from "lucide-react"
import * as Yup from "yup"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"

export default function OwnerForm() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    has_previous_store: null,
    delivery_required: null,
    has_suppliers: null,
    daily_time_available: "",
    business_duration: "",
    phone: "",
    address: {
      addressLine1: "",
      addressLine2: "",
      city: "",
      country: "",
      postalCode: "",
    },
  })

  const [currentStep, setCurrentStep] = useState(0)
  const [errors, setErrors] = useState({})
  const [toast, setToast] = useState({ show: false, message: "", type: "" })
  const [stepCompleted, setStepCompleted] = useState({})
  const lang = localStorage.getItem('lang');

  // Validation schema
  const validationSchema = Yup.object().shape({
    has_previous_store: Yup.boolean().required(t("owner.validation.previousExperience")),
    delivery_required: Yup.boolean().required(t("owner.validation.deliveryRequired")),
    has_suppliers: Yup.boolean().required(t("owner.validation.suppliers")),
    daily_time_available: Yup.string().required(t("owner.validation.timeAvailable")),
    business_duration: Yup.string().required(t("owner.validation.businessDuration")),
    phone: Yup.string()
      .required(t("owner.validation.phone.required"))
      .matches(/^[0-9+\-\s()]*$/, t("owner.validation.phone.invalid")),
    address: Yup.object().shape({
      addressLine1: Yup.string().required(t("owner.validation.address.line1")),
      city: Yup.string().required(t("owner.validation.address.city")),
      country: Yup.string().required(t("owner.validation.address.country")),
      postalCode: Yup.string().required(t("owner.validation.address.postalCode")),
    }),
  })

  // Step validation schemas
  const stepValidationSchemas = [
    null, // Step 1: No validation needed
    Yup.object().shape({
      // Step 2
      has_previous_store: Yup.boolean().required(t("owner.validation.previousExperience")),
      delivery_required: Yup.boolean().required(t("owner.validation.deliveryRequired")),
    }),
    Yup.object().shape({
      // Step 3
      has_suppliers: Yup.boolean().required(t("owner.validation.suppliers")),
      daily_time_available: Yup.string().required(t("owner.validation.timeAvailable")),
    }),
    Yup.object().shape({
      // Step 4
      business_duration: Yup.string().required(t("owner.validation.businessDuration")),
    }),
    Yup.object().shape({
      // Step 5
      phone: Yup.string()
        .required(t("owner.validation.phone.required"))
        .matches(/^[0-9+\-\s()]*$/, t("owner.validation.phone.invalid")),
      address: Yup.object().shape({
        addressLine1: Yup.string().required(t("owner.validation.address.line1")),
        city: Yup.string().required(t("owner.validation.address.city")),
        country: Yup.string().required(t("owner.validation.address.country")),
        postalCode: Yup.string().required(t("owner.validation.address.postalCode")),
      }),
    }),
  ]

  // Toast notification
  const showToast = (message, type) => {
    setToast({ show: true, message, type })
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 5000)
  }

  // Handle boolean field changes
  const handleBooleanChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target
    if (name.startsWith("address.")) {
      const field = name.split(".")[1]
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  // Validate current step
  const validateStep = async (step) => {
    try {
      if (!stepValidationSchemas[step]) return true

      await stepValidationSchemas[step].validate(formData, { abortEarly: false })
      setErrors({})
      return true
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const validationErrors = {}
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message
        })
        setErrors(validationErrors)
      }
      return false
    }
  }

  // Handle step change
  const handleStepChange = async (step) => {
    // Going back doesn't require validation
    if (step < currentStep) {
      setCurrentStep(step)
      return
    }

    // Check if current step is completed before proceeding
    if (!stepCompleted[currentStep]) {
      showToast(t("owner.toast.completeFields"), "error")
      return
    }

    // Final step submission
    if (currentStep === 4) {
      const success = await handleSubmit()
      if (success) {
        setCurrentStep(step)
      }
      return
    }

    // Validate current step before proceeding
    const isValid = await validateStep(currentStep)
    if (isValid) {
      setCurrentStep(step)
    }
  }

  // Check if current step is completed
  const checkStepCompletion = (step) => {
    switch (step) {
      case 0: // Step 1: Always completed
        return true
      case 1: // Step 2: Previous Experience & Delivery
        return formData.has_previous_store !== null && formData.delivery_required !== null
      case 2: // Step 3: Supplier Relationships & Time Commitment
        return formData.has_suppliers !== null && formData.daily_time_available !== ""
      case 3: // Step 4: Business Experience
        return formData.business_duration !== ""
      case 4: // Step 5: Contact Information
        return (
          formData.phone !== "" &&
          formData.address.addressLine1 !== "" &&
          formData.address.city !== "" &&
          formData.address.country !== "" &&
          formData.address.postalCode !== ""
        )
      default:
        return false
    }
  }

  // Update step completion status when form data changes
  useEffect(() => {
    setStepCompleted((prev) => ({
      ...prev,
      [currentStep]: checkStepCompletion(currentStep),
    }))
  }, [formData, currentStep])

  // Form submission
  const handleSubmit = async () => {
    try {
      // Validate entire form
      await validationSchema.validate(formData, { abortEarly: false })
      setErrors({})

      const userId = localStorage.getItem('IDUser')
      const token = localStorage.getItem('token')

      if (!userId || !token) {
        showToast(t("owner.toast.error.userNotAuth"), 'error')
        return false
      }

      console.log('Starting form submission with data:', formData)

      // First create or update address
      try {
        const addressResponse = await axios.post(
          'https://useful-champion-e28be6d32c.strapiapp.com/api/adresses',
          { 
            data: {...formData.address, user : userId}
          },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        )
        console.log('Address created successfully:', addressResponse.data)
      } catch (addressError) {
        console.error('Error creating address:', addressError.response?.data || addressError.message)
        throw addressError
      }

      // Update user with phone number
      try {
        const userResponse = await axios.put(
          `https://useful-champion-e28be6d32c.strapiapp.com/api/users/${userId}`,
          { 
            phone: parseInt(formData.phone.replace(/[^0-9]/g, '')), 
            role: 1 
          },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        )
        console.log('User updated successfully:', userResponse.data)
        localStorage.setItem('role', userResponse.data.role.name)
      } catch (userError) {
        console.error('Error updating user:', userError.response?.data || userError.message)
        throw userError
      }

      // Create business survey
      try {
        console.log('Attempting to create business survey with data:', {
          has_previous_store: formData.has_previous_store,
          delivery_required: formData.delivery_required,
          has_suppliers: formData.has_suppliers,
          daily_time_available: formData.daily_time_available,
          business_duration: formData.business_duration,
          user: userId
        })

        const surveyResponse = await axios.post(
          'https://useful-champion-e28be6d32c.strapiapp.com/api/business-surveis',
          {
            data: {
              has_previous_store: formData.has_previous_store,
              delivery_required: formData.delivery_required,
              has_suppliers: formData.has_suppliers,
              daily_time_available: formData.daily_time_available,
              business_duration: formData.business_duration,
              user: userId
            }
          },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        )
        console.log('Survey created successfully:', surveyResponse.data)

        if (surveyResponse.data) {
          showToast(t("owner.toast.success"), 'success')
          return true
        } else {
          throw new Error('No response data received from survey submission')
        }
      } catch (surveyError) {
        console.error('Error creating survey:', surveyError.response?.data || surveyError.message)
        throw surveyError
      }
    } catch (error) {
      console.error('Full error details:', error)
      
      if (error instanceof Yup.ValidationError) {
        const validationErrors = {}
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message
        })
        setErrors(validationErrors)
        showToast(t("owner.toast.completeFields"), 'error')
      } else if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const errorMessage = error.response.data?.error?.message || error.response.data?.message || t("owner.toast.error.serverError")
        showToast(errorMessage, 'error')
        console.error('API Error Details:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        })
      } else if (error.request) {
        // The request was made but no response was received
        showToast(t("owner.toast.error.networkError"), 'error')
        console.error('Network Error Details:', error.request)
      } else {
        // Something happened in setting up the request that triggered an Error
        showToast(t("owner.toast.error.unexpectedError"), 'error')
        console.error('Error Details:', {
          message: error.message,
          stack: error.stack
        })
      }
      return false
    }
  }

  // Options for form selections
  const businessDurationOptions = [
    { value: "just_starting", label: t("owner.businessExperience.options.just_starting") },
    { value: "less_than_6_months", label: t("owner.businessExperience.options.less_than_6_months") },
    { value: "between_6_12_months", label: t("owner.businessExperience.options.between_6_12_months") },
    { value: "more_than_a_year", label: t("owner.businessExperience.options.more_than_a_year") },
    { value: "more_than_3_years", label: t("owner.businessExperience.options.more_than_3_years") },
  ]

  const timeOptions = Object.keys(t("owner.timeCommitment.timeOptions", { returnObjects: true }))

  // Step content
  const steps = [
    t("owner.steps.confirmation"),
    t("owner.steps.experience"),
    t("owner.steps.timeCommitment"),
    t("owner.steps.businessExperience"),
    t("owner.steps.contactInfo"),
    t("owner.steps.completion"),
  ]

  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-gradient-to-b from-purple-50 to-purple-100 py-10 px-4">
      <div className="w-full max-w-[700px]">
        {/* Stepper */}
        <div className="w-full mb-8">
          <div className="flex justify-between relative">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex flex-col items-center z-10"
                onClick={() => index < currentStep && handleStepChange(index)}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ease-in-out ${
                    index === currentStep
                      ? "bg-purple-700 text-white scale-110 shadow-lg"
                      : index < currentStep
                        ? "bg-purple-600 text-white"
                        : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {index < currentStep ? <CheckIcon className="w-5 h-5" /> : <span>{index + 1}</span>}
                </div>
                <span
                  className={`mt-2 text-xs font-medium transition-all duration-300 ${
                    index === currentStep ? "text-purple-700" : "text-gray-500"
                  }`}
                >
                  {step}
                </span>
              </div>
            ))}

            {/* Connector lines */}
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-0">
              <div
                className="h-full bg-purple-600 transition-all duration-500 ease-in-out"
                style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-purple-100 transition-all duration-300">
          <div className="relative overflow-hidden">
            {/* Step 1: Owner Confirmation */}
            <div
              className={`transition-all duration-500 ease-in-out transform ${
                currentStep === 0
                  ? "translate-x-0 opacity-100"
                  : currentStep < 0
                    ? "translate-x-full opacity-0 absolute inset-0"
                    : "-translate-x-full opacity-0 absolute inset-0"
              }`}
            >
              <div className="flex flex-col items-center justify-center p-8 py-12">
                <h2 className="text-3xl font-bold text-purple-800 mb-6">{t("owner.welcome.title")}</h2>
                <p className="text-xl text-gray-700 mb-8 text-center">
                  {t("owner.welcome.subtitle")}
                </p>
                <div className="flex gap-4 mt-4">
                  <button
                    onClick={() => handleStepChange(currentStep + 1)}
                    className="px-8 py-4 bg-purple-700 text-white rounded-lg text-lg font-medium hover:bg-purple-800 transition-colors shadow-md"
                  >
                    {t("owner.welcome.startButton")}
                  </button>
                </div>
              </div>
            </div>

            {/* Step 2: Previous Experience and Delivery */}
            <div
              className={`transition-all duration-500 ease-in-out transform ${
                currentStep === 1
                  ? "translate-x-0 opacity-100"
                  : currentStep < 1
                    ? "translate-x-full opacity-0 absolute inset-0"
                    : "-translate-x-full opacity-0 absolute inset-0"
              }`}
            >
              <div className="p-8">
                <h2 className="text-2xl font-semibold text-purple-900 mb-8 text-center">
                  {t("owner.experience.title")}
                </h2>

                <div className="space-y-10">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-purple-100">
                    <p className="text-lg text-gray-700 mb-5">{t("owner.experience.storeQuestion")}</p>
                    <div className="flex gap-4 justify-center">
                      <button
                        onClick={() => handleBooleanChange("has_previous_store", true)}
                        className={`px-8 py-4 rounded-lg text-lg font-medium transition-all duration-300 ${
                          formData.has_previous_store === true
                            ? "bg-purple-700 text-white shadow-md"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {t("owner.experience.yes")}
                      </button>
                      <button
                        onClick={() => handleBooleanChange("has_previous_store", false)}
                        className={`px-8 py-4 rounded-lg text-lg font-medium transition-all duration-300 ${
                          formData.has_previous_store === false
                            ? "bg-purple-700 text-white shadow-md"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {t("owner.experience.no")}
                      </button>
                    </div>
                    {errors.has_previous_store && (
                      <p className="text-red-500 text-sm mt-2 text-center">{errors.has_previous_store}</p>
                    )}
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-sm border border-purple-100">
                    <p className="text-lg text-gray-700 mb-5">{t("owner.experience.deliveryQuestion")}</p>
                    <div className="flex gap-4 justify-center">
                      <button
                        onClick={() => handleBooleanChange("delivery_required", true)}
                        className={`px-8 py-4 rounded-lg text-lg font-medium transition-all duration-300 ${
                          formData.delivery_required === true
                            ? "bg-purple-700 text-white shadow-md"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {t("owner.experience.yes")}
                      </button>
                      <button
                        onClick={() => handleBooleanChange("delivery_required", false)}
                        className={`px-8 py-4 rounded-lg text-lg font-medium transition-all duration-300 ${
                          formData.delivery_required === false
                            ? "bg-purple-700 text-white shadow-md"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {t("owner.experience.no")}
                      </button>
                    </div>
                    {errors.delivery_required && (
                      <p className="text-red-500 text-sm mt-2 text-center">{errors.delivery_required}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Supplier Relationships and Time Commitment */}
            <div
              className={`transition-all duration-500 ease-in-out transform ${
                currentStep === 2
                  ? "translate-x-0 opacity-100"
                  : currentStep < 2
                    ? "translate-x-full opacity-0 absolute inset-0"
                    : "-translate-x-full opacity-0 absolute inset-0"
              }`}
            >
              <div className="p-8">
                <h2 className="text-2xl font-semibold text-purple-900 mb-8 text-center">{t("owner.timeCommitment.title")}</h2>

                <div className="space-y-10">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-purple-100">
                    <p className="text-lg text-gray-700 mb-5">{t("owner.timeCommitment.supplierQuestion")}</p>
                    <div className="flex gap-4 justify-center">
                      <button
                        onClick={() => handleBooleanChange("has_suppliers", true)}
                        className={`px-8 py-4 rounded-lg text-lg font-medium transition-all duration-300 ${
                          formData.has_suppliers === true
                            ? "bg-purple-700 text-white shadow-md"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {t("owner.experience.yes")}
                      </button>
                      <button
                        onClick={() => handleBooleanChange("has_suppliers", false)}
                        className={`px-8 py-4 rounded-lg text-lg font-medium transition-all duration-300 ${
                          formData.has_suppliers === false
                            ? "bg-purple-700 text-white shadow-md"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {t("owner.experience.no")}
                      </button>
                    </div>
                    {errors.has_suppliers && (
                      <p className="text-red-500 text-sm mt-2 text-center">{errors.has_suppliers}</p>
                    )}
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-sm border border-purple-100">
                    <p className="text-lg text-gray-700 mb-5">{t("owner.timeCommitment.timeQuestion")}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {timeOptions.map((time) => (
                        <button
                          key={time}
                          onClick={() => handleChange({ target: { name: "daily_time_available", value: time } })}
                          className={`px-4 py-3 rounded-lg text-center transition-all duration-300 ${
                            formData.daily_time_available === time
                              ? "bg-purple-700 text-white shadow-md"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {t(`owner.timeCommitment.timeOptions.${time}`)}
                        </button>
                      ))}
                    </div>
                    {errors.daily_time_available && (
                      <p className="text-red-500 text-sm mt-2 text-center">{errors.daily_time_available}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4: Business Experience */}
            <div
              className={`transition-all duration-500 ease-in-out transform ${
                currentStep === 3
                  ? "translate-x-0 opacity-100"
                  : currentStep < 3
                    ? "translate-x-full opacity-0 absolute inset-0"
                    : "-translate-x-full opacity-0 absolute inset-0"
              }`}
            >
              <div className="p-8">
                <h2 className="text-2xl font-semibold text-purple-900 mb-6 text-center">{t("owner.businessExperience.title")}</h2>
                <p className="text-lg text-gray-700 mb-6 text-center">{t("owner.businessExperience.subtitle")}</p>

                <div className="space-y-3 bg-white p-6 rounded-xl shadow-sm border border-purple-100">
                  {businessDurationOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleChange({ target: { name: "business_duration", value: option.value } })}
                      className={`w-full px-6 py-4 rounded-lg text-left transition-all duration-300 ${
                        formData.business_duration === option.value
                          ? "bg-purple-700 text-white shadow-md"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                  {errors.business_duration && (
                    <p className="text-red-500 text-sm mt-2 text-center">{errors.business_duration}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Step 5: Contact Information */}
            <div
              className={`transition-all duration-500 ease-in-out transform ${
                currentStep === 4
                  ? "translate-x-0 opacity-100"
                  : currentStep < 4
                    ? "translate-x-full opacity-0 absolute inset-0"
                    : "-translate-x-full opacity-0 absolute inset-0"
              }`}
            >
              <div className="p-8">
                <h2 className="text-2xl font-semibold text-purple-900 mb-6 text-center">{t("owner.contactInfo.title")}</h2>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-purple-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                      <div>
                        <label className="block mb-2 text-gray-700 font-medium">{t("owner.contactInfo.phone")}:</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          className={`w-full p-3 border ${errors.phone ? "border-red-500" : "border-purple-200"} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300`}
                          placeholder={t("owner.contactInfo.phonePlaceholder")}
                        />
                        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                      </div>

                      <div>
                        <label className="block mb-2 text-gray-700 font-medium">{t("owner.contactInfo.address.line1")}:</label>
                        <input
                          type="text"
                          name="address.addressLine1"
                          value={formData.address.addressLine1}
                          onChange={handleChange}
                          required
                          className={`w-full p-3 border ${errors["address.addressLine1"] ? "border-red-500" : "border-purple-200"} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300`}
                          placeholder={t("owner.contactInfo.address.line1Placeholder")}
                        />
                        {errors["address.addressLine1"] && (
                          <p className="text-red-500 text-sm mt-1">{errors["address.addressLine1"]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block mb-2 text-gray-700 font-medium">{t("owner.contactInfo.address.city")}:</label>
                        <input
                          type="text"
                          name="address.city"
                          value={formData.address.city}
                          onChange={handleChange}
                          required
                          className={`w-full p-3 border ${errors["address.city"] ? "border-red-500" : "border-purple-200"} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300`}
                          placeholder={t("owner.contactInfo.address.cityPlaceholder")}
                        />
                        {errors["address.city"] && (
                          <p className="text-red-500 text-sm mt-1">{errors["address.city"]}</p>
                        )}
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                      <div>
                        <label className="block mb-2 text-gray-700 font-medium">{t("owner.contactInfo.address.line2")}:</label>
                        <input
                          type="text"
                          name="address.addressLine2"
                          value={formData.address.addressLine2}
                          onChange={handleChange}
                          className="w-full p-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                          placeholder={t("owner.contactInfo.address.line2Placeholder")}
                        />
                      </div>

                      <div>
                        <label className="block mb-2 text-gray-700 font-medium">{t("owner.contactInfo.address.country")}:</label>
                        <input
                          type="text"
                          name="address.country"
                          value={formData.address.country}
                          onChange={handleChange}
                          required
                          className={`w-full p-3 border ${errors["address.country"] ? "border-red-500" : "border-purple-200"} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300`}
                          placeholder={t("owner.contactInfo.address.countryPlaceholder")}
                        />
                        {errors["address.country"] && (
                          <p className="text-red-500 text-sm mt-1">{errors["address.country"]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block mb-2 text-gray-700 font-medium">{t("owner.contactInfo.address.postalCode")}:</label>
                        <input
                          type="text"
                          name="address.postalCode"
                          value={formData.address.postalCode}
                          onChange={handleChange}
                          required
                          className={`w-full p-3 border ${errors["address.postalCode"] ? "border-red-500" : "border-purple-200"} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300`}
                          placeholder={t("owner.contactInfo.address.postalCodePlaceholder")}
                        />
                        {errors["address.postalCode"] && (
                          <p className="text-red-500 text-sm mt-1">{errors["address.postalCode"]}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 6: Completion Message */}
            <div
              className={`transition-all duration-500 ease-in-out transform ${
                currentStep === 5
                  ? "translate-x-0 opacity-100"
                  : currentStep < 5
                    ? "translate-x-full opacity-0 absolute inset-0"
                    : "-translate-x-full opacity-0 absolute inset-0"
              }`}
            >
              <div className="py-8 text-center p-8">
                <div className="mb-8">
                  <div className="w-20 h-20 bg-purple-700 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <CheckIcon className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-purple-900 mb-4">{t("owner.completion.title")}</h2>
                  <p className="text-xl text-gray-700 mb-6">
                    {t("owner.completion.message")}
                  </p>
                  <p className="text-lg text-gray-600 mb-8">
                    {t("owner.completion.subMessage")}
                  </p>
                </div>

                <div className="space-y-4">
                  <button 
                    onClick={() => navigate('/controll/AddStore')}
                    className="w-full max-w-md mx-auto block bg-purple-700 text-white py-4 px-6 rounded-lg font-medium hover:bg-purple-800 transition-colors shadow-md"
                  >
                    {t("owner.completion.createStore")}
                  </button>
                  <button 
                    onClick={() => navigate('/')}
                    className="w-full max-w-md mx-auto block border-2 border-purple-700 text-purple-700 py-4 px-6 rounded-lg font-medium hover:bg-purple-50 transition-colors"
                  >
                    {t("owner.completion.returnHome")}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation buttons */}
          {currentStep !== 5 && (
            <div className="flex justify-between p-6 border-t border-purple-100">
              {currentStep > 0 ? (
                <button
                  onClick={() => handleStepChange(currentStep - 1)}
                  className="flex items-center px-6 py-3 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-300"
                >
                  {
                    lang === "ar" ?   <ChevronRightIcon className="w-5 h-5 mr-1" /> :<ChevronLeftIcon className="w-5 h-5 mr-1" />
                  }
                  {t("owner.navigation.previous")}
                </button>
              ) : (
                <button className="px-6 py-3 rounded-lg font-medium bg-gray-100 text-gray-700 opacity-0 cursor-default">
                  {t("owner.navigation.previous")}
                </button>
              )}

              <button
                onClick={() => handleStepChange(currentStep + 1)}
                disabled={!stepCompleted[currentStep]}
                className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  stepCompleted[currentStep]
                    ? "bg-purple-700 text-white hover:bg-purple-800"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {currentStep === 4 ? t("owner.navigation.submit") : t("owner.navigation.next")}
                {
                  lang === "ar" ?   <ChevronLeftIcon className="w-5 h-5 ml-1" /> :<ChevronRightIcon className="w-5 h-5 ml-1" />
                }
                
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div
          className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg transition-all duration-500 transform translate-y-0 ${
            toast.type === "error"
              ? "bg-red-100 text-red-700 border-l-4 border-red-500"
              : "bg-purple-100 text-purple-700 border-l-4 border-purple-500"
          }`}
        >
          <div className="flex items-center">
            {toast.type === "error" ? (
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            ) : (
              <CheckIcon className="w-5 h-5 mr-2" />
            )}
            <span className="font-medium">{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  )
}
