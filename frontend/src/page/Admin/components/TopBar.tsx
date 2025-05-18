import React, { useState, useEffect, use } from "react";
import { Bell, Search, LogOut, Languages } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { changeLanguage } from '../../../i18n/i18n';
import axios from 'axios';

interface TopBarProps {
  onMenuClick: () => void;
}

interface Notification {
  id: number;
  type: 'pending_store' | 'store_update';
  message: string;
  storeName: string;
  createdAt: string;
  read: boolean;
}

const TopBar: React.FC<TopBarProps> = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation();
  const [title, setTitle] = useState(t('usersAdmin.topBar.titles.dashboard'));
  const language = localStorage.getItem('lang');

  useEffect(() => {
    fetchNotifications();
  }, [language]);

  useEffect(() => {
    if(location.pathname === "/admin"){
      setTitle(t('usersAdmin.topBar.titles.dashboard'));
    }else if(location.pathname === "/admin/users"){
      setTitle(t('usersAdmin.topBar.titles.users'));
    }else if(location.pathname === "/admin/stores"){
      setTitle(t('usersAdmin.topBar.titles.stores'));
    }else if(location.pathname === "/admin/products"){
      setTitle(t('usersAdmin.topBar.titles.products'));
    }else if(location.pathname === "/admin/categories"){
      setTitle(t('usersAdmin.topBar.titles.categories'));
    }else if(location.pathname === "/admin/support"){
      setTitle(t('usersAdmin.topBar.titles.support'));
    }else if(location.pathname === "/admin/settings"){
      setTitle(t('usersAdmin.topBar.titles.settings'));
    }
  }, [location.pathname, t]);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get('http://localhost:1337/api/boutiques?filters[statusBoutique][$eq]=pending&populate=*');
      const pendingStores = response.data.data;

      const storeNotifications: Notification[] = pendingStores.map((store: any) => ({
        id: store.id,
        type: 'pending_store',
        message: t('usersAdmin.topBar.notifications.newStore'),
        storeName: store.nom,
        createdAt: store.createdAt,
        read: false
      }));

      setNotifications(storeNotifications);
      setUnreadCount(storeNotifications.filter(n => !n.read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("IDUser");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("IDBoutique");
    localStorage.setItem("location", "login");
    navigate("/login");
  };
  

  const handleLanguageChange = (newLanguage: string) => {
    changeLanguage(newLanguage);
    setShowLangMenu(false);
  };

  const markNotificationAsRead = (notificationId: number) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const handleNotificationClick = (notification: Notification) => {
    markNotificationAsRead(notification.id);
    navigate('/admin/stores');
    setShowNotifications(false);
  };
  

  return (
    <header className="bg-white border-b py-3 border-slate-200 sticky top-0 " >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between" >
        <button
          className="md:hidden p-2 hover:bg-slate-100  rounded-md"
          onClick={onMenuClick}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="font-medium sm:block hidden text-4xl">
          {title}
        </div>

        <div className={`flex items-center space-x-4 ${language === 'ar' ? 'mr-auto' : 'ml-auto'}`}>
          
          <div className="relative">
            <button 
              className="p-2 hover:bg-slate-100 rounded-md relative flex items-center space-x-1"
              onClick={() => {setShowLangMenu(!showLangMenu); setShowNotifications(false)} }
            >
              <Languages className="h-5 w-5" />
              <span className="text-sm">{i18n.language.toUpperCase()}</span>
            </button>

            {showLangMenu && (
              <div className={`absolute ${language === "ar" ? "left-0" : "right-0"} mt-2 w-48 rounded-md shadow-lg bg-white  border-[1.9px] border-[#c8c2fd]`}>
                <div className="py-1" role="menu" aria-orientation="vertical">
                  <button
                    onClick={() => handleLanguageChange('en')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700"
                    role="menuitem"
                  >
                    English
                  </button>
                  <button
                    onClick={() => handleLanguageChange('fr')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700"
                    role="menuitem"
                  >
                    Français
                  </button>
                  <button
                    onClick={() => handleLanguageChange('ar')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700"
                    role="menuitem"
                  >
                    العربية
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button 
              className="p-2 hover:bg-slate-100 rounded-md relative"
              onClick={() => {setShowNotifications(!showNotifications); setShowLangMenu(false)}}
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className={`absolute -top-1 ${language === "ar" ? "-left-1" : "-right-1"} bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center`}>
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className={`absolute ${language === "ar" ? "left-0" : "right-0"} mt-2 w-80 rounded-md shadow-lg bg-white border-[1.9px] border-[#c8c2fd]`}>
                <div className="py-2">
                  <h3 className="px-4 py-2 text-sm font-medium text-gray-700 border-b border-[#c8c2fd]">
                    {t('usersAdmin.topBar.notifications.title')}
                  </h3>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <button
                          key={notification.id}
                          className={`w-full text-start px-4 py-3 hover:bg-gray-50 flex items-start space-x-3 ${
                            !notification.read ? 'bg-purple-50' : ''
                          }`}
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="flex-shrink-0">
                            <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                              <Bell className="h-4 w-4 text-purple-600" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">
                              {notification.message}
                            </p>
                            <p className="text-sm text-gray-500">{notification.storeName}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(notification.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-gray-500 text-center">
                        {t('usersAdmin.topBar.notifications.noNotifications')}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="h-6 w-px bg-slate-200 mx-2" />

          <button
            className="p-2 hover:bg-slate-100 rounded-md flex items-center space-x-1 text-red-600"
            title={t('usersAdmin.topBar.notifications.logout')}
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
