import { Store } from "lucide-react";
import Step1 from "../Steps/Step1";
import Step2 from "../Steps/Step2";
import Step3 from "../Steps/Step3";
import ShinyButton from "../blocks/TextAnimations/ShinyButton/ShinyButton";
import { useTranslation } from "react-i18next";

export default function Steps() {
    const { t } = useTranslation();
    
    return (
        <div className="w-full py-5 space-y-4">
            <div className="flex  justify-center ">
                <div className="space-y-2">
                    <div className="justify-center flex">
                        <div className=" bg-[#E5E7EB]  gap-1 text-[#6D28D9] flex p-2 rounded-xl ">
                            <Store className="" />
                            <h1>{t('howItWorks')}</h1>
                        </div>
                    </div>

                    <h1 className="text-[#6D28D9] font-bold pb-1 text-5xl">{t('createYourOnlineStore')}</h1>
                    <p className="text-gray-400 text-center ">{t('platformDescription')}</p>

                </div>

            </div>
            <Step1 />
            <div className="flex justify-center w-full ">
                <div className="h-20 w-[1px] bg-[#c8c2fd]"></div>
            </div>
            <Step2/>
            <div className="flex justify-center w-full ">
                <div className="h-20 w-[1px] bg-[#c8c2fd]"></div>
            </div>
            <Step3/>
            <div className="w-full flex justify-center">
                <ShinyButton>
                    <p>{t('startNow')}</p>
                    <Store/>
                </ShinyButton>
            </div>
        </div>
    )
}