import { AlignJustify, Search, User, X, Store, Package, MapPin, Star, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { changeLanguage } from "../i18n/i18n";
import { motion, AnimatePresence } from "framer-motion";
import { Link as LinkDom, useLocation, useNavigate } from "react-router-dom";
import ShinyButton from "../blocks/TextAnimations/ShinyButton/ShinyButton";
import { scroller, Link as ScrollLink } from 'react-scroll'
import BTN1 from "../blocks/Buttons/BTN1";
import axios from "axios";

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
    const [showSearch, setShowSearch] = useState(false);
    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState({ stores: [], products: [] });
    const [isSearching, setIsSearching] = useState(false);
    const [recentSearches, setRecentSearches] = useState([]);

    // const [popularSearches] = useState(['electronics', 'fashion', 'home', 'beauty', 'sports']);
    const popularSearches = [
        { key: 'electronics', label: t('search.electronics') },
        { key: 'fashion', label: t('search.fashion') },
        { key: 'home', label: t('search.home') },
        { key: 'beauty', label: t('search.beauty') },
        { key: 'sports', label: t('search.sports') },
    ];

    useEffect(() => {
        if (location.pathname === '/' && location.hash) {
            const targetSection = location.hash.substring(1); // Remove the # symbol
            setTimeout(() => {
                scroller.scrollTo(targetSection, {
                    smooth: true,
                    offset: -100,
                    duration: 500
                });
                setMakeStyle(targetSection);
            }, 100);
        }

    }, [location]);

    const handleNavigate = (path, style) => {
        setMakeStyle(style);
        if (menu) {
            setMenu(false);
        }
        if (path !== location.pathname) {
            navigate(path);
            if (location.pathname === '/' && location.hash) {
                const targetSection = location.hash.substring(1); // Remove the # symbol
                setTimeout(() => {
                    scroller.scrollTo(targetSection, {
                        smooth: true,
                        offset: -100,
                        duration: 500
                    });
                    setMakeStyle(targetSection);
                }, 100);
            }
        }
    };

    // const language = localStorage.getItem('lang')
    useEffect(() => {
        const langue = localStorage.getItem('lang');
        setLangue(langue)
        document.documentElement.dir = currentLang === "ar" ? "rtl" : "ltr";
    }, [currentLang]);

    // Load recent searches from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('recentSearches');
        if (saved) {
            setRecentSearches(JSON.parse(saved));
        }
    }, []);

    // Save recent searches to localStorage
    const saveRecentSearch = (searchTerm) => {
        if (!searchTerm.trim()) return;
        
        const updated = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 5);
        setRecentSearches(updated);
        localStorage.setItem('recentSearches', JSON.stringify(updated));
    };

    // Perform search
    const performSearch = async (searchQuery) => {
        if (!searchQuery.trim()) {
            setSearchResults({ stores: [], products: [] });
            return;
        }

        setIsSearching(true);
        try {
            // Search stores
            const storesResponse = await axios.get(
                `https://stylish-basket-710b77de8f.strapiapp.com/api/boutiques?filters[statusBoutique][$eq]=active&filters[$or][0][nom][$containsi]=${searchQuery}&filters[$or][1][description][$containsi]=${searchQuery}&filters[$or][2][category][$containsi]=${searchQuery}&populate=*`
            );

            // First, try to find categories that match the search query
            let matchingCategoryIds = [];
            try {
                // Get all categories first, then filter locally
                const categoriesResponse = await axios.get(
                    `https://stylish-basket-710b77de8f.strapiapp.com/api/Categorie-products?populate=*`
                );
                const allCategories = categoriesResponse.data.data;
                const matchingCategories = allCategories.filter(cat => 
                    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
                );
                matchingCategoryIds = matchingCategories.map(cat => cat.id);

            } catch (categoryError) {
                console.log('Category search failed:', categoryError);
            }

            // Search products with multiple approaches
            let productsResponse;
            try {
                if (matchingCategoryIds.length > 0) {
                    // If we found matching categories, search for products in those categories
                    const categoryFilters = matchingCategoryIds.map(id => `filters[category][id][$eq]=${id}`).join('&');
                    productsResponse = await axios.get(
                        `https://stylish-basket-710b77de8f.strapiapp.com/api/products?${categoryFilters}&filters[$or][0][name][$containsi]=${searchQuery}&filters[$or][1][description][$containsi]=${searchQuery}&populate=*`
                    );
                } else {
                    // Fallback to basic search
                    productsResponse = await axios.get(
                        `https://stylish-basket-710b77de8f.strapiapp.com/api/products?filters[$or][0][name][$containsi]=${searchQuery}&filters[$or][1][description][$containsi]=${searchQuery}&populate=*`
                    );
                }
            } catch (productError) {
                console.log('Product search failed, trying basic search:', productError);
                // Final fallback to basic search
                productsResponse = await axios.get(
                    `https://stylish-basket-710b77de8f.strapiapp.com/api/products?filters[$or][0][name][$containsi]=${searchQuery}&filters[$or][1][description][$containsi]=${searchQuery}&populate=*`
                );
            }

            setSearchResults({
                stores: storesResponse.data.data.slice(0, 3),
                products: productsResponse.data.data.slice(0, 6)
            });
        } catch (error) {
            console.error('Search error:', error);
            setSearchResults({ stores: [], products: [] });
        } finally {
            setIsSearching(false);
        }
    };

    // Debounced search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (query.trim()) {
                performSearch(query);
            } else {
                setSearchResults({ stores: [], products: [] });
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [query]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            saveRecentSearch(query);
            setShowSearch(false);
            navigate(`/search?q=${encodeURIComponent(query.trim())}`);
        }
    };

    const handleSearchClick = (searchTerm) => {
        setQuery(searchTerm);
        saveRecentSearch(searchTerm);
        setShowSearch(false);
        navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    };

    const handleResultClick = (type, item) => {
        if (type === 'store') {
            // Navigate to store view - fix the path to match the routing structure
            localStorage.setItem('IDBoutique', item.documentId);
            localStorage.setItem('idOwner', item.owner?.id);
            navigate(`/view/${item.documentId}`);
        } else if (type === 'product') {
            // Navigate to product view - fix the path to match the routing structure
            navigate(`/view/products/${item.documentId}`);
        }
        setShowSearch(false);
    };

    function logout() {

        localStorage.removeItem("user");
        localStorage.removeItem("IDUser");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("IDBoutique");
        localStorage.removeItem("idOwner");
        localStorage.setItem("location", "login");

        navigate("/login");
    }

    // Compute the display value for the input
    const displayQuery = (() => {
        const found = popularSearches.find((search) => search.key === query);
        return found ? found.label : query;
    })();

    return (
        <header className={`${menu ? "h-screen flex-col" : "items-center h-[80px] flex-row"} duration-300 select-none transition-all ease-in-out bg-[#1e3a8a]  fixed z-[99] text-[#FFFFFF] flex  w-full justify-between py-4 px-4 sm:px-28`}>
            <div className={`flex ${menu ? "flex justify-between w-full" : ""}  items-center w-full gap-16`}>
                {location.pathname === '/' ? (
                    <ScrollLink to="home" spy={true} smooth={true} offset={-100} className="sm:block hidden">
                        <img src="https://stylish-basket-710b77de8f.media.strapiapp.com/logo_2d36844e55.png" alt="" className="h-12 sm:block hidden" />
                    </ScrollLink>
                ) : (
                    <LinkDom to="/" className="sm:block hidden">
                        <img src="https://stylish-basket-710b77de8f.media.strapiapp.com/logo_2d36844e55.png" alt="" className="h-12 sm:block hidden" />
                    </LinkDom>
                )}
                {location.pathname === '/' ? (
                    <ScrollLink to="home2" spy={true} smooth={true} offset={-100} className="block sm:hidden" onClick={() => setMenu(false)}>
                        <img src="https://stylish-basket-710b77de8f.media.strapiapp.com/v_90885fa956.png" alt="" className="h-12 block sm:hidden" />
                    </ScrollLink>
                ) : (
                    <LinkDom to="/" className="block sm:hidden" onClick={() => setMenu(false)}>
                        <img src="https://stylish-basket-710b77de8f.media.strapiapp.com/v_90885fa956.png" alt="" className="h-12 block sm:hidden" />
                    </LinkDom>
                )}
                <X className={`${menu ? "" : "hidden"}  sm:hidden bg-[#c8c2fd] p-2 h-[80%] text-[#6D28D9] w-10 rounded-xl`} onClick={() => setMenu(!menu)} />
                <ul className="sm:flex hidden items-center gap-8">

                    {location.pathname === '/' ? (
                        <ScrollLink to="home" onClick={() => setMakeStyle("home")} spy={true} smooth={true} offset={-100} className={`${makeStyle === "home" ? "text-[#c8c2fd]" : "text-[#FFFFFF]"} group hover:text-[#c8c2fd] cursor-pointer duration-300 transition-all ease-in-out`}>
                            {t('Home')}
                            <div className={`${makeStyle === "home" ? "w-full" : "w-[4px]"}  h-0.5  group-hover:w-full transition-all ease-in-out duration-300 bg-[#c8c2fd]`}></div>
                        </ScrollLink>
                    ) : (
                        <LinkDom to="/" onClick={() => {
                            setMakeStyle("home");
                            navigate("/");
                        }} className={`${makeStyle === "home" ? "text-[#c8c2fd]" : "text-[#FFFFFF]"} group hover:text-[#c8c2fd] cursor-pointer duration-300 transition-all ease-in-out`}>
                            {t('Home')}
                            <div className={`${makeStyle === "home" ? "w-full" : "w-[4px]"}  h-0.5  group-hover:w-full transition-all ease-in-out duration-300 bg-[#c8c2fd]`}></div>
                        </LinkDom>
                    )}


                    {location.pathname === '/' ? (
                        <ScrollLink to="about" onClick={() => setMakeStyle("about")} spy={true} smooth={true} offset={-100} className={`${makeStyle === "about" ? "text-[#c8c2fd]" : "text-[#FFFFFF]"} group hover:text-[#c8c2fd] cursor-pointer duration-300 transition-all ease-in-out`}>
                            {t('AboutUs')}
                            <div className={`${makeStyle === "about" ? "w-full" : "w-[4px]"} h-0.5 group-hover:w-full transition-all ease-in-out duration-300 bg-[#c8c2fd]`}></div>
                        </ScrollLink>
                    ) : (
                        <div onClick={() => handleNavigate('/#about', 'about')} className={`${makeStyle === "about" ? "text-[#c8c2fd]" : "text-[#FFFFFF]"} group hover:text-[#c8c2fd] cursor-pointer duration-300 transition-all ease-in-out`}>
                            {t('AboutUs')}
                            <div className={`${makeStyle === "about" ? "w-full" : "w-[4px]"} h-0.5 group-hover:w-full transition-all ease-in-out duration-300 bg-[#c8c2fd]`}></div>
                        </div>
                    )}
                    {location.pathname === '/' ? (
                        <ScrollLink to="contact" onClick={() => setMakeStyle("contact")} spy={true} smooth={true} offset={-100} className={`${makeStyle === "contact" ? "text-[#c8c2fd]" : "text-[#FFFFFF]"} group hover:text-[#c8c2fd] cursor-pointer duration-300 transition-all ease-in-out`}>
                            {t('Contact')}
                            <div className={`${makeStyle === "contact" ? "w-full" : "w-[4px]"} h-0.5 group-hover:w-full transition-all ease-in-out duration-300 bg-[#c8c2fd]`}></div>
                        </ScrollLink>
                    ) : (
                        <div onClick={() => handleNavigate('/#contact', 'contact')} className={`${makeStyle === "contact" ? "text-[#c8c2fd]" : "text-[#FFFFFF]"} group hover:text-[#c8c2fd] cursor-pointer duration-300 transition-all ease-in-out`}>
                            {t('Contact')}
                            <div className={`${makeStyle === "contact" ? "w-full" : "w-[4px]"} h-0.5 group-hover:w-full transition-all ease-in-out duration-300 bg-[#c8c2fd]`}></div>
                        </div>
                    )}

                    <LinkDom to="/stores" onClick={() => setMakeStyle("stores")} className={`${makeStyle === "stores" ? "text-[#c8c2fd]" : "text-[#FFFFFF]"} group hover:text-[#c8c2fd] cursor-pointer duration-300 transition-all ease-in-out`}>
                        {t('Stores')}
                        <div className={`${makeStyle === "stores" ? "w-full" : "w-[4px]"} h-0.5 group-hover:w-full transition-all ease-in-out duration-300 bg-[#c8c2fd]`}></div>
                    </LinkDom>

                </ul>
            </div>
            <div className={`${langue === 'ar' ? ' sm:w-[30%]' : 'sm:w-auto'} flex w-full items-center justify-end gap-2`}>

                <div onClick={() => setShowSearch(true)} className={`${menu ? "hidden" : ""} duration-300 bg-[#c8c2fd] p-2 h-full justify-center font-medium text-[#6D28D9] text-xl rounded-xl`}>
                    <Search />
                </div>
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
                    <LinkDom to="/controll/" className={`${menu ? "hidden" : ""} duration-300 block bg-[#c8c2fd] p-2 h-full justify-center font-medium text-[#6D28D9]  text-xl rounded-xl`}>
                        <User />
                    </LinkDom>

                ) : (
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
                    <div className="hidden sm:block">
                        <BTN1 onClick={logout} />
                    </div>
                )}
                <div className={`${menu ? "hidden" : ""}  sm:hidden bg-[#c8c2fd] p-2 h-full text-[#6D28D9] rounded-xl`} onClick={() => setMenu(!menu)}>
                    <AlignJustify />
                </div>
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
                                            <p className={`z-50 transition-all duration-500 ease-in-out text-2xl font-medium ${makeStyle === "home" ? "text-[#c8c2fd]" : "text-[#E5E7EB]"}`}>{t('Home')}</p>
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
                                            <p className={`z-50 transition-all duration-500 ease-in-out text-2xl font-medium ${makeStyle === "home" ? "text-[#c8c2fd]" : "text-[#E5E7EB]"}`}>{t('Home')}</p>
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
                                    <div
                                        onClick={() => handleNavigate('/#about', 'about')}
                                    >
                                        <motion.li
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ duration: 0.3, delay: 0.2 }}
                                            className="flex justify-center p-3 text-[#E5E7EB] items-center"
                                        >
                                            <div className={`z-50 transition-all duration-500 ease-in-out text-2xl font-medium ${makeStyle === "about" ? "text-[#c8c2fd]" : "text-[#E5E7EB]"}`}>{t('AboutUs')}</div>
                                        </motion.li>
                                    </div>
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
                                    <div
                                        onClick={() => {
                                            handleNavigate('/#contact', 'contact')
                                        }}
                                    >
                                        <motion.li
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ duration: 0.3, delay: 0.3 }}
                                            className="flex justify-center p-3 text-[#E5E7EB] items-center"
                                        >
                                            <div className={`z-50 transition-all duration-500 ease-in-out text-2xl font-medium ${makeStyle === "contact" ? "text-[#c8c2fd]" : "text-[#E5E7EB]"}`}>{t('Contact')}</div>
                                        </motion.li>
                                    </div>
                                )}

                                <LinkDom
                                    to="/stores"
                                    onClick={() => {
                                        setMakeStyle("stores");
                                        setMenu(false);
                                    }}
                                >
                                    <motion.li
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3, delay: 0.35 }}
                                        className="flex justify-center p-3 text-[#E5E7EB] items-center"
                                    >
                                        <p className={`z-50 transition-all duration-500 ease-in-out text-2xl font-medium ${makeStyle === "stores" ? "text-[#c8c2fd]" : "text-[#E5E7EB]"}`}>{t('Stores')}</p>
                                    </motion.li>
                                </LinkDom>

                                {!userID ? (
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
                                ) : (
                                    <motion.li
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3, delay: 0.4 }}
                                        className="flex justify-center p-3 w-full text-[#E5E7EB] items-center"
                                    >
                                        <ShinyButton onClick={logout}
                                            rounded={true} className="w-full">
                                            {t('contact.logout')}
                                        </ShinyButton>
                                    </motion.li>
                                )}
                            </motion.ul>
                        )}
                    </AnimatePresence>
                </div>


            </div>
            <AnimatePresence>
                {showSearch && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed top-0 left-0 z-[999] w-full h-full bg-black/50 backdrop-blur-sm flex items-start justify-center pt-20"
                        onClick={() => setShowSearch(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: -20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white w-full max-w-4xl mx-4 rounded-2xl shadow-2xl border border-gray-200"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Search Header */}
                            <div className="flex items-center justify-between p-6 border-b border-gray-100">
                                <div className="flex items-center space-x-4">
                                    <Search className="h-6 w-6 text-purple-600" />
                                    <h2 className="text-xl font-semibold text-gray-800">{t('search.title')}</h2>
                                </div>
                                <button 
                                    onClick={() => setShowSearch(false)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X className="h-5 w-5 text-gray-500" />
                                </button>
                            </div>

                            {/* Search Input */}
                            <div className="p-6">
                                <form onSubmit={handleSearchSubmit} className="relative">
                                    <Search className={`absolute ${langue === 'ar' ? 'right-4' : 'left-4'} top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400`} />
                                    <input
                                        type="text"
                                        value={displayQuery}
                                        onChange={(e) => setQuery(e.target.value)}
                                        placeholder={t("header.searchPlaceholderFull")}
                                        className={`w-full ${langue === 'ar' ? 'pl-10 pr-12' : 'pr-10 pl-12'} py-4 text-black border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-lg`}
                                        autoFocus
                                    />
                                    {query && (
                                        <button
                                            type="button"
                                            onClick={() => setQuery("")}
                                            className={`absolute ${langue === 'ar' ? 'left-4' : 'right-4'} top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 transition-colors`}
                                            tabIndex={-1}
                                            aria-label="Clear search"
                                        >
                                            <X className="h-5 w-5 text-gray-400" />
                                        </button>
                                    )}
                                    {isSearching && !query && (
                                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-purple-500 border-t-transparent"></div>
                                        </div>
                                    )}
                                </form>
                            </div>

                            {/* Search Results or Suggestions */}
                            <div className="px-6 pb-6">
                                {query.trim() ? (
                                    // Search Results
                                    <div className="space-y-6">
                                        {/* Stores Results */}
                                        {searchResults.stores.length > 0 && (
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                                                    <Store className="h-5 w-5 mr-2 text-purple-600" />
                                                    {t('Stores')}
                                                </h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {searchResults.stores.map((store) => (
                                                        <div
                                                            key={store.id}
                                                            onClick={() =>{ handleResultClick('store', store) ; localStorage.setItem('IDBoutique', store.documentId)}  }
                                                            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                                                        >
                                                            <div className="flex items-center space-x-3">
                                                                <div className="w-10 h-10  rounded-lg flex items-center justify-center">
                                                                    <Store className="h-5 w-5 text-purple-600" />
                                                                </div>
                                                                <div className="flex-1">
                                                                    <h4 className="font-medium text-gray-800">{store.nom}</h4>
                                                                    <p className="text-sm text-gray-500 truncate w-[95%]">{store.description}</p>
                                                                </div>
                                                                <ArrowRight className="h-4 w-4 text-gray-400" />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Products Results */}
                                        {searchResults.products.length > 0 && (
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                                                    <Package className="h-5 w-5 mr-2 text-purple-600" />
                                                    {t('Products')}
                                                </h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                                    {searchResults.products.map((product) => (
                                                        <div
                                                            key={product.id}
                                                            onClick={() => handleResultClick('product', product)}
                                                            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                                                        >
                                                            <div className="flex items-center space-x-3">
                                                                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                                                    <Package className="h-5 w-5 text-purple-600" />
                                                                </div>
                                                                <div className="flex-1">
                                                                    <h4 className="font-medium text-gray-800">{product.name}</h4>
                                                                    <p className="text-sm text-gray-500">€{product.prix}</p>
                                                                </div>
                                                                <ArrowRight className="h-4 w-4 text-gray-400" />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* No Results */}
                                        {searchResults.stores.length === 0 && searchResults.products.length === 0 && !isSearching && (
                                            <div className="text-center py-8">
                                                <Package className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                                                <p className="text-gray-500">{t('search.noResultsFoundFor')} "{query}"</p>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    // Search Suggestions
                                    <div className="space-y-6">
                                        {/* Recent Searches */}
                                        {recentSearches.length > 0 && (
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-800 mb-3">{t('search.recentSearches')}</h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {recentSearches.map((search, index) => (
                                                        <button
                                                            key={index}
                                                            onClick={() => handleSearchClick(search)}
                                                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
                                                        >
                                                            {search}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Popular Searches */}
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800 mb-3">{t('search.popularSearches')}</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {popularSearches.map((search, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => handleSearchClick(search.key)}
                                                        className="px-4 py-2 bg-purple-100 hover:bg-purple-200 rounded-full text-sm text-purple-700 transition-colors"
                                                    >
                                                        {search.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    )
}
