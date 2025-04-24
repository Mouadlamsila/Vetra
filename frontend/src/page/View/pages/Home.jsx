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
} from "lucide-react"

// Import Swiper styles
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import "swiper/css/effect-fade"

export default function HomeView() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const heroSlides = [
    {
      title: "Summer Collection 2023",
      subtitle: "Discover our latest arrivals with premium quality and design",
      image:
        "https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      buttonText: "Shop Now",
    },
    {
      title: "Special Offers",
      subtitle: "Up to 50% off on selected items. Limited time offer!",
      image: "https://cdn.pixabay.com/photo/2020/09/23/20/27/headphones-5596987_1280.jpg",
      buttonText: "View Deals",
    },
    {
      title: "New Arrivals",
      subtitle: "Check out our newest products with cutting-edge technology",
      image: "https://cdn.pixabay.com/photo/2022/03/02/09/33/purse-7042725_1280.jpg",
      buttonText: "Explore",
    },
  ]

  const featuredProducts = [
    {
      id: 1,
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
      id: 2,
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
      id: 3,
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
      id: 4,
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
  ]

  const categories = [
    {
      name: "Electronics",
      image:
        "https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      count: 120,
      featured: true,
    },
    {
      name: "Fashion",
      image:
        "https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      count: 85,
      featured: true,
    },
    {
      name: "Home & Living",
      image:
        "https://images.unsplash.com/photo-1484101403633-562f891dc89a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      count: 65,
      featured: true,
    },
    {
      name: "Sports & Outdoors",
      image:
        "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      count: 48,
      featured: false,
    },
    {
      name: "Beauty & Health",
      image:
        "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      count: 72,
      featured: false,
    },
  ]

  const collections = [
    {
      name: "Summer Essentials",
      description: "Stay cool with our summer collection",
      image:
        "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      items: 24,
    },
    {
      name: "Work From Home",
      description: "Boost your productivity with the right gear",
      image:
        "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      items: 18,
    },
  ]

  const features = [
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Premium Quality",
      description: "All products are carefully selected for quality and durability",
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Fast Delivery",
      description: "Get your products delivered within 24-48 hours",
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Warranty",
      description: "All products come with a minimum 1-year warranty",
    },
    {
      icon: <Truck className="h-6 w-6" />,
      title: "Free Shipping",
      description: "Free shipping on orders over $50",
    },
  ]

  const [activeTab, setActiveTab] = useState("all")

  if (!isMounted) {
    return null
  }

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
                <div className="container mx-auto px-14 h-full flex items-center relative z-10">
                  <div className="max-w-2xl text-white">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">{slide.title}</h1>
                    <p className="text-lg md:text-xl mb-8 opacity-90">
                      {slide.subtitle}
                    </p>
                    <button className="group bg-white text-gray-900 hover:bg-gray-100 py-3 px-6 rounded-md flex items-center font-medium">
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      {slide.buttonText}
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
          
          {/* Custom Navigation Buttons */}
          <div className="swiper-button-prev !w-10 !h-10 !bg-transparent !text-white/60 hover:!text-white !left-4 transition-all duration-300 after:!content-none">
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
          </div>
          <div className="swiper-button-next !w-10 !h-10 !bg-transparent !text-white/60 hover:!text-white !right-4 transition-all duration-300 after:!content-none">
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </Swiper>
      </section>

      {/* Features Section */}
      <section className="py-12 px-15 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-4">
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
      <section className="py-16 px-15 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Shop by Category</h2>
              <p className="text-gray-600 mt-2">Browse our wide selection of products</p>
            </div>
            <Link
              to="/view/categories/1"
              className="mt-4 md:mt-0 inline-flex items-center text-purple-700 hover:text-purple-800 font-medium"
            >
              View all categories <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories
              .filter((cat) => cat.featured)
              .map((category, index) => (
                <Link
                  to={`/view/categories/${category.name.toLowerCase().replace(/\s+/g, "-")}`}
                  key={index}
                  className="group"
                >
                  <div className="relative overflow-hidden rounded-2xl shadow-sm transition-all duration-300 group-hover:shadow-md">
                    <div className="aspect-[4/3] relative">
                      <img
                        src={category.image || "/placeholder.svg"}
                        alt={category.name}
                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-2xl font-bold text-white mb-1">{category.name}</h3>
                      <div className="flex items-center justify-between">
                        <p className="text-white/80 text-sm">{category.count} products</p>
                        <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
                          Explore
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* Collections Section with Swiper */}
      <section className="py-16 px-15 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Featured Collections</h2>
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            spaceBetween={30}
            breakpoints={{
              640: {
                slidesPerView: 1,
              },
              768: {
                slidesPerView: 2,
              },
            }}
            className="collections-swiper"
          >
            {collections.map((collection, index) => (
              <SwiperSlide key={index}>
                <Link to={`/collections/${collection.name.toLowerCase().replace(/\s+/g, "-")}`} className="group block">
                  <div className="relative overflow-hidden rounded-2xl shadow-sm h-[300px]">
                    <img
                      src={collection.image || "/placeholder.svg"}
                      alt={collection.name}
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-8 max-w-[80%]">
                      <h3 className="text-2xl font-bold text-white mb-2">{collection.name}</h3>
                      <p className="text-white/80 mb-4">{collection.description}</p>
                      <div className="inline-flex items-center bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm">
                        View {collection.items} items <ArrowRight className="ml-2 h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* Featured Products with Swiper */}
      <section className="py-16 px-15 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
              <p className="text-gray-600 mt-2">Handpicked products for you</p>
            </div>
            <div className="mt-4 md:mt-0 inline-flex bg-white rounded-lg p-1 border">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-4 py-2 text-sm rounded-md ${
                  activeTab === "all" ? "bg-gray-100 font-medium" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveTab("new")}
                className={`px-4 py-2 text-sm rounded-md ${
                  activeTab === "new" ? "bg-gray-100 font-medium" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                New Arrivals
              </button>
              <button
                onClick={() => setActiveTab("bestsellers")}
                className={`px-4 py-2 text-sm rounded-md ${
                  activeTab === "bestsellers" ? "bg-gray-100 font-medium" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Bestsellers
              </button>
            </div>
          </div>

          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true, dynamicBullets: true }}
            spaceBetween={20}
            breakpoints={{
              640: {
                slidesPerView: 1,
              },
              768: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
              1280: {
                slidesPerView: 4,
              },
            }}
            className="products-swiper"
          >
            {featuredProducts.map((product) => (
              <SwiperSlide key={product.id}>
                <div className="group overflow-hidden border-none shadow-sm hover:shadow-md transition-all duration-300 bg-white rounded-lg h-full">
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
                          product.badge === "Sale"
                            ? "bg-red-500"
                            : product.badge === "New"
                              ? "bg-green-500"
                              : "bg-purple-700"
                        }`}
                      >
                        {product.badge}
                      </span>
                    )}
                    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button className="rounded-full h-9 w-9 flex items-center justify-center bg-white/80 backdrop-blur-sm hover:bg-white">
                        <Heart className="h-4 w-4 text-gray-700" />
                      </button>
                      <button className="rounded-full h-9 w-9 flex items-center justify-center bg-white/80 backdrop-blur-sm hover:bg-white">
                        <Share2 className="h-4 w-4 text-gray-700" />
                      </button>
                    </div>
                    {product.stock <= 10 && (
                      <div className="absolute bottom-3 left-3 right-3 bg-black/70 text-white text-xs text-center py-1 rounded-full backdrop-blur-sm">
                        {product.stock <= 5 ? "Only " + product.stock + " left in stock!" : "Low stock"}
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium line-clamp-1">{product.name}</h3>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                        {product.category}
                      </span>
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
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-purple-700">${product.price}</span>
                      {product.oldPrice && (
                        <span className="text-sm text-gray-500 line-through">${product.oldPrice}</span>
                      )}
                    </div>
                  </div>
                  <div className="p-4 pt-0">
                    <button className="w-full bg-purple-700 hover:bg-purple-800 text-white py-2 px-4 rounded-md flex items-center justify-center">
                      <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="mt-12 text-center">
            <button className="border border-purple-200 text-purple-700 hover:bg-purple-50 py-3 px-6 rounded-md font-medium inline-flex items-center">
              View All Products <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-purple-700 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Join Our Newsletter</h2>
            <p className="text-purple-100 mb-8">
              Subscribe to our newsletter and get 10% off your first purchase plus updates on new arrivals and special
              offers.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-3 bg-white rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
              <button className="bg-white text-purple-700 hover:bg-gray-100 py-3 px-6 rounded-lg font-medium">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
