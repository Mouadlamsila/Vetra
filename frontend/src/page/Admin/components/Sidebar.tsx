import React from "react";
import { Link, useLocation } from "react-router-dom";
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

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

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
      className={`bg-slate-800 text-white w-full md:w-64 flex-shrink-0 md:sticky md:top-0 md:h-screen overflow-y-auto z-40 transition-all duration-300 ${
        isOpen ? "fixed inset-0" : "hidden md:block"
      }`}
    >
      <div className="p-4 flex items-center justify-center border-b border-slate-700">
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
                    ? "bg-slate-700 text-white"
                    : "text-slate-300 hover:bg-slate-700 hover:text-white"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="mt-auto p-4 border-t border-slate-700">
        <Link to={"/admin/Profile"} className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white">
            <span className="text-sm font-medium">A</span>
          </div>
          <div>
            <p className="text-sm font-medium">Admin Principal</p>
            <p className="text-xs text-slate-400">admin@marketplace.com</p>
          </div>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
