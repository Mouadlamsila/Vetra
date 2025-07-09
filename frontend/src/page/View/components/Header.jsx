"use client"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ChevronDown, Search, User, ShoppingCart, Menu, X, Minus, Plus, Globe, Heart } from "lucide-react"
import axios from "axios"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useTranslation } from "react-i18next"
import { changeLanguage } from "../../../i18n/i18n"
import { loadStripe } from '@stripe/stripe-js'
import stripePromise from '../../../utils/stripe'
import { Elements } from '@stripe/react-stripe-js'
import CheckoutForm from '../../../components/CheckoutForm'

export default function Header() {
  const { t, i18n } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false)
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false)
  const [boutiques, setBoutiques] = useState([])
  const [categories, setCategories] = useState([])
  const [user, setUser] = useState([])
  const [cartItems, setCartItems] = useState([])
  const [cartLoading, setCartLoading] = useState(true)
  const id = localStorage.getItem("IDBoutique")
  const IDUser = localStorage.getItem("IDUser");
  const idOwner = localStorage.getItem("idOwner");
  const navigate = useNavigate('');
  const [refresh, setRefresh] = useState(false);
  const lang = localStorage.getItem('lang');
  const [favorites, setFavorites] = useState([])
  const [favoritesOpen, setFavoritesOpen] = useState(false)
  const [favoritesLoading, setFavoritesLoading] = useState(true)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [checkoutAmount, setCheckoutAmount] = useState(0);
  const [orderId, setOrderId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [searchResults, setSearchResults] = useState({ stores: [], products: [] });
  const [isSearching, setIsSearching] = useState(false);

  const handleLanguageChange = (lng) => {
    changeLanguage(lng);
    setLanguageMenuOpen(false);
  };

  // Perform search
  const performSearch = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setSearchResults({ stores: [], products: [] });
      return;
    }

    setIsSearching(true);
    try {
      // Search stores
      const storesResponse = await axios.get(
        `https://useful-champion-e28be6d32c.strapiapp.com/api/boutiques?filters[statusBoutique][$eq]=active&filters[$or][0][nom][$containsi]=${searchQuery}&filters[$or][1][description][$containsi]=${searchQuery}&filters[$or][2][category][$containsi]=${searchQuery}&populate=*`
      );

      // First, try to find categories that match the search query
      let matchingCategoryIds = [];
      try {
        // Get all categories first, then filter locally
        const categoriesResponse = await axios.get(
          `https://useful-champion-e28be6d32c.strapiapp.com/api/categories?populate=*`
        );
        const allCategories = categoriesResponse.data.data;
        const matchingCategories = allCategories.filter(cat => 
          cat.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        matchingCategoryIds = matchingCategories.map(cat => cat.id);

      } catch (categoryError) {
        console.log('Category search failed:', categoryError);
      }

      // Search products with multiple approaches
      let productsResponse;
      try {
        if (matchingCategoryIds.length > 0) {
          // If we found matching categories, search for products in those categories
          const categoryFilters = matchingCategoryIds.map(id => `filters[category][id][$eq]=${id}`).join('&');
          productsResponse = await axios.get(
            `https://useful-champion-e28be6d32c.strapiapp.com/api/products?${categoryFilters}&filters[$or][0][name][$containsi]=${searchQuery}&filters[$or][1][description][$containsi]=${searchQuery}&populate=*`
          );
        } else {
          // Fallback to basic search
          productsResponse = await axios.get(
            `https://useful-champion-e28be6d32c.strapiapp.com/api/products?filters[$or][0][name][$containsi]=${searchQuery}&filters[$or][1][description][$containsi]=${searchQuery}&populate=*`
          );
        }
      } catch (productError) {
        console.log('Product search failed, trying basic search:', productError);
        // Final fallback to basic search
        productsResponse = await axios.get(
          `https://useful-champion-e28be6d32c.strapiapp.com/api/products?filters[$or][0][name][$containsi]=${searchQuery}&filters[$or][1][description][$containsi]=${searchQuery}&populate=*`
        );
      }

      setSearchResults({
        stores: storesResponse.data.data.slice(0, 3),
        products: productsResponse.data.data.slice(0, 6)
      });
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults({ stores: [], products: [] });
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        performSearch(searchQuery);
      } else {
        setSearchResults({ stores: [], products: [] });
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearch(false);
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleResultClick = (type, item) => {
    if (type === 'store') {
      // Navigate to store view - fix the path to match the routing structure
      localStorage.setItem('IDBoutique', item.documentId);
      localStorage.setItem('idOwner', item.owner?.id);
      navigate(`/view/${item.documentId}`);
    } else if (type === 'product') {
      // Navigate to product view - fix the path to match the routing structure
      navigate(`/view/products/${item.documentId}`);
    }
    setShowSearch(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch boutique data
        const boutiqueResponse = await axios.get(`https://useful-champion-e28be6d32c.strapiapp.com/api/boutiques/${id}?filters[owner][id][$eq]=${idOwner}&populate=*`)
        setBoutiques(boutiqueResponse.data.data)

        // Fetch products with populated categories
        const productsResponse = await axios.get(
          `https://useful-champion-e28be6d32c.strapiapp.com/api/products?filters[boutique][documentId][$eq]=${id}&populate=*`
        )

        // Extract unique categories from products
        const uniqueCategories = Array.from(
          new Map(
            productsResponse.data.data
              .filter(product => product.category)
              .map(product => [product.category.id, product.category])
          ).values()
        )

        setCategories(uniqueCategories)
      } catch (err) {
        console.error(err)
      }
    }

    fetchData()
  }, [id, idOwner])

  // Get categories that have products in this boutique
  const getCategoriesWithProducts = () => {
    return categories
  }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`https://useful-champion-e28be6d32c.strapiapp.com/api/users/${IDUser}?populate=*`);
        setUser(res.data); // Assure-toi d'utiliser res.data, pas res
      } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur :", error);
      }
    };

    fetchUser();
  }, [IDUser]);



  useEffect(() => {
    const fetchCartItems = async () => {
      if (!IDUser) return;

      try {
        const response = await axios.get(`https://useful-champion-e28be6d32c.strapiapp.com/api/carts?filters[user][id][$eq]=${IDUser}&populate[product][populate]=*`);
        setCartItems(response.data.data);
        setCartLoading(false);

      } catch (error) {
        console.error('Error fetching cart items:', error);
        setCartLoading(false);
      }
    };

    fetchCartItems();
  }, [IDUser, refresh]);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!IDUser) return;

      try {
        const response = await axios.get(`https://useful-champion-e28be6d32c.strapiapp.com/api/favorite-products?filters[user][id][$eq]=${IDUser}&populate[product][populate]=*`);
        setFavorites(response.data.data);
        setFavoritesLoading(false);
      } catch (error) {
        console.error('Error fetching favorites:', error);
        setFavoritesLoading(false);
      }
    };

    fetchFavorites();
  }, [IDUser, refresh]);

  const handleRemoveFromCart = async (cartItemId) => {
    try {
      await axios.delete(`https://useful-champion-e28be6d32c.strapiapp.com/api/carts/${cartItemId}`);
      // Update cart items immediately
      setCartItems(prevItems => prevItems.filter(item => item.documentId !== cartItemId));
      toast.success("Produit retiré du panier", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setTimeout(()=>window.location.reload(),1000);
    } catch (error) {
      console.error('Error removing item from cart:', error);
      toast.error("Erreur lors de la suppression du produit", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleUpdateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      // Get the cart item to check product stock
      const cartItem = cartItems.find(item => item.documentId === cartItemId);
      const productStock = cartItem?.product?.stock || 0;

      // Check if new quantity exceeds stock
      if (newQuantity > productStock) {
        toast.error(`Désolé, il ne reste que ${productStock} unités en stock`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return;
      }

      await axios.put(`https://useful-champion-e28be6d32c.strapiapp.com/api/carts/${cartItemId}`, {
        data: {
          qte: newQuantity
        }
      });

      // Update cart items immediately
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.documentId === cartItemId
            ? { ...item, qte: newQuantity }
            : item
        )
      );
      toast.success("Quantité mise à jour", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error('Error updating cart quantity:', error);
      toast.error("Erreur lors de la mise à jour de la quantité", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  // Calculate total items in cart
  const totalCartItems = cartItems.reduce((sum, item) => sum + (item?.qte || 0), 0);

  // Calculate total price
  const totalPrice = cartItems.reduce((sum, item) => {
    const product = item?.product;
    return sum + (product?.prix || 0) * (item?.qte || 0);
  }, 0);

  const handleRemoveFromFavorites = async (favoriteId) => {
    try {
      await axios.delete(`https://useful-champion-e28be6d32c.strapiapp.com/api/favorite-products/${favoriteId}`);
      setFavorites(prevFavorites => prevFavorites.filter(item => item.documentId !== favoriteId));
      toast.success(t('header.removedFromFavorites'), {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setTimeout(()=>window.location.reload(),1000);
    } catch (error) {
      console.error('Error removing from favorites:', error);
      toast.error(t('header.errorRemovingFavorite'), {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleCheckout = async () => {
    const userId = localStorage.getItem("IDUser")
    if (!userId) {
      toast.error(t('header.loginRequired'))
      return
    }

    if (cartItems.length === 0) {
      toast.error(t('header.emptyCart'))
      return
    }

    setIsProcessingPayment(true)

    try {
      // Generate a unique order number
      const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      // Calculate total amount
      const totalAmount = cartItems.reduce((sum, item) => {
        const product = item?.product;
        return sum + (product?.prix || 0) * (item?.qte || 0);
      }, 0);

      // Create the order first
      const orderData = {
        data: {
          statusOrder: "pending",
          totalAmount: totalAmount,
          user: parseInt(userId),
          orderNumber: orderNumber,
          currency: 'usd',
          products: cartItems.map(item => parseInt(item.product.id)),
          quantities: cartItems.reduce((acc, item) => ({
            ...acc,
            [item.product.id]: parseInt(item.qte)
          }), {}),
          shippingAddress: {
            line1: user?.address?.line1 || '',
            line2: user?.address?.line2 || '',
            city: user?.address?.city || '',
            state: user?.address?.state || '',
            postal_code: user?.address?.postal_code || '',
            country: user?.address?.country || 'US'
          },
          paymentStatus: "pending"
        }
      };

      // Create the order
      const orderResponse = await axios.post('https://useful-champion-e28be6d32c.strapiapp.com/api/orders', orderData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      console.log('Order created:', orderResponse.data);
      
      // Set the order ID and amount for the checkout form
      setOrderId(orderResponse.data.data.id);
      setCheckoutAmount(totalAmount);
      setShowCheckoutForm(true);
      setCartOpen(false); // Close the cart sidebar
      
    } catch (error) {
      console.error('Error in checkout process:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
        console.error('Error details:', error.response.data.error);
      }
      toast.error(t('header.paymentError'));
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handlePaymentSuccess = async (response) => {
    try {
      // Show success message
      toast.success(t('header.paymentSuccess'));
      
      // Redirect to orders page
      window.location.href = '/view/orders';
    } catch (error) {
      console.error('Error handling payment success:', error);
      if (error.type === 'card_error') {
        switch (error.code) {
          case 'invalid_number':
            toast.error(t('payment.errors.invalidCardNumber'));
            break;
          case 'incomplete_number':
            toast.error(t('payment.errors.incompleteCardNumber'));
            break;
          case 'invalid_expiry':
            toast.error(t('payment.errors.invalidExpiryDate'));
            break;
          case 'incomplete_expiry':
            toast.error(t('payment.errors.incompleteExpiryDate'));
            break;
          case 'invalid_cvc':
            toast.error(t('payment.errors.invalidCVC'));
            break;
          case 'incomplete_cvc':
            toast.error(t('payment.errors.incompleteCVC'));
            break;
          case 'card_declined':
            toast.error(t('payment.errors.cardDeclined'));
            break;
          default:
            toast.error(t('payment.errors.processingError'));
        }
      } else if (error.message?.includes('incomplete')) {
        // Handle Stripe's default incomplete messages
        if (error.message.includes('card number')) {
          toast.error(t('payment.errors.incompleteCardNumber'));
        } else if (error.message.includes('expiry')) {
          toast.error(t('payment.errors.incompleteExpiryDate'));
        } else if (error.message.includes('cvc')) {
          toast.error(t('payment.errors.incompleteCVC'));
        } else {
          toast.error(t('payment.errors.processingError'));
        }
      } else {
        toast.error(t('payment.errors.processingError'));
      }
    }
  };

  const handlePaymentCancel = () => {
    setShowCheckoutForm(false);
  };

  // Add validation function for payment form
  const validatePaymentForm = (formData) => {
    if (!formData.cardNumber) {
      toast.error(t('payment.errors.incompleteCardNumber'));
      return false;
    }
    if (!formData.expiryDate) {
      toast.error(t('payment.errors.incompleteExpiryDate'));
      return false;
    }
    if (!formData.cvc) {
      toast.error(t('payment.errors.incompleteCVC'));
      return false;
    }
    if (!formData.name) {
      toast.error(t('payment.errors.incompleteName'));
      return false;
    }
    if (!formData.address) {
      toast.error(t('payment.errors.incompleteAddress'));
      return false;
    }
    return true;
  };

  return (
    <header className="sticky top-0 z-50  bg-white border-b border-gray-200">
      <ToastContainer />
      {/* Top bar */}
      <div className="bg-[#1e3a8a] text-white py-2 text-center text-sm">
        <p>{t('header.freeShipping')}</p>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 sm:px-15 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and mobile menu */}
          <div className="flex items-center gap-4">
            <button className="lg:hidden cursor-pointer" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Menu className="h-6 w-6" />
            </button>

            <Link to={`/view/${id}`} className="flex items-center gap-2 cursor-pointer">
              <img
                src={boutiques?.logo?.url ? `${boutiques.logo.url}` : "/placeholder.svg"}
                alt={boutiques?.nom || "ShopEase"}
                className="w-6 h-6 object-cover"
              />
              <span className="font-bold text-xl hidden sm:inline-block">{boutiques?.nom}</span>
            </Link>
          </div>

          {/* Search bar - desktop only */}
          <div className="hidden md:block flex-1 max-w-xl mx-4 cursor-pointer">
            <div className="relative">
              <Search className={` ${lang === 'ar' ? 'right-3' : 'left-3'} absolute  top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4`} />
              <form onSubmit={handleSearchSubmit}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('header.searchPlaceholderFull')}
                  className={`${lang === 'ar' ? 'pr-10 pl-12' : 'pl-10 pr-12'} w-full  py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:border-[#1e3a8a]`}
                />
                <button 
                  type="submit"
                  className={`absolute ${lang === 'ar' ? 'left-1' : 'right-1'}  top-1/2 transform -translate-y-1/2 h-7 bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 text-white px-3 rounded-md text-sm cursor-pointer`}
                >
                  {t('header.search')}
                </button>
              </form>
            </div>
          </div>

          {/* User actions */}
          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <div className="relative">
              <button
                className="flex items-center justify-center p-2 rounded-full hover:bg-gray-100 cursor-pointer"
                onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
              >
                <Globe className="h-5 w-5" />
              </button>

              {languageMenuOpen && (
                <div className={`${lang === 'ar' ? 'left-0' : 'right-0'} absolute  mt-2 w-32 bg-white rounded-md shadow-lg border overflow-hidden z-20`}>
                  <div className="p-1">
                    <button
                      onClick={() => handleLanguageChange('en')}
                      className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-center cursor-pointer"
                    >
                      English
                    </button>
                    <button
                      onClick={() => handleLanguageChange('fr')}
                      className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-center cursor-pointer"
                    >
                      Français
                    </button>
                    <button
                      onClick={() => handleLanguageChange('ar')}
                      className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-center cursor-pointer"
                    >
                      العربية
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User menu */}
            <div className="relative">
              <button
                className="hidden sm:flex items-center justify-center p-2 rounded-full hover:bg-gray-100 cursor-pointer"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                {user?.photo ? <div className="">
                  <img src={`${user.photo.url}`} className="h-9 w-9 rounded-full" />
                </div> : <User className="h-5 w-5" />}
              </button>

              {userMenuOpen && (
                <div className={`absolute ${lang === 'ar' ? 'left-0' : 'right-0'}  mt-2 w-56 bg-white rounded-md shadow-lg border overflow-hidden z-20`}>

                  <div className={`p-3 ${user ? 'text-center' : 'text-start'} `}>
                    <p className=" font-medium">{user?.username || t('header.welcome')}</p>
                    <p className="text-sm text-gray-500">{user?.email || ''}</p>
                  </div>
                  <hr />
                  <div className="p-1">
                    {IDUser ? <Link
                      to="/controll/Profil"
                      className={`block px-4 py-2 text-sm hover:bg-gray-100 w-full ${lang === 'ar' ? 'text-right' : 'text-left'} cursor-pointer`}
                      onClick={() => setUserMenuOpen(false)}
                    >
                      {t('header.profile')}
                    </Link> : <Link
                      to="/Login"
                      className={`block px-4 py-2 text-sm hover:bg-gray-100 w-full ${lang === 'ar' ? 'text-right' : 'text-left'} cursor-pointer`}
                      onClick={() => setUserMenuOpen(false)}
                    >
                      {t('header.login')}
                    </Link>}



                    {IDUser ? (
                      <button
                        className={`block px-4 py-2 text-sm hover:bg-gray-100 w-full ${lang === 'ar' ? 'text-right' : 'text-left'} cursor-pointer`}
                        onClick={() => {
                          setUserMenuOpen(false);
                          const langValue = localStorage.getItem('lang');
                          localStorage.clear();
                          localStorage.setItem('lang', langValue);
                          localStorage.setItem('location', "login");
                          navigate('/login');
                        }}
                      >
                        {t('header.logout')}
                      </button>
                    ) : (
                      <Link
                        to="/register"
                        className={`block px-4 py-2 text-sm hover:bg-gray-100 w-full ${lang === 'ar' ? 'text-right' : 'text-left'} cursor-pointer`}
                      >
                        {t('header.signup')}
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Favorites button */}
            <div className="relative">
              <button
                className="relative p-2 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
                onClick={() => setFavoritesOpen(!favoritesOpen)}
              >
                <Heart className="h-5 w-5" />
                {favorites.length > 0 && (
                  <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-[#1e3a8a] text-white text-xs flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </button>

              {favoritesOpen && (
                <div className="fixed inset-0 z-50 overflow-hidden">
                  <div className="absolute inset-0 bg-black/50" onClick={() => setFavoritesOpen(false)}></div>
                  <div className={`fixed inset-y-0 ${lang === "ar" ? "left-0" : "right-0"} max-w-full flex`}>
                    <div className="w-screen max-w-md">
                      <div className="h-full flex flex-col bg-white shadow-xl">
                        <div className="flex items-center justify-between p-4 border-b">
                          <h2 className="text-lg font-semibold">{t('header.favorites')}</h2>
                          <button onClick={() => setFavoritesOpen(false)}>
                            <X className="h-5 w-5" />
                          </button>
                        </div>

                        {favoritesLoading ? (
                          <div className="flex-1 flex items-center justify-center">
                            {IDUser ? <p>{t('header.loading')}</p> :
                              <div className="">
                                <div className="">
                                  <p className="text-center font-medium p-1.5">{t('header.goTo')}</p>
                                </div>
                                <Link
                                  to="/login"
                                  className="block bg-purple-700 hover:bg-purple-800 text-white py-2 px-4 rounded-md text-center cursor-pointer"
                                  onClick={() => setFavoritesOpen(false)}
                                >
                                  {t('header.login')}
                                </Link>
                              </div>
                            }
                          </div>
                        ) : favorites.length === 0 ? (
                          <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                              <Heart className="h-8 w-8 text-gray-400" />
                            </div>
                            <h3 className="font-medium text-lg mb-2">{t('header.emptyFavorites')}</h3>
                            <p className="text-gray-500 mb-6">{t('header.emptyFavoritesDesc')}</p>
                            <button className="bg-purple-700 hover:bg-purple-800 text-white py-2 px-4 rounded-md cursor-pointer">
                              <p onClick={() => setFavoritesOpen(false)} >{t('header.continueShopping')}</p>
                            </button>
                          </div>
                        ) : (
                          <div className="flex-1 overflow-auto py-6">
                            <div className="space-y-6 px-4">
                              {favorites.map((favorite) => {
                                const product = favorite?.product;
                                return (
                                  <div key={favorite.id} className="flex gap-4">
                                    <Link 
                                      to={`/view/products/${product?.documentId}`}
                                      className="relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0 border bg-white cursor-pointer"
                                      onClick={() => setFavoritesOpen(false)}
                                    >
                                      <img
                                        src={product?.imgMain?.url ? `${product.imgMain.url}` : "/placeholder.svg"}
                                        alt={product?.name}
                                        className="object-cover w-full h-full"
                                      />
                                    </Link>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex justify-between">
                                        <Link 
                                          to={`/view/products/${product?.documentId}`} 
                                          className="font-medium text-sm line-clamp-1 hover:text-purple-700 cursor-pointer"
                                          onClick={() => setFavoritesOpen(false)}
                                        >
                                          {product?.name}
                                        </Link>
                                        <button
                                          className="text-gray-400 hover:text-red-500 cursor-pointer"
                                          onClick={() => handleRemoveFromFavorites(favorite.documentId)}
                                        >
                                          <X className="h-4 w-4" />
                                        </button>
                                      </div>
                                      <div className="mt-2">
                                        <span className="font-medium">${product?.prix}</span>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Cart button */}
            <div className="relative">
              <button
                className="relative p-2 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
                onClick={() => setCartOpen(!cartOpen)}
              >
                <ShoppingCart className="h-5 w-5" />
                {totalCartItems > 0 && (
                  <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-[#1e3a8a] text-white text-xs flex items-center justify-center">
                    {totalCartItems}
                  </span>
                )}
              </button>

              {cartOpen && (
                <div className="fixed inset-0 z-50 overflow-hidden">
                  <div className="absolute inset-0 bg-black/50" onClick={() => setCartOpen(false)}></div>
                  <div className={`fixed inset-y-0 ${lang === "ar" ? "left-0" : "right-0"} max-w-full flex`}>
                    <div className="w-screen max-w-md">
                      <div className="h-full flex flex-col bg-white shadow-xl">
                        <div className="flex items-center justify-between p-4 border-b">
                          <h2 className="text-lg font-semibold">{t('header.cart')}</h2>
                          <button onClick={() => setCartOpen(false)}>
                            <X className="h-5 w-5" />
                          </button>
                        </div>

                        {cartLoading ? (
                          <div className="flex-1 flex items-center justify-center">
                            {IDUser ? <p>{t('header.loading')}</p> :
                              <div className="">
                                <div className="">
                                  <p className="text-center font-medium p-1.5">{t('header.goTo')}</p>
                                </div>
                                <Link
                                  to="/login"
                                  className="block  bg-purple-700 hover:bg-purple-800 text-white py-2 px-4 rounded-md text-center cursor-pointer"
                                  onClick={() => setMobileMenuOpen(false)}
                                >
                                  {t('header.login')}
                                </Link>
                              </div>
                            }

                          </div>
                        ) : cartItems.length === 0 ? (
                          <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                              <ShoppingCart className="h-8 w-8 text-gray-400" />
                            </div>
                            <h3 className="font-medium text-lg mb-2">{t('header.emptyCart')}</h3>
                            <p className="text-gray-500 mb-6">{t('header.emptyCartDesc')}</p>
                            <button className="bg-purple-700 hover:bg-purple-800 text-white py-2 px-4 rounded-md cursor-pointer">
                              <p  onClick={() => setCartOpen(false)}>{t('header.continueShopping')}</p>
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="flex-1 overflow-auto py-6">
                              <div className="space-y-6 px-4">
                                {cartItems.map((item) => {
                                  const product = item?.product;
                                  return (
                                    <div key={item.id} className="flex gap-4">
                                      <div className="relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0 border bg-white cursor-pointer">
                                        <img
                                          src={product?.imgMain?.url ? `${product.imgMain.url}` : "/placeholder.svg"}
                                          alt={product?.name}
                                          className="object-cover w-full h-full"
                                        />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="flex justify-between">
                                          <h4 className="font-medium text-sm line-clamp-1">{product?.name}</h4>
                                          <button
                                            className="text-gray-400 hover:text-red-500 cursor-pointer"
                                            onClick={() => handleRemoveFromCart(item.documentId)}
                                          >
                                            <X className="h-4 w-4" />
                                          </button>
                                        </div>
                                        <div className="mt-2 flex items-center justify-between">
                                          <div className="flex items-center border rounded-md">
                                            <button
                                              className="p-1 px-2 text-gray-600 hover:bg-gray-100 cursor-pointer"
                                              onClick={() => handleUpdateQuantity(item.documentId, item.qte - 1)}
                                            >
                                              <Minus className="h-3 w-3" />
                                            </button>
                                            <span className="px-2 text-sm">{item.qte}</span>
                                            <button
                                              className="p-1 px-2 text-gray-600 hover:bg-gray-100 cursor-pointer"
                                              onClick={() => handleUpdateQuantity(item.documentId, item.qte + 1)}
                                            >
                                              <Plus className="h-3 w-3" />
                                            </button>
                                          </div>
                                          <span className="font-medium">${(product?.prix * item.qte).toFixed(2)}</span>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            <div className="border-t pt-6 px-4">
                              <div className="space-y-4">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">{t('header.subtotal')}</span>
                                  <span className="font-medium">${totalPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">{t('header.shipping')}</span>
                                  <span className="font-medium">
                                    {totalPrice > 50 ? t('header.free') : "$10.00"}
                                  </span>
                                </div>
                                <hr />
                                <div className="flex justify-between">
                                  <span className="font-semibold">{t('header.total')}</span>
                                  <span className="font-bold text-lg">
                                    ${(totalPrice + (totalPrice > 50 ? 0 : 10)).toFixed(2)}
                                  </span>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-2">
                                  <button className="border border-gray-300 hover:bg-gray-50 py-2 px-4 rounded-md cursor-pointer">
                                    <Link to="/categories/electronics" className="w-full">
                                      {t('header.continue')}
                                    </Link>
                                  </button>
                                  <button 
                                    onClick={handleCheckout}
                                    disabled={isProcessingPayment}
                                    className={`bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 text-white py-2 px-4 rounded-md cursor-pointer ${
                                      isProcessingPayment ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                  >
                                    {isProcessingPayment ? t('header.processing') : t('header.checkout')}
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
          <Link to={`/view/${id}`} className="text-sm font-medium hover:text-purple-700 transition-colors cursor-pointer">
            {t('header.home')}
          </Link>

          <div className="relative">
            <button
              className="flex items-center gap-1 text-sm font-medium hover:text-purple-700 transition-colors cursor-pointer"
              onClick={() => setCategoryMenuOpen(!categoryMenuOpen)}
            >
              {t('header.categories')} <ChevronDown className="h-4 w-4" />
            </button>

            {categoryMenuOpen && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-md shadow-lg border overflow-hidden z-20">
                <div className="p-1">
                  {getCategoriesWithProducts().map((category) => (
                    <Link
                      key={category.id}
                      to={`/view/categories/${category.documentId}`}
                      className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left cursor-pointer"
                      onClick={() => setCategoryMenuOpen(false)}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

         

          <Link to="/view/contact" className="text-sm font-medium hover:text-purple-700 transition-colors cursor-pointer">
            {t('header.contact')}
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
                  <h2 className="font-semibold">{t('header.menu')}</h2>
                  <button onClick={() => setMobileMenuOpen(false)}>
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="py-4">
                  {/* Mobile Search */}
                  <div className="px-3 mb-4">
                    <form onSubmit={handleSearchSubmit} className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t('header.searchPlaceholderFull')}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:border-[#1e3a8a]"
                      />
                    </form>
                  </div>

                  <nav className="space-y-1 px-3">
                    <Link
                      to={`/view/${id}`}
                      className="block py-2 px-3 hover:bg-gray-100 rounded-md cursor-pointer"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t('header.home')}
                    </Link>

                    <div className="py-2">
                      <button
                        className="flex w-full items-center justify-between px-3 py-2 hover:bg-gray-100 rounded-md cursor-pointer"
                        onClick={() => {
                          const el = document.getElementById("mobile-categories")
                          if (el) {
                            el.classList.toggle("hidden")
                          }
                        }}
                      >
                        {t('header.categories')}
                        <ChevronDown className="h-4 w-4" />
                      </button>
                      <div id="mobile-categories" className="hidden pl-4 space-y-1 mt-1">
                        {getCategoriesWithProducts().map((category) => (
                          <Link
                            key={category.id}
                            to={`/view/categories/${category.documentId}`}
                            className="cursor-pointer"
                          >
                            {category.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Stripe Elements Provider and Checkout Form */}
      {showCheckoutForm && (
        <div className="fixed inset-0 bg-black/55 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{t('checkout.title')}</h2>
              <button
                onClick={handlePaymentCancel}
                className="text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <Elements stripe={stripePromise}>
              <CheckoutForm
                amount={checkoutAmount}
                onSuccess={handlePaymentSuccess}
                onCancel={handlePaymentCancel}
                orderId={orderId}
                userData={user}
                cartItems={cartItems}
              />
            </Elements>
          </div>
        </div>
      )}
    </header>
  );
}