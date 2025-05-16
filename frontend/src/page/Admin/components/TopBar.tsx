import React, { useState, useEffect } from "react";
import { Bell, Search, LogOut, Languages } from "lucide-react";
import { useNavigate } from "react-router-dom";
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

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      // Fetch pending stores
      const response = await axios.get('http://localhost:1337/api/boutiques?filters[statusBoutique][$eq]=pending&populate=*');
      const pendingStores = response.data.data;

      // Create notifications for pending stores
      const storeNotifications: Notification[] = pendingStores.map((store: any) => ({
        id: store.id,
        type: 'pending_store',
        message: `Nouvelle boutique en attente d'approbation`,
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
    <header className="bg-white border-b py-3 border-slate-200 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <button
          className="md:hidden p-2 hover:bg-slate-100 rounded-md"
          onClick={onMenuClick}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="flex items-center space-x-4 ml-auto">
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Rechercher..."
              className="w-64 pl-10 pr-4 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          </div>

          <div className="relative">
            <button 
              className="p-2 hover:bg-slate-100 rounded-md relative flex items-center space-x-1"
              onClick={() => setShowLangMenu(!showLangMenu)}
            >
              <Languages className="h-5 w-5" />
              <span className="text-sm">{i18n.language.toUpperCase()}</span>
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
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
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                <div className="py-2">
                  <h3 className="px-4 py-2 text-sm font-medium text-gray-700 border-b">Notifications</h3>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <button
                          key={notification.id}
                          className={`w-full text-left px-4 py-3 hover:bg-gray-50 flex items-start space-x-3 ${
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
                        Aucune notification
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
            title="Déconnexion"
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
