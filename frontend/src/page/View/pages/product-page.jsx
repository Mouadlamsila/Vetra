"use client"

import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
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
import axios from "axios"

export default function ProductPage() {
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState("features")
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [categoryProduct, setCategoryProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [cartMessage, setCartMessage] = useState("")
  const [cartItems, setCartItems] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:1337/api/products/${id}?populate=*`)
        setProduct(response.data.data)
        setCategoryProduct(response.data.data.category?.id)
        setLoading(false)
      } catch (err) {
        console.error(err)
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (categoryProduct) {
        try {
          const response = await axios.get(
            `http://localhost:1337/api/products?filters[category][id][$eq]=${categoryProduct}&populate=*`
          )
          const filteredProducts = response.data.data
            .filter(item => item.documentId !== id)
            .slice(0, 4)
          setRelatedProducts(filteredProducts)
        } catch (err) {
          console.error(err)
        }
      }
    }

    fetchRelatedProducts()
  }, [categoryProduct, id])

  // Fetch cart items to check stock
  useEffect(() => {
    const fetchCartItems = async () => {
      const userId = localStorage.getItem("IDUser")
      if (!userId) return;
      
      try {
        const response = await axios.get(`http://localhost:1337/api/carts?filters[user][id][$eq]=${userId}&populate[product][populate]=*`);
        setCartItems(response.data.data);
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };

    fetchCartItems();
  }, []);

  // Calculate available stock considering items in cart
  const getAvailableStock = () => {
    if (!product?.stock) return 0;
    const cartQuantity = cartItems
      .filter(item => item.product?.documentId === product.documentId)
      .reduce((sum, item) => sum + item.qte, 0);
    return product.stock - cartQuantity;
  };

  const handleAddToCart = async () => {
    const userId = localStorage.getItem("IDUser")
    if (!userId) {
      setCartMessage("Veuillez vous connecter pour ajouter au panier")
      return
    }

    const availableStock = getAvailableStock();
    if (quantity > availableStock) {
      setCartMessage(`Désolé, il ne reste que ${availableStock} unités en stock`)
      return
    }

    setIsAddingToCart(true)
    setCartMessage("")

    try {
      const response = await axios.post('http://localhost:1337/api/carts', {
        data: {
          user: userId,
          product: id,
          qte: quantity
        }
      })

      if (response.data) {
        // Update cart items immediately
        const newCartItem = {
          ...response.data.data,
          product: product
        };
        setCartItems(prevItems => [...prevItems, newCartItem]);
        setCartMessage("Produit ajouté au panier avec succès!")
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      setCartMessage("Erreur lors de l'ajout au panier")
    } finally {
      setIsAddingToCart(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  if (!product) {
    return <div className="flex justify-center items-center min-h-screen">Product not found</div>
  }

  const incrementQuantity = () => {
    const availableStock = getAvailableStock();
    if (quantity < availableStock) {
      setQuantity(quantity + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  // Get all images including main image and additional images
  const allImages = [
    product.imgMain?.url,
    ...(product.imgsAdditional?.map(img => img.url) || [])
  ].filter(Boolean)

  return (
    <div className="bg-white min-h-screen pb-16">
      {/* Breadcrumb */}
      <div className="bg-white border-gray-200 border-b">
        <div className="container mx-auto px-4 sm:px-15 py-3">
          <div className="flex items-center text-sm text-gray-500">
            <Link to="/view/1" className="hover:text-purple-700">
              Accueil
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <Link to={`/view/categories/${product.category?.documentId}`} className="hover:text-purple-700">
              {product.category?.name || 'Non catégorisé'}
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-gray-900 font-medium truncate">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="container mx-auto px-4 sm:px-15 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-gray-200 bg-white">
              <img
                src={allImages[selectedImage] ? `http://localhost:1337${allImages[selectedImage]}` : "/placeholder.svg"}
                alt={product.name}
                className="object-contain p-4 w-full h-full"
              />
            </div>
            <div className="flex gap-4 overflow-auto pb-2">
              {allImages.map((image, index) => (
                <button
                  key={index}
                  className={`relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-white ${
                    selectedImage === index ? "border-2 border-purple-700" : "border-2 border-gray-200"
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img
                    src={image ? `http://localhost:1337${image}` : "/placeholder.svg"}
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
                  {product.category?.name || 'Non catégorisé'}
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
                <span className="text-sm text-gray-600">SKU: {product.sku}</span>
              </div>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-purple-700">${product.prix}</span>
              {product.comparePrice && (
                <span className="text-lg text-gray-500 line-through">${product.comparePrice}</span>
              )}
              {product.comparePrice && (
                <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded">
                  Économisez ${(product.comparePrice - product.prix).toFixed(2)}
                </span>
              )}
            </div>

            <p className="text-gray-600">{product.description}</p>

            <div className="space-y-4">
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
                    disabled={quantity >= getAvailableStock()}
                    className={`h-10 w-10 rounded-r-md border border-gray-300 flex items-center justify-center ${
                      quantity >= getAvailableStock() ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"
                    }`}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  {getAvailableStock() > 10
                    ? "En stock"
                    : getAvailableStock() > 0
                      ? `Seulement ${getAvailableStock()} en stock`
                      : "Rupture de stock"}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button 
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                className={`flex-1 bg-purple-700 hover:bg-purple-800 text-white py-3 px-4 rounded-md flex items-center justify-center ${
                  isAddingToCart ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <ShoppingCart className="mr-2 h-5 w-5" /> 
                {isAddingToCart ? 'Ajout en cours...' : 'Ajouter au panier'}
              </button>
              <button className="flex-1 border border-purple-200 text-purple-700 hover:bg-purple-50 py-3 px-4 rounded-md">
                Acheter maintenant
              </button>
            </div>

            {cartMessage && (
              <div className={`p-3 rounded-md ${
                cartMessage.includes('succès') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {cartMessage}
              </div>
            )}

            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-purple-100 p-2 text-purple-700">
                  <Truck className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Livraison {product.shippingClass}</p>
                  <p className="text-sm text-gray-500">Poids: {product.weight} kg</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <div className="border-b-2 border-gray-200">
            <div className="flex space-x-8">
              <div className="relative flex justify-center items-center">
                <button
                  onClick={() => setActiveTab("features")}
                  className={`relative  py-3  font-medium 
                    ${activeTab === "features"
                    ? " text-purple-700"
                    : " text-gray-600 hover:text-gray-900"
                    }`}
                >
                  Caractéristiques
                </button>
                <div className={`${activeTab === "features" ? 'absolute' : 'hidden'} h-[2px] w-full -bottom-0.5 left-0 translate-[-50%, -50%] bg-purple-700`}></div>
              </div>
              <div className="relative flex justify-center items-center">
                <button
                  onClick={() => setActiveTab("specifications")}
                  className={`relative py-3 font-medium 
                    ${activeTab === "specifications"
                    ? " text-purple-700"
                    : " text-gray-600 hover:text-gray-900"
                    }`}
                >
                  Spécifications
                </button>
                <div className={`${activeTab === "specifications" ? 'absolute' : 'hidden'} h-[2px] w-full -bottom-0.5 left-0 translate-[-50%, -50%] bg-purple-700`}></div>
              </div>
            </div>
          </div>

          {activeTab === "features" && (
            <div className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold mb-4">Description du produit</h3>
                  <p className="text-gray-600">{product.description}</p>
                </div>
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold mb-4">Tags</h3>
                  <p className="text-gray-600">{product.tags}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "specifications" && (
            <div className="pt-6">
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Spécifications techniques</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {product.dimensions?.map((dim, index) => (
                    <div key={index} className="border-b  border-gray-300 pb-3">
                      <p className="text-sm text-gray-500">Dimensions</p>
                      <p className="font-medium">
                        {dim.length} x {dim.width} x {dim.height} {dim.unit}
                      </p>
                    </div>
                  ))}
                  <div className="border-b  border-gray-300 pb-3">
                    <p className="text-sm text-gray-500">Poids</p>
                    <p className="font-medium">{product.weight} kg</p>
                  </div>
                  <div className="border-b border-gray-300 pb-3">
                    <p className="text-sm text-gray-500">Stock</p>
                    <p className="font-medium">{product.stock} unités</p>
                  </div>
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
              <ProductCard key={product?.id} product={product} />
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
      <Link to={`/view/products/${product?.documentId}`} className="block">
        <div className="relative">
          <div className="aspect-square overflow-hidden">
            <img
              src={product?.imgMain?.url ? `http://localhost:1337${product.imgMain.url}` : "/placeholder.svg"}
              alt={product?.name}
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          {product?.badge && (
            <span
              className={`absolute top-3 left-3 px-2 py-1 text-xs font-medium text-white rounded-full ${
                product?.badge === "Sale" ? "bg-red-500" : product?.badge === "New" ? "bg-green-500" : "bg-purple-700"
              }`}
            >
              {product?.badge}
            </span>
          )}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button className="rounded-full h-9 w-9 flex items-center justify-center bg-white/80 backdrop-blur-sm hover:bg-white">
              <Heart className="h-4 w-4 text-gray-700" />
            </button>
          </div>
          {product?.stock <= 10 && (
            <div className="absolute bottom-3 left-3 right-3 bg-black/70 text-white text-xs text-center py-1 rounded-full backdrop-blur-sm">
              {product?.stock <= 5 ? "Plus que " + product?.stock + " en stock!" : "Stock limité"}
            </div>
          )}
        </div>
      </Link>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium line-clamp-1">{product?.name}</h3>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
            {product?.category?.name || 'Non catégorisé'}
          </span>
        </div>
        <div className="flex items-center mb-3">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${
                  i < Math.floor(product?.rating) ? "fill-current text-yellow-400" : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="ml-2 text-xs text-gray-600">({product?.reviews})</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-purple-700">${product?.prix}</span>
            {product?.comparePrice && <span className="text-sm text-gray-500 line-through">${product?.comparePrice}</span>}
          </div>
          <button className="bg-purple-700 hover:bg-purple-800 text-white p-2 rounded-md">
            <ShoppingCart className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
