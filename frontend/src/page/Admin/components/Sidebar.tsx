import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import {
  LayoutDashboard,
  Users,
  Store,
  ShoppingBag,
  Tag,
  HeadphonesIcon,
  Settings,
  Package2,
  User
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface UserData {
  username: string;
  email: string;
  photo?: {
    url: string;
  };
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem("IDUser");
        if (!userId) return;

        const response = await axios.get(`http://localhost:1337/api/users/${userId}?populate=*`);
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const navItems = [
    { href: "/admin", label: "Tableau de bord", icon: <LayoutDashboard className="text-lg" /> },
    { href: "/admin/users", label: "Utilisateurs", icon: <Users className="text-lg" /> },
    { href: "/admin/stores", label: "Boutiques", icon: <Store className="text-lg" /> },
    { href: "/admin/products", label: "Produits", icon: <ShoppingBag className="text-lg" /> },
    { href: "/admin/categories", label: "Catégories", icon: <Tag className="text-lg" /> },
    { href: "/admin/support", label: "Support", icon: <HeadphonesIcon className="text-lg" /> },
    { href: "/admin/settings", label: "Paramètres", icon: <Settings className="text-lg" /> },
  ];

  return (
    <aside 
      className={`bg-[#1e3a8a] text-white w-full md:w-64 flex-shrink-0 md:sticky md:top-0 md:h-screen overflow-y-auto z-40 transition-all duration-300 ${
        isOpen ? "fixed inset-0" : "hidden md:block"
      }`}
    >
      <div className="p-4 flex items-center justify-center border-b border-[#c8c2fd]">
        <div className="flex items-center justify-start space-x-2">
          <img src="/img/logo/logo.png" alt="logo" className="w-[80%] h-[80%] " />
        </div>
        <button className="md:hidden text-white" onClick={onClose}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <nav className="py-4">
        <ul>
          {navItems.map((item) => (
            <li key={item.href}>
              <Link 
                to={item.href}
                className={`flex items-center space-x-2 px-4 py-3 transition-colors ${
                  location.pathname === item.href
                    ? "bg-[#6D28D9] text-white"
                    : "text-[#c8c2fd] hover:bg-[#6D28D9] hover:text-white"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="mt-auto p-4 border-t border-[#c8c2fd]">
        <Link to="/admin/Profile" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white overflow-hidden">
            {userData?.photo?.url ? (
              <img 
                src={`http://localhost:1337${userData.photo.url}`}
                alt={userData?.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-sm font-medium">
                {userData?.username?.charAt(0) || 'A'}
              </span>
            )}
          </div>
          <div>
            <p className="text-sm font-medium">{userData?.username || 'Loading...'}</p>
            <p className="text-[10px] text-slate-400">{userData?.email || 'Loading...'}</p>
          </div>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
