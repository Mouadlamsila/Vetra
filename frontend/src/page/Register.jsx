"use client"

import { useState, useEffect } from "react"
import {
    Mail, Lock, Eye, EyeOff, User,
    Facebook, Twitter, Github, ArrowRight, ArrowLeft
} from "lucide-react"
import { auth, googleProvider } from "../firebase"
import { signInWithPopup } from "firebase/auth"
import { useTranslation } from "react-i18next"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"

export default function Register() {
    const { t } = useTranslation()
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isHovering, setIsHovering] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    })
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const language = localStorage.getItem('lang')
    const features = ['seamlessIntegration', 'advancedSecurity', 'realtimeCollaboration']
    const [activeFeatureIndex, setActiveFeatureIndex] = useState(0)
    const navigate = useNavigate()

    useEffect(() => {
        const animationTimer = setInterval(() => {
            setActiveFeatureIndex((prev) => (prev + 1) % features.length)
        }, 3000)
        return () => clearInterval(animationTimer)
    }, [])


    // Function to handle Google sign-in
   const handleGoogleRegister = () => {
    // يوجه المستخدم مباشرة إلى رابط Google عبر Strapi
    window.location.href = "https://stylish-basket-710b77de8f.strapiapp.com/api/connect/google?redirect_uri=https://vetra-dev.web.app/auth/google/callback";

};




    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setSuccess("")

        // Validate password confirmation
        if (formData.password !== formData.confirmPassword) {
            setError(t('passwordsDoNotMatch'));
            return;
        }

        try {
            setIsLoading(true)
            console.log('Sending registration data:', {
                username: formData.username,
                email: formData.email,
                password: formData.password
            });

            // Register the user
            const registerResponse = await axios.post('https://stylish-basket-710b77de8f.strapiapp.com/api/auth/local/register', {
                username: formData.username,
                email: formData.email,
                password: formData.password
            });

            console.log('Registration response:', registerResponse.data);

            // Update user role to "User"
            const userId = registerResponse.data.user.id;
            await axios.put(`https://stylish-basket-710b77de8f.strapiapp.com/api/users/${userId}`, {
                role: 4
            }, {
                headers: {
                    Authorization: `Bearer ${registerResponse.data.jwt}`
                }
            });

            // Store authentication data
            localStorage.setItem('token', registerResponse.data.jwt)
            localStorage.setItem('user', JSON.stringify(registerResponse.data.user.documentId))
            localStorage.setItem('IDUser', registerResponse.data.user.id)
            localStorage.setItem('role', 'user')

            setSuccess(t('registrationSuccess'));

            // Wait for 2 seconds to show success message before redirecting
            setTimeout(() => {
                navigate("/to-owner")
            }, 2000);
        } catch (error) {
            console.error('Registration error:', error);
            if (error.response) {
                const errorData = error.response.data?.error;
                if (errorData?.message?.includes('email')) {
                    setError(t('emailAlreadyExists'));
                } else if (errorData?.message?.includes('username')) {
                    setError(t('usernameAlreadyExists'));
                } else {
                    setError(errorData?.message || t('registrationError'));
                }
            } else {
                setError(t('registrationError'));
            }
        } finally {
            setIsLoading(false)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <div className="min-h-screen pt-12 w-full bg-[#1e3a8a] flex items-center justify-center relative overflow-hidden">
            <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

                    {/* Left Side */}
                    <div className="text-white text-center lg:text-left">
                        <h1 className={`text-4xl sm:text-5xl font-bold mb-4 ${language === 'ar' ? 'text-right' : 'text-left'} `}>
                            {t('createAccount')}
                        </h1>
                        <p className={`text-lg sm:text-xl text-purple-100 max-w-lg mx-auto lg:mx-0 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                            {t('experienceFuture')}
                        </p>

                        {/* Features List with smooth bounce */}
                        <div className="mt-8 space-y-6 hidden lg:block">
                            {features.map((feature, index) => (
                                <div
                                    key={feature}
                                    className={`flex items-center space-x-3 transition-all duration-500 ease-in-out transform
                    ${index === activeFeatureIndex ? 'opacity-100 translate-x-0' : 'opacity-50 -translate-x-2'}`}
                                >
                                    <div className={`bg-purple-500/20 p-2 rounded-full transition-all duration-500`}
                                    >
                                        {language === 'ar' ? (
                                            <ArrowLeft className="h-5 w-5 text-purple-300" />
                                        ) : (
                                            <ArrowRight className="h-5 w-5 text-purple-300" />
                                        )}
                                    </div>
                                    <p className="text-purple-100 text-lg font-medium">{t(feature)}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Side - Form */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow p-8 border border-white/20 transform transition-all duration-300  hover:border-purple-300/30">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-white mb-2 animate-pulse">{t('createAccount')}</h2>
                            <p className="text-purple-100 animate-fade-in-delayed">{t('joinOurCommunity')}</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                                {/* Name */}
                                <div className="relative group">
                                    <div className={`absolute inset-y-0 ${language === 'ar' ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none transition-transform duration-300 group-focus-within:scale-110`}>
                                        <User className="h-5 w-5 text-purple-200" />
                                    </div>
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        className={`w-full ${language === 'ar' ? 'pl-4 pr-10' : 'pl-10 pr-4'} py-3 bg-white/5 border border-purple-300/20 rounded-lg text-purple-200 placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-purple-300/40`}
                                        placeholder={t('namePlaceholder')}
                                        required
                                    />
                                </div>

                                {/* email */}
                                <div className="relative group">
                                    <div className={`absolute inset-y-0 ${language === 'ar' ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none transition-transform duration-300 group-focus-within:scale-110`}>
                                        <Mail className="h-5 w-5 text-purple-200" />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`w-full ${language === 'ar' ? 'pl-4 pr-10' : 'pl-10 pr-4'} py-3 bg-white/5 border border-purple-300/20 rounded-lg text-purple-200 placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-purple-300/40`}
                                        placeholder={t('emailPlaceholder')}
                                        required
                                    />
                                </div>

                                {/* Password */}
                                <div className="relative group">
                                    <div className={`absolute inset-y-0 ${language === 'ar' ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none transition-transform duration-300 group-focus-within:scale-110`}>
                                        <Lock className="h-5 w-5 text-purple-200" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-12 py-3 bg-white/5 border border-purple-300/20 rounded-lg text-purple-200 placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-purple-300/40"
                                        placeholder={t('passwordPlaceholder')}
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
                            </div>

                            {/* Register Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                onMouseEnter={() => setIsHovering(true)}
                                onMouseLeave={() => setIsHovering(false)}
                                className="w-full bg-gradient-to-r from-purple-600 to-purple-800 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-purple-900 transform hover:scale-[1.02] transition-all duration-300 relative overflow-hidden group"
                            >
                                <span className="relative z-10 flex items-center justify-center">
                                    {isLoading ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            {t('createAccount')}
                                            {language === 'ar' ? (
                                                <ArrowLeft className={`mr-2 h-5 w-5 transition-transform duration-300 ${isHovering ? "-translate-x-1" : ""}`} />
                                            ) : (
                                                <ArrowRight className={`ml-2 h-5 w-5 transition-transform duration-300 ${isHovering ? "translate-x-1" : ""}`} />
                                            )}
                                        </>
                                    )}
                                </span>
                                <span className="absolute inset-0 bg-gradient-to-r from-purple-700 to-indigo-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
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

                            {/* Divider */}
                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-purple-300/20"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-transparent text-purple-200 animate-fade-in">{t('orContinueWith')}</span>
                                </div>
                            </div>

                            {/* Social */}
                            <div className="grid grid-cols-3 gap-3">
                                <button
                                    type="button"
                                    className="flex items-center justify-center py-2 px-4 border border-purple-300/20 rounded-lg hover:bg-white/10 transition-all duration-200 group"
                                >
                                    <Facebook className="h-5 w-5 text-white group-hover:scale-110 transition-transform duration-200" />
                                </button>
                                <button
                                    type="button"
                                    onClick={handleGoogleRegister}
                                    className="flex items-center justify-center py-2 px-4 border border-purple-300/20 rounded-lg hover:bg-white/10 transition-all duration-200 group"
                                >
                                    <img
                                        src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png"
                                        alt="Google"
                                        className="h-5 w-5 mr-2"
                                    />
                                    <span className="text-white text-sm">Google</span>
                                </button>

                                <button
                                    type="button"
                                    className="flex items-center justify-center py-2 px-4 border border-purple-300/20 rounded-lg hover:bg-white/10 transition-all duration-200 group"
                                >
                                    <Github className="h-5 w-5 text-white group-hover:scale-110 transition-transform duration-200" />
                                </button>
                            </div>

                            {/* Login link */}
                            <div className="text-center text-sm mt-6">
                                <span className="text-purple-100">{t('alreadyHaveAccount')}</span>{" "}
                                <Link to="/login" className="font-medium text-purple-300 hover:text-white transition-colors duration-300">
                                    {t('Login')}
                                </Link>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    )
}
