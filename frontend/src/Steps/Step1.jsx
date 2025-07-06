import axios from "axios";
import { Check, ChevronLeft, ChevronRight, Globe, Settings, Store, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { getUserRole, getUserId } from "../utils/auth";

export default function Step1() {
    const { t } = useTranslation();
    const language = localStorage.getItem("lang") || "en";
    const userRole = getUserRole();
    const userId = getUserId();
    
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
                <Link to="/login" className="block">
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
                <Link to="/to-owner" className="block">
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
                <Link to="/controll/AddStore" className="block">
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
        <div className="max-w-2xl mx-auto p-6">
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
                <div className="text-center mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                        {t('getStarted')}
                    </h1>
                    <p className="text-gray-600">
                        {t('getStartedDescription')}
                    </p>
                </div>

                {renderError()}

                <div className="space-y-4">
                    {renderCreateAccountStep()}
                    {renderConfigureStoreStep()}
                    {renderChooseDomainStep()}
                </div>

                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-500">
                        {t('needHelp')} <Link to="/help" className="text-purple-600 hover:text-purple-700 underline">{t('contactSupport')}</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}