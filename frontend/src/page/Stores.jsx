import { useState, useMemo, useRef, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  Search,
  Filter,
  Star,
  MapPin,
  Package,
  ChevronDown,
  X,
  ArrowRight,
  Users,
  ChevronLeft,
  ChevronRight,
  Check,
} from "lucide-react"
import axios from "axios"

const categories = [
  "fashion",
  "electronics",
  "home",
  "beauty",
  "food",
  "other"
]

// Function to capitalize first letter of each word
const capitalizeCategory = (category) => {
  return category.split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')
}

export default function Stores() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategories, setSelectedCategories] = useState(["All"])
  const [sortBy, setSortBy] = useState("popular")
  const [currentPage, setCurrentPage] = useState(1)
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const [showSortDropdown, setShowSortDropdown] = useState(false)
  const [stores, setStores] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const categoryDropdownRef = useRef(null)
  const sortDropdownRef = useRef(null)
  const itemsPerPage = 6
  const navigate = useNavigate();

  // Fetch stores from Strapi
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await axios.get('http://localhost:1337/api/boutiques?filters[statusBoutique][$eq]=active&populate=*')
        setStores(response.data.data)
        setIsLoading(false)
        console.log(response.data.data)
      } catch (err) {
        console.error('Error fetching stores:', err)
        setError('Failed to fetch stores')
        setIsLoading(false)
      }
    }

    fetchStores()
  }, [])

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setShowCategoryDropdown(false)
      }
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
        setShowSortDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const filteredAndSortedStores = useMemo(() => {
    const filtered = stores.filter((store) => {
      const matchesSearch =
        store.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.description?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategory = selectedCategories.includes("All") || selectedCategories.includes(store.category)

      return matchesSearch && matchesCategory
    })

    // Sort stores
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "popular":
          return b.rating - a.rating
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "products":
          return b.products?.data?.length - a.products?.data?.length
        case "name":
          return a.nom.localeCompare(b.nom)
        default:
          return 0
      }
    })

    return filtered
  }, [searchTerm, selectedCategories, sortBy, stores])

  const totalPages = Math.ceil(filteredAndSortedStores.length / itemsPerPage)
  const paginatedStores = filteredAndSortedStores.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleCategoryChange = (category) => {
    if (category === "All") {
      setSelectedCategories(["All"])
    } else {
      setSelectedCategories((prev) => {
        const isSelected = prev.includes(category)

        if (isSelected) {
          const newCategories = prev.filter((c) => c !== category)
          return newCategories.length === 0 ? ["All"] : newCategories
        } else {
          return [...prev.filter((c) => c !== "All"), category]
        }
      })
    }
    setCurrentPage(1)
  }

  const getSortLabel = (value) => {
    switch (value) {
      case "popular":
        return "Most Popular"
      case "newest":
        return "Newest"
      case "products":
        return "Most Products"
      case "name":
        return "Name A-Z"
      default:
        return "Sort By"
    }
  }

  // Generate star rating display
  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className="h-4 w-4 text-yellow-400" />
          <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          </div>
        </div>,
      )
    }

    const emptyStars = 5 - stars.length
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />)
    }

    return stars
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b pt-16 from-gray-50 to-white">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-purple-700 to-indigo-800 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-8 max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold mb-6 leading-tight">Discover Amazing Stores</h1>
            <p className="text-xl text-purple-100 mb-8">
              Explore our curated collection of verified online stores offering unique products and exceptional service
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search stores, products, or owners..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full pl-12 pr-4 py-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 text-white placeholder-purple-200 shadow-lg"
              />
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="h-16 bg-gradient-to-r from-purple-700 to-indigo-800 relative">
          <svg className="absolute bottom-0 w-full h-16 text-gray-50" preserveAspectRatio="none" viewBox="0 0 1440 74">
            <path fill="currentColor" d="M0,0V74H1440V0C1082.31,72,348.31,72,0,0Z"></path>
          </svg>
        </div>
      </div>

      {/* Filters Section */}
      <div className="container mx-auto px-4 -mt-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-2 text-gray-600">
            <Filter className="h-5 w-5" />
            <span className="font-medium">Filters:</span>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            {/* Category Dropdown */}
            <div className="relative" ref={categoryDropdownRef}>
              <button
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Categories
                <ChevronDown className={`h-4 w-4 transition-transform ${showCategoryDropdown ? "rotate-180" : ""}`} />
              </button>

              {showCategoryDropdown && (
                <div className="absolute z-10 mt-2 w-56 rounded-lg bg-white shadow-lg border border-gray-200 py-2 max-h-64 overflow-y-auto">
                  {categories.map((category) => (
                    <div
                      key={category}
                      onClick={() => handleCategoryChange(category)}
                      className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      <div className="w-5 h-5 mr-3 flex items-center justify-center">
                        {(category === "all"
                          ? selectedCategories.includes("all")
                          : selectedCategories.includes(category)) && <Check className="h-4 w-4 text-purple-600" />}
                      </div>
                      <span>{capitalizeCategory(category)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="relative" ref={sortDropdownRef}>
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {getSortLabel(sortBy)}
                <ChevronDown className={`h-4 w-4 transition-transform ${showSortDropdown ? "rotate-180" : ""}`} />
              </button>

              {showSortDropdown && (
                <div className="absolute z-10 mt-2 w-48 rounded-lg bg-white shadow-lg border border-gray-200 py-2">
                  {[
                    { value: "popular", label: "Most Popular" },
                    { value: "newest", label: "Newest" },
                    { value: "products", label: "Most Products" },
                    { value: "name", label: "Name A-Z" },
                  ].map((option) => (
                    <div
                      key={option.value}
                      onClick={() => {
                        setSortBy(option.value)
                        setShowSortDropdown(false)
                      }}
                      className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      <div className="w-5 h-5 mr-3 flex items-center justify-center">
                        {sortBy === option.value && <Check className="h-4 w-4 text-purple-600" />}
                      </div>
                      <span>{option.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="container mx-auto px-4 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-gray-600">
            Showing {paginatedStores.length} of {filteredAndSortedStores.length} stores
          </p>

          {selectedCategories.length > 0 && !selectedCategories.includes("All") && (
            <div className="flex flex-wrap gap-2">
              {selectedCategories.map((category) => (
                <span
                  key={category}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800"
                >
                  {capitalizeCategory(category)}
                  <button
                    onClick={() => handleCategoryChange(category)}
                    className="ml-1 hover:bg-purple-200 rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stores Grid */}
      <div className="container mx-auto px-4 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginatedStores.map((store) => (
            <div
              key={store.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className="relative">
                <img
                  src={store.banniere?.url ? `http://localhost:1337${store.banniere.url}` : "/placeholder.svg"}
                  alt={`${store.nom} cover`}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-70"></div>

                {store.isNew && (
                  <span className="absolute top-3 left-3 px-3 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
                    New
                  </span>
                )}

                {store.statusBoutique === "active" && (
                  <span className="absolute top-3 right-3 px-3 py-1 bg-purple-600 text-white text-xs font-medium rounded-full flex items-center gap-1">
                    <Check className="h-3 w-3" /> Verified
                  </span>
                )}

                <div className="absolute bottom-0 left-0 w-full p-4 flex items-start gap-3">
                  <img
                    src={store.logo?.url ? `http://localhost:1337${store.logo.url}` : "/placeholder.svg"}
                    alt={`${store.nom} logo`}
                    className="w-16 h-16 rounded-xl border-2 border-white shadow-md"
                  />

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-xl text-white truncate">{store.nom}</h3>
                    <p className="text-sm text-white/80">{store.owner?.username}</p>
                  </div>
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-center gap-1 mb-3">
                  <div className="flex">{renderStars(store.rating || 0)}</div>
                  <span className="text-sm font-medium ml-1">{(store.rating || 0).toFixed(1)}</span>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-2">{store.description}</p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Package className="h-4 w-4" />
                    <span>{store.products?.length || 0} products</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{store.emplacement}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                    {store.category}
                  </span>

                  <button
                   onClick={() => {
                    localStorage.setItem("idOwner", store.owner.id);
                    localStorage.setItem("IDBoutique", store.documentId);
                    
                    navigate(`/view/${store.documentId}`)
                   }}
                    className="inline-flex items-center text-purple-600 font-medium hover:text-purple-800 transition-colors"
                  >
                    Visit Store
                    <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {paginatedStores.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="text-gray-400 mb-4">
              <Users className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No stores found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
            <button
              onClick={() => {
                setSearchTerm("")
                setSelectedCategories(["All"])
                setSortBy("popular")
              }}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-10">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`flex items-center justify-center w-10 h-10 rounded-lg border ${
                currentPage === 1
                  ? "border-gray-200 text-gray-300 cursor-not-allowed"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${
                    currentPage === page ? "bg-purple-600 text-white" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`flex items-center justify-center w-10 h-10 rounded-lg border ${
                currentPage === totalPages
                  ? "border-gray-200 text-gray-300 cursor-not-allowed"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
