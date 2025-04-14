import { AlignJustify, Languages, Link, Search, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { changeLanguage } from "../i18n/i18n";
import { motion, AnimatePresence } from "framer-motion";
import { Link as LinkDom, useLocation, useNavigate } from "react-router-dom";
import ShinyButton from "../blocks/TextAnimations/ShinyButton/ShinyButton";
import { Link as ScrollLink } from 'react-scroll'
import BTN1 from "../blocks/Buttons/BTN1";

export default function Header() {
    const { t, i18n } = useTranslation();
    const currentLang = i18n.language;
    const [langue, setLangue] = useState('');
    const [Show, setShow] = useState(false);
    const [menu, setMenu] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const [makeStyle, setMakeStyle] = useState(localStorage.getItem("location"));
    const userID = localStorage.getItem("user");

    useEffect(() => {
        localStorage.setItem("location", makeStyle);
    }, [location.pathname, makeStyle]);


    // const language = localStorage.getItem('lang')
    useEffect(() => {
        const langue = localStorage.getItem('lang');
        setLangue(langue)
        document.documentElement.dir = currentLang === "ar" ? "rtl" : "ltr";
    }, [currentLang]);

    return (
        <header className={`${menu ? "h-screen flex-col" : "items-center h-[80px] flex-row"} duration-300 select-none transition-all ease-in-out bg-[#1e3a8a]  fixed z-[99] text-[#FFFFFF] flex  w-full justify-between py-4 px-4 sm:px-28`}>
            <div className={`flex ${menu ? "flex justify-between w-full" : ""}  items-center w-full gap-16`}>
                {location.pathname === '/' ? (
                    <ScrollLink to="home" spy={true} smooth={true} offset={-100} className="sm:block hidden">
                        <img src="/public/img/logo/logo.png" alt="" className="h-12 sm:block hidden" />
                    </ScrollLink>
                ) : (
                    <LinkDom to="/" className="sm:block hidden">
                        <img src="/public/img/logo/logo.png" alt="" className="h-12 sm:block hidden" />
                    </LinkDom>
                )}
                {location.pathname === '/' ? (
                    <ScrollLink to="home2" spy={true} smooth={true} offset={-100} className="block sm:hidden" onClick={() => setMenu(false)}>
                        <img src="/public/img/logo/v.png" alt="" className="h-12 block sm:hidden" />
                    </ScrollLink>
                ) : (
                    <LinkDom to="/" className="block sm:hidden" onClick={() => setMenu(false)}>
                        <img src="/public/img/logo/v.png" alt="" className="h-12 block sm:hidden" />
                    </LinkDom>
                )}
                <X className={`${menu ? "" : "hidden"}  sm:hidden bg-[#c8c2fd] p-2 h-[80%] text-[#6D28D9] w-10 rounded-xl`} onClick={() => setMenu(!menu)} />
                <ul className="sm:flex hidden items-center gap-8">
                    {location.pathname === '/' ? (
                        <ScrollLink to="home" onClick={() => setMakeStyle("home")} spy={true} smooth={true} offset={-100} className={`${makeStyle === "home" ? "text-[#c8c2fd]" : "text-[#FFFFFF]"} group hover:text-[#c8c2fd] cursor-pointer duration-300 transition-all ease-in-out`}>
                            {t('Features')}
                            <div className={`${makeStyle === "home" ? "w-full" : "w-[4px]"}  h-0.5  group-hover:w-full transition-all ease-in-out duration-300 bg-[#c8c2fd]`}></div>
                        </ScrollLink>
                    ) : (
                        <LinkDom to="/" onClick={() => setMakeStyle("home")} className={`${makeStyle === "home" ? "text-[#c8c2fd]" : "text-[#FFFFFF]"} group hover:text-[#c8c2fd] cursor-pointer duration-300 transition-all ease-in-out`}>
                            {t('Features')}
                            <div className={`${makeStyle === "home" ? "w-full" : "w-[4px]"}  h-0.5  group-hover:w-full transition-all ease-in-out duration-300 bg-[#c8c2fd]`}></div>
                        </LinkDom>
                    )}
                    {location.pathname === '/' ? (
                        <ScrollLink to="about" onClick={() => setMakeStyle("about")} spy={true} smooth={true} offset={-100} className={`${makeStyle === "about" ? "text-[#c8c2fd]" : "text-[#FFFFFF]"} group hover:text-[#c8c2fd] cursor-pointer duration-300 transition-all ease-in-out`}>
                            {t('AboutUs')}
                            <div className={`${makeStyle === "about" ? "w-full" : "w-[4px]"} h-0.5 group-hover:w-full transition-all ease-in-out duration-300 bg-[#c8c2fd]`}></div>
                        </ScrollLink>
                    ) : (
                        <LinkDom to="/" onClick={() => setMakeStyle("about")} className={`${makeStyle === "about" ? "text-[#c8c2fd]" : "text-[#FFFFFF]"} group hover:text-[#c8c2fd] cursor-pointer duration-300 transition-all ease-in-out`}>
                            {t('AboutUs')}
                            <div className={`${makeStyle === "about" ? "w-full" : "w-[4px]"} h-0.5 group-hover:w-full transition-all ease-in-out duration-300 bg-[#c8c2fd]`}></div>
                        </LinkDom>
                    )}
                    {location.pathname === '/' ? (
                        <ScrollLink to="contact" onClick={() => setMakeStyle("contact")} spy={true} smooth={true} offset={-100} className={`${makeStyle === "contact" ? "text-[#c8c2fd]" : "text-[#FFFFFF]"} group hover:text-[#c8c2fd] cursor-pointer duration-300 transition-all ease-in-out`}>
                            {t('Contact')}
                            <div className={`${makeStyle === "contact" ? "w-full" : "w-[4px]"} h-0.5 group-hover:w-full transition-all ease-in-out duration-300 bg-[#c8c2fd]`}></div>
                        </ScrollLink>
                    ) : (
                        <LinkDom to="/" onClick={() => setMakeStyle("contact")} className={`${makeStyle === "contact" ? "text-[#c8c2fd]" : "text-[#FFFFFF]"} group hover:text-[#c8c2fd] cursor-pointer duration-300 transition-all ease-in-out`}>
                            {t('Contact')}
                            <div className={`${makeStyle === "contact" ? "w-full" : "w-[4px]"} h-0.5 group-hover:w-full transition-all ease-in-out duration-300 bg-[#c8c2fd]`}></div>
                        </LinkDom>
                    )}

                </ul>
            </div>
            <div className={`${langue === 'ar' ? ' sm:w-[30%]' : 'sm:w-auto'} flex w-full items-center gap-2`}>
                <Search className={`${menu ? "hidden" : " w-full h-full"} duration-300 bg-[#c8c2fd] p-2 sm:h-10 justify-center font-medium text-[#6D28D9] sm:w-10  text-xl rounded-xl`} />
                <User className={`${menu ? "hidden" : " w-full h-full"} duration-300 sm:hidden block  bg-[#c8c2fd] p-2 sm:h-10 justify-center font-medium text-[#6D28D9] sm:w-10  text-xl rounded-xl`} />
                <div className={`flex justify-center ${menu ? "hidden" : ""}`}>
                    <div onClick={() => setShow(!Show)} className="flex cursor-pointer relative items-center bg-[#c8c2fd] p-2 h-10 justify-center font-medium text-[#6D28D9] w-10  text-xl rounded-xl">

                        {langue === 'ar' ? 'ع' : langue}
                    </div>
                    {/* menu langue */}
                    <AnimatePresence>
                        {Show && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="absolute top-20 w-[100px] rounded-b-md bg-[#1e3a8a] text-black grid z-[99] items-center"
                            >
                                <button className={` ${langue === 'en' ? 'bg-[#6D28D9]' : ''} py-4 text-[#c8c2fd]  hover:bg-[#6D28D9] `} onClick={() => { changeLanguage("en"); setShow(!Show) }}>English</button>
                                <div className="w-full bg-[#c8c2fd] h-[1.5px]"></div>
                                <button className={`${langue === 'fr' ? 'bg-[#6D28D9]' : ''} py-4 text-[#c8c2fd]  hover:bg-[#6D28D9] `} onClick={() => { changeLanguage("fr"); setShow(!Show) }}>Français</button>
                                <div className="w-full bg-[#c8c2fd] h-[1.5px] "></div>
                                <button className={`${langue === 'ar' ? 'bg-[#6D28D9]' : ''} py-4 text-[#c8c2fd] rounded-b-md  hover:bg-[#6D28D9] `} onClick={() => { changeLanguage("ar"); setShow(!Show) }}>العربية</button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                {userID ? (
                    <LinkDom to="/controll/"> <User className={`duration-300  block  bg-[#c8c2fd] p-2 sm:h-10 justify-center font-medium text-[#6D28D9] sm:w-10  text-xl rounded-xl`} /> </LinkDom    >)
                    :
                    (
                        <div class="sm:flex hidden  items-center  justify-center ">
                            <div class="relative  group bg-[#1e3a8a]  rounded-xl hover:bg-transparent ">

                                <div class={`${makeStyle === "login" ? "w-full rounded-xl" : "w-0"} absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#c8c2fd] group-hover:border-[#c8c2fd] rounded-tl-xl transition-all duration-700 group-hover:w-full group-hover:h-full group-hover:rounded-xl`}></div>

                                <div class={`${makeStyle === "login" ? "w-full rounded-xl" : "w-0"} absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#c8c2fd] group-hover:border-[#c8c2fd] rounded-tr-xl transition-all duration-700 group-hover:w-full group-hover:h-full group-hover:rounded-xl`}></div>

                                <div class={`${makeStyle === "login" ? "w-full rounded-xl" : "w-0"} absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#c8c2fd] group-hover:border-[#c8c2fd] rounded-bl-xl transition-all duration-700 group-hover:w-full group-hover:h-full group-hover:rounded-xl`}></div>

                                <div class={`${makeStyle === "login" ? "w-full rounded-xl" : "w-0"} absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#c8c2fd] group-hover:border-[#c8c2fd] rounded-br-xl transition-all duration-700 group-hover:w-full group-hover:h-full group-hover:rounded-xl`}></div>

                                <LinkDom onClick={() => setMakeStyle("login")} to={'/login'} >
                                    <button class="relative px-4 py-2 font-medium text-[#c8c2fd] text-lg tracking-widest border-2 border-transparent rounded-md font-roboto transition duration-700 group-hover:text-[#c8c2fd] z-10 bg-transparent">
                                        {t('Login')}
                                    </button>
                                </LinkDom>
                            </div>
                        </div>
                    )}
                    {userID && (
                        <BTN1 onClick={() => {
                            localStorage.removeItem("user");
                            localStorage.removeItem("token");
                            navigate("/login");
                        }} />
                    )}
                <AlignJustify className={`${menu ? "hidden" : ""}  sm:hidden bg-[#c8c2fd] p-2 h-full text-[#6D28D9] w-full rounded-xl`} onClick={() => setMenu(!menu)} />
                <div className={`${menu ? "justify-center flex w-full" : "hidden"}`}>
                    <AnimatePresence>
                        {menu && (
                            <motion.ul
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className={`w-full h-screen flex flex-col justify-center items-center gap-8`}
                            >
                                {location.pathname === '/' ? (
                                    <ScrollLink
                                        to="home2"
                                        spy={true}
                                        smooth={true}
                                        offset={-100}
                                        onClick={() => {
                                            setMakeStyle("home");
                                            setMenu(false);
                                        }}
                                    >
                                        <motion.li
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ duration: 0.3, delay: 0.1 }}
                                            className="flex justify-center p-3 text-[#E5E7EB] items-center"
                                        >
                                            <p className={`z-50 transition-all duration-500 ease-in-out text-2xl font-medium ${makeStyle === "home" ? "text-[#c8c2fd]" : "text-[#E5E7EB]"}`}>{t('Features')}</p>
                                        </motion.li>
                                    </ScrollLink>
                                ) : (
                                    <LinkDom
                                        to="/"
                                        onClick={() => {
                                            setMakeStyle("home");
                                            setMenu(false);
                                        }}
                                    >
                                        <motion.li
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ duration: 0.3, delay: 0.1 }}
                                            className="flex justify-center p-3 text-[#E5E7EB] items-center"
                                        >
                                            <p className={`z-50 transition-all duration-500 ease-in-out text-2xl font-medium ${makeStyle === "home" ? "text-[#c8c2fd]" : "text-[#E5E7EB]"}`}>{t('Features')}</p>
                                        </motion.li>
                                    </LinkDom>
                                )}

                                {location.pathname === '/' ? (
                                    <ScrollLink
                                        to="about"
                                        spy={true}
                                        smooth={true}
                                        offset={-100}
                                        onClick={() => {
                                            setMakeStyle("about");
                                            setMenu(false);
                                        }}
                                    >
                                        <motion.li
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ duration: 0.3, delay: 0.2 }}
                                            className="flex justify-center p-3 text-[#E5E7EB] items-center"
                                        >
                                            <p className={`z-50 transition-all duration-500 ease-in-out text-2xl font-medium ${makeStyle === "about" ? "text-[#c8c2fd]" : "text-[#E5E7EB]"}`}>{t('AboutUs')}</p>
                                        </motion.li>
                                    </ScrollLink>
                                ) : (
                                    <LinkDom
                                        to="/"
                                        onClick={() => {
                                            setMakeStyle("about");
                                            setMenu(false);
                                        }}
                                    >
                                        <motion.li
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ duration: 0.3, delay: 0.2 }}
                                            className="flex justify-center p-3 text-[#E5E7EB] items-center"
                                        >
                                            <p className={`z-50 transition-all duration-500 ease-in-out text-2xl font-medium ${makeStyle === "about" ? "text-[#c8c2fd]" : "text-[#E5E7EB]"}`}>{t('AboutUs')}</p>
                                        </motion.li>
                                    </LinkDom>
                                )}

                                {location.pathname === '/' ? (
                                    <ScrollLink
                                        to="contact"
                                        spy={true}
                                        smooth={true}
                                        offset={-100}
                                        onClick={() => {
                                            setMakeStyle("contact");
                                            setMenu(false);
                                        }}
                                    >
                                        <motion.li
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ duration: 0.3, delay: 0.3 }}
                                            className="flex justify-center p-3 text-[#E5E7EB] items-center"
                                        >
                                            <p className={`z-50 transition-all duration-500 ease-in-out text-2xl font-medium ${makeStyle === "contact" ? "text-[#c8c2fd]" : "text-[#E5E7EB]"}`}>{t('Contact')}</p>
                                        </motion.li>
                                    </ScrollLink>
                                ) : (
                                    <LinkDom
                                        to="/"
                                        onClick={() => {
                                            setMakeStyle("contact");
                                            setMenu(false);
                                        }}
                                    >
                                        <motion.li
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ duration: 0.3, delay: 0.3 }}
                                            className="flex justify-center p-3 text-[#E5E7EB] items-center"
                                        >
                                            <p className={`z-50 transition-all duration-500 ease-in-out text-2xl font-medium ${makeStyle === "contact" ? "text-[#c8c2fd]" : "text-[#E5E7EB]"}`}>{t('Contact')}</p>
                                        </motion.li>
                                    </LinkDom>
                                )}

                                <LinkDom
                                    to="/login"
                                    onClick={() => {
                                        setMakeStyle("login");
                                        setMenu(false);
                                    }}
                                    className="w-full"
                                >
                                    <motion.li
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3, delay: 0.4 }}
                                        className="flex justify-center p-3 w-full text-[#E5E7EB] items-center"
                                    >
                                        <ShinyButton rounded={true} className="w-full">
                                            {t('Login')}
                                        </ShinyButton>
                                    </motion.li>
                                </LinkDom>
                            </motion.ul>
                        )}
                    </AnimatePresence>
                </div>


            </div>

        </header>
    )
}
