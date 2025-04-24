"use client"

import { useState } from "react"
import {Link} from "react-router-dom"
import { Menu, Search, X, ChevronDown } from "lucide-react"

// Mock navigation data
const navigationItems = [
  {
    name: "Accueil",
    href: "/",
  },
  {
    name: "Catégories",
    children: [
      {
        name: "Électronique",
        href: "/categories/electronics",
        children: [
          { name: "Casques", href: "/categories/electronics/headphones" },
          { name: "Enceintes", href: "/categories/electronics/speakers" },
          { name: "Montres connectées", href: "/categories/electronics/smartwatches" },
        ],
      },
      {
        name: "Mode",
        href: "/categories/fashion",
        children: [
          { name: "Hommes", href: "/categories/fashion/men" },
          { name: "Femmes", href: "/categories/fashion/women" },
          { name: "Accessoires", href: "/categories/fashion/accessories" },
        ],
      },
      {
        name: "Maison",
        href: "/categories/home",
        children: [
          { name: "Décoration", href: "/categories/home/decor" },
          { name: "Cuisine", href: "/categories/home/kitchen" },
          { name: "Meubles", href: "/categories/home/furniture" },
        ],
      },
    ],
  },
  {
    name: "Promotions",
    href: "/promotions",
  },
  {
    name: "Nouveautés",
    href: "/new-arrivals",
  },
  {
    name: "À propos",
    href: "/about",
  },
  {
    name: "Contact",
    href: "/contact",
  },
]

export function MobileMenu() {
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
      <button className="p-2 rounded-md hover:bg-gray-100" onClick={() => setIsSearchOpen(!isSearchOpen)}>
        {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
      </button>

      <button className="p-2 rounded-md hover:bg-gray-100" onClick={() => setIsMenuOpen(true)}>
        <Menu className="h-5 w-5" />
      </button>

      {isMenuOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsMenuOpen(false)}></div>
          <div className="fixed inset-y-0 left-0 max-w-full flex">
            <div className="w-screen max-w-[300px] sm:max-w-[350px] overflow-auto">
              <div className="h-full flex flex-col bg-white shadow-xl">
                <div className="flex items-center justify-between p-4 border-b">
                  <h2 className="font-semibold">Menu</h2>
                  <button onClick={() => setIsMenuOpen(false)}>
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="py-4 overflow-y-auto">
                  <nav className="space-y-1 px-3">
                    {navigationItems.map((item) => (
                      <div key={item.name}>
                        {item.children ? (
                          <div className="border-b">
                            <button
                              className="flex w-full items-center justify-between py-3 px-3 hover:bg-gray-100 rounded-md"
                              onClick={() => toggleAccordion(item.name)}
                            >
                              {item.name}
                              <ChevronDown
                                className={`h-4 w-4 transition-transform ${
                                  openAccordions.includes(item.name) ? "rotate-180" : ""
                                }`}
                              />
                            </button>
                            {openAccordions.includes(item.name) && (
                              <div className="pl-4 space-y-1 pb-2">
                                {item.children.map((child) => (
                                  <div key={child.name}>
                                    {child.children ? (
                                      <div>
                                        <button
                                          className="flex w-full items-center justify-between py-2 px-3 hover:bg-gray-100 rounded-md"
                                          onClick={() => toggleSubAccordion(child.name)}
                                        >
                                          {child.name}
                                          <ChevronDown
                                            className={`h-4 w-4 transition-transform ${
                                              openSubAccordions.includes(child.name) ? "rotate-180" : ""
                                            }`}
                                          />
                                        </button>
                                        {openSubAccordions.includes(child.name) && (
                                          <div className="pl-4 space-y-1">
                                            {child.children.map((subChild) => (
                                              <Link
                                                key={subChild.name}
                                                to={subChild.href}
                                                className="block py-2 px-3 hover:bg-gray-100 rounded-md"
                                                onClick={() => setIsMenuOpen(false)}
                                              >
                                                {subChild.name}
                                              </Link>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    ) : (
                                      <Link
                                        to={child.href}
                                        className="block py-2 px-3 hover:bg-gray-100 rounded-md"
                                        onClick={() => setIsMenuOpen(false)}
                                      >
                                        {child.name}
                                      </Link>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ) : (
                          <Link
                            to={item.href}
                            className="block py-2 px-3 hover:bg-gray-100 rounded-md"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {item.name}
                          </Link>
                        )}
                      </div>
                    ))}
                  </nav>

                  <div className="mt-6 px-3">
                    <div className="space-y-3">
                      <Link
                        to="/account/login"
                        className="block w-full bg-purple-700 hover:bg-purple-800 text-white py-2 px-4 rounded-md text-center"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Se connecter
                      </Link>
                      <Link
                        to="/account/register"
                        className="block w-full border border-gray-300 hover:bg-gray-50 py-2 px-4 rounded-md text-center"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        S'inscrire
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
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Rechercher des produits..."
              className="w-full pl-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              autoFocus
            />
          </div>
        </div>
      )}
    </div>
  )
}
