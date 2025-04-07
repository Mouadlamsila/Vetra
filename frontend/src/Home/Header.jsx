import { AlignJustify, Languages, Search, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { changeLanguage } from "../i18n/i18n";


export default function Header() {
    const { t, i18n } = useTranslation();
    const currentLang = i18n.language;
    const [langue, setLangue] = useState('');
    const [Show, setShow] = useState(false);
    console.log(Show)
    const [menu, setMenu] = useState(false);


    // const language = localStorage.getItem('lang')
    useEffect(() => {
        const langue = localStorage.getItem('lang');
        setLangue(langue)
        document.documentElement.dir = currentLang === "ar" ? "rtl" : "ltr";
    }, [currentLang]);

    return (
        <header className={`${menu ? "h-screen flex-col" : "items-center h-[80px] flex-row"} duration-300 transition-all ease-in-out bg-[#1e3a8a]  fixed z-[99] text-[#FFFFFF] flex  w-full justify-between py-4 px-4 sm:px-28`}>
            <div className={`flex ${menu ? "flex justify-between w-full" : ""}  items-center w-full gap-16`}>
                <img src="/public/img/logo/logo.png" alt="" className="h-12 sm:block hidden " />
                <img src="/public/img/logo/v.png" alt="" className="h-12 block sm:hidden " />
                <X className={`${menu ? "" : "hidden"}  sm:hidden bg-[#c8c2fd] p-2 h-[80%] text-[#6D28D9] w-10 rounded-xl`} onClick={() => setMenu(!menu)} />
                <ul className="sm:flex hidden items-center gap-8">
                    <li className="group hover:text-[#c8c2fd] cursor-pointer duration-300 transition-all ease-in-out">
                        {t('Features')}
                        <div className="w-[4px] h-0.5 group-hover:w-full transition-all ease-in-out duration-300 bg-[#c8c2fd]"></div>
                    </li>
                    <li className="group hover:text-[#c8c2fd] cursor-pointer duration-300 transition-all ease-in-out">
                        {t('AboutUs')}
                        <div className="w-[4px] h-0.5 group-hover:w-full transition-all ease-in-out duration-300 bg-[#c8c2fd]"></div>
                    </li>
                    <li className="group hover:text-[#c8c2fd] cursor-pointer duration-300 transition-all ease-in-out">
                        {t('Services')}
                        <div className="w-[4px] h-0.5 group-hover:w-full transition-all ease-in-out duration-300 bg-[#c8c2fd]"></div>
                    </li>
                    <li className="group hover:text-[#c8c2fd] cursor-pointer duration-300 transition-all ease-in-out">
                        {t('Contact')}
                        <div className="w-[4px] h-0.5 group-hover:w-full transition-all ease-in-out duration-300 bg-[#c8c2fd]"></div>
                    </li>
                </ul>
            </div>
            <div className={`${langue === 'ar' ? ' sm:w-[30%]' : 'sm:w-auto'} flex w-full items-center gap-2`}>
                <Search className={`${menu ? "hidden" : " w-full h-full"} duration-300 bg-[#c8c2fd] p-2 sm:h-10 justify-center font-medium text-[#6D28D9] sm:w-10  text-xl rounded-xl`} />
                <User className={`${menu ? "hidden" : " w-full h-full"} duration-300 sm:hidden block  bg-[#c8c2fd] p-2 sm:h-10 justify-center font-medium text-[#6D28D9] sm:w-10  text-xl rounded-xl`} />
                <div className={`flex justify-center ${menu ? "hidden" : ""}`}>
                    <div onClick={() => setShow(!Show)} className="flex cursor-pointer relative items-center bg-[#c8c2fd] p-2 h-10 justify-center font-medium text-[#6D28D9] w-10  text-xl rounded-xl">

                        {langue === 'ar' ? 'ع' : langue
                        }
                    </div>
                    <div className={`absolute ${Show ? "opacity-100 top-20" : "opacity-0 top-24"} transition-all duration-300 ease-in-out w-[100px] rounded-b-md bg-[#1e3a8a] text-black grid z-[99] items-center`}>
                        <button className={` ${langue === 'en' ? 'bg-[#6D28D9]' : ''} py-4 text-[#c8c2fd]  hover:bg-[#6D28D9] `} onClick={() => { changeLanguage("en"); setShow(!Show) }}>English</button>
                        <div className="w-full bg-[#c8c2fd] h-[1.5px]"></div>
                        <button className={`${langue === 'fr' ? 'bg-[#6D28D9]' : ''} py-4 text-[#c8c2fd]  hover:bg-[#6D28D9] `} onClick={() => { changeLanguage("fr"); setShow(!Show) }}>Français</button>
                        <div className="w-full bg-[#c8c2fd] h-[1.5px] "></div>
                        <button className={`${langue === 'ar' ? 'bg-[#6D28D9]' : ''} py-4 text-[#c8c2fd] rounded-b-md  hover:bg-[#6D28D9] `} onClick={() => { changeLanguage("ar"); setShow(!Show) }}>العربية</button>
                    </div>
                </div>
                <div class="sm:flex hidden  items-center justify-center ">
                    <div class="relative  group bg-[#6D28D9] rounded-xl hover:bg-transparent ">

                        <div class="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#c8c2fd] group-hover:border-[#c8c2fd] rounded-tl-xl transition-all duration-700 group-hover:w-full group-hover:h-full group-hover:rounded-xl"></div>

                        <div class="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#c8c2fd] group-hover:border-[#c8c2fd] rounded-tr-xl transition-all duration-700 group-hover:w-full group-hover:h-full group-hover:rounded-xl"></div>

                        <div class="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#c8c2fd] group-hover:border-[#c8c2fd] rounded-bl-xl transition-all duration-700 group-hover:w-full group-hover:h-full group-hover:rounded-xl"></div>

                        <div class="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#c8c2fd] group-hover:border-[#c8c2fd] rounded-br-xl transition-all duration-700 group-hover:w-full group-hover:h-full group-hover:rounded-xl"></div>

                        <button class="relative px-4 py-2 font-medium text-[#c8c2fd] text-lg tracking-widest border-2 border-transparent rounded-md font-roboto transition duration-700 group-hover:text-white z-10 bg-transparent">
                            {t('Login')}
                        </button>
                    </div>
                </div>

                <AlignJustify className={`${menu ? "hidden" : ""}  sm:hidden bg-[#c8c2fd] p-2 h-full text-[#6D28D9] w-full rounded-xl`} onClick={() => setMenu(!menu)} />
                <div className={`${menu ? "justify-center flex w-full" : "hidden"}`}>
                    <ul className={`${menu ? "" : "hidden"} w-full h-screen flex flex-col justify-center items-center gap-8`}>
                        <li className="  flex justify-center  p-3 text-[#E5E7EB] items-center ">

                            <p className=" z-50 -hover:text-[#6D28D9]  transition-all duration-500 ease-in-out text-2xl font-medium">{t('Features')}</p>
                        </li>
                        <li className="  flex justify-center  p-3 text-[#E5E7EB] items-center ">

                            <p className=" z-50 -hover:text-[#6D28D9] transition-all duration-500 ease-in-out  text-2xl font-medium">{t('AboutUs')}</p>
                        </li>
                        <li className="  flex justify-center  p-3 text-[#E5E7EB] items-center ">

                            <p className=" z-50 -hover:text-[#6D28D9]  transition-all duration-500 ease-in-out text-2xl font-medium">{t('Services')}</p>
                        </li>
                        <li className="  flex justify-center  p-3 text-[#E5E7EB] items-center ">

                            <p className=" z-50 group-hover:text-[#6D28D9] transition-all duration-500 ease-in-out  text-2xl font-medium">{t('Contact')}</p>
                        </li>
                    </ul>
                </div>


            </div>

        </header>
    )
}
