"use client"

import React, { useState, useEffect } from "react"
import {
  Download,
  Eye,
  Search,
  ShoppingBag,
  Filter,
  X,
  RefreshCw,
  Info,
  AlertTriangle,
  ChevronDown,
  Package,
} from "lucide-react"
import axios from "axios"
import { useTranslation } from "react-i18next"
import { toast } from 'react-hot-toast'
import { generateOrderInvoice } from '../../../utils/pdfGenerator'

export default function OrdersPage() {
  const { t } = useTranslation()
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [openActionMenu, setOpenActionMenu] = useState(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filteredOrders, setFilteredOrders] = useState([])
  const [isFiltersVisible, setIsFiltersVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const IDUser = localStorage.getItem("IDUser")
  const lang = localStorage.getItem("lang")
  const [showCheckoutForm, setShowCheckoutForm] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [checkoutAmount, setCheckoutAmount] = useState(0)
  const [orderId, setOrderId] = useState(null)

  // Check if mobile on mount and when window resizes
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Initial check
    checkIfMobile()

    // Add event listener
    window.addEventListener("resize", checkIfMobile)

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        const response = await axios.get(
          `https://stylish-basket-710b77de8f.strapiapp.com/api/orders?filters[user][id][$eq]=${IDUser}&populate[products][populate]=imgMain&populate[user][populate]=*`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        )
        setOrders(response.data.data)
        setFilteredOrders(response.data.data) // Initialize filtered orders
        setLoading(false)
      } catch (err) {
        setError(t("orders.orders.error"))
        setLoading(false)
        console.error("Error fetching orders:", err)
      }
    }

    fetchOrders()
  }, [IDUser, t])

  // Add useEffect for filtering
  useEffect(() => {
    let filtered = [...orders]

    // Filter by status
    if (selectedStatus !== "all") {
      filtered = filtered.filter((order) => order.statusOrder === selectedStatus)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (order) =>
          order.id.toString().toLowerCase().includes(query) ||
          (order.user?.username || "").toLowerCase().includes(query) ||
          order.statusOrder.toLowerCase().includes(query),
      )
    }

    setFilteredOrders(filtered)
  }, [orders, selectedStatus, searchQuery])

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "processing":
        return "bg-yellow-100 text-yellow-800"
      case "pending":
        return "bg-gray-100 text-gray-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status) => {
    return t(`orders.orders.status.${status.toLowerCase()}`)
  }

  const getPaymentStatusBadgeClass = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPaymentStatusText = (status) => {
    return t(`orders.orders.paymentStatus.${status.toLowerCase()}`)
  }

  const handleViewDetails = (order) => {
    setSelectedOrder(order)
    setOpenActionMenu(null)
  }

  const handleDownloadInvoice = (orderId) => {
    const order = orders.find(o => o.id === orderId)
    if (order) {
      generateOrderInvoice(order)
    }
  }

  const resetFilters = () => {
    setSelectedStatus("all")
    setSearchQuery("")
  }

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (openActionMenu && !event.target.closest(".action-menu")) {
        setOpenActionMenu(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [openActionMenu])

  const handlePaymentSuccess = async (response) => {
    try {
      // Show success message
      toast.success(t('orders.paymentSuccess'))
      
      // Refresh orders list
      const response = await axios.get(
        `https://stylish-basket-710b77de8f.strapiapp.com/api/orders?populate=*&filters[user][id][$eq]=${IDUser}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      setOrders(response.data.data)
      setFilteredOrders(response.data.data)
      
      // Close checkout form
      setShowCheckoutForm(false)
      setSelectedOrder(null)
    } catch (error) {
      console.error('Error handling payment success:', error)
      toast.error(t('orders.paymentError'))
    }
  }

  const handlePaymentCancel = () => {
    setShowCheckoutForm(false)
    setSelectedOrder(null)
  }

  // Mobile order card component
  const OrderCard = ({ order }) => (
    <div className="bg-white rounded-lg shadow-sm border border-[#c8c2fd]/30 p-4 mb-3">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-medium text-[#1e3a8a]">
            {order.orderNumber}
          </h3>
          <p className="text-xs text-gray-500">{new Date(order?.createdAt).toLocaleDateString()}</p>
        </div>
        <span
          className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(order?.statusOrder)}`}
        >
          {getStatusText(order?.statusOrder)}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
        <div>
          <p className="text-gray-500">{t("orders.orders.table.user")}</p>
          <p className="font-medium">{order?.user?.username || "N/A"}</p>
        </div>
        <div>
          <p className="text-gray-500">{t("orders.orders.table.paymentStatus")}</p>
          <p className="font-medium">{order?.paymentStatus}</p>
        </div>
        <div>
          <p className="text-gray-500">{t("orders.orders.table.total")}</p>
          <p className="font-medium text-[#6D28D9]">{order?.totalAmount.toFixed(2)} {order?.currency?.toUpperCase()}</p>
        </div>
      </div>

      {/* Products Preview */}
      <div className="mb-3">
        <p className="text-gray-500 mb-2">{t("orders.orders.table.products")}</p>
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {order.products?.map((product) => (
            <div key={product.id} className="flex-shrink-0">
              <img
                src={product.imgMain?.url ? 
                  `${product.imgMain.url}` : 
                  "/placeholder.svg"}
                alt={product.name}
                className="w-12 h-12 object-cover rounded-lg"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-2 border-t border-gray-100 pt-3">
        <button
          onClick={() => handleViewDetails(order)}
          className="inline-flex items-center px-2 py-1 text-sm text-blue-500 rounded hover:bg-blue-50"
        >
          <Eye className="h-4 w-4 mr-1" />
          {t("orders.orders.actions.view")}
        </button>
        <button
          onClick={() => handleDownloadInvoice(order.id)}
          className="inline-flex items-center px-2 py-1 text-sm text-green-500 rounded hover:bg-green-50"
        >
          <Download className="h-4 w-4 mr-1" />
          {t("orders.orders.actions.download")}
        </button>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6D28D9]"></div>
          <p className="text-[#6D28D9] font-medium">{t("orders.orders.loading")}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center justify-center space-x-2">
          <AlertTriangle className="h-5 w-5" />
          <span>{error}</span>
        </div>
        <div className="mt-4 space-x-4">
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#6D28D9] text-white rounded-lg hover:bg-[#6D28D9]/90 transition-colors inline-flex items-center"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            {t("orders.orders.retry")}
          </button>
        </div>
      </div>
    )
  }


  return (
    <div className="space-y-6 p-4 md:p-6 bg-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:space-x-3 mb-6">
        <div className="bg-[#6D28D9] p-3 rounded-lg shadow-lg mb-3 md:mb-0">
          <ShoppingBag className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#1e3a8a]">{t("orders.orders.title")}</h1>
          <p className="text-[#6D28D9]/70">{t("orders.orders.subtitle")}</p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-[#c8c2fd]/10 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-2 text-[#6D28D9]">
          <Info className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm">{t("orders.orders.infoMessage")}</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-4">
        <div className="relative w-full">
          <div className="relative">
            <Search
              className={`absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 ${lang === "ar" ? "right-3" : "left-3"}`}
            />
            <input
              type="text"
              placeholder={t("orders.orders.search")}
              className={`w-full py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:border-[#6D28D9] ${lang === "ar" ? "pl-4 pr-10" : "pl-10 pr-4"}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className={`absolute top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 ${lang === "ar" ? "left-3" : "right-3"}`}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 w-full">
          <button
            onClick={() => setIsFiltersVisible(!isFiltersVisible)}
            className="md:hidden inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <Filter className="mr-2 h-4 w-4" />
            {t("orders.orders.filters")} {isFiltersVisible ? "▲" : "▼"}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${isFiltersVisible || !isMobile ? "block" : "hidden"}`}>
        <div className="relative">
          <label className=" text-sm font-medium text-[#1e3a8a] mb-1 flex items-center">
            <Package className="h-4 w-4 mr-1" />
            {t("orders.orders.filterByStatus")}
          </label>
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:border-[#6D28D9]"
            >
              <option value="all">{t("orders.orders.allStatuses")}</option>
              <option value="pending">{t("orders.orders.status.pending")}</option>
              <option value="processing">{t("orders.orders.status.processing")}</option>
              <option value="completed">{t("orders.orders.status.completed")}</option>
              <option value="cancelled">{t("orders.orders.status.cancelled")}</option>
            </select>
            <div
              className={`absolute inset-y-0 ${lang === "ar" ? "left-0" : "right-0"} flex items-center px-2 pointer-events-none`}
            >
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="flex items-end">
          <button
            onClick={resetFilters}
            className="inline-flex items-center px-4 py-2 border border-[#6D28D9] text-[#6D28D9] rounded-lg hover:bg-[#6D28D9]/10 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${lang === "ar" ? "ml-2" : "mr-2"}`} />
            {t("orders.orders.resetFilters")}
          </button>
        </div>
      </div>

      {/* No Results */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-8 md:py-12 bg-gray-50 rounded-lg border border-[#c8c2fd]/30">
          <Package className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">{t("orders.orders.noOrdersFound")}</h3>
          <p className="text-gray-500 mb-4">{t("orders.orders.tryDifferentFilters")}</p>
          <div className="flex justify-center space-x-3">
            <button
              onClick={resetFilters}
              className="inline-flex items-center px-4 py-2 border border-[#6D28D9] text-[#6D28D9] rounded-lg hover:bg-[#6D28D9]/10 transition-colors"
            >
              <RefreshCw className={`h-4 w-4 ${lang === "ar" ? "ml-2" : "mr-2"}`} />
              {t("orders.orders.resetFilters")}
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Mobile View - Cards */}
          <div className="md:hidden mt-4">
            {filteredOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
            <div className="bg-gray-50 px-4 py-3 border border-[#c8c2fd]/30 rounded-lg text-sm text-gray-500 text-center">
              {filteredOrders.length} {t("orders.orders.ordersFound")}
            </div>
          </div>

          {/* Desktop View - Table */}
          <div className="hidden md:block border border-[#c8c2fd]/30 shadow-lg rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[#c8c2fd]/30">
                <thead className="bg-[#1e3a8a]">
                  <tr>
                    <th scope="col" className={`px-6 py-3 text-xs font-medium text-white uppercase tracking-wider ${lang === "ar" ? "text-right" : "text-left"}`}>
                      {t("orders.orders.table.orderInfo")}
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                      {t("orders.orders.table.products")}
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                      {t("orders.orders.table.user")}
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                      {t("orders.orders.table.total")}
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                      {t("orders.orders.table.status")}
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                      {t("orders.orders.table.paymentStatus")}
                    </th>
                    <th scope="col" className={`px-6 py-3 text-xs font-medium text-white uppercase tracking-wider ${lang === "ar" ? "text-left" : "text-right"}`}>
                      {t("orders.orders.table.actions")}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-[#c8c2fd]/30">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-[#c8c2fd]/5 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-medium text-[#1e3a8a]">
                            {order.orderNumber}
                          </span>
                          <span className="text-sm text-gray-500">
                            {new Date(order?.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2 justify-center">
                          {order.products?.map((product) => (
                            <div key={product.id} className="relative group">
                              <img
                                src={product.imgMain?.url ? 
                                  `${product.imgMain.url}` : 
                                  "/placeholder.svg"}
                                alt={product.name}
                                className="w-12 h-12 object-cover rounded-lg"
                              />
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block">
                                <div className="bg-black text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                                  {product.name}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                        <div className="flex flex-col items-center">
                          <span className="font-medium">{order?.user?.username || "N/A"}</span>
                          <span className="text-xs text-gray-400">{order?.user?.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex flex-col">
                          <span className="font-medium text-[#6D28D9]">
                            {order?.totalAmount.toFixed(2)} {order?.currency?.toUpperCase()}
                          </span>
                          <span className="text-xs text-gray-500">
                            {t("orders.orders.table.items")}: {Object.keys(order?.quantities || {}).length}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(order?.statusOrder)}`}>
                          {getStatusText(order?.statusOrder)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusBadgeClass(order?.paymentStatus)}`}>
                          {getPaymentStatusText(order?.paymentStatus)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                        <div className="inline-block text-end action-menu">
                          <button
                            type="button"
                            onClick={() => handleViewDetails(order)}
                            className="cursor-pointer text-blue-500 focus:outline-none p-1 rounded-full hover:bg-blue-500/10 transition-colors"
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDownloadInvoice(order.id)}
                            className="cursor-pointer text-green-500 focus:outline-none p-1 rounded-full hover:bg-green-500/10 transition-colors"
                          >
                            <Download className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-gray-50 px-6 py-3 border-t border-[#c8c2fd]/30 text-sm text-gray-500">
              {filteredOrders.length} {t("orders.orders.ordersFound")}
            </div>
          </div>
        </>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 relative">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Order Header */}
            <div className="mb-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold text-[#1e3a8a] mb-1">
                    {t('orders.orders.view.orderDetails')} - {selectedOrder.orderNumber}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {new Date(selectedOrder.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">{t('orders.orders.table.status')}:</span>
                    <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(selectedOrder.statusOrder)}`}>
                      {getStatusText(selectedOrder.statusOrder)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">{t('orders.orders.table.paymentStatus')}:</span>
                    <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusBadgeClass(selectedOrder.paymentStatus)}`}>
                      {getPaymentStatusText(selectedOrder.paymentStatus)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Customer Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-[#1e3a8a] mb-3">{t('orders.orders.view.customerInfo')}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">{t('orders.orders.view.username')}</p>
                    <p className="font-medium">{selectedOrder.user?.username || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{t('orders.orders.view.email')}</p>
                    <p className="font-medium">{selectedOrder.user?.email || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Products List */}
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b">
                  <h3 className="font-medium text-[#1e3a8a]">{t('orders.orders.view.items')}</h3>
                </div>
                <div className="divide-y">
                  {selectedOrder.products?.map((product) => (
                    <div key={product.id} className="p-4 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <img
                          src={product.imgMain?.url ? 
                            `${product.imgMain.url}` : 
                            "/placeholder.svg"}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div>
                          <h4 className="font-medium">{product.name}</h4>
                          <p className="text-sm text-gray-500">
                            {t('orders.orders.view.quantity')}: {selectedOrder.quantities[product.id] || 1}
                          </p>
                          <p className="text-sm text-gray-500">
                            {t('orders.orders.view.sku')}: {product.sku || 'N/A'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-[#6D28D9]">
                          {product.prix.toFixed(2)} {selectedOrder.currency?.toUpperCase()}
                        </p>
                        <p className="text-sm text-gray-500">
                          {t('orders.orders.view.stock')}: {product.stock}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="border rounded-lg p-4">
                <h3 className="font-medium text-[#1e3a8a] mb-4">{t('orders.orders.view.summary')}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t('orders.orders.view.subtotal')}</span>
                    <span>{selectedOrder.totalAmount.toFixed(2)} {selectedOrder.currency?.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t('orders.orders.view.items')}</span>
                    <span>{Object.keys(selectedOrder.quantities || {}).length}</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-medium">
                      <span>{t('orders.orders.view.total')}</span>
                      <span className="text-[#6D28D9]">
                        {selectedOrder.totalAmount.toFixed(2)} {selectedOrder.currency?.toUpperCase()}
                      </span>
                    </div>
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

