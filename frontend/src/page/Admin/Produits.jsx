"use client"

import { useState, useEffect } from "react"
import { ShoppingBag, Search, Eye, Trash2, Filter, Tag, Store, Package, Info, DollarSign, Box, AlertCircle, Ruler, Truck, X } from "lucide-react"
import axios from "axios"
import { useTranslation } from 'react-i18next'

export default function Products() {
  const { t } = useTranslation()
  const [products, setProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [categoryFilter, setCategoryFilter] = useState("")
  const [storeFilter, setStoreFilter] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [categories, setCategories] = useState([])

  // Fetch products and categories from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesResponse = await axios.get('http://localhost:1337/api/categorie-products')
        setCategories(categoriesResponse.data.data)

        // Fetch products
        const response = await axios.get('http://localhost:1337/api/products?populate=*')
        setProducts(response.data.data)
        setIsLoading(false)
      } catch (err) {
        setError('Failed to fetch data')
        setIsLoading(false)
        console.error('Error fetching data:', err)
      }
    }

    fetchData()
  }, [])

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(amount)
  }

  const openDeleteModal = (product) => {
    setSelectedProduct(product)
    setDeleteModalOpen(true)
  }

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return

    setIsSubmitting(true)

    try {
      await axios.delete(`http://localhost:1337/api/products/${selectedProduct.documentId}`)
      
      // Update local state
      const updatedProducts = products.filter((p) => p.id !== selectedProduct.id)
      setProducts(updatedProducts)
      setDeleteModalOpen(false)
    } catch (error) {
      console.error('Error deleting product:', error)
      setError('Failed to delete product')
    } finally {
      setIsSubmitting(false)
    }
  }

  const openViewModal = (product) => {
    setSelectedProduct(product)
    setViewModalOpen(true)
  }

  // Filter products based on search term and filters
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter ? product.category?.id === Number.parseInt(categoryFilter) : true
    const matchesStore = storeFilter ? product.boutique?.id === Number.parseInt(storeFilter) : true

    return matchesSearch && matchesCategory && matchesStore
  })

  // Get unique stores from products
  const stores = [...new Set(products.map(product => product.boutique).filter(Boolean))]

  const resetFilters = () => {
    setCategoryFilter("")
    setStoreFilter("")
    setSearchTerm("")
  }

  // Get categories that have products
  const getCategoriesWithProducts = () => {
    const categoryIds = new Set()
    products.forEach(product => {
      if (product.category?.id) {
        categoryIds.add(product.category.id)
      }
    })
    return categories.filter(category => categoryIds.has(category.id))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t('productsAdmin.title')}</h1>
          <p className="text-gray-500">{t('productsAdmin.subtitle')}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-wrap gap-4">
          <div className="w-full md:w-auto flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder={t('productsAdmin.search.placeholder')}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <div className="w-full md:w-auto">
            <select
              className="w-full md:w-[180px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">{t('productsAdmin.search.filters.category.label')}</option>
              {getCategoriesWithProducts().map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full md:w-auto">
            <select
              className="w-full md:w-[180px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              value={storeFilter}
              onChange={(e) => setStoreFilter(e.target.value)}
            >
              <option value="">{t('productsAdmin.search.filters.store.label')}</option>
              {stores.map((store) => (
                <option key={store.id} value={store.id}>
                  {store.nom}
                </option>
              ))}
            </select>
          </div>

          <button
            className="ml-auto flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            onClick={resetFilters}
          >
            <Filter className="mr-2 h-4 w-4" />
            {t('productsAdmin.search.reset')}
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('productsAdmin.table.product')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('productsAdmin.table.price')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('productsAdmin.table.store')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('productsAdmin.table.category')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('productsAdmin.table.stock')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('productsAdmin.table.addedOn')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('productsAdmin.table.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 mr-3">
                        {product.imgMain?.formats?.thumbnail?.url ? (
                          <img
                            src={`http://localhost:1337${product.imgMain.formats.thumbnail.url}`}
                            alt={product.name}
                            className="h-full w-full object-cover rounded-lg"
                          />
                        ) : (
                          <ShoppingBag className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">{product.name}</p>
                        <p className="text-gray-500 text-xs">{t('productsAdmin.table.id', { id: product.id })}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-medium">{formatCurrency(product.prix)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.boutique ? (
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        {product.boutique.nom}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-sm">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                      {product.category ? categories.find(cat => cat.id === product.category.id)?.name : '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      product.stock <= product.lowStockAlert
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}>
                      {product.stock === 0 
                        ? t('productsAdmin.status.outOfStock')
                        : t(product.stock <= product.lowStockAlert ? 'productsAdmin.status.lowStock' : 'productsAdmin.status.inStock', { count: product.stock })}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm">{new Date(product.createdAt).toLocaleDateString()}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button 
                        className="text-gray-500 hover:text-gray-700" 
                        onClick={() => openViewModal(product)}
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={() => openDeleteModal(product)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">{t('productsAdmin.noProducts')}</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Trash2 className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {t('productsAdmin.modals.delete.title')}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        {t('productsAdmin.modals.delete.message', { name: selectedProduct?.name })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleDeleteProduct}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t('productsAdmin.modals.delete.buttons.processing') : t('productsAdmin.modals.delete.buttons.confirm')}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setDeleteModalOpen(false)}
                  disabled={isSubmitting}
                >
                  {t('productsAdmin.modals.delete.buttons.cancel')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <div className="h-16 w-16 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 mr-4">
                      {selectedProduct.imgMain?.formats?.thumbnail?.url ? (
                        <img
                          src={`http://localhost:1337${selectedProduct.imgMain.formats.thumbnail.url}`}
                          alt={selectedProduct.name}
                          className="h-full w-full object-cover rounded-lg"
                        />
                      ) : (
                        <ShoppingBag className="h-8 w-8" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{selectedProduct.name}</h3>
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                        {selectedProduct.category ? categories.find(cat => cat.id === selectedProduct.category.id)?.name : '-'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setViewModalOpen(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Product Details */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">{t('productsAdmin.modals.view.description')}</h4>
                      <p className="text-gray-900">{selectedProduct.description}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">{t('productsAdmin.modals.view.priceAndStock')}</h4>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-gray-900 font-medium">{formatCurrency(selectedProduct.prix)}</span>
                          {selectedProduct.comparePrice && (
                            <span className="ml-2 text-sm text-gray-500 line-through">
                              {formatCurrency(selectedProduct.comparePrice)}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center">
                          <Box className="h-4 w-4 text-gray-400 mr-2" />
                          <span className={`text-sm ${
                            selectedProduct.stock <= selectedProduct.lowStockAlert
                              ? "text-red-600"
                              : "text-green-600"
                          }`}>
                            {t('productsAdmin.modals.view.stockCount')}: {selectedProduct.stock}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <AlertCircle className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-600">
                            {t('productsAdmin.modals.view.lowStockAlert')}: {selectedProduct.lowStockAlert}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">{t('productsAdmin.modals.view.dimensionsAndWeight')}</h4>
                      <div className="space-y-2">
                        {selectedProduct.dimensions && selectedProduct.dimensions[0] && (
                          <div className="flex items-center">
                            <Ruler className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-600">
                              {selectedProduct.dimensions[0].length} x {selectedProduct.dimensions[0].width} x {selectedProduct.dimensions[0].height} {selectedProduct.dimensions[0].unit}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center">
                          <Package className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-600">
                            {t('productsAdmin.modals.view.weight')}: {selectedProduct.weight} kg
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">{t('productsAdmin.modals.view.additionalInfo')}</h4>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Tag className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-600">
                            {t('productsAdmin.modals.view.sku')}: {selectedProduct.sku}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Truck className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-600">
                            {t('productsAdmin.modals.view.shippingClass')}: {selectedProduct.shippingClass}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Store Details and Images */}
                  <div className="space-y-4">
                    {selectedProduct.boutique && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2">{t('productsAdmin.modals.view.store')}</h4>
                        <div className="bg-gray-50 p-3 rounded-md">
                          <p className="font-medium text-gray-900">{selectedProduct.boutique.nom}</p>
                          <p className="text-sm text-gray-600">{selectedProduct.boutique.description}</p>
                          <p className="text-sm text-gray-600 mt-1">{selectedProduct.boutique.emplacement}</p>
                        </div>
                      </div>
                    )}

                    {/* Additional Images */}
                    {selectedProduct.imgsAdditional && selectedProduct.imgsAdditional.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2">{t('productsAdmin.modals.view.additionalImages')}</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {selectedProduct.imgsAdditional.map((img) => (
                            <div key={img.id} className="relative aspect-square">
                              <img
                                src={`http://localhost:1337${img.formats.thumbnail.url}`}
                                alt={img.name}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
