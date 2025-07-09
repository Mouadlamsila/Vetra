"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules"
import {
  ShoppingCart,
  Star,
  Heart,
  Share2,
  ChevronRight,
  ArrowRight,
  TrendingUp,
  Clock,
  Award,
  Truck,
  ChevronLeft,
  ArrowLeft,
} from "lucide-react"
import axios from "axios"
import { useTranslation } from "react-i18next"

// Import Swiper styles
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import "swiper/css/effect-fade"

export default function HomeView() {
  const { t } = useTranslation();
  const [isMounted, setIsMounted] = useState(false)
  const [boutique, setBoutique] = useState(null)
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("all")
  const userId = localStorage.getItem("IDUser")
  const id = localStorage.getItem("IDBoutique")
  const idOwner = localStorage.getItem("idOwner");
  const lang = localStorage.getItem('lang');
  
  useEffect(() => {
    setIsMounted(true)
    const fetchData = async () => {
      try {
        // Fetch boutique data
        const boutiqueResponse = await axios.get(`https://useful-champion-e28be6d32c.strapiapp.com/api/boutiques/${id}?filters[owner][id][$eq]=${idOwner}&populate=*`)
        setBoutique(boutiqueResponse.data.data)

        // Fetch products data
        const productsResponse = await axios.get(`https://useful-champion-e28be6d32c.strapiapp.com/api/products?filters[boutique][documentId][$eq]=${boutiqueResponse.data.data.documentId}&populate=*`)
        setProducts(productsResponse.data.data)

        // Fetch categories data
        const categoriesResponse = await axios.get('https://useful-champion-e28be6d32c.strapiapp.com/api/categories?populate=*')
        setCategories(categoriesResponse.data.data)
        
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (!isMounted) {
    return null
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">{t('view.home.loading')}</div>
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{t('view.home.error', { error })}</div>
  }

  if (!boutique) {
    return <div className="min-h-screen flex items-center justify-center">{t('view.home.noBoutiqueFound')}</div>
  }

  // Filter products based on active tab
  const filteredProducts = activeTab === "all" 
    ? products 
    : products.filter(product => product.category?.id === Number.parseInt(activeTab))

  // Get categories that have products
  const categoriesWithProducts = categories.filter(category => 
    products.some(product => product.category?.id === category.id)
  )


  const heroSlides = [
    {
      title: "Summer Collection 2023",
      subtitle: "Discover our latest arrivals with premium quality and design",
      image: boutique.banniere?.url ? `${boutique.banniere.url}` : "/placeholder.svg",
      buttonText: "Shop Now",
    },
  ]

  const features = [
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: t('view.home.features.quality.title'),
      description: t('view.home.features.quality.description'),
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: t('view.home.features.delivery.title'),
      description: t('view.home.features.delivery.description'),
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: t('view.home.features.warranty.title'),
      description: t('view.home.features.warranty.description'),
    },
    {
      icon: <Truck className="h-6 w-6" />,
      title: t('view.home.features.shipping.title'),
      description: t('view.home.features.shipping.description'),
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Swiper */}
      <section className="relative h-[80vh] w-full group">
        <Swiper
          modules={[Navigation, Pagination, Autoplay, EffectFade]}
          effect="fade"
          navigation={{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          }}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop={true}
          className="h-full w-full"
        >
          {heroSlides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className="relative h-full w-full">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${slide.image})`,
                  }}
                >
                  <div className="absolute inset-0 bg-black/40" />
                </div>
                <div className="container mx-auto sm:px-14 px-5 h-full flex items-center relative z-10">
                  <div className="max-w-2xl text-white">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">{slide.title}</h1>
                    <p className="text-lg md:text-xl mb-8 opacity-90">
                      {slide.subtitle}
                    </p>
                    <Link className="group bg-white text-gray-900 w-45 hover:bg-gray-100 py-3 px-6 rounded-md flex items-center font-medium cursor-pointer">
                      <ShoppingCart className={` h-5 w-5 ${lang ==='ar' ? 'ml-2':'mr-2'  } `} />
                      {t('view.home.shopNow')}
                      {lang === 'ar' ? <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" /> :<ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" /> }
                      
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
          
          {/* Custom Navigation Buttons */}
          <div className="swiper-button-prev !w-10 !h-10 !bg-transparent !text-white/60 hover:!text-white !left-4 transition-all duration-300 after:!content-none cursor-pointer">
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
          </div>
          <div className="swiper-button-next !w-10 !h-10 !bg-transparent !text-white/60 hover:!text-white !right-4 transition-all duration-300 after:!content-none cursor-pointer">
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </Swiper>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:px-15 px-2  bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-4 cursor-pointer">
                <div className="bg-purple-100 p-3 rounded-lg text-purple-700">{feature.icon}</div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 sm:px-15 px-2 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{t('view.home.shopByCategory')}</h2>
              <p className="text-gray-600 mt-2">{t('view.home.browseProducts')}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categoriesWithProducts.map((category) => (
              <Link
                to={`/view/categories/${category.documentId}`}
                key={category.id}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-2xl shadow-sm transition-all duration-300 group-hover:shadow-md">
                  <div className="aspect-[4/3] relative">
                    <img
                      src={category.photo?.url ? `${category.photo.url}` : "/placeholder.svg"}
                      alt={category.name}
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-2xl font-bold text-white mb-1">{category.name}</h3>
                    <div className="flex items-center justify-between">
                      <p className="text-white/80 text-sm">
                        {products.filter(p => p.category?.id === category.id).length} {t('view.home.products')}
                      </p>
                      <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full cursor-pointer">
                        {t('view.home.explore')}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 sm:px-15 px-2 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{t('view.home.featuredProducts')}</h2>
              <p className="text-gray-600 mt-2">{t('view.home.handpickedProducts')}</p>
            </div>
            <div className="mt-4 md:mt-0 inline-flex bg-white rounded-lg p-1 border border-[#6D28D9]">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-4 py-2 text-sm rounded-md ${
                  activeTab === "all" ? "bg-[#6D28D9] text-white font-medium cursor-pointer" : "text-gray-600 hover:text-gray-900 cursor-pointer"
                }`}
              >
                {t('view.home.all')}
              </button>
              {categoriesWithProducts.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveTab(category.id.toString())}
                  className={`px-4 py-2 text-sm rounded-md ${
                    activeTab === category.id.toString() ? "bg-[#6D28D9] text-white font-medium cursor-pointer" : "text-gray-600 hover:text-gray-900 cursor-pointer"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="group overflow-hidden border-none shadow-sm hover:shadow-md transition-all duration-300 bg-white rounded-lg cursor-pointer">
                <Link to={`/view/products/${product.documentId}`} className="block">
                  <div className="relative">
                    <div className="aspect-square overflow-hidden">
                      <img 
                        src={product.imgMain?.url ? `${product.imgMain.url}` : "/placeholder.svg"} 
                        alt={product.name} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    {product.stock <= 10 && (
                      <div className="absolute bottom-3 left-3 right-3 bg-black/70 text-white text-xs text-center py-1 rounded-full backdrop-blur-sm cursor-pointer">
                        {product.stock <= 5 ? t('view.home.onlyLeft', { count: product.stock }) : t('view.home.lowStock')}
                      </div>
                    )}
                  </div>
                </Link>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium line-clamp-1">{product.name}</h3>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full cursor-pointer">
                      {product.category ? categories.find(cat => cat.id === product.category.id)?.name : t('view.category.uncategorized')}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-purple-700">${product.prix}</span>
                      {product.comparePrice && (
                        <span className="text-sm text-gray-500 line-through">${product.comparePrice}</span>
                      )}
                    </div>
                    <button className="bg-purple-700 hover:bg-purple-800 text-white p-2 rounded-md cursor-pointer">
                      <ShoppingCart className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
