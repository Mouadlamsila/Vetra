"use client"

import { useEffect, useState, useMemo } from "react"
import { Link, useParams } from "react-router-dom"
import { ChevronRight, Heart, Minus, Plus, Share2, ShoppingCart, Star, Truck, MessageSquare, X } from "lucide-react"
import axios from "axios"
import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

import stripePromise from "../../../utils/stripe"
import { Elements } from "@stripe/react-stripe-js"
import CheckoutForm from "../../../components/CheckoutForm"

export default function ProductPage() {
  const { t } = useTranslation()
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
  const lang = localStorage.getItem("lang")
  const [showRatingModal, setShowRatingModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isRating, setIsRating] = useState(false)
  const [ratingForm, setRatingForm] = useState({
    stars: 0,
    opinion: "",
  })
  const [isFavorite, setIsFavorite] = useState(false)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [user, setUser] = useState(null)
  const [userData, setUserData] = useState(null)
  const [showCheckoutForm, setShowCheckoutForm] = useState(false)
  const [checkoutAmount, setCheckoutAmount] = useState(0)
  const [orderId, setOrderId] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch product with ratings
        const ratingResponse = await axios.get(
          `https://stylish-basket-710b77de8f.strapiapp.com/api/products/${id}?populate[rating_products][populate]=user`,
        )

        // Fetch complete product data
        const completeResponse = await axios.get(`https://stylish-basket-710b77de8f.strapiapp.com/api/products/${id}?populate=*`)

        // Merge the data
        const mergedProduct = {
          ...completeResponse.data.data,
          rating_products: ratingResponse.data.data.rating_products || [],
        }

        setProduct(mergedProduct)
        setCategoryProduct(mergedProduct.category?.id)
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
            `https://stylish-basket-710b77de8f.strapiapp.com/api/products?filters[category][id][$eq]=${categoryProduct}&populate=*`,
          )
          const filteredProducts = response.data.data.filter((item) => item.documentId !== id).slice(0, 4)
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
      if (!userId) return

      try {
        const response = await axios.get(
          `https://stylish-basket-710b77de8f.strapiapp.com/api/carts?filters[user][id][$eq]=${userId}&populate[product][populate]=*`,
        )
        setCartItems(response.data.data)
      } catch (error) {
        console.error("Error fetching cart items:", error)
      }
    }

    fetchCartItems()
  }, [])

  // Calculate available stock considering items in cart
  const getAvailableStock = () => {
    if (!product?.stock) return 0
    const cartQuantity = cartItems
      .filter((item) => item.product?.documentId === product.documentId)
      .reduce((sum, item) => sum + item.qte, 0)
    return product.stock - cartQuantity
  }

  const handleAddToCart = async () => {
    const userId = localStorage.getItem("IDUser")
    if (!userId) {
      setCartMessage(t("view.productDetails.error.loginRequired"))
      return
    }

    const availableStock = getAvailableStock()
    if (quantity > availableStock) {
      setCartMessage(t("view.productDetails.error.stockExceeded", { count: availableStock }))
      return
    }

    setIsAddingToCart(true)
    setCartMessage("")

    try {
      // Check if product already exists in cart
      const existingCartItem = cartItems.find((item) => item.product?.documentId === id)

      if (existingCartItem) {
        // Update existing cart item
        const newQuantity = existingCartItem.qte + quantity

        // Check if new total quantity exceeds stock
        if (newQuantity > product.stock) {
          setCartMessage(t("view.productDetails.error.stockExceeded", { count: product.stock }))
          setIsAddingToCart(false)
          return
        }

        const response = await axios.put(`https://stylish-basket-710b77de8f.strapiapp.com/api/carts/${existingCartItem.documentId}`, {
          data: {
            qte: newQuantity,
          },
        })

        if (response.data) {
          // Update cart items immediately
          setCartItems((prevItems) =>
            prevItems.map((item) =>
              item.documentId === existingCartItem.documentId ? { ...item, qte: newQuantity } : item,
            ),
          )
          setCartMessage(t("view.productDetails.error.quantityUpdated"))
        }
      } else {
        // Add new cart item
        const response = await axios.post("https://stylish-basket-710b77de8f.strapiapp.com/api/carts", {
          data: {
            user: userId,
            product: id,
            qte: quantity,
          },
        })

        if (response.data) {
          // Update cart items immediately
          const newCartItem = {
            ...response.data.data,
            product: product,
          }
          setCartItems((prevItems) => [...prevItems, newCartItem])
          setCartMessage(t("view.productDetails.error.productAdded"))
        }
      }
      setTimeout(() => window.location.reload(), 1000)
    } catch (error) {
      console.error("Error updating cart:", error)
      setCartMessage(t("view.productDetails.error.cartUpdateError"))
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleRating = async (productId, rating, opinion) => {
    try {
      const userId = localStorage.getItem("IDUser")

      if (!userId) {
        toast.error(t("view.productDetails.loginToReview"))
        return
      }

      // Check if user has already rated this product
      const existingRating = selectedProduct.rating_products?.find(
        (rating) => rating.user?.id === Number.parseInt(userId),
      )
      let response
      if (existingRating) {
        // Update existing rating
        response = await axios.put(`https://stylish-basket-710b77de8f.strapiapp.com/api/rating-products/${existingRating.documentId}`, {
          data: {
            stars: Number.parseInt(rating),
            opinion: opinion,
            user: Number.parseInt(userId),
            product: productId,
          },
        })
      } else {
        // Create new rating
        response = await axios.post("https://stylish-basket-710b77de8f.strapiapp.com/api/rating-products", {
          data: {
            stars: Number.parseInt(rating),
            opinion: opinion,
            user: Number.parseInt(userId),
            product: productId,
          },
        })
      }

      // Update the product's rating in the local state
      setProduct((prevProduct) => ({
        ...prevProduct,
        rating_products: existingRating
          ? prevProduct.rating_products.map((r) => (r.id === existingRating.id ? response.data.data : r))
          : [...(prevProduct.rating_products || []), response.data.data],
      }))

      toast.success(
        existingRating ? t("view.productDetails.reviewUpdateSuccess") : t("view.productDetails.reviewSuccess"),
      )
      setTimeout(() => window.location.reload(), 1000)
    } catch (error) {
      console.error("Error submitting rating:", error)
      toast.error(t("view.productDetails.reviewError"))
    }
  }

  const openRatingModal = (product) => {
    const userId = localStorage.getItem("IDUser")
    const existingRating = product.rating_products?.find((rating) => rating.user?.id === Number.parseInt(userId))

    if (existingRating) {
      setRatingForm({
        stars: existingRating.stars,
        opinion: existingRating.opinion || "",
      })
    } else {
      setRatingForm({
        stars: 0,
        opinion: "",
      })
    }

    setSelectedProduct(product)
    setShowRatingModal(true)
  }

  const RatingStars = ({ productId, rating_products, isInteractive = false, onStarClick }) => {
    const [hoveredRating, setHoveredRating] = useState(0)

    const averageRating = useMemo(() => {
      if (!rating_products || rating_products.length === 0) return 0
      const sum = rating_products.reduce((acc, curr) => acc + curr.stars, 0)
      return sum / rating_products.length
    }, [rating_products])

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
              id={`star${rating}-${productId}`}
              name={`rating-${productId}`}
              value={rating}
              className="hidden"
              checked={isInteractive ? ratingForm.stars === rating : averageRating >= rating}
              onChange={() => handleStarClick(rating)}
              disabled={!isInteractive || isRating}
            />
            <label
              htmlFor={`star${rating}-${productId}`}
              className={`float-right cursor-pointer text-2xl transition-colors duration-300 ${
                isInteractive
                  ? hoveredRating >= rating || ratingForm.stars >= rating
                    ? "text-purple-600"
                    : "text-gray-300"
                  : averageRating >= rating
                    ? "text-purple-600"
                    : "text-gray-300"
              }`}
              onMouseEnter={() => (isInteractive ? setHoveredRating(rating) : null)}
              onMouseLeave={() => (isInteractive ? setHoveredRating(0) : null)}
              onClick={() => handleStarClick(rating)}
            >
              ★
            </label>
          </div>
        ))}
      </div>
    )
  }

  // Add this new useEffect to check if product is in favorites
  useEffect(() => {
    const checkFavorite = async () => {
      const userId = localStorage.getItem("IDUser")
      if (!userId || !product) return

      try {
        const response = await axios.get(
          `https://stylish-basket-710b77de8f.strapiapp.com/api/favorite-products?filters[user][id][$eq]=${userId}&filters[product][id][$eq]=${product.id}`,
        )
        setIsFavorite(response.data.data.length > 0)
      } catch (error) {
        console.error("Error checking favorite status:", error)
      }
    }

    checkFavorite()
  }, [product])

  // Add this new function to handle adding/removing from favorites
  const handleFavorite = async () => {
    const userId = localStorage.getItem("IDUser")
    if (!userId) {
      toast.error(t("view.productDetails.loginToFavorite"))
      return
    }

    try {
      if (isFavorite) {
        // Remove from favorites
        const response = await axios.get(
          `https://stylish-basket-710b77de8f.strapiapp.com/api/favorite-products?filters[user][id][$eq]=${userId}&filters[product][id][$eq]=${product.id}`,
        )
        if (response.data.data.length > 0) {
          await axios.delete(`https://stylish-basket-710b77de8f.strapiapp.com/api/favorite-products/${response.data.data[0].documentId}`)
          toast.success(t("view.productDetails.removedFromFavorites"))
          setTimeout(() => window.location.reload(), 1000)
        }
      } else {
        // Add to favorites
        await axios.post("https://stylish-basket-710b77de8f.strapiapp.com/api/favorite-products", {
          data: {
            user: Number.parseInt(userId),
            product: product.id,
          },
        })
        toast.success(t("view.productDetails.addedToFavorites"))
        setTimeout(() => window.location.reload(), 1000)
      }
      setIsFavorite(!isFavorite)
    } catch (error) {
      console.error("Error updating favorite status:", error)
      toast.error(t("view.productDetails.favoriteError"))
    }
  }

  // Add useEffect to fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem("IDUser")
      if (!userId) return

      try {
        const response = await axios.get(`https://stylish-basket-710b77de8f.strapiapp.com/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        setUserData(response.data)
      } catch (error) {
        console.error("Error fetching user data:", error)
        toast.error(t("view.productDetails.error.fetchingUserData"))
      }
    }

    fetchUserData()
  }, [])

  const handleBuyNow = async () => {
    const userId = localStorage.getItem("IDUser")
    if (!userId) {
      toast.error(t("view.productDetails.loginRequired"))
      return
    }

    const availableStock = getAvailableStock()
    if (quantity > availableStock) {
      toast.error(t("view.productDetails.error.stockExceeded", { count: availableStock }))
      return
    }

    setIsProcessingPayment(true)

    try {
      // Generate a unique order number
      const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`

      // First create the order
      const orderData = {
        data: {
          statusOrder: "pending",
          totalAmount: Number.parseFloat(product.prix * quantity),
          user: Number.parseInt(userId),
          orderNumber: orderNumber,
          currency: "usd",
          products: [Number.parseInt(product.id)],
          quantities: {
            [product.id]: Number.parseInt(quantity),
          },
          shippingAddress: {
            line1: userData?.address?.line1 || "",
            line2: userData?.address?.line2 || "",
            city: userData?.address?.city || "",
            state: userData?.address?.state || "",
            postal_code: userData?.address?.postal_code || "",
            country: userData?.address?.country || "US",
          },
          paymentStatus: "pending",
        },
      }

      // Create the order
      const orderResponse = await axios.post("https://stylish-basket-710b77de8f.strapiapp.com/api/orders", orderData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      console.log("Order created:", orderResponse.data)

      // Set the order ID and amount for the checkout form
      setOrderId(orderResponse.data.data.id)
      setCheckoutAmount(product.prix * quantity)
      setShowCheckoutForm(true)
    } catch (error) {
      console.error("Error in checkout process:", error)
      if (error.response) {
        console.error("Error response:", error.response.data)
        console.error("Error status:", error.response.status)
        console.error("Error details:", error.response.data.error)
      }
      toast.error(t("view.productDetails.paymentError"))
    } finally {
      setIsProcessingPayment(false)
    }
  }

  const handlePaymentSuccess = async (paymentMethod) => {
    try {
      // Create checkout session with the payment method
      const checkoutData = {
        data: {
          products: [Number.parseInt(product.id)],
          quantities: {
            [product.id]: Number.parseInt(quantity),
          },
          user: Number.parseInt(localStorage.getItem("IDUser")),
          amount: checkoutAmount,
          currency: "usd",
          status_checkout: "pending",
          customer: {
            email: userData?.email || "",
            name: userData?.username || "",
            phone: userData?.phone || "",
            address: {
              line1: userData?.address?.line1 || "",
              line2: userData?.address?.line2 || "",
              city: userData?.address?.city || "",
              state: userData?.address?.state || "",
              postal_code: userData?.address?.postal_code || "",
              country: userData?.address?.country || "US",
            },
          },
          shippingAddress: {
            line1: userData?.address?.line1 || "",
            line2: userData?.address?.line2 || "",
            city: userData?.address?.city || "",
            state: userData?.address?.state || "",
            postal_code: userData?.address?.postal_code || "",
            country: userData?.address?.country || "US",
          },
          order: orderId,
          paymentMethodId: paymentMethod.id,
        },
      }

      const response = await axios.post("https://stylish-basket-710b77de8f.strapiapp.com/api/checkout-sessions", checkoutData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      console.log("Checkout session created:", response.data)

      // Close the checkout form
      setShowCheckoutForm(false)

      // Show success message
      toast.success(t("view.productDetails.paymentSuccess"))

      // Redirect to order confirmation page or home
      window.location.href = "/view/orders"
    } catch (error) {
      console.error("Error creating checkout session:", error)
      if (error.type === "card_error") {
        switch (error.code) {
          case "invalid_number":
            toast.error(t("payment.errors.invalidCardNumber"))
            break
          case "incomplete_number":
            toast.error(t("payment.errors.incompleteCardNumber"))
            break
          case "invalid_expiry":
            toast.error(t("payment.errors.invalidExpiryDate"))
            break
          case "incomplete_expiry":
            toast.error(t("payment.errors.incompleteExpiryDate"))
            break
          case "invalid_cvc":
            toast.error(t("payment.errors.invalidCVC"))
            break
          case "incomplete_cvc":
            toast.error(t("payment.errors.incompleteCVC"))
            break
          case "card_declined":
            toast.error(t("payment.errors.cardDeclined"))
            break
          default:
            toast.error(t("payment.errors.processingError"))
        }
      } else if (error.message?.includes("incomplete")) {
        // Handle Stripe's default incomplete messages
        if (error.message.includes("card number")) {
          toast.error(t("payment.errors.incompleteCardNumber"))
        } else if (error.message.includes("expiry")) {
          toast.error(t("payment.errors.incompleteExpiryDate"))
        } else if (error.message.includes("cvc")) {
          toast.error(t("payment.errors.incompleteCVC"))
        } else {
          toast.error(t("payment.errors.processingError"))
        }
      } else {
        toast.error(t("payment.errors.processingError"))
      }
    }
  }

  const handlePaymentCancel = () => {
    setShowCheckoutForm(false)
  }

  const handleShare = async () => {
    const shareData = {
      title: product.name,
      text: product.description,
      url: window.location.href,
    }

    try {
      // Check if Web Share API is supported
      if (navigator.share) {
        await navigator.share(shareData)
        toast.success(t("view.productDetails.shareSuccess"))
      } else {
        // Fallback: copy URL to clipboard
        await navigator.clipboard.writeText(window.location.href)
        toast.success(t("view.productDetails.linkCopied"))
      }
    } catch (error) {
      // If sharing is cancelled or fails, try clipboard as fallback
      try {
        await navigator.clipboard.writeText(window.location.href)
        toast.success(t("view.productDetails.linkCopied"))
      } catch (clipboardError) {
        console.error("Error sharing:", error)
        toast.error(t("view.productDetails.shareError"))
      }
    }
  }

  // Add validation function for payment form
  const validatePaymentForm = (formData) => {
    if (!formData.cardNumber) {
      toast.error(t("payment.errors.incompleteCardNumber"))
      return false
    }
    if (!formData.expiryDate) {
      toast.error(t("payment.errors.incompleteExpiryDate"))
      return false
    }
    if (!formData.cvc) {
      toast.error(t("payment.errors.incompleteCVC"))
      return false
    }
    if (!formData.name) {
      toast.error(t("payment.errors.incompleteName"))
      return false
    }
    if (!formData.address) {
      toast.error(t("payment.errors.incompleteAddress"))
      return false
    }
    return true
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">{t("view.productDetails.loading")}</div>
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen">{t("view.productDetails.productNotFound")}</div>
    )
  }

  const incrementQuantity = () => {
    const availableStock = getAvailableStock()
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
  const allImages = [product.imgMain?.url, ...(product.imgsAdditional?.map((img) => img.url) || [])].filter(Boolean)

  return (
    <div className="bg-white min-h-screen pb-16">
      {/* Breadcrumb */}
      <div className="bg-white border-gray-200 border-b">
        <div className="container mx-auto px-4 sm:px-15 py-3">
          <div className="flex items-center text-sm text-gray-500">
            <Link to="/view/1" className="hover:text-purple-700">
              {t("view.productDetails.home")}
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <Link to={`/view/categories/${product.category?.documentId}`} className="hover:text-purple-700">
              {product.category?.name || t("view.category.uncategorized")}
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
                src={allImages[selectedImage] ? `${allImages[selectedImage]}` : "/placeholder.svg"}
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
                    src={image ? `${image}` : "/placeholder.svg"}
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
                  {product.category?.name || t("view.category.uncategorized")}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleFavorite}
                    className={`rounded-full h-9 w-9 flex items-center justify-center border ${
                      isFavorite ? "border-red-500 text-red-500" : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
                  </button>
                  <button
                    onClick={handleShare}
                    className="rounded-full h-9 w-9 flex items-center justify-center border border-gray-300 hover:bg-gray-50"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <h1 className="mt-4 text-3xl font-bold text-gray-900">{product.name}</h1>

              <div className="mt-2 flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {t("view.productDetails.sku")}: {product.sku}
                </span>
              </div>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-purple-700">${product.prix}</span>
              {product.comparePrice && (
                <span className="text-lg text-gray-500 line-through">${product.comparePrice}</span>
              )}
              {product.comparePrice && (
                <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded">
                  {t("view.productDetails.save", { amount: (product.comparePrice - product.prix).toFixed(2) })}
                </span>
              )}
            </div>

            <p className="text-gray-600">{product.description}</p>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">{t("view.productDetails.quantity")}</h3>
                <div className="flex items-center">
                  <button
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    className={`h-10 w-10 ${lang === "ar" ? "rounded-r-md" : "rounded-l-md"}  border border-gray-300 flex items-center justify-center ${
                      quantity <= 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"
                    }`}
                  >
                    <Minus className="h-4  w-4" />
                  </button>
                  <div className="flex h-10 w-16 items-center justify-center border-y border-gray-200 text-center">
                    {quantity}
                  </div>
                  <button
                    onClick={incrementQuantity}
                    disabled={quantity >= getAvailableStock()}
                    className={`h-10 w-10 ${lang === "ar" ? "rounded-l-md" : "rounded-r-md"}  border border-gray-300 flex items-center justify-center ${
                      quantity >= getAvailableStock() ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"
                    }`}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  {getAvailableStock() > 10
                    ? t("view.productDetails.inStock")
                    : getAvailableStock() > 0
                      ? t("view.productDetails.onlyLeft", { count: getAvailableStock() })
                      : t("view.productDetails.outOfStock")}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                className={`flex-1 bg-purple-700 hover:bg-purple-800 text-white py-3 px-4 rounded-md flex items-center justify-center ${
                  isAddingToCart ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <ShoppingCart className={`${lang === "ar" ? "ml-2" : "mr-2"} h-5 w-5`} />
                {isAddingToCart ? t("view.productDetails.addingToCart") : t("view.productDetails.addToCart")}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={isProcessingPayment}
                className={`flex-1 border border-purple-200 text-purple-700 hover:bg-purple-50 py-3 px-4 rounded-md ${
                  isProcessingPayment ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isProcessingPayment ? t("view.productDetails.processing") : t("view.productDetails.buyNow")}
              </button>
            </div>

            {cartMessage && (
              <div
                className={`p-3 rounded-md ${
                  cartMessage.includes("succès") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}
              >
                {cartMessage}
              </div>
            )}

            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-purple-100 p-2 text-purple-700">
                  <Truck className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">
                    {t("view.productDetails.shipping")} {product.shippingClass}
                  </p>
                  <p className="text-sm text-gray-500">
                    {t("view.productDetails.weight")}: {product.weight} kg
                  </p>
                </div>
              </div>
            </div>

            {/* Add Rating Section */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <RatingStars productId={product.id} rating_products={product.rating_products} />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {product.rating_products && product.rating_products.length > 0
                      ? (
                          product.rating_products.reduce((acc, curr) => acc + curr.stars, 0) /
                          product.rating_products.length
                        ).toFixed(1)
                      : "0.0"}
                  </span>
                  <span className="text-xs text-gray-500">
                    {t("view.productDetails.ratingCount", {
                      count: product.rating_products?.length || 0,
                      type:
                        product.rating_products?.length === 1
                          ? t("view.productDetails.singleRating")
                          : t("view.productDetails.multipleRatings"),
                    })}
                  </span>
                </div>
              </div>
              <button
                onClick={() => openRatingModal(product)}
                className="flex items-center gap-1 text-purple-600 hover:text-purple-800"
              >
                <MessageSquare className="h-4 w-4" />
                <span className="text-sm">{t("view.productDetails.rateProduct")}</span>
              </button>
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
                  className={`relative py-3 font-medium 
                    ${activeTab === "features" ? " text-purple-700" : " text-gray-600 hover:text-gray-900"}`}
                >
                  {t("view.productDetails.features")}
                </button>
                <div
                  className={`${activeTab === "features" ? "absolute" : "hidden"} h-[2px] w-full -bottom-0.5 left-0 translate-[-50%, -50%] bg-purple-700`}
                ></div>
              </div>
              <div className="relative flex justify-center items-center">
                <button
                  onClick={() => setActiveTab("specifications")}
                  className={`relative py-3 font-medium 
                    ${activeTab === "specifications" ? " text-purple-700" : " text-gray-600 hover:text-gray-900"}`}
                >
                  {t("view.productDetails.specifications")}
                </button>
                <div
                  className={`${activeTab === "specifications" ? "absolute" : "hidden"} h-[2px] w-full -bottom-0.5 left-0 translate-[-50%, -50%] bg-purple-700`}
                ></div>
              </div>
            </div>
          </div>

          {activeTab === "features" && (
            <div className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold mb-4">{t("view.productDetails.description")}</h3>
                  <p className="text-gray-600">{product.description}</p>
                </div>
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold mb-4">{t("view.productDetails.tags")}</h3>
                  <p className="text-gray-600">{product.tags}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "specifications" && (
            <div className="pt-6">
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">{t("view.productDetails.technicalSpecs")}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {product.dimensions?.map((dim, index) => (
                    <div key={index} className="border-b border-gray-300 pb-3">
                      <p className="text-sm text-gray-500">{t("view.productDetails.dimensions")}</p>
                      <p className="font-medium">
                        {dim.length} x {dim.width} x {dim.height} {dim.unit}
                      </p>
                    </div>
                  ))}
                  <div className="border-b border-gray-300 pb-3">
                    <p className="text-sm text-gray-500">{t("view.productDetails.weight")}</p>
                    <p className="font-medium">{product.weight} kg</p>
                  </div>
                  <div className="border-b border-gray-300 pb-3">
                    <p className="text-sm text-gray-500">{t("view.productDetails.stock")}</p>
                    <p className="font-medium">
                      {product.stock} {t("view.productDetails.units")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8">{t("view.productDetails.relatedProducts")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {relatedProducts.map((product) => (
              <ProductCard key={product?.id} product={product} />
            ))}
          </div>
        </div>
      </div>

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-[#1e3a8a]/40 bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 relative">
            <button
              onClick={() => {
                setShowRatingModal(false)
                setSelectedProduct(null)
                setRatingForm({ stars: 0, opinion: "" })
              }}
              className={`absolute top-4 ${lang === "ar" ? "left-4" : "right-4"} text-gray-400 hover:text-gray-600`}
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="text-xl font-bold mb-4">
              {selectedProduct?.rating_products?.find(
                (rating) => rating.user?.id === Number.parseInt(localStorage.getItem("IDUser")),
              )
                ? t("view.productDetails.updateReview")
                : t("view.productDetails.writeReview")}
            </h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">{t("view.productDetails.rating")}</label>
              <RatingStars
                productId={selectedProduct?.id}
                rating_products={selectedProduct?.rating_products}
                isInteractive={true}
                onStarClick={(rating) => setRatingForm((prev) => ({ ...prev, stars: rating }))}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="opinion" className="block text-sm font-medium text-gray-700 mb-2">
                {t("view.productDetails.review")}
              </label>
              <textarea
                id="opinion"
                rows={4}
                value={ratingForm.opinion}
                onChange={(e) => setRatingForm((prev) => ({ ...prev, opinion: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                placeholder={t("view.productDetails.reviewPlaceholder")}
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowRatingModal(false)
                  setSelectedProduct(null)
                  setRatingForm({ stars: 0, opinion: "" })
                }}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {t("view.productDetails.cancel")}
              </button>
              <button
                onClick={() => {
                  if (ratingForm.stars === 0) {
                    toast.error(t("view.productDetails.selectRating"))
                    return
                  }
                  handleRating(selectedProduct.id, ratingForm.stars, ratingForm.opinion)
                  setShowRatingModal(false)
                  setSelectedProduct(null)
                  setRatingForm({ stars: 0, opinion: "" })
                }}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                {t("view.productDetails.submit")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Stripe Elements Provider and Checkout Form */}
      {showCheckoutForm && (
        <div className="fixed inset-0 bg-[#1e3a8a]/40 bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 relative">
            <button
              onClick={handlePaymentCancel}
              className={`absolute top-4 ${lang === "ar" ? "left-4" : "right-4"} text-gray-400 hover:text-gray-600`}
            >
              <X className="h-5 w-5" />
            </button>

            <Elements stripe={stripePromise}>
              <CheckoutForm
                amount={checkoutAmount}
                onSuccess={(response) => {
                  // Close the checkout form
                  setShowCheckoutForm(false)

                  // Show success message
                  toast.success(t("view.productDetails.paymentSuccess"))

                  // Redirect to order confirmation page
                  window.location.href = "/view/orders"
                }}
                onCancel={handlePaymentCancel}
                orderId={orderId}
                product={product}
                quantity={quantity}
                userData={userData}
              />
            </Elements>
          </div>
        </div>
      )}
    </div>
  )
}

function ProductCard({ product }) {
  const { t } = useTranslation()
  const [isHovered, setIsHovered] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  const averageRating = useMemo(() => {
    if (!product?.rating_products || product.rating_products.length === 0) return 0
    const sum = product.rating_products.reduce((acc, curr) => acc + curr.stars, 0)
    return sum / product.rating_products.length
  }, [product?.rating_products])

  // Add this new useEffect to check if product is in favorites
  useEffect(() => {
    const checkFavorite = async () => {
      const userId = localStorage.getItem("IDUser")
      if (!userId || !product) return

      try {
        const response = await axios.get(
          `https://stylish-basket-710b77de8f.strapiapp.com/api/favorite-products?filters[user][id][$eq]=${userId}&filters[product][id][$eq]=${product.id}`,
        )
        setIsFavorite(response.data.data.length > 0)
      } catch (error) {
        console.error("Error checking favorite status:", error)
      }
    }

    checkFavorite()
  }, [product])

  // Add this new function to handle adding/removing from favorites
  const handleFavorite = async (e) => {
    e.preventDefault() // Prevent navigation when clicking the favorite button
    const userId = localStorage.getItem("IDUser")
    if (!userId) {
      toast.error(t("view.productDetails.loginToFavorite"))
      return
    }

    try {
      if (isFavorite) {
        // Remove from favorites
        const response = await axios.get(
          `https://stylish-basket-710b77de8f.strapiapp.com/api/favorite-products?filters[user][id][$eq]=${userId}&filters[product][id][$eq]=${product.id}`,
        )
        if (response.data.data.length > 0) {
          await axios.delete(`https://stylish-basket-710b77de8f.strapiapp.com/api/favorite-products/${response.data.data[0].documentId}`)
          toast.success(t("view.productDetails.removedFromFavorites"))
        }
      } else {
        // Add to favorites
        await axios.post("https://stylish-basket-710b77de8f.strapiapp.com/api/favorite-products", {
          data: {
            user: Number.parseInt(userId),
            product: product.id,
          },
        })
        toast.success(t("view.productDetails.addedToFavorites"))
      }
      setIsFavorite(!isFavorite)
      setTimeout(() => window.location.reload(), 1000)
    } catch (error) {
      console.error("Error updating favorite status:", error)
      toast.error(t("view.productDetails.favoriteError"))
    }
  }

  return (
    <div
      className="group overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 bg-white rounded-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/view/products/${product?.documentId}`} className="block">
        <div className="relative">
          <div className="aspect-square overflow-hidden">
            <img
              src={product?.imgMain?.url ? `${product.imgMain.url}` : "/placeholder.svg"}
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
            <button
              onClick={handleFavorite}
              className={`rounded-full h-9 w-9 flex items-center justify-center bg-white/80 backdrop-blur-sm hover:bg-white ${
                isFavorite ? "text-red-500" : "text-gray-700"
              }`}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
            </button>
          </div>
          {product?.stock <= 10 && (
            <div className="absolute bottom-3 left-3 right-3 bg-black/70 text-white text-xs text-center py-1 rounded-full backdrop-blur-sm">
              {product?.stock <= 5
                ? t("view.productDetails.onlyLeft", { count: product?.stock })
                : t("view.productDetails.lowStock")}
            </div>
          )}
        </div>
      </Link>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium line-clamp-1">{product?.name}</h3>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
            {product?.category?.name || t("view.category.uncategorized")}
          </span>
        </div>
        <div className="flex items-center mb-3">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${
                  i < Math.floor(averageRating) ? "fill-current text-yellow-400" : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="ml-2 text-xs text-gray-600">({product?.rating_products?.length || 0})</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-purple-700">${product?.prix}</span>
            {product?.comparePrice && (
              <span className="text-sm text-gray-500 line-through">${product?.comparePrice}</span>
            )}
          </div>
          <button className="bg-purple-700 hover:bg-purple-800 text-white p-2 rounded-md">
            <ShoppingCart className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
