import { ChartColumnIncreasing, Check, ChevronRight, CreditCard, Earth, Globe, Package, Settings, Shield, ShoppingBag, Smartphone, Store, Truck, User, UserPlus, Users } from "lucide-react";


export default function Step3() {
    return (
        <div className="p-6">
            <div className="grid grid-cols-2 px-5">
                <div className="space-y-3">
                    <div className="flex items-center gap-4">
                        <h1 className="bg-[#6D28D9] w-12 h-12 rounded-[50%] text-white items-center flex justify-center">3</h1>
                        <p className="text-[#6D28D9] text-3xl font-medium">Choisissez vos méthodes de paiement</p>
                    </div>
                    <p className="text-gray-500 text-lg">Configurez les options de paiement pour offrir une expérience d'achat fluide à vos clients.</p>
                    <div>
                        <div className="flex gap-5 items-center">
                            <div className="text-[#6D28D9] rounded-[50%]  bg-[#c8c2fd]  w-10 h-10 flex justify-center items-center">
                                <CreditCard className="" />
                            </div>
                            <div className="">
                                <h1 className="text-lg font-medium">Multiples options de paiement</h1>
                                <h1 className="text-lg text-gray-500">Cartes de crédit, PayPal, virements bancaires et plus</h1>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="flex gap-5 items-center">
                            <div className="text-[#6D28D9] rounded-[50%]  bg-[#c8c2fd]  w-10 h-10 flex justify-center items-center">
                                <Shield className="" />
                            </div>
                            <div className="">
                                <h1 className="text-lg font-medium">Transactions sécurisées</h1>
                                <h1 className="text-lg text-gray-500">Toutes les transactions sont protégées par un cryptage avancé</h1>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="flex gap-5 items-center">
                            <div className="text-[#6D28D9] rounded-[50%]  bg-[#c8c2fd]  w-10 h-10 flex justify-center items-center">
                                <ChartColumnIncreasing className="" />
                            </div>
                            <div className="">
                                <h1 className="text-lg font-medium">Suivi des ventes</h1>
                                <h1 className="text-lg text-gray-500">Consultez les rapports de ventes et les statistiques en temps réel</h1>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex w-full justify-center items-center">

                    <div className="bg-white shadow-2xl p-6 rounded-xl  w-[80%]">
                        <div className="flex w-full justify-between pb-4 ">
                            <h1 className="text-2xl font-medium">Configuration des paiements</h1>
                            <p className="bg-[#c8c2fd] px-2 py-0.5 text-[#6D28D9] rounded-lg">Étape 3</p>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between border-1 border-gray-400 rounded-lg px-2 py-3 ">
                                <div className="flex gap-2.5 items-center">
                                    <CreditCard className="text-[#6D28D9]" />
                                    <p>Cartes de crédit</p>
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
                                    <p>Paiement mobile</p>
                                </div>
                                <div className="flex gap-1">
                                    <div className="w-8 h-5 bg-black rounded"></div>
                                    <div className="w-8 h-5 bg-green-400 rounded"></div>
                                </div>
                            </div>
                            <div className="flex justify-between border-1 border-gray-400 rounded-lg px-2 py-3 ">
                                <div className="flex gap-2.5 items-center">
                                    <Users className="text-[#6D28D9]" />
                                    <p>Autres méthodes</p>
                                </div>
                                <p className="text-white text-sm px-2 py-1 bg-[#6D28D9] rounded-sm">Ajouter</p>
                            </div>

                        </div>


                    </div>
                </div>
            </div>

        </div>
    )
}