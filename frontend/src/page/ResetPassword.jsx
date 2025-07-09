"use client"

import { useState, useEffect } from "react"
import { Lock, Eye, EyeOff, ArrowLeft, ArrowRight, CheckCircle, AlertCircle, XCircle } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { motion } from "framer-motion"
import axios from "axios"

export default function ResetPassword() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordErrors, setPasswordErrors] = useState({})
  const language = localStorage.getItem("lang")

  // Get the reset code from URL parameters
  const resetCode = searchParams.get("code")

  useEffect(() => {
    // If no reset code is provided, redirect to forgot password
    if (!resetCode) {
      navigate('/forgot-password')
    }
  }, [resetCode, navigate])

  // Password validation function
  const validatePassword = (password) => {
    const errors = {}
    
    if (password.length < 8) {
      errors.tooShort = true
    }
    if (!/[A-Z]/.test(password)) {
      errors.noUpperCase = true
    }
    if (!/[a-z]/.test(password)) {
      errors.noLowerCase = true
    }
    if (!/\d/.test(password)) {
      errors.noNumber = true
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.noSpecialChar = true
    }
    
    return errors
  }

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value
    setPassword(newPassword)
    setPasswordErrors(validatePassword(newPassword))
  }

  // Calculate password strength
  const getPasswordStrength = () => {
    const errors = Object.keys(passwordErrors).length
    const total = 5
    const passed = total - errors
    return { passed, total, percentage: (passed / total) * 100 }
  }

  const strength = getPasswordStrength()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      // Basic validation
      if (!password || !confirmPassword) {
        throw new Error(t('allFieldsRequired'))
      }

      // Password validation
      const errors = validatePassword(password)
      if (Object.keys(errors).length > 0) {
        throw new Error(t('passwordRequirementsNotMet'))
      }

      // Confirm password validation
      if (password !== confirmPassword) {
        throw new Error(t('passwordsDoNotMatch'))
      }

      // Send password reset request to Strapi
      const response = await axios.post(
        'https://useful-champion-e28be6d32c.strapiapp.com/api/auth/reset-password',
        {
          code: resetCode,
          password: password,
          passwordConfirmation: confirmPassword
        }
      )

      console.log('Password reset response:', response.data)
      setSuccess(true)
      
      // Clear form
      setPassword("")
      setConfirmPassword("")

    } catch (error) {
      let errorMessage = t('passwordResetError')

      if (error.response) {
        if (error.response.status === 400) {
          if (error.response.data?.error?.message?.includes('code')) {
            errorMessage = t('invalidResetCode')
          } else if (error.response.data?.error?.message?.includes('password')) {
            errorMessage = t('passwordRequirementsNotMet')
          } else {
            errorMessage = error.response.data.error.message
          }
        } else if (error.response.status === 404) {
          errorMessage = t('resetCodeNotFound')
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

  if (!resetCode) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen pt-12 w-full bg-gradient-to-br bg-[#1e3a8a] flex items-center justify-center relative overflow-hidden">
      {/* Content Container */}
      <div className="w-full max-w-md mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow p-8 border border-white/20 transform transition-all duration-300 hover:border-purple-300/30">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">{t('resetPassword')}</h1>
            <p className="text-purple-100">{t('resetPasswordDescription')}</p>
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
                <span>{t('passwordResetSuccess')}</span>
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
                {/* New Password */}
                <div className="relative group">
                  <div className={`absolute inset-y-0 ${language === 'ar' ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none transition-transform duration-300 group-focus-within:scale-110`}>
                    <Lock className="h-5 w-5 text-purple-200" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={handlePasswordChange}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    className="w-full pl-10 pr-12 py-3 bg-white/5 border border-purple-300/20 rounded-lg text-purple-200 placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-purple-300/40"
                    placeholder={t('newPasswordPlaceholder')}
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute inset-y-0 ${language === 'ar' ? 'left-0 pl-3' : 'right-0 pr-3'} flex items-center text-purple-300 hover:text-purple-500 transition-colors duration-300`}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>

                {/* Password Requirements Tooltip */}
                {passwordFocused && password && (
                  <div className="absolute z-20 bg-gray-900/95 backdrop-blur-sm border border-purple-300/30 rounded-lg p-4 shadow-xl max-w-xs">
                    <div className="text-xs space-y-2">
                      <div className={`flex items-center space-x-2 ${passwordErrors.tooShort ? 'text-red-400' : 'text-green-400'}`}>
                        {passwordErrors.tooShort ? <XCircle className="h-3 w-3" /> : <CheckCircle className="h-3 w-3" />}
                        <span>{t('passwordMinLength')}</span>
                      </div>
                      <div className={`flex items-center space-x-2 ${passwordErrors.noUpperCase ? 'text-red-400' : 'text-green-400'}`}>
                        {passwordErrors.noUpperCase ? <XCircle className="h-3 w-3" /> : <CheckCircle className="h-3 w-3" />}
                        <span>{t('passwordUppercase')}</span>
                      </div>
                      <div className={`flex items-center space-x-2 ${passwordErrors.noLowerCase ? 'text-red-400' : 'text-green-400'}`}>
                        {passwordErrors.noLowerCase ? <XCircle className="h-3 w-3" /> : <CheckCircle className="h-3 w-3" />}
                        <span>{t('passwordLowercase')}</span>
                      </div>
                      <div className={`flex items-center space-x-2 ${passwordErrors.noNumber ? 'text-red-400' : 'text-green-400'}`}>
                        {passwordErrors.noNumber ? <XCircle className="h-3 w-3" /> : <CheckCircle className="h-3 w-3" />}
                        <span>{t('passwordNumber')}</span>
                      </div>
                      <div className={`flex items-center space-x-2 ${passwordErrors.noSpecialChar ? 'text-red-400' : 'text-green-400'}`}>
                        {passwordErrors.noSpecialChar ? <XCircle className="h-3 w-3" /> : <CheckCircle className="h-3 w-3" />}
                        <span>{t('passwordSpecial')}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Confirm Password */}
                <div className="relative group">
                  <div className={`absolute inset-y-0 ${language === 'ar' ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none transition-transform duration-300 group-focus-within:scale-110`}>
                    <Lock className="h-5 w-5 text-purple-200" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 bg-white/5 border border-purple-300/20 rounded-lg text-purple-200 placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-purple-300/40"
                    placeholder={t('confirmPasswordPlaceholder')}
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className={`absolute inset-y-0 ${language === 'ar' ? 'left-0 pl-3' : 'right-0 pr-3'} flex items-center text-purple-300 hover:text-purple-500 transition-colors duration-300`}
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
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
                      {t('resetPassword')}
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