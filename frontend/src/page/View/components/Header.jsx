"use client"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { ChevronDown, Search, User, ShoppingCart, Menu, X, Minus, Plus } from "lucide-react"
import axios from "axios"
import { useParams } from "react-router-dom"

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false)
  const [boutiques, setBoutiques] = useState([]);
  const id = localStorage.getItem("IDBoutique");
  const userId = localStorage.getItem("IDUser")
  

  useEffect(() => {
    console.log(id)
    const fetchBoutiques = async () => {
      const response = await axios.get(`http://localhost:1337/api/boutiques/${id}?filters[owner][id][$eq]=${userId}&populate=*`);
      setBoutiques(response.data.data);

    };
    fetchBoutiques();
  }, [])

  // Mock cart data
  const cartItems = [
    {
      id: "1",
      name: "Premium Wireless Headphones",
      price: 299.99,
      image:
        "https://images.unsplash.com/photo-1505740420928-5e040d5bfb6f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      quantity: 1,
      color: "Black",
    },
    {
      id: "3",
      name: "Portable Wireless Speaker",
      price: 149.99,
      image:
        "https://images.unsplash.com/photo-1606220588911-5117e04b09f9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      quantity: 2,
      color: "Blue",
    },
  ]

  return (
    <header className="sticky top-0 z-50  bg-white border-b border-gray-200">
      {/* Top bar */}
      <div className="bg-[#1e3a8a] text-white py-2 text-center text-sm">
        <p>Livraison gratuite pour toute commande supérieure à 50€ | Retours gratuits sous 30 jours</p>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 sm:px-15 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and mobile menu */}
          <div className="flex items-center gap-4">
            <button className="lg:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Menu className="h-6 w-6" />
            </button>

            <Link to={`/view/${id}`} className="flex items-center gap-2">
              <img 
                src={ `http://localhost:1337${boutiques?.logo?.url}` || "/placeholder.svg"} 
                alt={boutiques?.nom || "ShopEase"} 
                className="w-6 h-6 object-cover"
              />
              <span className="font-bold text-xl hidden sm:inline-block">{boutiques?.nom}</span>
            </Link>
          </div>

          {/* Search bar - desktop only */}
          <div className="hidden md:block flex-1 max-w-xl mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Rechercher des produits..."
                className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:border-[#1e3a8a]"
              />
              <button className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 text-white px-3 rounded-md text-sm">
                Rechercher
              </button>
            </div>
          </div>

          {/* User actions */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                className="hidden sm:flex items-center justify-center p-2 rounded-full hover:bg-gray-100"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <User className="h-5 w-5" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border overflow-hidden z-20">
                  <div className="p-3 text-center">
                    <p className="font-medium">Bienvenue!</p>
                    <p className="text-sm text-gray-500">Accédez à votre compte</p>
                  </div>
                  <hr />
                  <div className="p-1">
                    <Link
                      to="/account/login"
                      className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Se connecter
                    </Link>
                    <Link
                      to="/account/register"
                      className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      S'inscrire
                    </Link>
                  </div>
                  <hr />
                  <div className="p-1">
                    <Link
                      to="/account/orders"
                      className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Mes commandes
                    </Link>
                    <Link
                      to="/wishlist"
                      className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Ma liste d'envies
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                className="relative p-2 border border-gray-300 rounded-md hover:bg-gray-50"
                onClick={() => setCartOpen(!cartOpen)}
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-[#1e3a8a] text-white text-xs flex items-center justify-center">
                    {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </button>

              {cartOpen && (
                <div className="fixed inset-0 z-50 overflow-hidden">
                  <div className="absolute inset-0 bg-black/50" onClick={() => setCartOpen(false)}></div>
                  <div className="fixed inset-y-0 right-0 max-w-full flex">
                    <div className="w-screen max-w-md">
                      <div className="h-full flex flex-col bg-white shadow-xl">
                        <div className="flex items-center justify-between p-4 border-b">
                          <h2 className="text-lg font-semibold">Votre Panier</h2>
                          <button onClick={() => setCartOpen(false)}>
                            <X className="h-5 w-5" />
                          </button>
                        </div>

                        {cartItems.length === 0 ? (
                          <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                              <ShoppingCart className="h-8 w-8 text-gray-400" />
                            </div>
                            <h3 className="font-medium text-lg mb-2">Votre panier est vide</h3>
                            <p className="text-gray-500 mb-6">Découvrez nos produits et ajoutez-les à votre panier</p>
                            <button className="bg-purple-700 hover:bg-purple-800 text-white py-2 px-4 rounded-md">
                              <Link to="/categories/electronics">Continuer vos achats</Link>
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="flex-1 overflow-auto py-6">
                              <div className="space-y-6 px-4">
                                {cartItems.map((item) => (
                                  <div key={item.id} className="flex gap-4">
                                    <div className="relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0 border bg-white">
                                      <img
                                        src={item.image || "/placeholder.svg"}
                                        alt={item.name}
                                        className="object-cover w-full h-full"
                                      />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex justify-between">
                                        <h4 className="font-medium text-sm line-clamp-1">{item.name}</h4>
                                        <button className="text-gray-400 hover:text-red-500">
                                          <X className="h-4 w-4" />
                                        </button>
                                      </div>
                                      <p className="text-gray-500 text-xs">Couleur: {item.color}</p>
                                      <div className="mt-2 flex items-center justify-between">
                                        <div className="flex items-center border rounded-md">
                                          <button className="p-1 px-2 text-gray-600 hover:bg-gray-100">
                                            <Minus className="h-3 w-3" />
                                          </button>
                                          <span className="px-2 text-sm">{item.quantity}</span>
                                          <button className="p-1 px-2 text-gray-600 hover:bg-gray-100">
                                            <Plus className="h-3 w-3" />
                                          </button>
                                        </div>
                                        <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="border-t pt-6 px-4">
                              <div className="space-y-4">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Sous-total</span>
                                  <span className="font-medium">
                                    ${cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Frais de livraison</span>
                                  <span className="font-medium">
                                    {cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0) > 100
                                      ? "Gratuit"
                                      : "$10.00"}
                                  </span>
                                </div>
                                <hr />
                                <div className="flex justify-between">
                                  <span className="font-semibold">Total</span>
                                  <span className="font-bold text-lg">
                                    $
                                    {(
                                      cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0) +
                                      (cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0) > 100
                                        ? 0
                                        : 10)
                                    ).toFixed(2)}
                                  </span>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-2">
                                  <button className="border border-gray-300 hover:bg-gray-50 py-2 px-4 rounded-md">
                                    <Link to="/categories/electronics" className="w-full">
                                      Continuer
                                    </Link>
                                  </button>
                                  <button className="bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 text-white py-2 px-4 rounded-md">
                                    <Link to="/checkout" className="w-full">
                                      Commander
                                    </Link>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation - desktop only */}
        <nav className="hidden lg:flex items-center gap-6 mt-4">
          <Link to={`/view/${id}`} className="text-sm font-medium hover:text-purple-700 transition-colors">
            Accueil
          </Link>

          <div className="relative">
            <button
              className="flex items-center gap-1 text-sm font-medium hover:text-purple-700 transition-colors"
              onClick={() => setCategoryMenuOpen(!categoryMenuOpen)}
            >
              Catégories <ChevronDown className="h-4 w-4" />
            </button>

            {categoryMenuOpen && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-md shadow-lg border overflow-hidden z-20">
                <div className="p-1">
                  
                {
                    [...new Set(boutiques?.products?.map(p => p.categories))].map((category) => (
                      <Link
                        to={`/categories/${category}`}
                        className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left"
                        onClick={() => setCategoryMenuOpen(false)}
                      >
                        {category}
                      </Link>
                    ))
                  }
                  
                </div>
              </div>
            )}
          </div>

          <Link to="/promotions" className="text-sm font-medium hover:text-purple-700 transition-colors">
            Promotions
          </Link>

          <Link to="/new-arrivals" className="text-sm font-medium hover:text-purple-700 transition-colors">
            Nouveautés
          </Link>

          <Link to="/about" className="text-sm font-medium hover:text-purple-700 transition-colors">
            À propos
          </Link>

          <Link to="/contact" className="text-sm font-medium hover:text-purple-700 transition-colors">
            Contact
          </Link>
        </nav>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="fixed inset-y-0 left-0 max-w-full flex">
            <div className="w-screen max-w-[300px] sm:max-w-[350px]">
              <div className="h-full flex flex-col bg-white shadow-xl overflow-y-auto">
                <div className="flex items-center justify-between p-4 border-b">
                  <h2 className="font-semibold">Menu</h2>
                  <button onClick={() => setMobileMenuOpen(false)}>
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="py-4">
                  <nav className="space-y-1 px-3">
                    <Link
                      to="/"
                      className="block py-2 px-3 hover:bg-gray-100 rounded-md"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Accueil
                    </Link>

                    <div className="py-2">
                      <button
                        className="flex w-full items-center justify-between px-3 py-2 hover:bg-gray-100 rounded-md"
                        onClick={() => {
                          const el = document.getElementById("mobile-categories")
                          if (el) {
                            el.classList.toggle("hidden")
                          }
                        }}
                      >
                        Catégories
                        <ChevronDown className="h-4 w-4" />
                      </button>
                      <div id="mobile-categories" className="hidden pl-4 space-y-1 mt-1">
                        <Link
                          to="/categories/electronics"
                          className="block py-2 px-3 hover:bg-gray-100 rounded-md"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Électronique
                        </Link>
                        <Link
                          to="/categories/fashion"
                          className="block py-2 px-3 hover:bg-gray-100 rounded-md"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Mode
                        </Link>
                        <Link
                          to="/categories/home"
                          className="block py-2 px-3 hover:bg-gray-100 rounded-md"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Maison & Jardin
                        </Link>
                      </div>
                    </div>

                    <Link
                      to="/promotions"
                      className="block py-2 px-3 hover:bg-gray-100 rounded-md"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Promotions
                    </Link>

                    <Link
                      to="/new-arrivals"
                      className="block py-2 px-3 hover:bg-gray-100 rounded-md"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Nouveautés
                    </Link>

                    <Link
                      to="/about"
                      className="block py-2 px-3 hover:bg-gray-100 rounded-md"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      À propos
                    </Link>

                    <Link
                      to="/contact"
                      className="block py-2 px-3 hover:bg-gray-100 rounded-md"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Contact
                    </Link>
                  </nav>

                  <div className="mt-6 px-3">
                    <div className="space-y-3">
                      <Link
                        to="/account/login"
                        className="block w-full bg-purple-700 hover:bg-purple-800 text-white py-2 px-4 rounded-md text-center"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Se connecter
                      </Link>
                      <Link
                        to="/account/register"
                        className="block w-full border border-gray-300 hover:bg-gray-50 py-2 px-4 rounded-md text-center"
                        onClick={() => setMobileMenuOpen(false)}
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

      {/* Mobile search */}
      {searchOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white p-4 border-b shadow-sm z-50 lg:hidden">
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
    </header>
  )
}
