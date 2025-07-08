import axios from "axios";
import { Check, ChevronLeft, ChevronRight, Globe, Settings, Store, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function Step1() {
    const { t } = useTranslation();
    const language = localStorage.getItem("lang") || "en";
    const userRole = localStorage.getItem("role");
    const userId = localStorage.getItem("IDUser");
    
    const [boutiquesCount, setBoutiquesCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userAuthenticated, setUserAuthenticated] = useState(false);

    // Check if user is logged in with valid ID
    useEffect(() => {
        const isAuthenticated = userId && userId !== "undefined" && userId !== "null";
        setUserAuthenticated(isAuthenticated);
        
        if (!isAuthenticated) {
            setIsLoading(false);
            return;
        }

        const fetchBoutiquesData = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`https://stylish-basket-710b77de8f.strapiapp.com/api/users/${userId}?populate[boutiques][count]=true`);
                
                if (response.data && response.data.boutiques) {
                    setBoutiquesCount(response.data.boutiques.count);
                } else {
                    setBoutiquesCount(0);
                }
            } catch (error) {
                console.error("Error fetching boutiques count:", error);
                setError("Failed to load store data");
                setBoutiquesCount(0);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBoutiquesData();
    }, [userId]);

    // Direction chevron based on language
    const DirectionChevron = language === "ar" ? ChevronLeft : ChevronRight;

    // Step 1: Create Account Step
    const renderCreateAccountStep = () => {
        // User not logged in
        if (!userAuthenticated) {
            return (
                <Link to="/login" className="block cursor-pointer">
                    <div className="flex justify-between border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 hover:border-purple-500 transition-colors">
                        <div className="flex gap-2 sm:gap-2.5 items-center">
                            <UserPlus className="text-[#6D28D9] w-4 h-4 sm:w-5 sm:h-5" />
                            <p className="text-sm sm:text-base">{t('createAccount')}</p>
                        </div>
                        <DirectionChevron className="text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                </Link>
            );
        }
        if (userRole === "user") {
            return (
                <Link to="/to-owner" className="block cursor-pointer">
                    <div className="flex justify-between border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 hover:border-purple-500 transition-colors">
                        <div className="flex gap-2 sm:gap-2.5 items-center">
                            <UserPlus className="text-[#6D28D9] w-4 h-4 sm:w-5 sm:h-5" />
                            <p className="text-sm sm:text-base">{t('createAccount')}</p>
                        </div>
                        <DirectionChevron className="text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                </Link>
            );
        }
        
        // User logged in - step completed
        return (
            <div className="flex justify-between border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 bg-purple-50">
                <div className="flex gap-2 sm:gap-2.5 items-center">
                    <UserPlus className="text-[#6D28D9] w-4 h-4 sm:w-5 sm:h-5" />
                    <p className="text-sm sm:text-base">{t('createAccount')}</p>
                </div>
                <Check className="text-green-500 w-4 h-4 sm:w-5 sm:h-5" />
            </div>
        );
    };

    // Step 2: Configure Store Step
    const renderConfigureStoreStep = () => {
        // Not logged in
        if (!userAuthenticated || userRole === "User") {
            return (
                <div className="flex justify-between border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 opacity-70">
                    <div className="flex gap-2 sm:gap-2.5 items-center">
                        <Store className="text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                        <p className="text-sm sm:text-base text-gray-400">{t('configureStore')}</p>
                    </div>
                    <DirectionChevron className="text-gray-300 w-4 h-4 sm:w-5 sm:h-5" />
                </div>
            );
        }

        // Loading state
        if (isLoading) {
            return (
                <div className="flex justify-between border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3">
                    <div className="flex gap-2 sm:gap-2.5 items-center">
                        <Store className="text-[#6D28D9] w-4 h-4 sm:w-5 sm:h-5" />
                        <p className="text-sm sm:text-base">{t('configureStore')}</p>
                    </div>
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            );
        }

        // Regular user - needs to upgrade
        // if () {
        //     return (
               
        //             <div className="flex justify-between border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 hover:border-purple-500 transition-colors">
        //                 <div className="flex gap-2 sm:gap-2.5 items-center">
        //                     <Store className="text-[#6D28D9] w-4 h-4 sm:w-5 sm:h-5" />
        //                     <p className="text-sm sm:text-base">{t('configureStore')}</p>
        //                 </div>
        //                 <DirectionChevron className="text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
        //             </div>
            
        //     );
        // }

        // Owner who has configured stores
        if (userRole === "Owner" && boutiquesCount > 0) {
            return (
                <div className="flex justify-between border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 bg-purple-50">
                    <div className="flex gap-2 sm:gap-2.5 items-center">
                        <Store className="text-[#6D28D9] w-4 h-4 sm:w-5 sm:h-5" />
                        <p className="text-sm sm:text-base">{t('configureStore')}</p>
                    </div>
                    <Check className="text-green-500 w-4 h-4 sm:w-5 sm:h-5" />
                </div>
            );
        }

        // Owner who needs to create a store
        if (userRole === "Owner" && boutiquesCount === 0) {
            return (
                <Link to="/controll/AddStore" className="block cursor-pointer">
                    <div className="flex justify-between border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 hover:border-purple-500 transition-colors">
                        <div className="flex gap-2 sm:gap-2.5 items-center">
                            <Store className="text-[#6D28D9] w-4 h-4 sm:w-5 sm:h-5" />
                            <p className="text-sm sm:text-base">{t('configureStore')}</p>
                        </div>
                        <DirectionChevron className="text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                </Link>
            );
        }

        // Fallback for any unexpected state
        return (
            <div className="flex justify-between border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3">
                <div className="flex gap-2 sm:gap-2.5 items-center">
                    <Store className="text-[#6D28D9] w-4 h-4 sm:w-5 sm:h-5" />
                    <p className="text-sm sm:text-base">{t('configureStore')}</p>
                </div>
                <DirectionChevron className="text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            </div>
        );
    };

    // Step 3: Choose Domain Step
    const renderChooseDomainStep = () => {
        // Not logged in or not an owner or no boutiques created
        const isDisabled = !userAuthenticated || userRole !== "Owner" || boutiquesCount === 0;
        
        return (
            <div className={`flex justify-between border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 ${isDisabled ? 'opacity-70' : 'hover:border-purple-500 transition-colors'}`}>
                <div className="flex gap-2 sm:gap-2.5 items-center">
                    <Globe className={`${isDisabled ? 'text-gray-400' : 'text-[#6D28D9]'} w-4 h-4 sm:w-5 sm:h-5`} />
                    <p className={`text-sm sm:text-base ${isDisabled ? 'text-gray-400' : ''}`}>{t('chooseDomain')}</p>
                </div>
                <DirectionChevron className="text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            </div>
        );
    };

    // Error display component
    const renderError = () => {
        if (!error) return null;
        
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg mb-4">
                {error}
            </div>
        );
    };
    
    return (
        <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-4 sm:px-5">
                <div className="space-y-3 max-w-2xl mx-auto lg:mx-0">
                    <div className="flex items-center gap-4">
                        <h1 className="bg-[#6D28D9] flex w-8 h-8 sm:w-12 sm:h-12 rounded-full text-white items-center justify-center text-xl sm:text-2xl">1</h1>
                        <p className="text-[#6D28D9] text-2xl sm:text-3xl font-medium">{t('step1Title')}</p>
                    </div>
                    <p className="text-gray-500 text-base sm:text-lg">{t('step1Description')}</p>
                    <div className="space-y-4">
                        <div className="flex gap-4 sm:gap-5 items-start">
                            <div className="text-[#6D28D9] rounded-full bg-[#c8c2fd] w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 flex justify-center items-center">
                                <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" />
                            </div>
                            <div>
                                <h2 className="text-base sm:text-lg font-medium">{t('simpleRegistration')}</h2>
                                <p className="text-base sm:text-lg text-gray-500">{t('simpleRegistrationDesc')}</p>
                            </div>
                        </div>
                        <div className="flex gap-4 sm:gap-5 items-start">
                            <div className="text-[#6D28D9] rounded-full bg-[#c8c2fd] w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 flex justify-center items-center">
                                <Store className="w-4 h-4 sm:w-5 sm:h-5" />
                            </div>
                            <div>
                                <h2 className="text-base sm:text-lg font-medium">{t('storeCustomization')}</h2>
                                <p className="text-base sm:text-lg text-gray-500">{t('storeCustomizationDesc')}</p>
                            </div>
                        </div>
                        <div className="flex gap-4 sm:gap-5 items-start">
                            <div className="text-[#6D28D9] rounded-full bg-[#c8c2fd] w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 flex justify-center items-center">
                                <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
                            </div>
                            <div>
                                <h2 className="text-base sm:text-lg font-medium">{t('basicSettings')}</h2>
                                <p className="text-base sm:text-lg text-gray-500">{t('basicSettingsDesc')}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex w-full justify-center items-center">
                    <div className="bg-white border border-[#c8c2fd] shadow p-4 sm:p-6 rounded-xl w-full max-w-md">
                        <div className="flex w-full justify-between pb-4">
                            <h2 className="text-xl sm:text-2xl font-medium">{t('controlPanel')}</h2>
                            <p className="bg-[#c8c2fd] px-2 py-0.5 text-[#6D28D9] rounded-lg text-sm sm:text-base">{t('step1')}</p>
                        </div>
                        {renderError()}
                        <div className="space-y-3 sm:space-y-4">
                            {renderCreateAccountStep()}
                            {renderConfigureStoreStep()}
                            {renderChooseDomainStep()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}