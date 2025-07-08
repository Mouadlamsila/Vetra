"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Menu, Search, X, ChevronDown } from "lucide-react"
import { useTranslation } from "react-i18next"



export function MobileMenu() {
  const { t } = useTranslation();
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [openAccordions, setOpenAccordions] = useState([])
  const [openSubAccordions, setOpenSubAccordions] = useState([])

  const toggleAccordion = (name) => {
    setOpenAccordions((prev) => (prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]))
  }

  const toggleSubAccordion = (name) => {
    setOpenSubAccordions((prev) => (prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]))
  }

  return (
    <div className="lg:hidden flex items-center gap-2">
      <button className="p-2 rounded-md hover:bg-gray-100 cursor-pointer" onClick={() => setIsSearchOpen(!isSearchOpen)}>
        {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
      </button>

      <button className="p-2 rounded-md hover:bg-gray-100 cursor-pointer" onClick={() => setIsMenuOpen(true)}>
        <Menu className="h-5 w-5" />
      </button>

      {isMenuOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsMenuOpen(false)}></div>
          <div className="fixed inset-y-0 left-0 max-w-full flex">
            <div className="w-screen max-w-[300px] sm:max-w-[350px] overflow-auto">
              <div className="h-full flex flex-col bg-white shadow-xl">
                <div className="flex items-center justify-between p-4 border-b">
                  <h2 className="font-semibold">{t('view.header.menu')}</h2>
                  <button onClick={() => setIsMenuOpen(false)} className="cursor-pointer">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="py-4 overflow-y-auto">
                  <nav className="space-y-1 px-3">
                    <Link
                      to="/"
                      className="block py-2 px-3 hover:bg-gray-100 rounded-md cursor-pointer"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      mala
                    </Link>

                    <div className="py-2">
                      <button
                        className="flex w-full items-center justify-between px-3 py-2 hover:bg-gray-100 rounded-md cursor-pointer"
                        onClick={() => {
                          const el = document.getElementById("mobile-categories")
                          if (el) {
                            el.classList.toggle("hidden")
                          }
                        }}
                      >
                        {t('view.header.categories')}
                        <ChevronDown className="h-4 w-4" />
                      </button>
                      <div id="mobile-categories" className="hidden pl-4 space-y-1 mt-1">
                        {/* Categories will be populated dynamically from the API */}
                      </div>
                    </div>


                    <Link
                      to="/new-arrivals"
                      className="block py-2 px-3 hover:bg-gray-100 rounded-md cursor-pointer"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t('view.header.newArrivals')}
                    </Link>

                    <Link
                      to="/about"
                      className="block py-2 px-3 hover:bg-gray-100 rounded-md cursor-pointer"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t('view.header.about')}
                    </Link>

                    <Link
                      to="/contact"
                      className="block py-2 px-3 hover:bg-gray-100 rounded-md cursor-pointer"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t('view.header.contact')}
                    </Link>
                  </nav>

                  <div className="mt-6 px-3">
                    <div className="space-y-3">
                      <Link
                        to="/account/login"
                        className="block w-full bg-purple-700 hover:bg-purple-800 text-white py-2 px-4 rounded-md text-center cursor-pointer"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {t('view.header.login')}
                      </Link>
                      <Link
                        to="/account/register"
                        className="block w-full border border-gray-300 hover:bg-gray-50 py-2 px-4 rounded-md text-center cursor-pointer"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {t('view.header.signup')}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isSearchOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white p-4 border-b shadow-sm z-50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 cursor-pointer" />
            <input
              type="text"
              placeholder={t('view.header.searchPlaceholder')}
              className="w-full pl-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              autoFocus
            />
          </div>
        </div>
      )}
    </div>
  )
}
