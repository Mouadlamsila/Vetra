

import { useState } from "react"
import {Link} from "react-router-dom"
import { ChevronDown, ChevronRight, Filter, Star, Heart, ShoppingCart } from "lucide-react"

// Mock category data
const categoryData = {
  electronics: {
    name: "Électronique",
    description: "Découvrez notre gamme de produits électroniques de haute qualité",
    products: [
      {
        id: "1",
        name: "Premium Wireless Headphones",
        price: 299.99,
        oldPrice: 349.99,
        image:
          "https://images.unsplash.com/photo-1505740420928-5e040d5bfb6f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        rating: 4.8,
        reviews: 124,
        category: "Electronics",
        badge: "New",
        stock: 15,
      },
      {
        id: "2",
        name: "Smart Watch Series X",
        price: 199.99,
        oldPrice: 249.99,
        image:
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        rating: 4.5,
        reviews: 89,
        category: "Wearables",
        badge: "Sale",
        stock: 8,
      },
      {
        id: "3",
        name: "Portable Wireless Speaker",
        price: 149.99,
        oldPrice: null,
        image:
          "https://images.unsplash.com/photo-1606220588911-5117e04b09f9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        rating: 4.7,
        reviews: 56,
        category: "Audio",
        badge: "Best Seller",
        stock: 20,
      },
      {
        id: "4",
        name: "Ultra HD Camera",
        price: 599.99,
        oldPrice: 699.99,
        image:
          "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        rating: 4.9,
        reviews: 42,
        category: "Photography",
        badge: "Limited",
        stock: 5,
      },
      {
        id: "5",
        name: "Wireless Earbuds Pro",
        price: 129.99,
        oldPrice: 159.99,
        image:
          "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        rating: 4.6,
        reviews: 78,
        category: "Audio",
        badge: null,
        stock: 25,
      },
      {
        id: "6",
        name: "Smart Home Hub",
        price: 89.99,
        oldPrice: null,
        image:
          "https://images.unsplash.com/photo-1558089687-f282ffcbc0d4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        rating: 4.3,
        reviews: 36,
        category: "Smart Home",
        badge: null,
        stock: 12,
      },
      {
        id: "7",
        name: "4K Gaming Monitor",
        price: 349.99,
        oldPrice: 399.99,
        image:
          "https://images.unsplash.com/photo-1616763355548-1b606f439f86?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        rating: 4.7,
        reviews: 52,
        category: "Computers",
        badge: "Sale",
        stock: 7,
      },
      {
        id: "8",
        name: "Wireless Charging Pad",
        price: 39.99,
        oldPrice: null,
        image:
          "https://images.unsplash.com/photo-1622043176872-fc1e49a43d35?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        rating: 4.4,
        reviews: 29,
        category: "Accessories",
        badge: null,
        stock: 30,
      },
    ],
    filters: {
      brands: ["Apple", "Samsung", "Sony", "Bose", "JBL", "Canon", "Logitech"],
      price: {
        min: 0,
        max: 1000,
      },
      ratings: [5, 4, 3, 2, 1],
      subcategories: ["Audio", "Wearables", "Photography", "Computers", "Smart Home", "Accessories"],
    },
  },
}

export default function CategoryPage({ params }) {
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [viewMode, setViewMode] = useState("grid")
  const [openAccordions, setOpenAccordions] = useState(["price", "brand", "rating"])
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  // Get category data or fallback to electronics if not found
  const category = categoryData[params?.category] || categoryData.electronics

  const toggleAccordion = (id) => {
    setOpenAccordions((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Breadcrumb */}
      <div className="bg-white   border-b border-gray-200">
        <div className="container mx-auto px-15 py-3">
          <div className="flex items-center text-sm text-gray-500">
            <Link to="/view/1" className="hover:text-purple-700">
              Accueil
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-gray-900 font-medium">{category.name}</span>
          </div>
        </div>
      </div>

      {/* Category Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-15 py-8">
          <h1 className="text-3xl font-bold text-gray-900">{category.name}</h1>
          <p className="mt-2 text-gray-600">{category.description}</p>
        </div>
      </div>

      <div className="container mx-auto px-15 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters - Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-lg border border-gray-300 p-6 sticky top-8">
              <h3 className="font-semibold text-lg mb-4">Filtres</h3>

              <div className="space-y-2">
                {/* Price Accordion */}
                <div className="border-b  pb-2">
                  <button
                    className="flex w-full items-center justify-between py-3 font-medium transition-all hover:underline"
                    onClick={() => toggleAccordion("price")}
                  >
                    Prix
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 transition-transform duration-200 ${openAccordions.includes("price") ? "rotate-180" : ""}`}
                    />
                  </button>
                  {openAccordions.includes("price") && (
                    <div className="pt-1  pb-3">
                      <div className="space-y-4">
                        <input
                          type="range"
                          min="0"
                          max="1000"
                          step="10"
                          value={priceRange[1]}
                          onChange={(e) => setPriceRange([priceRange[0], Number.parseInt(e.target.value)])}
                          className="w-full"
                        />
                        <div className="flex items-center justify-between">
                          <span className="text-sm">${priceRange[0]}</span>
                          <span className="text-sm">${priceRange[1]}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Brand Accordion */}
                <div className="border-b pb-2">
                  <button
                    className="flex w-full items-center justify-between py-3 font-medium transition-all hover:underline"
                    onClick={() => toggleAccordion("brand")}
                  >
                    Marque
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 transition-transform duration-200 ${openAccordions.includes("brand") ? "rotate-180" : ""}`}
                    />
                  </button>
                  {openAccordions.includes("brand") && (
                    <div className="pt-1 pb-3">
                      <div className="space-y-2">
                        {category.filters.brands.map((brand) => (
                          <div key={brand} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`brand-${brand}`}
                              className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                            />
                            <label htmlFor={`brand-${brand}`} className="text-sm">
                              {brand}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Rating Accordion */}
                <div className="border-b pb-2">
                  <button
                    className="flex w-full items-center justify-between py-3 font-medium transition-all hover:underline"
                    onClick={() => toggleAccordion("rating")}
                  >
                    Évaluation
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 transition-transform duration-200 ${openAccordions.includes("rating") ? "rotate-180" : ""}`}
                    />
                  </button>
                  {openAccordions.includes("rating") && (
                    <div className="pt-1 pb-3">
                      <div className="space-y-2">
                        {category.filters.ratings.map((rating) => (
                          <div key={rating} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`rating-${rating}`}
                              className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                            />
                            <label htmlFor={`rating-${rating}`} className="flex items-center text-sm">
                              {[...Array(rating)].map((_, i) => (
                                <Star key={i} className="h-4 w-4 fill-current text-yellow-400" />
                              ))}
                              {[...Array(5 - rating)].map((_, i) => (
                                <Star key={i} className="h-4 w-4 text-gray-300" />
                              ))}
                              <span className="ml-1">& plus</span>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Category Accordion */}
                <div className="border-b   pb-2">
                  <button
                    className="flex w-full items-center justify-between py-3 font-medium transition-all hover:underline"
                    onClick={() => toggleAccordion("category")}
                  >
                    Catégorie
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 transition-transform duration-200 ${openAccordions.includes("category") ? "rotate-180" : ""}`}
                    />
                  </button>
                  {openAccordions.includes("category") && (
                    <div className="pt-1 pb-3">
                      <div className="space-y-2">
                        {category.filters.subcategories.map((subcategory) => (
                          <div key={subcategory} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`subcategory-${subcategory}`}
                              className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                            />
                            <label htmlFor={`subcategory-${subcategory}`} className="text-sm">
                              {subcategory}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <button className="w-full bg-purple-700 hover:bg-purple-800 text-white py-2 px-4 rounded-md transition-colors">
                  Appliquer les filtres
                </button>
                <button className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 px-4 rounded-md transition-colors">
                  Réinitialiser
                </button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Mobile Filters */}
            <div className="lg:hidden mb-6">
              <button
                className="w-full border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 py-2 px-4 rounded-md transition-colors flex items-center justify-center"
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              >
                <Filter className="h-4 w-4 mr-2" /> Filtres
              </button>

              {mobileFilterOpen && (
                <div className="fixed inset-0 z-50 bg-black/50">
                  <div className="fixed inset-y-0 left-0 z-50 w-[300px] sm:w-[400px] bg-white overflow-auto">
                    <div className="flex items-center justify-between p-4 border-b">
                      <h2 className="text-lg font-semibold">Filtres</h2>
                      <button onClick={() => setMobileFilterOpen(false)}>
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-gray-500 mb-4">Affinez votre recherche avec nos filtres</p>

                      <div className="space-y-2">
                        {/* Mobile Price Accordion */}
                        <div className="border-b pb-2">
                          <button
                            className="flex w-full items-center justify-between py-3 font-medium transition-all hover:underline"
                            onClick={() => toggleAccordion("price-mobile")}
                          >
                            Prix
                            <ChevronDown
                              className={`h-4 w-4 shrink-0 transition-transform duration-200 ${openAccordions.includes("price-mobile") ? "rotate-180" : ""}`}
                            />
                          </button>
                          {openAccordions.includes("price-mobile") && (
                            <div className="pt-1 pb-3">
                              <div className="space-y-4">
                                <input
                                  type="range"
                                  min="0"
                                  max="1000"
                                  step="10"
                                  value={priceRange[1]}
                                  onChange={(e) => setPriceRange([priceRange[0], Number.parseInt(e.target.value)])}
                                  className="w-full"
                                />
                                <div className="flex items-center justify-between">
                                  <span className="text-sm">${priceRange[0]}</span>
                                  <span className="text-sm">${priceRange[1]}</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Other mobile accordions would go here */}
                      </div>

                      <div className="mt-6 space-y-3">
                        <button
                          className="w-full bg-purple-700 hover:bg-purple-800 text-white py-2 px-4 rounded-md transition-colors"
                          onClick={() => setMobileFilterOpen(false)}
                        >
                          Appliquer les filtres
                        </button>
                        <button className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 px-4 rounded-md transition-colors">
                          Réinitialiser
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sort and View Options */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <p className="text-gray-600">{category.products.length} produits trouvés</p>

              <div className="flex items-center gap-4 self-end sm:self-auto">
                <div className="relative">
                  <select
                    className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    defaultValue="featured"
                  >
                    <option value="featured">En vedette</option>
                    <option value="price-low">Prix: Croissant</option>
                    <option value="price-high">Prix: Décroissant</option>
                    <option value="newest">Plus récent</option>
                    <option value="rating">Mieux noté</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none text-gray-500" />
                </div>

                <div className="flex items-center border border-gray-300 rounded-md">
                  <button
                    className={`p-2 rounded-l-md ${viewMode === "grid" ? "bg-gray-100" : ""}`}
                    onClick={() => setViewMode("grid")}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="3" width="7" height="7" />
                      <rect x="14" y="3" width="7" height="7" />
                      <rect x="3" y="14" width="7" height="7" />
                      <rect x="14" y="14" width="7" height="7" />
                    </svg>
                  </button>
                  <button
                    className={`p-2 rounded-r-md ${viewMode === "list" ? "bg-gray-100" : ""}`}
                    onClick={() => setViewMode("list")}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="8" y1="6" x2="21" y2="6" />
                      <line x1="8" y1="12" x2="21" y2="12" />
                      <line x1="8" y1="18" x2="21" y2="18" />
                      <line x1="3" y1="6" x2="3.01" y2="6" />
                      <line x1="3" y1="12" x2="3.01" y2="12" />
                      <line x1="3" y1="18" x2="3.01" y2="18" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Products */}
            <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-6"}>
              {category.products.map((product) => (
                <ProductCard key={product.id} product={product} layout={viewMode} />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-12 flex justify-center">
              <div className="flex items-center gap-1">
                <button className="p-2 rounded-md border border-gray-300 text-gray-400 cursor-not-allowed">
                  <ChevronDown className="h-4 w-4 rotate-90" />
                </button>
                <button className="py-1 px-3 rounded-md bg-purple-50 text-purple-700 border-purple-200 border">
                  1
                </button>
                <button className="py-1 px-3 rounded-md border border-gray-300 hover:bg-gray-50">2</button>
                <button className="py-1 px-3 rounded-md border border-gray-300 hover:bg-gray-50">3</button>
                <span className="px-2">...</span>
                <button className="py-1 px-3 rounded-md border border-gray-300 hover:bg-gray-50">8</button>
                <button className="p-2 rounded-md border border-gray-300 hover:bg-gray-50">
                  <ChevronDown className="h-4 w-4 -rotate-90" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProductCard({ product, layout = "grid" }) {
  if (layout === "list") {
    return (
      <div className="group relative flex flex-col sm:flex-row gap-6 bg-white border-gray-200 rounded-lg border overflow-hidden hover:shadow-md transition-all duration-300">
        <div className="relative w-full sm:w-48 h-48">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
          />
          {product.badge && (
            <span
              className={`absolute top-3 left-3 px-2 py-1 text-xs font-medium text-white rounded-full ${
                product.badge === "Sale" ? "bg-red-500" : product.badge === "New" ? "bg-green-500" : "bg-purple-700"
              }`}
            >
              {product.badge}
            </span>
          )}
        </div>

        <div className="flex-1 p-4 flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium">{product.name}</h3>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{product.category}</span>
          </div>

          <div className="flex items-center mb-3">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${
                    i < Math.floor(product.rating) ? "fill-current text-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="ml-2 text-xs text-gray-600">({product.reviews})</span>
          </div>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua.
          </p>

          <div className="mt-auto flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-purple-700">${product.price}</span>
              {product.oldPrice && <span className="text-sm text-gray-500 line-through">${product.oldPrice}</span>}
            </div>

            <div className="flex gap-2">
              <button className="rounded-full h-9 w-9 flex items-center justify-center border border-gray-300 hover:bg-gray-50">
                <Heart className="h-4 w-4" />
              </button>
              <button className="bg-purple-700 hover:bg-purple-800 text-white py-2 px-4 rounded-md flex items-center">
                <ShoppingCart className="h-4 w-4 mr-2" /> Ajouter
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="group overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 bg-white rounded-lg">
      <Link to={`/view/products/${product.id}`} className="block">
        <div className="relative">
          <div className="aspect-square overflow-hidden">
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          {product.badge && (
            <span
              className={`absolute top-3 left-3 px-2 py-1 text-xs font-medium text-white rounded-full ${
                product.badge === "Sale" ? "bg-red-500" : product.badge === "New" ? "bg-green-500" : "bg-purple-700"
              }`}
            >
              {product.badge}
            </span>
          )}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button className="rounded-full h-9 w-9 flex items-center justify-center bg-white/80 backdrop-blur-sm hover:bg-white">
              <Heart className="h-4 w-4 text-gray-700" />
            </button>
          </div>
          {product.stock <= 10 && (
            <div className="absolute bottom-3 left-3 right-3 bg-black/70 text-white text-xs text-center py-1 rounded-full backdrop-blur-sm">
              {product.stock <= 5 ? "Plus que " + product.stock + " en stock!" : "Stock limité"}
            </div>
          )}
        </div>
      </Link>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium line-clamp-1">{product.name}</h3>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{product.category}</span>
        </div>
        <div className="flex items-center mb-3">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${
                  i < Math.floor(product.rating) ? "fill-current text-yellow-400" : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="ml-2 text-xs text-gray-600">({product.reviews})</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-purple-700">${product.price}</span>
            {product.oldPrice && <span className="text-sm text-gray-500 line-through">${product.oldPrice}</span>}
          </div>
          <button className="bg-purple-700 hover:bg-purple-800 text-white p-2 rounded-md">
            <ShoppingCart className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
