"use client"

import { useState, useEffect } from "react"
import {
    Mail, Lock, Eye, EyeOff, User,
    Facebook, Twitter, Github, ArrowRight, ArrowLeft
} from "lucide-react"
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
        password: ""
    })
    const language = localStorage.getItem('lang')
    const features = ['seamlessIntegration', 'advancedSecurity', 'realtimeCollaboration']
    const [activeFeatureIndex, setActiveFeatureIndex] = useState(0)
    const [isAnimating, setIsAnimating] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const animationTimer = setInterval(() => {
            setIsAnimating(true)
            setTimeout(() => setIsAnimating(false), 1000)
            setActiveFeatureIndex((prev) => (prev + 1) % features.length)
        }, 3000)
        return () => clearInterval(animationTimer)
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            await axios.post('http://localhost:1337/api/auth/local/register', {
                username: formData.username,
                email: formData.email,
                password: formData.password
            });
            navigate("/login")
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
                                    className="flex items-center justify-center py-2 px-4 border border-purple-300/20 rounded-lg hover:bg-white/10 transition-all duration-200 group"
                                >
                                    <Twitter className="h-5 w-5 text-white group-hover:scale-110 transition-transform duration-200" />
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
