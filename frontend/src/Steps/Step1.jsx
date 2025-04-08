import { Check, ChevronRight, Earth, Globe, Settings, Store, User, UserPlus } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Step1() {
    const { t } = useTranslation();
    
    return (
        <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-4 sm:px-5">
                <div className="space-y-3 max-w-2xl mx-auto lg:mx-0">
                    <div className="flex items-center gap-4">
                        <h1 className="bg-[#6D28D9] w-10 h-10 sm:w-12 sm:h-12 rounded-[50%] text-white items-center flex justify-center text-lg sm:text-xl">1</h1>
                        <p className="text-[#6D28D9] text-2xl sm:text-3xl font-medium">{t('step1Title')}</p>
                    </div>
                    <p className="text-gray-500 text-base sm:text-lg">{t('step1Description')}</p>
                    <div className="space-y-4">
                        <div className="flex gap-4 sm:gap-5 items-start">
                            <div className="text-[#6D28D9] rounded-[50%] bg-[#c8c2fd] w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 flex justify-center items-center">
                                <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" />
                            </div>
                            <div>
                                <h1 className="text-base sm:text-lg font-medium">{t('simpleRegistration')}</h1>
                                <h1 className="text-base sm:text-lg text-gray-500">{t('simpleRegistrationDesc')}</h1>
                            </div>
                        </div>
                        <div className="flex gap-4 sm:gap-5 items-start">
                            <div className="text-[#6D28D9] rounded-[50%] bg-[#c8c2fd] w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 flex justify-center items-center">
                                <Store className="w-4 h-4 sm:w-5 sm:h-5" />
                            </div>
                            <div>
                                <h1 className="text-base sm:text-lg font-medium">{t('storeCustomization')}</h1>
                                <h1 className="text-base sm:text-lg text-gray-500">{t('storeCustomizationDesc')}</h1>
                            </div>
                        </div>
                        <div className="flex gap-4 sm:gap-5 items-start">
                            <div className="text-[#6D28D9] rounded-[50%] bg-[#c8c2fd] w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 flex justify-center items-center">
                                <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
                            </div>
                            <div>
                                <h1 className="text-base sm:text-lg font-medium">{t('basicSettings')}</h1>
                                <h1 className="text-base sm:text-lg text-gray-500">{t('basicSettingsDesc')}</h1>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex w-full justify-center items-center">
                    <div className="bg-white border border-[#c8c2fd] shadow p-4 sm:p-6 rounded-xl w-full max-w-md">
                        <div className="flex w-full justify-between pb-4">
                            <h1 className="text-xl sm:text-2xl font-medium">{t('controlPanel')}</h1>
                            <p className="bg-[#c8c2fd] px-2 py-0.5 text-[#6D28D9] rounded-lg text-sm sm:text-base">{t('step1')}</p>
                        </div>
                        <div className="space-y-3 sm:space-y-4">
                            <div className="flex justify-between border-1 border-gray-400 rounded-lg px-3 py-2 sm:px-4 sm:py-3">
                                <div className="flex gap-2 sm:gap-2.5 items-center">
                                    <UserPlus className="text-[#6D28D9] w-4 h-4 sm:w-5 sm:h-5" />
                                    <p className="text-sm sm:text-base">{t('createAccount')}</p>
                                </div>
                                <Check className="text-green-500 w-4 h-4 sm:w-5 sm:h-5" />
                            </div>
                            <div className="flex justify-between border-1 border-gray-400 rounded-lg px-3 py-2 sm:px-4 sm:py-3">
                                <div className="flex gap-2 sm:gap-2.5 items-center">
                                    <Store className="text-[#6D28D9] w-4 h-4 sm:w-5 sm:h-5" />
                                    <p className="text-sm sm:text-base">{t('configureStore')}</p>
                                </div>
                                <Check className="text-green-500 w-4 h-4 sm:w-5 sm:h-5" />
                            </div>
                            <div className="flex justify-between border-1 border-gray-400 rounded-lg px-3 py-2 sm:px-4 sm:py-3">
                                <div className="flex gap-2 sm:gap-2.5 items-center">
                                    <Globe className="text-[#6D28D9] w-4 h-4 sm:w-5 sm:h-5" />
                                    <p className="text-sm sm:text-base">{t('chooseDomain')}</p>
                                </div>
                                <ChevronRight className="text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}