import { useTranslation } from 'react-i18next';
import { Facebook, Twitter, Instagram, Linkedin, Github } from 'lucide-react';

export default function Footer() {
    const { t } = useTranslation();

    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#1e3a8a] text-[#c8c2fd]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold">{t('Company')}</h3>
                        <p className="text-[#c8c2fd]/80">
                            {t('footerDescription')}
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="hover:text-[#6D28D9] transition duration-300">
                                <Facebook className="h-6 w-6" />
                            </a>
                            <a href="#" className="hover:text-[#6D28D9] transition duration-300">
                                <Twitter className="h-6 w-6" />
                            </a>
                            <a href="#" className="hover:text-[#6D28D9] transition duration-300">
                                <Instagram className="h-6 w-6" />
                            </a>
                            <a href="#" className="hover:text-[#6D28D9] transition duration-300">
                                <Linkedin className="h-6 w-6" />
                            </a>
                            <a href="#" className="hover:text-[#6D28D9] transition duration-300">
                                <Github className="h-6 w-6" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">{t('Quick Links')}</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="#" className="hover:text-[#6D28D9] transition duration-300">
                                    {t('Home')}
                                </a>
                            </li>
                            <li>
                                <a href="#features" className="hover:text-[#6D28D9] transition duration-300">
                                    {t('Features')}
                                </a>
                            </li>
                            <li>
                                <a href="#about" className="hover:text-[#6D28D9] transition duration-300">
                                    {t('AboutUs')}
                                </a>
                            </li>
                            <li>
                                <a href="#contact" className="hover:text-[#6D28D9] transition duration-300">
                                    {t('Contact')}
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">{t('Services')}</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="#" className="hover:text-[#6D28D9] transition duration-300">
                                    {t('Web Development')}
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-[#6D28D9] transition duration-300">
                                    {t('Mobile Development')}
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-[#6D28D9] transition duration-300">
                                    {t('UI/UX Design')}
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-[#6D28D9] transition duration-300">
                                    {t('Digital Marketing')}
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">{t('Contact Info')}</h3>
                        <ul className="space-y-2">
                            <li className="flex items-start">
                                <span className="mr-2">📍</span>
                                <span className="text-[#c8c2fd]/80">
                                    123 Business Street, City, Country
                                </span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2">📧</span>
                                <span className="text-[#c8c2fd]/80">
                                    contact@example.com
                                </span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2">📞</span>
                                <span className="text-[#c8c2fd]/80">
                                    +1 234 567 890
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-[#6D28D9]/20 mt-12 pt-8 text-center">
                    <p className="text-[#c8c2fd]/80">
                        © {currentYear} {t('Company')}. {t('All rights reserved')}
                    </p>
                </div>
            </div>
        </footer>
    );
} 