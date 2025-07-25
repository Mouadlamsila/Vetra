import { ChartColumn, CircleHelp, CirclePlus, CreditCard, Home, Lock, LogOut, Package, PackagePlus, Settings, Shield, ShoppingBag, Store, User, UserPen } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function DashBoard() {
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const language = localStorage.getItem("lang");
    const userRole = localStorage.getItem("role");

    // Function to check if menu item should be disabled
    const isMenuItemDisabled = (menuType) => {
        if (userRole !== 'Owner') {
            // List of menu items that should be disabled for regular users
            const disabledMenus = [
                'AddStore', 
                'AddProduct', 
                'Stats', 
                'Payment',
                'Stores',
                'Products',
                'Orders',
                'Dashboard'
            ];
            return disabledMenus.includes(menuType);
        }
        return false;
    };

    // Function to handle menu item click
    const handleMenuClick = (e, menuType) => {
        if (isMenuItemDisabled(menuType)) {
            e.preventDefault();
            return;
        }
    };

    return (
        <div className="w-full h-full hidden sm:flex justify-center items-center bg-[#1e3a8a]">
            <div className={`${language === 'ar' ? 'right-0' : 'left-0'} h-full bg-[#1e3a8a] w-[15%] fixed top-0  pt-4 grid grid-rows-[10%_90%] `}>

                <Link to={'/'}>
                    <div className="flex justify-start px-4 border-b-[0.1px] border-gray-300  w-full h-full items-start">
                        <img src="https://useful-champion-e28be6d32c.media.strapiapp.com/logo_82b964b857.png" className="h-[48px] w-[145px]" alt="" />
                    </div>
                </Link>
                <div className="flex h-full w-full items-center">
                    <ul className="grid h-full w-full flex-col text-white ">

                        <Link 
                            to={'/controll/'} 
                            onClick={(e) => handleMenuClick(e, 'Dashboard')}
                            className={`hover:bg-[#c8c2fd] hover:text-[#6D28D9] transition-all py-2 flex items-center duration-300 
                                ${location.pathname === '/controll/' ? (language === 'ar' ? 'pr-6 bg-[#c8c2fd] text-[#6D28D9] pl-4' : 'pl-6 pr-4 bg-[#c8c2fd] text-[#6D28D9]') : 'px-4'}
                                ${isMenuItemDisabled('Dashboard') ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <li className="flex items-center gap-2">
                                <Home />
                                <p>{t('dashboard.title')}</p>
                            </li>
                        </Link>
                        <Link to={'/controll/Profil'} className={`hover:bg-[#c8c2fd] hover:text-[#6D28D9] transition-all  py-2 flex items-center duration-300 w-full ${location.pathname === '/controll/Profil' ? (language === 'ar' ? 'pr-6 bg-[#c8c2fd] text-[#6D28D9] pl-4' : 'pl-6 pr-4 bg-[#c8c2fd] text-[#6D28D9]') : 'px-4'}`}>
                            <li className="flex items-center gap-2">
                                <User />
                                <p>{t('dashboard.profile')}</p>
                            </li>
                        </Link>
                        <Link 
                            to={'/controll/Stores'} 
                            onClick={(e) => handleMenuClick(e, 'Stores')}
                            className={`hover:bg-[#c8c2fd] hover:text-[#6D28D9] transition-all py-2 flex items-center duration-300 w-full 
                                ${location.pathname === '/controll/Stores' ? (language === 'ar' ? 'pr-6 bg-[#c8c2fd] text-[#6D28D9] pl-4' : 'pl-6 pr-4 bg-[#c8c2fd] text-[#6D28D9]') : 'px-4'}
                                ${isMenuItemDisabled('Stores') ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <li className="flex items-center gap-2">
                                <Store />
                                <p>{t('dashboard.myStores')}</p>
                            </li>
                        </Link>
                        <Link 
                            to={'/controll/AddStore'} 
                            onClick={(e) => handleMenuClick(e, 'AddStore')}
                            className={`hover:bg-[#c8c2fd] hover:text-[#6D28D9] transition-all py-2 flex items-center duration-300 w-full 
                                ${location.pathname === '/controll/AddStore' ? (language === 'ar' ? 'pr-6 bg-[#c8c2fd] text-[#6D28D9] pl-4' : 'pl-6 pr-4 bg-[#c8c2fd] text-[#6D28D9]') : 'px-4'}
                                ${isMenuItemDisabled('AddStore') ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <li className="flex items-center gap-2">
                                <CirclePlus />
                                <p>{t('dashboard.createStore')}</p>
                            </li>
                        </Link>
                        <Link 
                            to={'/controll/Products'} 
                            onClick={(e) => handleMenuClick(e, 'Products')}
                            className={`hover:bg-[#c8c2fd] hover:text-[#6D28D9] transition-all py-2 flex items-center duration-300 w-full 
                                ${location.pathname === '/controll/Products' ? (language === 'ar' ? 'pr-6 bg-[#c8c2fd] text-[#6D28D9] pl-4' : 'pl-6 pr-4 bg-[#c8c2fd] text-[#6D28D9]') : 'px-4'}
                                ${isMenuItemDisabled('Products') ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <li className="flex items-center gap-2">
                                <Package />
                                <p>{t('dashboard.myProducts')}</p>
                            </li>
                        </Link>
                        <Link 
                            to={'/controll/AddProduct'} 
                            onClick={(e) => handleMenuClick(e, 'AddProduct')}
                            className={`hover:bg-[#c8c2fd] hover:text-[#6D28D9] transition-all py-2 flex items-center duration-300 w-full 
                                ${location.pathname === '/controll/AddProduct' ? (language === 'ar' ? 'pr-6 bg-[#c8c2fd] text-[#6D28D9] pl-4' : 'pl-6 pr-4 bg-[#c8c2fd] text-[#6D28D9]') : 'px-4'}
                                ${isMenuItemDisabled('AddProduct') ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <li className="flex items-center gap-2">
                                <PackagePlus />
                                <p>{t('dashboard.addProduct')}</p>
                            </li>
                        </Link>
                        <Link 
                            to={'/controll/Orders'} 
                            onClick={(e) => handleMenuClick(e, 'Orders')}
                            className={`hover:bg-[#c8c2fd] hover:text-[#6D28D9] transition-all py-2 flex items-center duration-300 w-full 
                                ${location.pathname === '/controll/Orders' ? (language === 'ar' ? 'pr-6 bg-[#c8c2fd] text-[#6D28D9] pl-4' : 'pl-6 pr-4 bg-[#c8c2fd] text-[#6D28D9]') : 'px-4'}
                                ${isMenuItemDisabled('Orders') ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <li className="flex items-center gap-2">
                                <ShoppingBag />
                                <p>{t('dashboard.orders')}</p>
                            </li>
                        </Link>
                        <Link 
                            to={'/controll/Stats'} 
                            onClick={(e) => handleMenuClick(e, 'Stats')}
                            className={`hover:bg-[#c8c2fd] hover:text-[#6D28D9] transition-all py-2 flex items-center duration-300 w-full 
                                ${location.pathname === '/controll/Stats' ? (language === 'ar' ? 'pr-6 bg-[#c8c2fd] text-[#6D28D9] pl-4' : 'pl-6 pr-4 bg-[#c8c2fd] text-[#6D28D9]') : 'px-4'}
                                ${isMenuItemDisabled('Stats') ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <li className="flex items-center gap-2">
                                <ChartColumn />
                                <p>{t('dashboard.statistics')}</p>
                            </li>
                        </Link>
                        <Link 
                            to={'/controll/Payment'} 
                            onClick={(e) => handleMenuClick(e, 'Payment')}
                            className={`hover:bg-[#c8c2fd] hover:text-[#6D28D9] transition-all py-2 flex items-center duration-300 w-full 
                                ${location.pathname === '/controll/Payment' ? (language === 'ar' ? 'pr-6 bg-[#c8c2fd] text-[#6D28D9] pl-4' : 'pl-6 pr-4 bg-[#c8c2fd] text-[#6D28D9]') : 'px-4'}
                                ${isMenuItemDisabled('Payment') ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <li className="flex items-center gap-2">
                                <CreditCard />
                                <p>{t('dashboard.payments')}</p>
                            </li>
                        </Link>
                        <Link to={'/controll/Settings'} className={`hover:bg-[#c8c2fd] hover:text-[#6D28D9] transition-all  py-2 flex items-center duration-300 w-full ${location.pathname === '/controll/Settings' ? (language === 'ar' ? 'pr-6 bg-[#c8c2fd] text-[#6D28D9] pl-4' : 'pl-6 pr-4 bg-[#c8c2fd] text-[#6D28D9]') : 'px-4'}`}>
                            <li className="flex items-center gap-2">
                                <Settings />
                                <p>{t('dashboard.settings')}</p>
                            </li>
                        </Link>
                        <Link to={'/controll/Help'} className={`hover:bg-[#c8c2fd] hover:text-[#6D28D9] transition-all  py-2 flex items-center duration-300 w-full ${location.pathname === '/controll/Help' ? (language === 'ar' ? 'pr-6 bg-[#c8c2fd] text-[#6D28D9] pl-4' : 'pl-6 pr-4 bg-[#c8c2fd] text-[#6D28D9]') : 'px-4'}`}>
                            <li className="flex items-center gap-2">
                                <CircleHelp />
                                <p>{t('dashboard.help')}</p>
                            </li>
                        </Link>
                        <div onClick={() => {
                            localStorage.removeItem("user");
                            localStorage.removeItem("IDUser");
                            localStorage.removeItem("token");
                            localStorage.removeItem("role");
                            localStorage.removeItem('IDBoutique');
                            localStorage.removeItem('idOwner');
                            localStorage.setItem("location", "login");
                            navigate("/login");
                        }} className={`hover:bg-[#c8c2fd] hover:text-[#6D28D9] transition-all  py-2 flex items-center duration-300 w-full ${location.pathname === '/controll/Modification' ? (language === 'ar' ? 'pr-6 bg-[#c8c2fd] text-[#6D28D9] pl-4' : 'pl-6 pr-4 bg-[#c8c2fd] text-[#6D28D9]') : 'px-4'}`}>
                            <li className="flex items-center gap-2">
                                <LogOut />
                                <p>{t('dashboard.logout')}</p>
                            </li>
                        </div>
                    </ul>
                </div>
            </div>
        </div>
    )
}
