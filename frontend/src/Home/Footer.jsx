import { Link, useLocation } from "react-router-dom"
import { Mail, Phone, MapPin, Linkedin, Twitter, Facebook, Instagram, ChevronRight, Heart } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Link as ScrollLink } from "react-scroll"

const Footer = () => {
    const { t } = useTranslation()
    const currentYear = new Date().getFullYear()
    const location = useLocation();
    const language = localStorage.getItem("lang");
    const userId = localStorage.getItem("IDUser");




    return (
        <footer className="bg-[#1e3a8a] text-white pt-16 pb-8">
            <div className="container mx-auto px-4">
                {/* Section principale du footer */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 mb-16">
                    {/* Colonne 1: À propos */}
                    <div className="max-w-xs">
                        <div className="mb-4">
                            <img src="/img/logo/logo.png" alt="" className="h-12" />
                        </div>
                        <p className="text-gray-300 mb-6">
                            {t('companyVision')}
                        </p>
                        <div className="flex space-x-4">
                            {[
                                { icon: <Linkedin className="h-5 w-5" />, url: "https://linkedin.com", name: "LinkedIn" },
                                { icon: <Twitter className="h-5 w-5" />, url: "https://twitter.com", name: "Twitter" },
                                { icon: <Facebook className="h-5 w-5" />, url: "https://facebook.com", name: "Facebook" },
                                { icon: <Instagram className="h-5 w-5" />, url: "https://instagram.com", name: "Instagram" },
                            ].map((social, index) => (
                                <a
                                    key={index}
                                    href={social.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="bg-[#2e4a9a] p-2 rounded-full hover:bg-[#c8c2fd] hover:text-[#1e3a8a] transition-colors text-white"
                                    aria-label={`${t('contact.social.visit')} ${social.name}`}
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Colonne 2: Liens rapides */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-6">{t('Features')}</h3>
                        <ul className="space-y-3">
                            {[
                                { name: t('Features'), url: location.pathname === "/" ? "home" : "/" },
                                { name: t('AboutUs'), url: location.pathname === "/" ? "about" : "/" },
                                { name: t('step1'), url: location.pathname === "/" ? "steps" : "/" },
                                { name: t('step2'), url: location.pathname === "/" ? "step2" : "/" },
                                { name: t('step3'), url: location.pathname === "/" ? "step3" : "/" },
                                { name: t('Contact'), url: location.pathname === "/" ? "contact" : "/" },
                            ].map((link, index) =>
                                <li key={index} className="cursor-pointer">
                                    {location.pathname === '/' ?
                                        <ScrollLink
                                            to={link.url}
                                            spy={true}
                                            smooth={true}
                                            offset={-100}
                                            className="text-gray-300 hover:text-[#c8c2fd] transition-colors flex items-center "
                                        >
                                            <ChevronRight className="h-4 w-4 mr-1 text-[#c8c2fd]" />
                                            {link.name}
                                        </ScrollLink>
                                        :
                                        <Link
                                            to={link.url}
                                            className="text-gray-300 hover:text-[#c8c2fd] transition-colors flex items-center "
                                        >
                                            <ChevronRight className="h-4 w-4 mr-1 text-[#c8c2fd]" />
                                            {link.name}
                                        </Link>
                                    }

                                </li>
                            )}
                        </ul>
                    </div>

                    {/* Colonne 3: Services */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-6">{t('Services')}</h3>
                        <ul className="space-y-3">
                            {[
                                { name: t('swiperTitle1'), url: "/services/web-development" },
                                { name: t('swiperTitle2'), url: "/services/mobile-apps" },
                                { name: t('swiperTitle3'), url: "/services/ux-ui-design" },
                                { name: t('swiperTitle4'), url: "/services/digital-marketing" },
                                { name: t('swiperTitle5'), url: "/services/consulting" },
                                { name: t('swiperTitle6'), url: "/services/technical-support" },
                            ].map((service, index) => (
                                <li key={index}>
                                    <Link
                                        to={service.url}
                                        className="text-gray-300 hover:text-[#c8c2fd] transition-colors flex items-center"
                                    >
                                        <ChevronRight className="h-4 w-4 mr-1 text-[#c8c2fd]" />
                                        {service.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Colonne 4: Contact */}
                    <div className="w-full  ">
                        <h3 className="text-lg font-semibold text-white mb-6">{t('readyToTransform')}</h3>
                        <p className="text-gray-300 mb-6">{t('joinUsers')}</p>
                        {/* Séparateur */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            {userId ? <button
                                className="bg-[#c8c2fd] text-[#6D28D9] hover:bg-[#c8c2fd]/90 hover:text-[#1e3a8a] px-6 py-2 rounded-lg font-medium transition-all ease-in-out duration-300 w-full sm:w-auto cursor-pointer"
                                onClick={() => { window.location.href = '/controll/Profil'; localStorage.setItem("location", "login") }}
                            >
                                {t('dashboard.profile')}
                            </button> :
                                <div className=" flex flex-col sm:flex-row gap-2">
                                    <button
                                        className="bg-[#c8c2fd] text-[#6D28D9] hover:bg-[#c8c2fd]/90 hover:text-[#1e3a8a] px-6 py-2  rounded-lg font-medium transition-all ease-in-out duration-300 w-full sm:w-auto cursor-pointer"
                                        onClick={() => { window.location.href = '/login'; localStorage.setItem("location", "login") }}
                                    >
                                        {t('Login')}
                                    </button>
                                    <button
                                        className="bg-[#6D28D9] hover:bg-[#6D28D9]/90 hover:text-[#c8c2fd] transition-all ease-in-out duration-300 px-6 py-2 rounded-lg text-[#c8c2fd] font-medium w-full sm:w-auto cursor-pointer"
                                        onClick={() => { window.location.href = '/register'; localStorage.setItem("location", "login") }}
                                    >
                                        {t('createAccount')}
                                    </button></div>
                            }
                        </div>
                    </div>
                </div>


                <div className="border-t border-[#2e4a9a] pt-8 mt-8">
                    <div dir={language === "ar" ? "rtl" : "ltr"} className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="text-gray-400 text-sm">
                            © {currentYear} {t('companyName')}. {t('allRightsReserved')}
                        </div>
                        <div className="flex flex-wrap justify-center gap-4 text-sm">
                            <Link to="/privacy" className="text-gray-400 hover:text-[#c8c2fd] transition-colors">
                                {t('privacyPolicy')}
                            </Link>
                            <Link to="/terms" className="text-gray-400 hover:text-[#c8c2fd] transition-colors">
                                {t('termsOfService')}
                            </Link>
                            <Link to="/cookies" className="text-gray-400 hover:text-[#c8c2fd] transition-colors">
                                {t('cookiePolicy')}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

        </footer>
    )
}

export default Footer
