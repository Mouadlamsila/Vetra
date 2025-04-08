import { useState } from "react"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Mail, Lock, Eye, EyeOff, Facebook, Twitter, Github } from "lucide-react"
import Hyperspeed from "../blocks/Backgrounds/Hyperspeed/Hyperspeed"

export default function Login() {
    const { t } = useTranslation()
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })

    const handleSubmit = (e) => {
        e.preventDefault()

        console.log("Login form submitted:", formData)
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }
    console.log(formData)

    return (
        <div className="">
            <div className="min-h-screen bg-gradient-to-br sm:pt-20 from-[#1e3a8a] to-[#6D28D9] flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('Login')}</h1>
                            <p className="text-gray-600">{t('welcomeBack')}</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                                <div className="relative">
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`peer w-full pl-10 pr-4 py-3 text-gray-700 border ${formData.email ? "ring-[#6D28D9] ring-2 border-0" : "border-gray-300 outline-none"} focus:outline-none  rounded-lg  focus:ring-2 focus:ring-[#6D28D9] focus:border-transparent transition-all duration-200`}
                                        placeholder={t('emailPlaceholder')}
                                        required
                                    />
                                    <div className={`absolute peer-focus:text-[#6D28D9] transition-all duration-200 ${formData.email ? "text-[#6D28D9]" : "text-gray-400"} inset-y-0 left-0 pl-3 flex items-center pointer-events-none`}>
                                        <Mail className="h-5 w-5  " />
                                    </div>
                                </div>

                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={`peer w-full pl-10 pr-4 py-3 text-gray-700 border ${formData.password ? "ring-[#6D28D9] ring-2 border-0" : "border-gray-300 outline-none"} focus:outline-none  rounded-lg  focus:ring-2 focus:ring-[#6D28D9] focus:border-transparent transition-all duration-200`}
                                        placeholder={t('passwordPlaceholder')}
                                        required
                                    />
                                    <div className={`absolute peer-focus:text-[#6D28D9] transition-all duration-200 ${formData.password ? "text-[#6D28D9]" : "text-gray-400"} inset-y-0 left-0 pl-3 flex items-center pointer-events-none`}>
                                        <Lock className="h-5 w-5 " />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className={`absolute peer-focus:text-[#6D28D9] transition-all duration-200 ${formData.password ? "text-[#6D28D9]" : "text-gray-400"} inset-y-0 right-0 pr-3 flex items-center`}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex space-x-2 items-center">
                                    <input
                                        type="checkbox"
                                        id="remember"
                                        className=" h-4 w-4 text-[#6D28D9] focus:ring-[#6D28D9] border-gray-300 rounded"
                                    />
                                    <label htmlFor="remember" className=" block text-sm text-gray-700">
                                        {t('rememberMe')}
                                    </label>
                                </div>
                                <Link
                                    to="/forgot-password"
                                    className="text-sm font-medium text-[#6D28D9] hover:text-[#5b21b6]"
                                >
                                    {t('forgotPassword')}
                                </Link>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-[#6D28D9] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#5b21b6] transition-colors"
                            >
                                {t('Login')}
                            </button>

                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">
                                        {t('orContinueWith')}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <button
                                    type="button"
                                    className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <Facebook className="h-5 w-5 text-[#1877F2]" />
                                </button>
                                <button
                                    type="button"
                                    className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <Twitter className="h-5 w-5 text-[#1DA1F2]" />
                                </button>
                                <button
                                    type="button"
                                    className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <Github className="h-5 w-5 text-gray-900" />
                                </button>
                            </div>

                            <div className="text-center text-sm">
                                <span className="text-gray-600">{t('dontHaveAccount')}</span>{" "}
                                <Link
                                    to="/register"
                                    className="font-medium text-[#6D28D9] hover:text-[#5b21b6]"
                                >
                                    {t('createAccount')}
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className="">
                <Hyperspeed
                    effectOptions={{
                        onSpeedUp: () => { },
                        onSlowDown: () => { },
                        distortion: 'turbulentDistortion',
                        length: 400,
                        roadWidth: 10,
                        islandWidth: 2,
                        lanesPerRoad: 4,
                        fov: 90,
                        fovSpeedUp: 150,
                        speedUp: 2,
                        carLightsFade: 0.4,
                        totalSideLightSticks: 20,
                        lightPairsPerRoadWay: 40,
                        shoulderLinesWidthPercentage: 0.05,
                        brokenLinesWidthPercentage: 0.1,
                        brokenLinesLengthPercentage: 0.5,
                        lightStickWidth: [0.12, 0.5],
                        lightStickHeight: [1.3, 1.7],
                        movingAwaySpeed: [60, 80],
                        movingCloserSpeed: [-120, -160],
                        carLightsLength: [400 * 0.03, 400 * 0.2],
                        carLightsRadius: [0.05, 0.14],
                        carWidthPercentage: [0.3, 0.5],
                        carShiftX: [-0.8, 0.8],
                        carFloorSeparation: [0, 5],
                        colors: {
                            roadColor: 0x080808,
                            islandColor: 0x0a0a0a,
                            background: 0x000000,
                            shoulderLines: 0xFFFFFF,
                            brokenLines: 0xFFFFFF,
                            leftCars: [0xD856BF, 0x6750A2, 0xC247AC],
                            rightCars: [0x03B3C3, 0x0E5EA5, 0x324555],
                            sticks: 0x03B3C3,
                        }
                    }}
                />
            </div>
        </div>
    )
}  
