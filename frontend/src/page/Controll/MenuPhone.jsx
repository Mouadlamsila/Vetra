"use client"

import {
  BarChartIcon as ChartColumn,
  CircleChevronUp,
  CircleHelp,
  CreditCard,
  Home,
  LogOut,
  Package,
  Settings,
  ShoppingBag,
  Store,
  User,
} from "lucide-react"

import { useEffect, useState, useRef } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"

export default function MobileNavigation() {
  const location = useLocation()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [showMore, setShowMore] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const lastScrollY = useRef(0)
  const menuRef = useRef(null)

  const handleLogout = () => {
    localStorage.removeItem("IDUser")
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    navigate("/login")
  }

  // Main navigation items (always visible)
  const mainNavItems = [
    { icon: Home, path: "/controll/", label: t("dashboard.title") },
    { icon: User, path: "/controll/Profil", label: t("dashboard.profile") },
    { icon: Store, path: "/controll/Stores", label: t("dashboard.myStores") },
    { icon: Package, path: "/controll/Products", label: t("dashboard.myProducts") },
    { icon: ShoppingBag, path: "/controll/Orders", label: t("dashboard.orders") },
  ]
  
  // Additional navigation items (shown when expanded)
  const additionalNavItems = [
    { icon: "logo", path: "/", label: t("dashboard.home")},
    { icon: ChartColumn, path: "/controll/Stats", label: t("dashboard.statistics") },
    { icon: CreditCard, path: "/controll/Payment", label: t("dashboard.payments") },
    { icon: Settings, path: "/controll/Settings", label: t("dashboard.settings") },
    { icon: CircleHelp, path: "/controll/Help", label: t("dashboard.help") },
    { icon: LogOut, path: "#", label: t("dashboard.logout"), onClick: handleLogout },
  ]

  useEffect(() => {
    setShowMore(false)
  }, [location])

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const scrollHeight = document.documentElement.scrollHeight
      const clientHeight = document.documentElement.clientHeight
      const isAtBottom = scrollHeight - currentScrollY <= clientHeight + 100

      // Show menu when scrolling up or at bottom
      if (currentScrollY < lastScrollY.current || isAtBottom) {
        setIsVisible(true)
      } 
      // Hide menu when scrolling down
      else if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsVisible(false)
      }
      lastScrollY.current = currentScrollY
    }

    // Add touch events for mobile
    const handleTouchStart = (e) => {
      lastScrollY.current = window.scrollY
    }

    const handleTouchMove = (e) => {
      const currentScrollY = window.scrollY
      if (currentScrollY > lastScrollY.current) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }
      lastScrollY.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [])

  return (
    <div 
      ref={menuRef}
      className={`fixed bottom-0 left-0 w-full sm:hidden z-50 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      {/* Additional menu items overlay */}
      <div 
        className={`${
          showMore ? "translate-y-0" : "translate-y-96"
        } duration-500 transition-all ease-in-out bg-white border-t border-gray-200 p-2 grid grid-cols-3 gap-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]`}
      >
        {additionalNavItems.map((item, index) => {
          const isActive = location.pathname === item.path
          return (
            <div
              key={index}
              className={`flex flex-col items-center justify-center p-2 cursor-pointer rounded-md transition-colors ${
                isActive ? "text-[#6D28D9] bg-[#f5f3ff]" : "text-gray-600 hover:bg-gray-50"
              }`}
              onClick={item.onClick || (() => navigate(item.path))}
            >
              <div className={`p-1.5 rounded-full ${isActive ? "bg-[#c8c2fd]" : ""}`}>
                {item.icon === "logo" ?
                <img src="/img/logo/v.png" alt="logo" className="w-6 h-6" />
                : 
                <item.icon size={20} />}
              </div>
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </div>
          )
        })}
      </div>

      {/* Main navigation bar */}
      <div className="h-16 bg-white border-t relative z-50 border-gray-200 shadow-sm">
        <div className="flex h-full">
          {mainNavItems.map((item, index) => {
            const isActive = location.pathname === item.path
            return (
              <div
                key={index}
                className={`flex-1 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                  isActive ? "text-[#6D28D9]" : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => navigate(item.path)}
              >
                <div className={`p-1.5 rounded-full ${isActive ? "bg-[#c8c2fd]" : ""}`}>
                  <item.icon size={20} />
                </div>
              </div>
            )
          })}
          
          {/* Expand/Collapse button */}
          <div
            className={`flex-1 flex flex-col items-center justify-center cursor-pointer transition-colors ${
              showMore ? "text-[#6D28D9]" : "text-gray-600 hover:text-gray-900"
            }`}
            onClick={() => setShowMore(!showMore)}
          >
            <div className={`p-1.5 rounded-full ${showMore ? "bg-[#c8c2fd]" : ""}`}>
              <CircleChevronUp
                size={20}
                className={`transition-transform duration-300 ${showMore ? "rotate-180" : ""}`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
