"use client"

import { useState, useEffect } from "react"
import { Lock, Eye, EyeOff, ArrowRight, ArrowLeft, CheckCircle, XCircle } from "lucide-react"
import { useTranslation } from "react-i18next"
import axios from "axios"
import { useNavigate } from "react-router-dom"

export default function SetupPassword() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [passwordFocused, setPasswordFocused] = useState(false)
    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: ""
    })
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [passwordErrors, setPasswordErrors] = useState({})
    const language = localStorage.getItem('lang')

    // Check if user is authenticated
    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) {
            navigate('/login')
            return
        }
    }, [navigate])

    // Password validation function (same as other forms)
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
        setFormData(prev => ({ ...prev, password: newPassword }))
        setPasswordErrors(validatePassword(newPassword))
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
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
        setError("")
        setSuccess("")

        // Validate password requirements
        const errors = validatePassword(formData.password)
        if (Object.keys(errors).length > 0) {
            setError(t('passwordRequirementsNotMet'))
            return
        }

        // Validate password confirmation
        if (formData.password !== formData.confirmPassword) {
            setError(t('passwordsDoNotMatch'))
            return
        }

        try {
            setIsLoading(true)
            
            const token = localStorage.getItem('token')
            let userId = localStorage.getItem('IDUser')
            const userEmail = localStorage.getItem('userEmail')

            if (!userId && userEmail) {
                // Create new user
                const username = userEmail.split('@')[0]
                const registerResponse = await axios.post(
                    'https://stylish-basket-710b77de8f.strapiapp.com/api/auth/local/register',
                    {
                        username,
                        email: userEmail,
                        password: formData.password
                    }
                )
                userId = registerResponse.data.user.id
                localStorage.setItem('IDUser', userId)
                localStorage.setItem('token', registerResponse.data.jwt)
                setSuccess(t('registrationSuccess'))
                setTimeout(() => {
                    navigate("/to-owner")
                }, 2000)
                return
            }

            // Update user password
            const response = await axios.put(
                `https://stylish-basket-710b77de8f.strapiapp.com/api/users/${userId}`,
                {
                    password: formData.password
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            setSuccess(t('passwordUpdateSuccess'))

            // Redirect to dashboard after successful password update
            setTimeout(() => {
                navigate("/to-owner")
            }, 2000)

        } catch (error) {
            console.error('Password update error:', error)
            if (error.response) {
                const errorData = error.response.data?.error
                setError(errorData?.message || t('passwordUpdateError'))
            } else {
                setError(t('passwordUpdateError'))
            }
        } finally {
            setIsLoading(false)
        }
    }

    const isPasswordValid = Object.keys(passwordErrors).length === 0

    return (
        <div className="min-h-screen pt-12 w-full bg-[#1e3a8a] flex items-center justify-center relative overflow-hidden">
            <div className="w-full max-w-md mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow p-8 border border-white/20 transform transition-all duration-300 hover:border-purple-300/30">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-white mb-2">{t('setupPassword')}</h2>
                        <p className="text-purple-100">{t('setupPasswordDescription')}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Password */}
                        <div className="relative group">
                            <div className={`absolute inset-y-0 ${language === 'ar' ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none transition-transform duration-300 group-focus-within:scale-110`}>
                                <Lock className="h-5 w-5 text-purple-200" />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handlePasswordChange}
                                onFocus={() => setPasswordFocused(true)}
                                onBlur={() => setPasswordFocused(false)}
                                className="w-full pl-10 pr-12 py-3 bg-white/5 border border-purple-300/20 rounded-lg text-purple-200 placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-purple-300/40"
                                placeholder={t('newPasswordPlaceholder')}
                                required
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
                        {passwordFocused && formData.password && (
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
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full pl-10 pr-12 py-3 bg-white/5 border border-purple-300/20 rounded-lg text-purple-200 placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-purple-300/40"
                                placeholder={t('confirmPasswordPlaceholder')}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className={`absolute inset-y-0 ${language === 'ar' ? 'left-0 pl-3' : 'right-0 pr-3'} flex items-center text-purple-300 hover:text-purple-500 transition-colors duration-300`}
                            >
                                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading || !isPasswordValid || formData.password !== formData.confirmPassword}
                            className="w-full bg-gradient-to-r from-purple-600 to-purple-800 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-purple-900 transform hover:scale-[1.02] transition-all duration-300 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="relative z-10 flex items-center justify-center">
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        {t('updatePassword')}
                                        {language === 'ar' ? (
                                            <ArrowLeft className="ml-2 h-5 w-5" />
                                        ) : (
                                            <ArrowRight className="ml-2 h-5 w-5" />
                                        )}
                                    </>
                                )}
                            </span>
                        </button>

                        {/* Skip Button */}
                        <button
                            type="button"
                            onClick={() => navigate("/to-owner")}
                            className="w-full bg-transparent border border-purple-300/20 text-purple-200 py-3 px-4 rounded-lg font-medium hover:bg-purple-300/10 transition-all duration-300"
                        >
                            {t('skipForNow')}
                        </button>

                        {/* Error Message */}
                        {error && (
                            <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 text-sm">
                                {error}
                            </div>
                        )}

                        {/* Success Message */}
                        {success && (
                            <div className="mt-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-200 text-sm">
                                {success}
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    )
} 