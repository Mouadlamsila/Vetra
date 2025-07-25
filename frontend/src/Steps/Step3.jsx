import { ChartColumnIncreasing, Check, ChevronRight, CreditCard, Earth, Globe, Package, Settings, Shield, ShoppingBag, Smartphone, Store, Truck, User, UserPlus, Users } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Step3() {
    const { t } = useTranslation();
    
    return (
        <div id="step3" className="p-4 sm:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-4 sm:px-5">
                <div className="space-y-3 max-w-2xl mx-auto lg:mx-0">
                    <div className="flex items-center gap-4  ">
                        <h1 className="sm:bg-[#6D28D9] flex  w-8 h-8 sm:w-12 sm:h-12 sm:rounded-[50%] text-[#6D28D9] sm:text-white items-center  justify-center text-4xl sm:text-xl">3</h1>
                        <p className="text-[#6D28D9] text-2xl sm:text-3xl font-medium">{t('step3Title')}</p>
                    </div>
                    <p className="text-gray-500 text-base sm:text-lg">{t('step3Description')}</p>
                    <div className="space-y-4">
                        <div className="flex gap-4 sm:gap-5 items-start">
                            <div className="text-[#6D28D9] rounded-[50%] bg-[#c8c2fd] w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 flex justify-center items-center">
                                <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
                            </div>
                            <div>
                                <h1 className="text-base sm:text-lg font-medium">{t('multiplePaymentOptions')}</h1>
                                <h1 className="text-base sm:text-lg text-gray-500">{t('multiplePaymentOptionsDesc')}</h1>
                            </div>
                        </div>
                        <div className="flex gap-4 sm:gap-5 items-start">
                            <div className="text-[#6D28D9] rounded-[50%] bg-[#c8c2fd] w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 flex justify-center items-center">
                                <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
                            </div>
                            <div>
                                <h1 className="text-base sm:text-lg font-medium">{t('secureTransactions')}</h1>
                                <h1 className="text-base sm:text-lg text-gray-500">{t('secureTransactionsDesc')}</h1>
                            </div>
                        </div>
                        <div className="flex gap-4 sm:gap-5 items-start">
                            <div className="text-[#6D28D9] rounded-[50%] bg-[#c8c2fd] w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 flex justify-center items-center">
                                <ChartColumnIncreasing className="w-4 h-4 sm:w-5 sm:h-5" />
                            </div>
                            <div>
                                <h1 className="text-base sm:text-lg font-medium">{t('salesTracking')}</h1>
                                <h1 className="text-base sm:text-lg text-gray-500">{t('salesTrackingDesc')}</h1>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex w-full justify-center items-center">
                    <div className="bg-white border border-[#c8c2fd] shadow p-4 sm:p-6 rounded-xl w-full max-w-md">
                        <div className="flex w-full justify-between pb-4">
                            <h1 className="text-sm  sm:text-2xl sm:font-medium font-bold">{t('paymentConfiguration')}</h1>
                            <p className="bg-[#c8c2fd] px-2 py-0.5 text-[#6D28D9] rounded-lg text-sm sm:text-base">{t('step3')}</p>
                        </div>
                        <div className="space-y-3 sm:space-y-4">
                            <div className="flex justify-between border-1 border-gray-400 rounded-lg px-3 py-2 sm:px-4 sm:py-3">
                                <div className="flex gap-2 sm:gap-2.5 items-center">
                                    <CreditCard className="text-[#6D28D9] w-4 h-4 sm:w-5 sm:h-5" />
                                    <p className="text-sm sm:text-base">{t('creditCards')}</p>
                                </div>
                                <div className="flex gap-1">
                                    <div className="w-6 h-4 sm:w-8 sm:h-5 bg-blue-500 rounded"></div>
                                    <div className="w-6 h-4 sm:w-8 sm:h-5 bg-red-500 rounded"></div>
                                    <div className="w-6 h-4 sm:w-8 sm:h-5 bg-yellow-500 rounded"></div>
                                </div>
                            </div>
                            <div className="flex justify-between border-1 border-gray-400 rounded-lg px-3 py-2 sm:px-4 sm:py-3">
                                <div className="flex gap-2 sm:gap-2.5 items-center">
                                    <Smartphone className="text-[#6D28D9] w-4 h-4 sm:w-5 sm:h-5" />
                                    <p className="text-sm sm:text-base">{t('mobilePayment')}</p>
                                </div>
                                <div className="flex gap-1">
                                    <div className="w-6 h-4 sm:w-8 sm:h-5 bg-black rounded"></div>
                                    <div className="w-6 h-4 sm:w-8 sm:h-5 bg-green-400 rounded"></div>
                                </div>
                            </div>
                            <div className="flex justify-between border-1 border-gray-400 rounded-lg px-3 py-2 sm:px-4 sm:py-3">
                                <div className="flex gap-2 sm:gap-2.5 items-center">
                                    <Users className="text-[#6D28D9] w-4 h-4 sm:w-5 sm:h-5" />
                                    <p className="text-sm sm:text-base">{t('otherMethods')}</p>
                                </div>
                                <p className="text-white text-xs sm:text-sm px-2 py-1 bg-[#6D28D9] rounded-sm">{t('add')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}