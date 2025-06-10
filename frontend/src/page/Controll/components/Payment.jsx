"use client"

import React, { useState, useEffect } from "react"
import {
  CreditCard,
  Download,
  Eye,
  Search,
  X,
  RefreshCw,
  Filter,
  Info,
  ChevronDown,
  DollarSign,
  Calendar,
  Clock,
  User,
  ShoppingBag,
  MapPin,
} from "lucide-react"
import { useTranslation } from "react-i18next"
import axios from "axios"
import { generatePaymentReceipt } from '../../../utils/pdfGenerator'

export default function PaymentsPage() {
  const { t } = useTranslation()
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isFiltersVisible, setIsFiltersVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [showAllProducts, setShowAllProducts] = useState(false)
  const lang = localStorage.getItem("lang")
  const IDUser = localStorage.getItem("IDUser")

  // Fetch payments data
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true)
        const response = await axios.get(
          `http://localhost:1337/api/checkout-sessions?filters[user][id][$eq]=${IDUser}&populate[products][populate]=imgMain&populate[user][populate]=*`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        setPayments(response.data.data)
        setLoading(false)
      } catch (err) {
        setError(t("payment.payment.error"))
        setLoading(false)
        console.error("Error fetching payments:", err)
      }
    }

    fetchPayments()
  }, [IDUser, t])

  // Filter payments based on status and search query
  const filteredPayments = payments.filter((payment) => {
    // Filter by status
    if (selectedStatus !== "all" && payment.status_checkout !== selectedStatus) {
      return false
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        payment.sessionId.toLowerCase().includes(query) ||
        payment.amount.toString().includes(query) ||
        payment.status_checkout.toLowerCase().includes(query)
      )
    }

    return true
  })

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status) => {
    return t(`payment.payment.status.${status}`)
  }

  // Calculate metrics
  const calculateMetrics = () => {
    const totalReceived = payments
      .filter(p => p.status_checkout === "completed")
      .reduce((sum, p) => sum + parseFloat(p.amount), 0)

    const pendingAmount = payments
      .filter(p => p.status_checkout === "pending")
      .reduce((sum, p) => sum + parseFloat(p.amount), 0)

    const nextPayment = payments
      .filter(p => p.status_checkout === "pending")
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))[0]

    return {
      totalReceived,
      pendingAmount,
      nextPayment
    }
  }

  const metrics = calculateMetrics()

  // Add handleViewDetails function
  const handleViewDetails = (paymentId) => {
    const payment = payments.find(p => p.id === paymentId)
    if (payment) {
      setSelectedPayment(payment)
      setIsDetailsModalOpen(true)
    }
  }

  // Update handleDownloadReceipt function
  const handleDownloadReceipt = (paymentId) => {
    const payment = payments.find(p => p.id === paymentId)
    if (payment) {
      generatePaymentReceipt(payment)
    }
  }

  const resetFilters = () => {
    setSelectedStatus("all")
    setSearchQuery("")
  }

  // Mobile payment card component
  const PaymentCard = ({ payment }) => (
    <div className="bg-white rounded-lg shadow-sm border border-[#c8c2fd]/30 p-4 mb-3">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-medium text-[#1e3a8a]">{payment.sessionId}</h3>
          <p className="text-xs text-gray-500">{new Date(payment.createdAt).toLocaleDateString()}</p>
        </div>
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(payment.status_checkout)}`}
        >
          {getStatusText(payment.status_checkout)}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
        <div>
          <p className="text-gray-500">{t("payment.payment.table.headers.amount")}</p>
          <p className="font-medium text-[#6D28D9]">
            {payment.amount} {payment.currency?.toUpperCase()}
          </p>
        </div>
        <div>
          <p className="text-gray-500">{t("payment.payment.table.headers.products")}</p>
          <p className="font-medium">
            {t("payment.payment.table.headers.items", { nbr: payment?.products?.length || 0 })}
          </p>
        </div>
      </div>

      <div className="flex justify-end space-x-2 border-t border-gray-100 pt-3">
        <button
          onClick={() => handleViewDetails(payment.id)}
          className="inline-flex items-center px-2 py-1 text-sm text-blue-500 rounded hover:bg-blue-50"
        >
          <Eye className="h-4 w-4 mr-1" />
          {t("payment.payment.actions.view")}
        </button>
        <button
          onClick={() => handleDownloadReceipt(payment.id)}
          className="inline-flex items-center px-2 py-1 text-sm text-green-500 rounded hover:bg-green-50"
        >
          <Download className="h-4 w-4 mr-1" />
          {t("payment.payment.actions.download")}
        </button>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6D28D9]"></div>
          <p className="text-[#6D28D9] font-medium">{t("payment.payment.loading")}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center justify-center space-x-2">
          <Info className="h-5 w-5" />
          <span>{error}</span>
        </div>
        <div className="mt-4 space-x-4">
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#6D28D9] text-white rounded-lg hover:bg-[#6D28D9]/90 transition-colors inline-flex items-center"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            {t("payment.payment.retry")}
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
          <CreditCard className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#1e3a8a]">{t("payment.payment.title")}</h1>
          <p className="text-[#6D28D9]/70">{t("payment.payment.subtitle")}</p>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white rounded-lg shadow-lg border border-[#c8c2fd]/30 p-4 md:p-6">
          <div className="flex flex-row items-center justify-between">
            <h3 className="text-sm font-medium text-[#1e3a8a]">{t("payment.payment.metrics.totalReceived.title")}</h3>
            <div className="bg-[#6D28D9]/10 p-2 rounded-full">
              <DollarSign className="h-5 w-5 text-[#6D28D9]" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl md:text-2xl font-bold text-[#1e3a8a]">
              {metrics.totalReceived.toFixed(2)} €
            </div>
            <p className="text-xs text-[#6D28D9]/70">{t("payment.payment.metrics.totalReceived.description")}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg border border-[#c8c2fd]/30 p-4 md:p-6">
          <div className="flex flex-row items-center justify-between">
            <h3 className="text-sm font-medium text-[#1e3a8a]">{t("payment.payment.metrics.pending.title")}</h3>
            <div className="bg-[#6D28D9]/10 p-2 rounded-full">
              <Clock className="h-5 w-5 text-[#6D28D9]" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl md:text-2xl font-bold text-[#1e3a8a]">
              {metrics.pendingAmount.toFixed(2)} €
            </div>
            <p className="text-xs text-[#6D28D9]/70">{t("payment.payment.metrics.pending.description")}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg border border-[#c8c2fd]/30 p-4 md:p-6">
          <div className="flex flex-row items-center justify-between">
            <h3 className="text-sm font-medium text-[#1e3a8a]">{t("payment.payment.metrics.nextPayment.title")}</h3>
            <div className="bg-[#6D28D9]/10 p-2 rounded-full">
              <Calendar className="h-5 w-5 text-[#6D28D9]" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl md:text-2xl font-bold text-[#1e3a8a]">
              {metrics.nextPayment ? `${metrics.nextPayment.amount} ${metrics.nextPayment.currency?.toUpperCase()}` : 'N/A'}
            </div>
            <p className="text-xs text-[#6D28D9]/70">{t("payment.payment.metrics.nextPayment.description")}</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-4">
        <div className="relative w-full">
          <div className="relative">
            <Search
              className={`absolute ${lang === "ar" ? "right-3" : "left-3"} top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400`}
            />
            <input
              type="text"
              placeholder={t("payment.payment.search.placeholder")}
              className={`w-full py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:border-[#6D28D9] ${lang === "ar" ? "pl-4 pr-10" : "pl-10 pr-4"}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className={`absolute ${lang === "ar" ? "left-3" : "right-3"} top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600`}
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
            {t("payment.payment.filters")} {isFiltersVisible ? "▲" : "▼"}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${isFiltersVisible || !isMobile ? "block" : "hidden"}`}>
        <div className="relative">
          <label className="block text-sm font-medium text-[#1e3a8a] mb-1 flex items-center">
            <CreditCard className="h-4 w-4 mr-1" />
            {t("payment.payment.filterByStatus")}
          </label>
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:border-[#6D28D9]"
            >
              <option value="all">{t("payment.payment.status.all")}</option>
              <option value="completed">{t("payment.payment.status.completed")}</option>
              <option value="pending">{t("payment.payment.status.pending")}</option>
              <option value="failed">{t("payment.payment.status.failed")}</option>
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
            {t("payment.payment.resetFilters")}
          </button>
        </div>
      </div>

      {/* No Results */}
      {filteredPayments.length === 0 ? (
        <div className="text-center py-8 md:py-12 bg-gray-50 rounded-lg border border-[#c8c2fd]/30">
          <CreditCard className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">{t("payment.payment.noPaymentsFound")}</h3>
          <p className="text-gray-500 mb-4">{t("payment.payment.tryDifferentFilters")}</p>
          <div className="flex justify-center space-x-3">
            <button
              onClick={resetFilters}
              className="inline-flex items-center px-4 py-2 border border-[#6D28D9] text-[#6D28D9] rounded-lg hover:bg-[#6D28D9]/10 transition-colors"
            >
              <RefreshCw className={`h-4 w-4 ${lang === "ar" ? "ml-2" : "mr-2"}`} />
              {t("payment.payment.resetFilters")}
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Mobile View - Cards */}
          <div className="md:hidden mt-4">
            {filteredPayments.map((payment) => (
              <PaymentCard key={payment.id} payment={payment} />
            ))}
            <div className="bg-gray-50 px-4 py-3 border border-[#c8c2fd]/30 rounded-lg text-sm text-gray-500 text-center">
              {filteredPayments.length} {t("payment.payment.paymentsFound")}
            </div>
          </div>

          {/* Desktop View - Table */}
          <div className="hidden md:block border border-[#c8c2fd]/30 shadow-lg rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[#c8c2fd]/30">
                <thead className="bg-[#1e3a8a]">
                  <tr>
                    <th className="px-6 py-3 text-start text-xs font-medium text-white uppercase tracking-wider">
                      {t("payment.payment.table.headers.id")}
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                      {t("payment.payment.table.headers.date")}
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                      {t("payment.payment.table.headers.amount")}
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                      {t("payment.payment.table.headers.products")}
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                      {t("payment.payment.table.headers.status")}
                    </th>
                    <th className="px-6 py-3 text-end text-xs font-medium text-white uppercase tracking-wider">
                      {t("payment.payment.table.headers.actions")}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-[#c8c2fd]/30">
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-[#c8c2fd]/5 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-start text-sm font-medium text-[#1e3a8a]">
                        {payment.sessionId}
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-500">
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap text-sm font-medium text-[#6D28D9]">
                        {payment.amount} {payment.currency?.toUpperCase()}
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-500">
                        {t("payment.payment.table.headers.items", { nbr: payment?.products?.length || 0 })}
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap text-sm">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(payment.status_checkout)}`}
                        >
                          {getStatusText(payment.status_checkout)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-end">
                        <div className="inline-block text-end action-menu">
                          <button
                            type="button"
                            onClick={() => handleViewDetails(payment.id)}
                            className="cursor-pointer text-blue-500 focus:outline-none p-1 rounded-full hover:bg-blue-500/10 transition-colors"
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDownloadReceipt(payment.id)}
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
              {filteredPayments.length} {t("payment.payment.paymentsFound")}
            </div>
          </div>
        </>
      )}

      {/* Payment Details Modal */}
      {isDetailsModalOpen && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 relative">
            <button
              onClick={() => setIsDetailsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Payment Header */}
            <div className="mb-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold text-[#1e3a8a] mb-1">
                    {t('payment.payment.actions.viewDetails')} - {selectedPayment.sessionId}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {new Date(selectedPayment.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(selectedPayment.status_checkout)}`}
                >
                  {getStatusText(selectedPayment.status_checkout)}
                </span>
              </div>
            </div>

            <div className="space-y-6">
              {/* Payment Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-[#1e3a8a] mb-3 flex items-center">
                  <CreditCard className="h-4 w-4 mr-2" />
                  {t('payment.payment.table.headers.paymentInfo')}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">{t('payment.payment.table.headers.amount')}</p>
                    <p className="font-medium text-[#6D28D9]">
                      {selectedPayment.amount} {selectedPayment.currency?.toUpperCase()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{t('payment.payment.table.headers.status')}</p>
                    <p className="font-medium">{getStatusText(selectedPayment.status_checkout)}</p>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              {selectedPayment.customer && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-[#1e3a8a] mb-3 flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    {t('payment.payment.table.headers.customerInfo')}
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">{t('payment.payment.table.headers.name')}</p>
                      <p className="font-medium">{selectedPayment.customer.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{t('payment.payment.table.headers.email')}</p>
                      <p className="font-medium">{selectedPayment.customer.email}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Shipping Address */}
              {selectedPayment.shippingAddress && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-[#1e3a8a] mb-3 flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    {t('payment.payment.table.headers.shippingAddress')}
                  </h3>
                  <div className="space-y-2">
                    <p className="font-medium">{selectedPayment.shippingAddress.line1}</p>
                    {selectedPayment.shippingAddress.line2 && (
                      <p>{selectedPayment.shippingAddress.line2}</p>
                    )}
                    <p>
                      {selectedPayment.shippingAddress.city}, {selectedPayment.shippingAddress.state} {selectedPayment.shippingAddress.postal_code}
                    </p>
                    <p>{selectedPayment.shippingAddress.country}</p>
                  </div>
                </div>
              )}

              {/* Products List */}
              {selectedPayment.products && selectedPayment.products.length > 0 && (
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b">
                    <h3 className="font-medium text-[#1e3a8a] flex items-center">
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      {t('payment.payment.table.headers.products')}
                    </h3>
                  </div>
                  <div className="divide-y">
                    {selectedPayment.products
                      .slice(0, showAllProducts ? undefined : 4)
                      .map((product) => {
                        if (!product) return null;
                        
                        return (
                          <div key={product.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                            <div className="flex items-center space-x-4">
                              <img
                                src={product.imgMain?.url ? 
                                  `http://localhost:1337${product.imgMain.url}` : 
                                  "/placeholder.svg"}
                                alt={product.name || 'Product'}
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                              <div>
                                <h4 className="font-medium">{product.name || 'N/A'}</h4>
                                <p className="text-sm text-gray-500">
                                  {t('payment.payment.table.headers.quantity')}: {selectedPayment.quantities?.[product.id] || 1}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {t('payment.payment.table.headers.sku')}: {product.sku || 'N/A'}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-[#6D28D9]">
                                {product.prix?.toFixed(2) || '0.00'} {selectedPayment.currency?.toUpperCase() || 'USD'}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                  {selectedPayment.products.length > 4 && (
                    <div className="px-4 py-3 bg-gray-50 border-t">
                      <button
                        onClick={() => setShowAllProducts(!showAllProducts)}
                        className="w-full text-center text-[#6D28D9] hover:text-[#6D28D9]/80 transition-colors font-medium"
                      >
                        {showAllProducts 
                          ? t('payment.payment.actions.showLess') 
                          : t('payment.payment.actions.showMore', { count: selectedPayment.products.length - 4 })}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  onClick={() => handleDownloadReceipt(selectedPayment.id)}
                  className="inline-flex items-center px-4 py-2 border border-[#6D28D9] text-[#6D28D9] rounded-lg hover:bg-[#6D28D9]/10 transition-colors"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {t('payment.payment.actions.downloadReceipt')}
                </button>
                <button
                  onClick={() => setIsDetailsModalOpen(false)}
                  className="inline-flex items-center px-4 py-2 bg-[#6D28D9] text-white rounded-lg hover:bg-[#6D28D9]/90 transition-colors"
                >
                  {t('payment.payment.actions.close')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
