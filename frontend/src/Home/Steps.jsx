import { Store } from "lucide-react";
import Step1 from "../Steps/Step1";
import Step2 from "../Steps/Step2";
import Step3 from "../Steps/Step3";
import ShinyButton from "../blocks/TextAnimations/ShinyButton/ShinyButton";
import { useTranslation } from "react-i18next";

export default function Steps() {
    const { t } = useTranslation();
    
    return (
        <div className="w-full py-5 space-y-4 px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center">
                <div className="space-y-2 max-w-3xl w-full">
                    <div className="justify-center flex">
                        <div className="bg-[#E5E7EB] gap-1 text-[#6D28D9] flex p-2 rounded-xl items-center">
                            <Store className="w-5 h-5" />
                            <h1 className="text-sm sm:text-base">{t('howItWorks')}</h1>
                        </div>
                    </div>

                    <h1 className="text-[#6D28D9] font-bold pb-1 text-3xl sm:text-4xl md:text-5xl text-center">
                        {t('createYourOnlineStore')}
                    </h1>
                    <p className="text-gray-400 text-center text-sm sm:text-base max-w-2xl mx-auto">
                        {t('platformDescription')}
                    </p>
                </div>
            </div>

            <div className="space-y-4 max-w-7xl mx-auto">
                <Step1 />
                <div className="flex justify-center w-full">
                    <div className="h-20 w-[1px] bg-[#c8c2fd]"></div>
                </div>
                <Step2 />
                <div className="flex justify-center w-full">
                    <div className="h-20 w-[1px] bg-[#c8c2fd]"></div>
                </div>
                <Step3 />
            </div>

            <div className="w-full flex justify-center pt-4">
                <ShinyButton className="w-full sm:w-auto">
                    <p className="text-sm sm:text-base">{t('startNow')}</p>
                    <Store className="w-4 h-4 sm:w-5 sm:h-5" />
                </ShinyButton>
            </div>
        </div>
    )
}