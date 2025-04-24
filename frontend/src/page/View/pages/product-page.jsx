"use client"

import { useState } from "react"
import {Link} from "react-router-dom"
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Heart,
  Minus,
  Plus,
  Share2,
  ShoppingCart,
  Star,
  Truck,
  Clock,
} from "lucide-react"

// Mock product data - in a real app this would come from an API
const product = {
  id: "1",
  name: "Premium Wireless Headphones",
  price: 299.99,
  oldPrice: 349.99,
  description:
    "Experience crystal-clear sound with our premium wireless headphones. Featuring active noise cancellation, 40-hour battery life, and ultra-comfortable ear cushions for extended listening sessions.",
  rating: 4.8,
  reviews: 124,
  stock: 15,
  sku: "HDP-100-BLK",
  category: "Electronics",
  tags: ["Wireless", "Headphones", "Bluetooth", "Noise Cancellation"],
  badge: "New",
  images: [
    "https://images.unsplash.com/photo-1505740420928-5e040d5bfb6f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1546435770-a3e426bf472b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
  ],
  colors: [
    { name: "Black", value: "#000000" },
    { name: "Silver", value: "#C0C0C0" },
    { name: "Navy Blue", value: "#000080" },
  ],
  features: [
    "Active Noise Cancellation",
    "40-hour Battery Life",
    "Bluetooth 5.2",
    "Built-in Microphone",
    "Touch Controls",
    "Voice Assistant Compatible",
  ],
  specifications: {
    Dimensions: "7.8 x 6.1 x 3.1 inches",
    Weight: "250g",
    Connectivity: "Bluetooth 5.2, 3.5mm jack",
    Battery: "Lithium-ion, 40 hours",
    Charging: "USB-C, Fast Charging",
    "Frequency Response": "20Hz - 20kHz",
  },
  shipping: {
    Delivery: "Free shipping on orders over $50",
    "Estimated Delivery": "2-4 business days",
    Returns: "30-day return policy",
  },
}

// Related products
const relatedProducts = [
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
]

export default function ProductPage() {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState("features")

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-15 py-3">
          <div className="flex items-center text-sm text-gray-500">
            <Link to="/view/1" className="hover:text-purple-700">
              Accueil
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <Link to="/view/categories/electronics" className="hover:text-purple-700">
              Électronique
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            
            <Link to="/view/categories/electronics/headphones" className="hover:text-purple-700">
              Casques
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-gray-900 font-medium truncate">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="container mx-auto px-15 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-2xl border bg-white">
              <img
                src={product.images[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                className="object-contain p-4 w-full h-full"
              />
              {product.badge && (
                <span
                  className={`absolute top-4 left-4 px-2 py-1 text-xs font-medium text-white rounded-full ${
                    product.badge === "Sale" ? "bg-red-500" : product.badge === "New" ? "bg-green-500" : "bg-purple-700"
                  }`}
                >
                  {product.badge}
                </span>
              )}
            </div>
            <div className="flex gap-4 overflow-auto pb-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  className={`relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border bg-white ${
                    selectedImage === index ? "ring-2 ring-purple-700" : ""
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} - Image ${index + 1}`}
                    className="object-contain p-2 w-full h-full"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <span className="inline-block px-2.5 py-0.5 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                  {product.category}
                </span>
                <div className="flex items-center gap-2">
                  <button className="rounded-full h-9 w-9 flex items-center justify-center border border-gray-300 hover:bg-gray-50">
                    <Heart className="h-4 w-4" />
                  </button>
                  <button className="rounded-full h-9 w-9 flex items-center justify-center border border-gray-300 hover:bg-gray-50">
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <h1 className="mt-4 text-3xl font-bold text-gray-900">{product.name}</h1>

              <div className="mt-2 flex items-center gap-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating) ? "fill-current text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {product.rating} ({product.reviews} avis)
                </span>
                <span className="text-sm text-gray-400">|</span>
                <span className="text-sm text-gray-600">SKU: {product.sku}</span>
              </div>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-purple-700">${product.price}</span>
              {product.oldPrice && <span className="text-lg text-gray-500 line-through">${product.oldPrice}</span>}
              {product.oldPrice && (
                <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded">
                  Économisez ${(product.oldPrice - product.price).toFixed(2)}
                </span>
              )}
            </div>

            <p className="text-gray-600">{product.description}</p>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Couleur</h3>
                <div className="flex gap-3">
                  {product.colors.map((color, index) => (
                    <button
                      key={index}
                      className={`relative h-10 w-10 rounded-full border-2 ${
                        selectedColor === index ? "border-purple-700" : "border-transparent"
                      }`}
                      style={{ backgroundColor: color.value }}
                      onClick={() => setSelectedColor(index)}
                      title={color.name}
                    >
                      {selectedColor === index && (
                        <span className="absolute inset-0 flex items-center justify-center">
                          <Check className="h-5 w-5 text-white" />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Sélectionné: <span className="font-medium">{product.colors[selectedColor].name}</span>
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Quantité</h3>
                <div className="flex items-center">
                  <button
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    className={`h-10 w-10 rounded-l-md border border-gray-300 flex items-center justify-center ${
                      quantity <= 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"
                    }`}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <div className="flex h-10 w-16 items-center justify-center border-y border-gray-200 text-center">
                    {quantity}
                  </div>
                  <button
                    onClick={incrementQuantity}
                    disabled={quantity >= product.stock}
                    className={`h-10 w-10 rounded-r-md border border-gray-300 flex items-center justify-center ${
                      quantity >= product.stock ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"
                    }`}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  {product.stock > 10
                    ? "En stock"
                    : product.stock > 0
                      ? `Seulement ${product.stock} en stock`
                      : "Rupture de stock"}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button className="flex-1 bg-purple-700 hover:bg-purple-800 text-white py-3 px-4 rounded-md flex items-center justify-center">
                <ShoppingCart className="mr-2 h-5 w-5" /> Ajouter au panier
              </button>
              <button className="flex-1 border border-purple-200 text-purple-700 hover:bg-purple-50 py-3 px-4 rounded-md">
                Acheter maintenant
              </button>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-purple-100 p-2 text-purple-700">
                  <Truck className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Livraison gratuite</p>
                  <p className="text-sm text-gray-500">Pour les commandes de plus de $50</p>
                </div>
              </div>
              <hr className="my-3" />
              <p className="text-sm text-gray-600">
                <span className="font-medium">Livraison estimée:</span> 2-4 jours ouvrables
              </p>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <div className="border-b">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab("features")}
                className={`py-3 border-b-2 font-medium ${
                  activeTab === "features"
                    ? "border-purple-700 text-purple-700"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                Caractéristiques
              </button>
              <button
                onClick={() => setActiveTab("specifications")}
                className={`py-3 border-b-2 font-medium ${
                  activeTab === "specifications"
                    ? "border-purple-700 text-purple-700"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                Spécifications
              </button>
              <button
                onClick={() => setActiveTab("shipping")}
                className={`py-3 border-b-2 font-medium ${
                  activeTab === "shipping"
                    ? "border-purple-700 text-purple-700"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                Livraison & Retours
              </button>
            </div>
          </div>

          {activeTab === "features" && (
            <div className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-6 border">
                  <h3 className="text-lg font-semibold mb-4">Caractéristiques principales</h3>
                  <ul className="space-y-3">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white rounded-lg p-6 border">
                  <h3 className="text-lg font-semibold mb-4">Description du produit</h3>
                  <p className="text-gray-600">
                    Découvrez une qualité sonore exceptionnelle avec nos casques sans fil premium. Dotés d'une
                    technologie de pointe, ils offrent une expérience d'écoute immersive pour tous vos contenus audio
                    préférés.
                  </p>
                  <p className="text-gray-600 mt-4">
                    La technologie de réduction active du bruit vous permet de vous immerger complètement dans votre
                    musique, tandis que les coussinets d'oreille ultra-confortables assurent un confort optimal même
                    pendant les longues sessions d'écoute.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "specifications" && (
            <div className="pt-6">
              <div className="bg-white rounded-lg p-6 border">
                <h3 className="text-lg font-semibold mb-4">Spécifications techniques</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="border-b pb-3">
                      <p className="text-sm text-gray-500">{key}</p>
                      <p className="font-medium">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "shipping" && (
            <div className="pt-6">
              <div className="bg-white rounded-lg p-6 border">
                <h3 className="text-lg font-semibold mb-4">Informations de livraison</h3>
                <div className="space-y-4">
                  {Object.entries(product.shipping).map(([key, value]) => (
                    <div key={key} className="flex items-start">
                      <div className="mr-3 rounded-full bg-purple-100 p-1.5 text-purple-700">
                        {key === "Delivery" ? (
                          <Truck className="h-4 w-4" />
                        ) : key === "Estimated Delivery" ? (
                          <Clock className="h-4 w-4" />
                        ) : (
                          <ArrowLeft className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">
                          {key === "Delivery"
                            ? "Livraison"
                            : key === "Estimated Delivery"
                              ? "Délai estimé"
                              : "Politique de retour"}
                        </p>
                        <p className="text-sm text-gray-600">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8">Produits similaires</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {relatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ProductCard({ product }) {
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
