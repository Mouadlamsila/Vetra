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
  MessageSquare,
  ArrowLeft,
} from "lucide-react"
import axios from "axios"
import { toast } from "react-toastify"
import RatingForm from "../components/RatingForm"
import { useTranslation } from "react-i18next"

// Categories will be fetched from API


export default function Stores() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategories, setSelectedCategories] = useState(["All"])
  const [categories, setCategories] = useState([])
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
  const [userRating, setUserRating] = useState(0)
  const [isRating, setIsRating] = useState(false)
  const [showRatingModal, setShowRatingModal] = useState(false)
  const [selectedStore, setSelectedStore] = useState(null)
  const lang = localStorage.getItem('lang');

  // Fetch stores from Strapi
  useEffect(() => {
    const fetchStores = async () => {
      try {
        // Fetch stores with ratings
        const ratingResponse = await axios.get('https://useful-champion-e28be6d32c.strapiapp.com/api/boutiques?filters[statusBoutique][$eq]=active&populate[rating_boutiques][populate]=user');
        
        // Fetch complete store data
        const completeResponse = await axios.get('https://useful-champion-e28be6d32c.strapiapp.com/api/boutiques?filters[statusBoutique][$eq]=active&populate=*');
        
        // Merge the data
        const mergedStores = completeResponse.data.data.map(store => {
          const ratingStore = ratingResponse.data.data.find(ratingStore => ratingStore.id === store.id);
          return {
            ...store,
            rating_boutiques: ratingStore?.rating_boutiques || []
          };
        });

        setStores(mergedStores);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching stores:', err);
        setError('Failed to fetch stores');
        setIsLoading(false);
      }
    };

    fetchStores();
  }, []);

  // Fetch categories from Strapi and translate
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('https://useful-champion-e28be6d32c.strapiapp.com/api/categories');
        const rawCategories = res.data.data.map(cat => cat?.name || cat.name || '');
        // Ensure cache exists
        let cachedTranslations = {};
        try {
          cachedTranslations = JSON.parse(localStorage.getItem('categoryTranslations')) || {};
        } catch (e) {
          cachedTranslations = {};
        }
        const categoriesWithTranslations = await Promise.all(
          rawCategories.map(async (name) => {
            if (!name) return { name, ar: name, fr: name };
            // If already cached, use it
            if (cachedTranslations[name]) {
              return { name, ...cachedTranslations[name] };
            }
            // Otherwise, fetch translations from Lingva Translate
            const [ar, fr] = await Promise.all([
              fetch(`https://lingva.ml/api/v1/en/ar/${encodeURIComponent(name)}`)
                .then(res => res.json())
                .then(data => {
                  console.log('AR translation:', data);
                  return data.translation && data.translation !== name ? data.translation : '';
                })
                .catch((e) => {
                  console.error('AR translation error:', e);
                  return '';
                }),
              fetch(`https://lingva.ml/api/v1/en/fr/${encodeURIComponent(name)}`)
                .then(res => res.json())
                .then(data => {
                  console.log('FR translation:', data);
                  return data.translation && data.translation !== name ? data.translation : '';
                })
                .catch((e) => {
                  console.error('FR translation error:', e);
                  return '';
                }),
            ]);
            // Cache for future use
            cachedTranslations[name] = { ar: ar || name, fr: fr || name };
            return { name, ar: ar || name, fr: fr || name };
          })
        );
        // Save to localStorage
        localStorage.setItem('categoryTranslations', JSON.stringify(cachedTranslations));
        setCategories(categoriesWithTranslations);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

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

  const handleCategoryChange = (categoryName) => {
    if (categoryName === "All") {
      setSelectedCategories(["All"])
    } else {
      setSelectedCategories((prev) => {
        const isSelected = prev.includes(categoryName)
        const newCategories = prev.filter((c) => c !== "All")

        if (isSelected) {
          const filtered = newCategories.filter((c) => c !== categoryName)
          return filtered.length === 0 ? ["All"] : filtered
        } else {
          return [...newCategories, categoryName]
        }
      })
    }
    setCurrentPage(1)
  }

  const getSortLabel = (value) => {
    return t(`stores.sortOptions.${value}`)
  }

  const handleRating = async (storeId, rating, opinion) => {
    try {
      const userId = localStorage.getItem('IDUser')
      
      if (!userId) {
        toast.error(t('stores.ratings.loginToReview'))
        return
      }

      // Check if user has already rated this store
      const existingRating = selectedStore.rating_boutiques?.find(
        (rating) => rating.user?.id === parseInt(userId)
      )
      let response
      if (existingRating) {
        // Update existing rating
        response = await axios.put(`https://useful-champion-e28be6d32c.strapiapp.com/api/rating-boutiques/${existingRating.documentId}`, {
          data: {
            stars: parseInt(rating),
            opinion: opinion,
            user: parseInt(userId),
            boutique: storeId
          }
        })
      } else {
        // Create new rating
        response = await axios.post('https://useful-champion-e28be6d32c.strapiapp.com/api/rating-boutiques', {
          data: {
            stars: parseInt(rating),
            opinion: opinion,
            user: parseInt(userId),
            boutique: storeId
          }
        })
      }
      
      // Update the store's rating in the local state
      setStores(prevStores => 
        prevStores.map(store => 
          store.id === storeId 
            ? { 
                ...store, 
                rating_boutiques: existingRating
                  ? store.rating_boutiques.map(r => 
                      r.id === existingRating.id ? response.data.data : r
                    )
                  : [...(store.rating_boutiques || []), response.data.data]
              }
            : store
        )
      )
      
      toast.success(existingRating ? t('stores.ratings.reviewUpdateSuccess') : t('stores.ratings.reviewSuccess'))
      window.location.reload();
    } catch (error) {
      console.error('Error submitting rating:', error)
      toast.error(t('stores.ratings.reviewError'))
    }
  }

  const openRatingModal = (store) => {
    const userId = localStorage.getItem('IDUser')
    const existingRating = store.rating_boutiques?.find(
      rating => rating.user?.id === parseInt(userId)
    )

    setSelectedStore(store)
    setShowRatingModal(true)
  }

  const RatingStars = ({ storeId, rating_boutiques, isInteractive = false, onStarClick }) => {
    const [hoveredRating, setHoveredRating] = useState(0)

    const averageRating = useMemo(() => {
      if (!rating_boutiques || rating_boutiques.length === 0) return 0
      const sum = rating_boutiques.reduce((acc, curr) => acc + curr.stars, 0)
      return sum / rating_boutiques.length
    }, [rating_boutiques])

    const handleStarClick = (rating) => {
      if (isInteractive && onStarClick) {
        onStarClick(rating)
      }
    }

    return (
      <div className="inline-block">
        {[1, 2, 3, 4, 5].map((rating) => (
          <div key={rating} className="inline-block">
            <input
              type="radio"
              id={`star${rating}-${storeId}`}
              name={`rating-${storeId}`}
              value={rating}
              className="hidden"
              checked={isInteractive ? ratingForm.stars === rating : averageRating >= rating}
              onChange={() => handleStarClick(rating)}
              disabled={!isInteractive || isRating}
            />
            <label
              htmlFor={`star${rating}-${storeId}`}
              className={`float-right cursor-pointer text-2xl transition-colors duration-300 ${
                isInteractive 
                  ? (hoveredRating >= rating || ratingForm.stars >= rating ? 'text-purple-600' : 'text-gray-300')
                  : (averageRating >= rating ? 'text-purple-600' : 'text-gray-300')
              }`}
              onMouseEnter={() => isInteractive ? setHoveredRating(rating) : null}
              onMouseLeave={() => isInteractive ? setHoveredRating(0) : null}
              onClick={() => handleStarClick(rating)}
            >
              ★
            </label>
          </div>
        ))}
      </div>
    )
  }
  
  const filteredAndSortedStores = useMemo(() => {
    const filtered = stores.filter((store) => {
      // Search term filtering
      const searchLower = searchTerm.toLowerCase()
      const matchesSearch = 
        store.nom?.toLowerCase().includes(searchLower) ||
        store.description?.toLowerCase().includes(searchLower) ||
        store.owner?.username?.toLowerCase().includes(searchLower)

      // Category filtering
      const storeCategory = store?.category?.name?.toLowerCase()
      const matchesCategory = 
        selectedCategories.includes("All") || 
        selectedCategories.some(cat => cat.toLowerCase() === storeCategory)

      return matchesSearch && matchesCategory
    })

    // Sort stores
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "popular":
          const aRating = a.rating_boutiques?.length || 0
          const bRating = b.rating_boutiques?.length || 0
          return bRating - aRating
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "products":
          const aProducts = a.products?.data?.length || 0
          const bProducts = b.products?.data?.length || 0
          return bProducts - aProducts
        case "name":
          return (a.nom || "").localeCompare(b.nom || "")
        default:
          return 0
      }
    })
  }, [searchTerm, selectedCategories, sortBy, stores])

  const totalPages = Math.ceil(filteredAndSortedStores.length / itemsPerPage)
  const paginatedStores = filteredAndSortedStores.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

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
            <h1 className="text-5xl font-bold mb-6 leading-tight">{t('stores.discoverStores')}</h1>
            <p className="text-xl text-purple-100 mb-8">
              {t('stores.exploreStores')}
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder={t('stores.searchPlaceholder')}
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
      <div className="container mx-auto px-4 mb-8">
        <div className="bg-white h-full rounded-xl shadow-lg sm:pr-20 p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex h-full items-center gap-2 text-gray-600">
            <Filter className="h-5 w-5" />
            <span className="font-medium">{t('stores.filters')}:</span>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            {/* Category Dropdown */}
            <div className="relative" ref={categoryDropdownRef}>
              <button
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {t('stores.categories')}
                <ChevronDown className={`h-4 w-4 transition-transform ${showCategoryDropdown ? "rotate-180" : ""}`} />
              </button>

              {showCategoryDropdown && (
                <div className="absolute z-10 mt-2 w-56 rounded-lg bg-white shadow-lg border border-gray-200 py-2 max-h-64 overflow-y-auto">
                  <div
                    onClick={() => handleCategoryChange("All")}
                    className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <div className={`w-5 h-5 ${lang === 'ar' ? 'ml-3' : 'mr3' }  flex items-center justify-center`}>
                      {selectedCategories.includes("All") && <Check className="h-4 w-4 text-purple-600" />}
                    </div>
                    <span>{t('stores.allCategories')}</span>
                  </div>
                  {categories.map((categoryObj) => (
                    <div
                      key={categoryObj.name}
                      onClick={() => handleCategoryChange(categoryObj.name)}
                      className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      <div className={`w-5 h-5 ${lang === 'ar' ? 'ml-3' : 'mr3' }  flex items-center justify-center`}>
                        {selectedCategories.includes(categoryObj.name) && <Check className="h-4 w-4 text-purple-600" />}
                      </div>
                      <span>{categoryObj[lang] || categoryObj.name}</span>
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
                {t('stores.sortBy')}
                <ChevronDown className={`h-4 w-4 transition-transform ${showSortDropdown ? "rotate-180" : ""}`} />
              </button>

              {showSortDropdown && (
                <div className="absolute  z-10 mt-2 w-48 rounded-lg bg-white shadow-lg border border-gray-200 py-2">
                  {[
                    { value: "popular", label: t('stores.sortOptions.popular') },
                    { value: "newest", label: t('stores.sortOptions.newest') },
                    { value: "products", label: t('stores.sortOptions.products') },
                    { value: "name", label: t('stores.sortOptions.name') },
                  ].map((option) => (
                    <div
                      key={option.value}
                      onClick={() => {
                        setSortBy(option.value)
                        setShowSortDropdown(false)
                      }}
                      className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      <div className={`w-5 h-5 ${lang === 'ar' ? 'ml-3' : 'mr3' }  flex items-center justify-center`}>
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
            {t('stores.showing')} {paginatedStores.length} {t('stores.of')} {filteredAndSortedStores.length} {t('stores.stores')}
          </p>

          {selectedCategories.length > 0 && !selectedCategories.includes("All") && (
            <div className="flex flex-wrap gap-2">
              {selectedCategories.map((categoryName) => {
                const categoryObj = categories.find(c => c.name === categoryName);
                return (
                  <span
                    key={categoryName}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800"
                  >
                    {categoryObj ? (categoryObj[lang] || categoryObj.name) : categoryName}
                    <button
                      onClick={() => handleCategoryChange(categoryName)}
                      className="ml-1 hover:bg-purple-200 rounded-full w-5 h-5 flex items-center justify-center"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                );
              })}
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
                  src={store.banniere?.url ? `${store.banniere.url}` : "/placeholder.svg"}
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
                    <Check className="h-3 w-3" /> {t('stores.verified')}
                  </span>
                )}

                <div className="absolute bottom-0 left-0 w-full p-4 flex items-start gap-3">
                  <img
                    src={store.logo?.url ? `${store.logo.url}` : "/placeholder.svg"}
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
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <RatingStars 
                      storeId={store.id} 
                      rating_boutiques={store.rating_boutiques}
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {store.rating_boutiques && store.rating_boutiques.length > 0
                          ? (store.rating_boutiques.reduce((acc, curr) => acc + curr.stars, 0) / store.rating_boutiques.length).toFixed(1)
                          : '0.0'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {t('stores.ratings.ratingCount', {
                          count: store.rating_boutiques?.length || 0,
                          type: store.rating_boutiques?.length === 1 ? t('stores.ratings.singleRating') : t('stores.ratings.multipleRatings')
                        })}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => openRatingModal(store)}
                    className="flex items-center gap-1 text-purple-600 hover:text-purple-800 cursor-pointer"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span className="text-sm">{t('stores.rateStore')}</span>
                  </button>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-2">{store.description}</p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Package className="h-4 w-4" />
                    <span>{store.products?.length || 0} {t('stores.products')}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{store.emplacement}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                    {(() => {
                      const categoryObj = categories.find(c => c.name === store.category?.name);
                      return categoryObj ? (categoryObj[lang] || categoryObj.name) : store.category?.name;
                    })()}
                  </span>

                  <button
                   onClick={() => {
                    localStorage.setItem("idOwner", store?.owner?.id);
                    localStorage.setItem("IDBoutique", store.documentId);
                    
                    navigate(`/view/${store.documentId}`)
                   }}
                    className="inline-flex items-center text-purple-600 font-medium hover:text-purple-800 transition-colors cursor-pointer"
                  >
                    {t('stores.visitStore')}
                    {lang === 'ar' ? <ArrowLeft className="mr-1 h-4 w-4 group-hover:-translate-x-1 transition-transform" /> :  <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" /> }
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
            <h3 className="text-xl font-medium text-gray-900 mb-2">{t('stores.noStoresFound')}</h3>
            <p className="text-gray-600 mb-6">{t('stores.tryAdjusting')}</p>
            <button
              onClick={() => {
                setSearchTerm("")
                setSelectedCategories(["All"])
                setSortBy("popular")
              }}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              {t('stores.resetFilters')}
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

      {/* Replace the old RatingModal with the new component */}
      <RatingForm
        showModal={showRatingModal}
        onClose={() => {
          setShowRatingModal(false)
          setSelectedStore(null)
        }}
        selectedStore={selectedStore}
        onRatingSubmit={handleRating}
        existingRating={selectedStore?.rating_boutiques?.find(
          rating => rating.user?.id === parseInt(localStorage.getItem('IDUser'))
        )}
      />
    </div>
  )
}
