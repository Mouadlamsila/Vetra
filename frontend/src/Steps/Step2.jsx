import { Check, ChevronRight, Earth, Globe, Package, Settings, ShoppingBag, Store, Truck, User, UserPlus } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Step2() {
    const { t } = useTranslation();
    
    return (
        <div className="p-6">
            <div className="grid grid-cols-2 px-5">
                <div className="space-y-3">
                    <div className="flex items-center gap-4">
                        <h1 className="bg-[#6D28D9] w-12 h-12 rounded-[50%] text-white items-center flex justify-center">2</h1>
                        <p className="text-[#6D28D9] text-3xl font-medium">{t('step2Title')}</p>
                    </div>
                    <p className="text-gray-500 text-lg">{t('step2Description')}</p>
                    <div>
                        <div className="flex gap-5 items-center">
                            <div className="text-[#6D28D9] rounded-[50%]  bg-[#c8c2fd]  w-10 h-10 flex justify-center items-center">
                                <Package className="" />
                            </div>
                            <div className="">
                                <h1 className="text-lg font-medium">{t('easyProductAddition')}</h1>
                                <h1 className="text-lg text-gray-500">{t('easyProductAdditionDesc')}</h1>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="flex gap-5 items-center">
                            <div className="text-[#6D28D9] rounded-[50%]  bg-[#c8c2fd]  w-10 h-10 flex justify-center items-center">
                                <ShoppingBag className="" />
                            </div>
                            <div className="">
                                <h1 className="text-lg font-medium">{t('categoryOrganization')}</h1>
                                <h1 className="text-lg text-gray-500">{t('categoryOrganizationDesc')}</h1>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="flex gap-5 items-center">
                            <div className="text-[#6D28D9] rounded-[50%]  bg-[#c8c2fd]  w-10 h-10 flex justify-center items-center">
                                <Truck className="" />
                            </div>
                            <div className="">
                                <h1 className="text-lg font-medium">{t('deliveryOptions')}</h1>
                                <h1 className="text-lg text-gray-500">{t('deliveryOptionsDesc')}</h1>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex w-full justify-center items-center">
                    <div className="bg-white shadow-2xl p-6 rounded-xl  w-[80%]">
                        <div className="flex w-full justify-between pb-4 ">
                            <h1 className="text-2xl font-medium">{t('productManagement')}</h1>
                            <p className="bg-[#c8c2fd] px-2 py-0.5 text-[#6D28D9] rounded-lg">{t('step2')}</p>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between border-1 border-gray-400 rounded-lg px-2 py-3 ">
                                <div className="flex gap-2.5 items-center">
                                    <Package className="text-[#6D28D9]" />
                                    <p>{t('addProduct')}</p>
                                </div>
                                <p className="text-white text-sm px-2 py-1 bg-[#6D28D9] rounded-sm">{t('add')}</p>
                            </div>
                            <div className="flex justify-between border-1 border-gray-400 rounded-lg px-2 py-3 ">
                                <div className="flex gap-2.5 items-center">
                                    <ShoppingBag className="text-[#6D28D9]" />
                                    <p>{t('manageCategories')}</p>
                                </div>
                                <ChevronRight className="text-gray-400" />
                            </div>
                            <div className="flex justify-between border-1 border-gray-400 rounded-lg px-2 py-3 ">
                                <div className="flex gap-2.5 items-center">
                                    <Truck className="text-[#6D28D9]" />
                                    <p>{t('deliveryOptions')}</p>
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