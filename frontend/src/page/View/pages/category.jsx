"use client"

import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { ChevronRight, Heart, ShoppingCart, Star, Filter, X } from 'lucide-react'
import axios from "axios"

export default function CategoryPage() {
  const { category } = useParams()
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  // Filter states
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [inStockOnly, setInStockOnly] = useState(false)
  const [selectedRating, setSelectedRating] = useState(0)

  useEffect(() => {
    axios
      .get(`http://localhost:1337/api/products?filters[categories][$eq]=${category}&populate=*`)
      .then((res) => {
        setProducts(res.data.data)
        setFilteredProducts(res.data.data)
        setLoading(false)
      })
      .catch((err) => {
        console.log(err)
        setLoading(false)
      })
  }, [category])

  // Apply filters whenever filter states change
  useEffect(() => {
    if (products.length === 0) return

    const filtered = products.filter((product) => {
      // Price filter
      if (product.prix < priceRange[0] || product.prix > priceRange[1]) return false

      // In stock filter
      if (inStockOnly && product.stock <= 0) return false

      // Rating filter (assuming product has a rating property)
      if (selectedRating > 0 && (!product.rating || product.rating < selectedRating)) return false

      return true
    })

    setFilteredProducts(filtered)
  }, [products, priceRange, inStockOnly, selectedRating])

  const handlePriceChange = (e, index) => {
    const newPriceRange = [...priceRange]
    newPriceRange[index] = Number(e.target.value)
    setPriceRange(newPriceRange)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-t-black border-opacity-20 rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center text-sm text-gray-500">
            <Link to="/view/1" className="hover:text-purple-700 transition-colors">
              Accueil
            </Link>
            <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
            <span className="text-gray-900 font-medium capitalize">{category}</span>
          </div>
        </div>
      </div>

      {/* Category Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 capitalize mb-2">{category}</h1>
              <p className="text-gray-500">{filteredProducts.length} produits trouvés</p>
            </div>
            <button
              className="md:hidden bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm hover:bg-purple-800 transition-colors"
              onClick={() => setMobileFilterOpen(true)}
            >
              <Filter className="h-4 w-4" />
              Filtrer
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filter Sidebar - Desktop */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-5 sticky top-4 border border-gray-200">
              <h2 className="font-bold text-lg mb-6 text-gray-900">Filtres</h2>

              {/* Price Range Filter */}
              <div className="mb-8">
                <h3 className="font-medium mb-4 text-gray-700">Prix</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Min: ${priceRange[0]}</span>
                    <span className="text-sm text-gray-500">Max: ${priceRange[1]}</span>
                  </div>
                  <div className="relative pt-1">
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      value={priceRange[0]}
                      onChange={(e) => handlePriceChange(e, 0)}
                      className="w-full h-1 bg-gray-200 rounded-full appearance-none cursor-pointer focus:outline-none"
                      style={{
                        background: `linear-gradient(to right, #e5e7eb 0%, #7c3aed ${priceRange[0] / 10}%, #7c3aed ${
                          priceRange[1] / 10
                        }%, #e5e7eb 100%)`,
                        WebkitAppearance: "none",
                      }}
                    />
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      value={priceRange[1]}
                      onChange={(e) => handlePriceChange(e, 1)}
                      className="w-full h-1 bg-gray-200 rounded-full appearance-none cursor-pointer mt-2 focus:outline-none"
                      style={{
                        background: `linear-gradient(to right, #e5e7eb 0%, #7c3aed ${priceRange[0] / 10}%, #7c3aed ${
                          priceRange[1] / 10
                        }%, #e5e7eb 100%)`,
                        WebkitAppearance: "none",
                      }}
                    />
                  </div>
                  <div className="flex gap-2 mt-2">
                    <div className="relative flex-1">
                      <input
                        type="number"
                        value={priceRange[0]}
                        onChange={(e) => handlePriceChange(e, 0)}
                        className="w-full border border-gray-300 rounded-lg pl-7 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-700 focus:border-transparent transition-all"
                      />
                      <span className="absolute left-3 top-2 text-sm text-gray-500">$</span>
                    </div>
                    <div className="relative flex-1">
                      <input
                        type="number"
                        value={priceRange[1]}
                        onChange={(e) => handlePriceChange(e, 1)}
                        className="w-full border border-gray-300 rounded-lg pl-7 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-700 focus:border-transparent transition-all"
                      />
                      <span className="absolute left-3 top-2 text-sm text-gray-500">$</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Availability Filter */}
              <div className="mb-8">
                <h3 className="font-medium mb-4 text-gray-700">Disponibilité</h3>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={() => setInStockOnly(!inStockOnly)}
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 border ${
                        inStockOnly ? "bg-purple-700 border-purple-700" : "border-gray-300 bg-white"
                      } rounded transition-colors`}
                    ></div>
                    {inStockOnly && (
                      <svg
                        className="absolute top-0.5 left-0.5 w-4 h-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
                    En stock uniquement
                  </span>
                </label>
              </div>

              {/* Rating Filter */}
              <div className="mb-8">
                <h3 className="font-medium mb-4 text-gray-700">Évaluation</h3>
                <div className="space-y-3">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <label key={rating} className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="radio"
                          name="rating"
                          checked={selectedRating === rating}
                          onChange={() => setSelectedRating(rating)}
                          className="sr-only"
                        />
                        <div
                          className={`w-5 h-5 rounded-full border ${
                            selectedRating === rating ? "border-purple-700" : "border-gray-300"
                          } flex items-center justify-center`}
                        >
                          {selectedRating === rating && <div className="w-3 h-3 rounded-full bg-purple-700"></div>}
                        </div>
                      </div>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                          />
                        ))}
                        <span className="ml-1 text-sm text-gray-500">et plus</span>
                      </div>
                    </label>
                  ))}
                  {selectedRating > 0 && (
                    <button
                      onClick={() => setSelectedRating(0)}
                      className="text-sm text-purple-700 hover:text-purple-800 hover:underline transition-colors mt-2"
                    >
                      Réinitialiser
                    </button>
                  )}
                </div>
              </div>

              {/* Reset All Filters */}
              <button
                onClick={() => {
                  setPriceRange([0, 1000])
                  setInStockOnly(false)
                  setSelectedRating(0)
                }}
                className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 py-2.5 rounded-lg text-sm font-medium transition-colors border border-gray-300"
              >
                Réinitialiser tous les filtres
              </button>
            </div>
          </div>

          {/* Mobile Filter Sidebar */}
          {mobileFilterOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden backdrop-blur-sm transition-all">
              <div 
                className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-white p-5 overflow-y-auto shadow-xl"
                style={{
                  animation: "slide-in 0.3s ease-out forwards",
                }}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-bold text-lg text-gray-900">Filtres</h2>
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Price Range Filter */}
                <div className="mb-8">
                  <h3 className="font-medium mb-4 text-gray-700">Prix</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Min: ${priceRange[0]}</span>
                      <span className="text-sm text-gray-500">Max: ${priceRange[1]}</span>
                    </div>
                    <div className="relative pt-1">
                      <input
                        type="range"
                        min="0"
                        max="1000"
                        value={priceRange[0]}
                        onChange={(e) => handlePriceChange(e, 0)}
                        className="w-full h-1 bg-gray-200 rounded-full appearance-none cursor-pointer focus:outline-none"
                        style={{
                          background: `linear-gradient(to right, #e5e7eb 0%, #7c3aed ${priceRange[0] / 10}%, #7c3aed ${
                            priceRange[1] / 10
                          }%, #e5e7eb 100%)`,
                          WebkitAppearance: "none",
                        }}
                      />
                      <input
                        type="range"
                        min="0"
                        max="1000"
                        value={priceRange[1]}
                        onChange={(e) => handlePriceChange(e, 1)}
                        className="w-full h-1 bg-gray-200 rounded-full appearance-none cursor-pointer mt-2 focus:outline-none"
                        style={{
                          background: `linear-gradient(to right, #e5e7eb 0%, #7c3aed ${priceRange[0] / 10}%, #7c3aed ${
                            priceRange[1] / 10
                          }%, #e5e7eb 100%)`,
                          WebkitAppearance: "none",
                        }}
                      />
                    </div>
                    <div className="flex gap-2 mt-2">
                      <div className="relative flex-1">
                        <input
                          type="number"
                          value={priceRange[0]}
                          onChange={(e) => handlePriceChange(e, 0)}
                          className="w-full border border-gray-300 rounded-lg pl-7 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-700 focus:border-transparent transition-all"
                        />
                        <span className="absolute left-3 top-2 text-sm text-gray-500">$</span>
                      </div>
                      <div className="relative flex-1">
                        <input
                          type="number"
                          value={priceRange[1]}
                          onChange={(e) => handlePriceChange(e, 1)}
                          className="w-full border border-gray-300 rounded-lg pl-7 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-700 focus:border-transparent transition-all"
                        />
                        <span className="absolute left-3 top-2 text-sm text-gray-500">$</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Availability Filter */}
                <div className="mb-8">
                  <h3 className="font-medium mb-4 text-gray-700">Disponibilité</h3>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={inStockOnly}
                        onChange={() => setInStockOnly(!inStockOnly)}
                        className="sr-only"
                      />
                      <div
                        className={`w-5 h-5 border ${
                          inStockOnly ? "bg-purple-700 border-purple-700" : "border-gray-300 bg-white"
                        } rounded transition-colors`}
                      ></div>
                      {inStockOnly && (
                        <svg
                          className="absolute top-0.5 left-0.5 w-4 h-4 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
                      En stock uniquement
                    </span>
                  </label>
                </div>

                {/* Rating Filter */}
                <div className="mb-8">
                  <h3 className="font-medium mb-4 text-gray-700">Évaluation</h3>
                  <div className="space-y-3">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <label key={rating} className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative">
                          <input
                            type="radio"
                            name="rating-mobile"
                            checked={selectedRating === rating}
                            onChange={() => setSelectedRating(rating)}
                            className="sr-only"
                          />
                          <div
                            className={`w-5 h-5 rounded-full border ${
                              selectedRating === rating ? "border-purple-700" : "border-gray-300"
                            } flex items-center justify-center`}
                          >
                            {selectedRating === rating && <div className="w-3 h-3 rounded-full bg-purple-700"></div>}
                          </div>
                        </div>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                            />
                          ))}
                          <span className="ml-1 text-sm text-gray-500">et plus</span>
                        </div>
                      </label>
                    ))}
                    {selectedRating > 0 && (
                      <button
                        onClick={() => setSelectedRating(0)}
                        className="text-sm text-purple-700 hover:text-purple-800 hover:underline transition-colors mt-2"
                      >
                        Réinitialiser
                      </button>
                    )}
                  </div>
                </div>

                {/* Apply and Reset Buttons */}
                <div className="flex gap-2 sticky bottom-0 bg-white pt-4 pb-2">
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="flex-1 bg-purple-700 hover:bg-purple-800 text-white py-3 rounded-lg text-sm font-medium transition-colors shadow-sm"
                  >
                    Appliquer
                  </button>
                  <button
                    onClick={() => {
                      setPriceRange([0, 1000])
                      setInStockOnly(false)
                      setSelectedRating(0)
                    }}
                    className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 py-3 rounded-lg text-sm font-medium transition-colors border border-gray-300"
                  >
                    Réinitialiser
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-10 text-center border border-gray-200">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4">
                  <X className="h-8 w-8 text-gray-500" />
                </div>
                <p className="text-gray-700 mb-4">Aucun produit ne correspond à vos critères de recherche.</p>
                <button
                  onClick={() => {
                    setPriceRange([0, 1000])
                    setInStockOnly(false)
                    setSelectedRating(0)
                  }}
                  className="text-purple-700 hover:text-purple-800 font-medium hover:underline transition-colors"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="group overflow-hidden rounded-xl bg-white border border-gray-200 transition-all duration-300 hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/view/products/${product.documentId}`} className="block">
        <div className="relative">
          <div className="aspect-square overflow-hidden">
            <img
              src={`http://localhost:1337${product.imgMain?.url}` || "/placeholder.svg"}
              alt={product.name}
              className={`object-cover w-full h-full transition-transform duration-500 ${isHovered ? "scale-110" : "scale-100"}`}
            />
          </div>
          {product.stock <= 10 && (
            <div className="absolute bottom-3 left-3 right-3 bg-black/70 text-white text-xs text-center py-1.5 rounded-full backdrop-blur-sm">
              {product.stock <= 5 ? "Plus que " + product.stock + " en stock!" : "Stock limité"}
            </div>
          )}
          <div
            className={`absolute top-3 right-3 transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"}`}
          >
            <button className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-purple-700 hover:text-white transition-colors">
              <Heart className="h-4 w-4" />
            </button>
          </div>
        </div>
      </Link>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium line-clamp-1 text-gray-900 group-hover:text-purple-700 transition-colors">
            {product.name}
          </h3>
          <span className="text-xs text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full">{product.categories}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-purple-700">${product.prix}</span>
            {product.comparePrice && (
              <span className="text-sm text-gray-500 line-through">${product.comparePrice}</span>
            )}
          </div>
          <button className="bg-purple-700 hover:bg-purple-800 text-white p-2 rounded-lg transition-colors shadow-sm">
            <ShoppingCart className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
