import { ChartColumnIncreasing, Check, ChevronRight, CreditCard, Earth, Globe, Package, Settings, Shield, ShoppingBag, Smartphone, Store, Truck, User, UserPlus, Users } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Step3() {
    const { t } = useTranslation();
    
    return (
        <div className="p-6">
            <div className="grid grid-cols-2 px-5">
                <div className="space-y-3">
                    <div className="flex items-center gap-4">
                        <h1 className="bg-[#6D28D9] w-12 h-12 rounded-[50%] text-white items-center flex justify-center">3</h1>
                        <p className="text-[#6D28D9] text-3xl font-medium">{t('step3Title')}</p>
                    </div>
                    <p className="text-gray-500 text-lg">{t('step3Description')}</p>
                    <div>
                        <div className="flex gap-5 items-center">
                            <div className="text-[#6D28D9] rounded-[50%]  bg-[#c8c2fd]  w-10 h-10 flex justify-center items-center">
                                <CreditCard className="" />
                            </div>
                            <div className="">
                                <h1 className="text-lg font-medium">{t('multiplePaymentOptions')}</h1>
                                <h1 className="text-lg text-gray-500">{t('multiplePaymentOptionsDesc')}</h1>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="flex gap-5 items-center">
                            <div className="text-[#6D28D9] rounded-[50%]  bg-[#c8c2fd]  w-10 h-10 flex justify-center items-center">
                                <Shield className="" />
                            </div>
                            <div className="">
                                <h1 className="text-lg font-medium">{t('secureTransactions')}</h1>
                                <h1 className="text-lg text-gray-500">{t('secureTransactionsDesc')}</h1>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="flex gap-5 items-center">
                            <div className="text-[#6D28D9] rounded-[50%]  bg-[#c8c2fd]  w-10 h-10 flex justify-center items-center">
                                <ChartColumnIncreasing className="" />
                            </div>
                            <div className="">
                                <h1 className="text-lg font-medium">{t('salesTracking')}</h1>
                                <h1 className="text-lg text-gray-500">{t('salesTrackingDesc')}</h1>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex w-full justify-center items-center">
                    <div className="bg-white shadow-2xl p-6 rounded-xl  w-[80%]">
                        <div className="flex w-full justify-between pb-4 ">
                            <h1 className="text-2xl font-medium">{t('paymentConfiguration')}</h1>
                            <p className="bg-[#c8c2fd] px-2 py-0.5 text-[#6D28D9] rounded-lg">{t('step3')}</p>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between border-1 border-gray-400 rounded-lg px-2 py-3 ">
                                <div className="flex gap-2.5 items-center">
                                    <CreditCard className="text-[#6D28D9]" />
                                    <p>{t('creditCards')}</p>
                                </div>
                                <div className="flex gap-1">
                                    <div className="w-8 h-5 bg-blue-500 rounded"></div>
                                    <div className="w-8 h-5 bg-red-500 rounded"></div>
                                    <div className="w-8 h-5 bg-yellow-500 rounded"></div>
                                </div>
                            </div>
                            <div className="flex justify-between border-1 border-gray-400 rounded-lg px-2 py-3 ">
                                <div className="flex gap-2.5 items-center">
                                    <Smartphone className="text-[#6D28D9]" />
                                    <p>{t('mobilePayment')}</p>
                                </div>
                                <div className="flex gap-1">
                                    <div className="w-8 h-5 bg-black rounded"></div>
                                    <div className="w-8 h-5 bg-green-400 rounded"></div>
                                </div>
                            </div>
                            <div className="flex justify-between border-1 border-gray-400 rounded-lg px-2 py-3 ">
                                <div className="flex gap-2.5 items-center">
                                    <Users className="text-[#6D28D9]" />
                                    <p>{t('otherMethods')}</p>
                                </div>
                                <p className="text-white text-sm px-2 py-1 bg-[#6D28D9] rounded-sm">{t('add')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}