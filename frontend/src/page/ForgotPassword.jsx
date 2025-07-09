"use client"

import { useState } from "react"
import { Mail, ArrowLeft, ArrowRight, CheckCircle, AlertCircle } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import axios from "axios"

export default function ForgotPassword() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [email, setEmail] = useState("")
  const language = localStorage.getItem("lang")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      // Basic validation
      if (!email) {
        throw new Error(t('emailRequired'))
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        throw new Error(t('invalidEmailFormat'))
      }

      // Send password reset request to Strapi
      const response = await axios.post(
        'https://useful-champion-e28be6d32c.strapiapp.com/api/auth/forgot-password',
        {
          email: email
        }
      )

      console.log('Password reset response:', response.data)
      setSuccess(true)
      
      // Clear form
      setEmail("")

    } catch (error) {
      let errorMessage = t('passwordResetError')

      if (error.response) {
        if (error.response.status === 400) {
          errorMessage = t('emailNotFound')
        } else if (error.response.data?.error?.message) {
          errorMessage = error.response.data.error.message
        }
      } else if (error.message) {
        errorMessage = error.message
      }

      setError(errorMessage)
      console.error('Password reset error:', error)

    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToLogin = () => {
    navigate('/login')
  }

  return (
    <div className="min-h-screen pt-12 w-full bg-gradient-to-br bg-[#1e3a8a] flex items-center justify-center relative overflow-hidden">
      {/* Content Container */}
      <div className="w-full max-w-md mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow p-8 border border-white/20 transform transition-all duration-300 hover:border-purple-300/30">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">{t('forgotPassword')}</h1>
            <p className="text-purple-100">{t('forgotPasswordDescription')}</p>
          </div>

          {/* Success Message */}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 mb-6 text-green-400 bg-green-900/20 rounded-lg border border-green-500/30"
            >
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span>{t('passwordResetEmailSent')}</span>
              </div>
            </motion.div>
          )}

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 mb-6 text-red-400 bg-red-900/20 rounded-lg border border-red-500/30"
            >
              <div className="flex items-center justify-center space-x-2">
                <AlertCircle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            </motion.div>
          )}

          {/* Form */}
          {!success && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                {/* Email */}
                <div className="relative group">
                  <div className={`absolute inset-y-0 ${language === 'ar' ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none transition-transform duration-300 group-focus-within:scale-110`}>
                    <Mail className="h-5 w-5 text-purple-200" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full ${language === 'ar' ? 'pl-4 pr-10' : 'pl-10 pr-4'} py-3 bg-white/5 border border-purple-300/20 rounded-lg text-purple-200 placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-purple-300/40`}
                    placeholder={t('emailPlaceholder')}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-800 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-purple-900 transform hover:scale-[1.02] transition-all duration-300 relative overflow-hidden group disabled:opacity-50"
              >
                <span className="relative z-10 flex items-center justify-center">
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      {t('sendResetLink')}
                      {language === "ar" ? (
                        <ArrowLeft className="mr-2 h-5 w-5" />
                      ) : (
                        <ArrowRight className="ml-2 h-5 w-5" />
                      )}
                    </>
                  )}
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-purple-700 to-indigo-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </button>
            </form>
          )}

          {/* Back to Login */}
          <div className="text-center mt-6">
            <button
              onClick={handleBackToLogin}
              className="text-purple-300 hover:text-white transition-colors duration-300 flex items-center justify-center mx-auto"
            >
              {language === "ar" ? (
                <>
                  <ArrowRight className="mr-2 h-4 w-4" />
                  {t('backToLogin')}
                </>
              ) : (
                <>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {t('backToLogin')}
                </>
              )}
            </button>
          </div>

          {/* Additional Help */}
          {!success && (
            <div className="mt-6 text-center">
              <p className="text-sm text-purple-200">
                {t('forgotPasswordHelp')}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      )}
    </div>
  )
} 