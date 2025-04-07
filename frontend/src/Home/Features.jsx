import SpotlightCard from "../blocks/Components/SpotlightCard/SpotlightCard";
import { BarChart3, Shield, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";

const Features = () => {
    const { t } = useTranslation();

    const features = [
        {
            icon: <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-[#1e3a8a]" />,
            title: t('featureLightningFast'),
            description: t('featureLightningDesc')
        },
        {
            icon: <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-[#1e3a8a]" />,
            title: t('featureSecure'),
            description: t('featureSecureDesc')
        },
        {
            icon: <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-[#1e3a8a]" />,
            title: t('featureAnalytics'),
            description: t('featureAnalyticsDesc')
        }
    ];

    return (
        <div className="p-4  sm:p-6 lg:p-8 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {features.map((feature, index) => (
                    <SpotlightCard 
                        key={index} 
                        className="custom-spotlight-card h-full" 
                        spotlightColor="rgba(255, 255, 255, 0.217)"
                    >
                        <div className="flex flex-col h-full p-4 sm:p-6">
                            <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                                <div className="bg-[#c8c2fd] p-2 sm:p-3 rounded-lg">
                                    {feature.icon}
                                </div>
                                <h3 className="text-lg sm:text-xl font-semibold text-[#c8c2fd]">
                                    {feature.title}
                                </h3>
                            </div>
                            <p className="text-sm sm:text-base text-[#c8c2fd] flex-grow">
                                {feature.description}
                            </p>
                        </div>
                    </SpotlightCard>
                ))}
            </div>
        </div>
    );
};

export default Features; 