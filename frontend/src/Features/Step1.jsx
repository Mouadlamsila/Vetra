import { Check, ChevronRight, Earth, Globe, Settings, Store, User, UserPlus } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Step1() {
    const { t } = useTranslation();
    
    return (
        <div className="p-6">
            <div className="grid grid-cols-2 px-5">
                <div className="space-y-3">
                    <div className="flex items-center gap-4">
                        <h1 className="bg-[#6D28D9] w-12 h-12 rounded-[50%] text-white items-center flex justify-center">1</h1>
                        <p className="text-[#6D28D9] text-3xl font-medium">{t('step1Title')}</p>
                    </div>
                    <p className="text-gray-500 text-lg">{t('step1Description')}</p>
                    <div>
                        <div className="flex gap-5 items-center">
                            <div className="text-[#6D28D9] rounded-[50%]  bg-[#c8c2fd]  w-10 h-10 flex justify-center items-center">
                                <UserPlus className="" />
                            </div>
                            <div className="">
                                <h1 className="text-lg font-medium">{t('simpleRegistration')}</h1>
                                <h1 className="text-lg text-gray-500">{t('simpleRegistrationDesc')}</h1>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="flex gap-5 items-center">
                            <div className="text-[#6D28D9] rounded-[50%]  bg-[#c8c2fd]  w-10 h-10 flex justify-center items-center">
                                <Store className="" />
                            </div>
                            <div className="">
                                <h1 className="text-lg font-medium">{t('storeCustomization')}</h1>
                                <h1 className="text-lg text-gray-500">{t('storeCustomizationDesc')}</h1>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="flex gap-5 items-center">
                            <div className="text-[#6D28D9] rounded-[50%]  bg-[#c8c2fd]  w-10 h-10 flex justify-center items-center">
                                <Settings className="" />
                            </div>
                            <div className="">
                                <h1 className="text-lg font-medium">{t('basicSettings')}</h1>
                                <h1 className="text-lg text-gray-500">{t('basicSettingsDesc')}</h1>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex w-full justify-center items-center">
                    <div className="bg-white shadow-2xl p-6 rounded-xl  w-[80%]">
                        <div className="flex w-full justify-between pb-4 ">
                            <h1 className="text-2xl font-medium">{t('controlPanel')}</h1>
                            <p className="bg-[#c8c2fd] px-2 py-0.5 text-[#6D28D9] rounded-lg">{t('step1')}</p>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between border-1 border-gray-400 rounded-lg px-2 py-3 ">
                                <div className="flex gap-2.5 items-center">
                                    <UserPlus className="text-[#6D28D9]" />
                                    <p>{t('createAccount')}</p>
                                </div>
                                <Check className="text-green-500" />
                            </div>
                            <div className="flex justify-between border-1 border-gray-400 rounded-lg px-2 py-3 ">
                                <div className="flex gap-2.5 items-center">
                                    <Store className="text-[#6D28D9]" />
                                    <p>{t('configureStore')}</p>
                                </div>
                                <Check className="text-green-500" />
                            </div>
                            <div className="flex justify-between border-1 border-gray-400 rounded-lg px-2 py-3 ">
                                <div className="flex gap-2.5 items-center">
                                    <Globe className="text-[#6D28D9]" />
                                    <p>{t('chooseDomain')}</p>
                                </div>
                                <ChevronRight className="text-gray-400" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}