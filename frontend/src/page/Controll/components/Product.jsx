import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Edit, MoreHorizontal, Package, PlusCircle, Search, Trash, Image } from "lucide-react";
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next';

export default function ProductsPage() {
  const { t } = useTranslation();
  const [isDropdownOpen, setIsDropdownOpen] = useState({});
  const [selectedStore, setSelectedStore] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const IDUser = localStorage.getItem('IDUser');
  // Fetch products and stores from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        if (!token) {
          navigate('/login');
          return;
        }

        // Fetch user's stores
        const storesResponse = await axios.get(`http://localhost:1337/api/users/${IDUser}?populate=boutiques`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        const userStores = storesResponse.data.boutiques || [];
        setStores(userStores);

        // Fetch products for each store
        const allProducts = [];
        for (const store of userStores) {
          const productsResponse = await axios.get(`http://localhost:1337/api/products?filters[boutique][id][$eq]=${store.id}&populate=*`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          if (productsResponse.data.data) {
            allProducts.push(...productsResponse.data.data);
          }
        }
        
        setProducts(allProducts);
        
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Erreur lors du chargement des données');
        toast.error('Erreur lors du chargement des données', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate, token, IDUser]);


  const toggleDropdown = (productId, event) => {
    // Close all other dropdowns first
    const newDropdownState = {};
    newDropdownState[productId] = !isDropdownOpen[productId];
    setIsDropdownOpen(newDropdownState);
    
    // Prevent event from bubbling up
    event.stopPropagation();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsDropdownOpen({});
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const getStatusBadgeClass = (stock) => {
    if (stock > 10) return 'bg-green-100 text-green-800';
    if (stock > 0) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getStatusText = (stock) => {
    if (stock > 10) return 'En stock';
    if (stock > 0) return 'Stock faible';
    return 'Épuisé';
  };

  const handleDeleteProduct = async (productId) => {
    const result = await Swal.fire({
      title: "Êtes-vous sûr?",
      text: "Êtes-vous sûr de vouloir supprimer ce produit ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, supprimer!",
      cancelButtonText: "Annuler"
    });
    
    if (result.isConfirmed) {
      try {
        if (!token) {
          navigate('/login');
          return;
        }

        await axios.delete(`http://localhost:1337/api/products/${productId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Update the products list after deletion
        setProducts(prevProducts => prevProducts?.filter(product => product.documentId !== productId));
        setIsDropdownOpen({});
        
        // Show success toast
        toast.success('Produit supprimé avec succès', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } catch (err) {
        console.error('Error deleting product:', err);
        if (err.response && err.response.status === 401) {
          navigate('/login');
        } else {
          toast.error('Erreur lors de la suppression du produit. Veuillez réessayer.', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
      }
    }
  };

  // Get unique categories from products
  const getUniqueCategories = () => {
    const categories = new Set();
    products.forEach(product => {
      if (product && product.categories) {
        categories.add(product.categories);
      }
    });
    return Array.from(categories);
  };

  // Filtrage des produits
  const filteredProducts = products.filter(product => {
    // Filter by store
    if (selectedStore !== 'all' && product?.boutique?.id !== parseInt(selectedStore)) {
      return false;
    }
    
    // Filter by category
    if (selectedCategory !== 'all' && product?.categories !== selectedCategory) {
      return false;
    }
    
    // Filter by search query
    return (product?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
           (product?.description?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
           (product?.sku?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6D28D9]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="bg-red-50 text-red-700 p-4 rounded-md">
          {error}
        </div>
        <button 
          onClick={() => navigate('/login')}
          className="mt-4 px-4 py-2 bg-[#6D28D9] text-white rounded-lg hover:bg-[#6D28D9]/90 transition-colors"
        >
          Se connecter
        </button>
      </div>
    );
  }
  

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('product.products.title')}</h1>
          <p className="text-gray-500">{t('product.products.subtitle')}</p>
        </div>
        <Link 
          to="/controll/AddProduct"
          className="inline-flex items-center px-4 py-2 bg-[#6D28D9] text-white rounded-lg hover:bg-[#6D28D9]/90 transition-colors"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          {t('product.products.createProduct')}
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder={t('product.products.search')}
            className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c8c2fd] focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="relative w-full md:w-[200px]">
          <select
            value={selectedStore}
            onChange={(e) => setSelectedStore(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#c8c2fd] focus:border-transparent"
          >
            <option value="all">{t('product.products.allStores')}</option>
            {stores && stores.map(store => (
              <option key={store.id} value={store.id}>
                {store?.nom || `Boutique ${store.id}`}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        <div className="relative w-full md:w-[200px]">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#c8c2fd] focus:border-transparent"
          >
            <option value="all">{t('product.products.allCategories')}</option>
            {getUniqueCategories().map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          {t('product.products.noProducts')}
        </div>
      ) : (
        <div className="border border-[#c8c2fd] shadow rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-[#c8c2fd]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#1e3a8a] uppercase tracking-wider">{t('product.products.table.product')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#1e3a8a] uppercase tracking-wider hidden md:table-cell">{t('product.products.table.id')}</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-[#1e3a8a] uppercase tracking-wider">{t('product.products.table.price')}</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-[#1e3a8a] uppercase tracking-wider">{t('product.products.table.stock')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#1e3a8a] uppercase tracking-wider hidden md:table-cell">{t('product.products.table.category')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#1e3a8a] uppercase tracking-wider hidden md:table-cell">{t('product.products.table.store')}</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-[#1e3a8a] uppercase tracking-wider">{t('product.products.table.status')}</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-[#1e3a8a] uppercase tracking-wider">{t('product.products.table.actions')}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#c8c2fd]">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {product?.imgMain ? (
                        <div className="w-10 h-10 rounded overflow-hidden">  
                          <img 
                            src={`http://localhost:1337${product.imgMain.url || product.imgMain?.url}`} 
                            alt={product?.name || 'Product'}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center">
                          <Image className="h-5 w-5 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <span className="font-medium">{product?.name || t('product.products.noName')}</span>
                        <div className="text-xs text-gray-500">SKU: {product?.sku || 'N/A'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell text-gray-500">
                    {product.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    {product?.prix?.toFixed(2) || '0.00'} €
                    {product?.comparePrice > 0 && (
                      <div className="text-xs text-gray-500 line-through">
                        {product.comparePrice.toFixed(2)} €
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {product?.stock || 0}
                    {product?.lowStockAlert && (
                      <div className="text-xs text-gray-500">
                        {t('product.products.lowStockAlert')}: {product.lowStockAlert}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                    {product?.categories ? (
                      <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                        {product.categories}
                      </span>
                    ) : (
                      t('product.products.uncategorized')
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                    {product?.boutique?.nom || t('product.products.unassigned')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(product?.stock || 0)}`}>
                      {getStatusText(product?.stock || 0)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="relative">
                      <button
                        onClick={(e) => toggleDropdown(product.id, e)}
                        className="hover:text-[#c8c2fd] text-[#6D28D9] focus:outline-none"
                      >
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                      {isDropdownOpen[product.id] && (
                        <div className="absolute right-6 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-[#c8c2fd] ring-opacity-5" style={{ position: 'fixed', zIndex: 1000 }}>
                          <div className="pt-1">
                            <div className="px-4 py-2 text-start text-sm text-gray-700 font-medium">{t('product.products.actions')}</div>
                            <div className="h-px bg-[#c8c2fd]"></div>
                            <Link
                              to={`/controll/edit-product/${product.documentId}`}
                              className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              {t('product.products.actions.edit')}
                            </Link>
                            <button 
                              className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                              onClick={() => {
                                setIsDropdownOpen({});
                                // Logic for managing stock
                              }}
                            >
                              <Package className="mr-2 h-4 w-4" />
                              {t('product.products.actions.manageStock')}
                            </button>
                            <div className="h-px bg-[#c8c2fd]"></div>
                            <button 
                              className="w-full rounded-b-md px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                              onClick={() => handleDeleteProduct(product.documentId)}
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              {t('product.products.actions.delete')}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
