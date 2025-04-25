"use client"

import React, { useState } from "react"
import {
  CreditCard,
  Download,
  Eye,
  MoreHorizontal,
  Search,
  X,
  RefreshCw,
  Filter,
  Info,
  ChevronDown,
  DollarSign,
  Calendar,
  Clock,
} from "lucide-react"
import { useTranslation } from "react-i18next"

export default function PaymentsPage() {
  const { t } = useTranslation()
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [openActionMenu, setOpenActionMenu] = useState(null)
  const [isFiltersVisible, setIsFiltersVisible] = useState(false)
  const lang = localStorage.getItem("lang")

  const payments = [
    {
      id: "PAY-2023-001",
      date: "2023-04-10",
      amount: 129.99,
      method: "card",
      status: "completed",
      orderId: "ORD-2023-001",
    },
    {
      id: "PAY-2023-002",
      date: "2023-04-09",
      amount: 89.5,
      method: "paypal",
      status: "completed",
      orderId: "ORD-2023-002",
    },
    {
      id: "PAY-2023-003",
      date: "2023-04-08",
      amount: 245.75,
      method: "card",
      status: "pending",
      orderId: "ORD-2023-003",
    },
    {
      id: "PAY-2023-004",
      date: "2023-04-07",
      amount: 59.99,
      method: "bank",
      status: "pending",
      orderId: "ORD-2023-004",
    },
    {
      id: "PAY-2023-005",
      date: "2023-04-06",
      amount: 175.25,
      method: "card",
      status: "failed",
      orderId: "ORD-2023-005",
    },
  ]

  // Filter payments based on status and search query
  const filteredPayments = payments.filter((payment) => {
    // Filter by status
    if (selectedStatus !== "all" && payment.status !== selectedStatus) {
      return false
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        payment.id.toLowerCase().includes(query) ||
        payment.orderId.toLowerCase().includes(query) ||
        payment.method.toLowerCase().includes(query) ||
        payment.status.toLowerCase().includes(query)
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

  const getMethodText = (method) => {
    return t(`payment.payment.methods.${method}`)
  }

  const handleActionClick = (paymentId) => {
    setOpenActionMenu(openActionMenu === paymentId ? null : paymentId)
  }

  const handleViewDetails = (paymentId) => {
    console.log("View details for payment:", paymentId)
    setOpenActionMenu(null)
  }

  const handleDownloadReceipt = (paymentId) => {
    console.log("Download receipt for payment:", paymentId)
    setOpenActionMenu(null)
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

  return (
    <div className="space-y-6 p-6 bg-white">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-[#6D28D9] p-3 rounded-lg shadow-lg">
          <CreditCard className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1e3a8a]">{t("payment.payment.title")}</h1>
          <p className="text-[#6D28D9]/70">{t("payment.payment.subtitle")}</p>
        </div>
      </div>

      <div className="bg-[#c8c2fd]/10 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-2 text-[#6D28D9]">
          <Info className="h-5 w-5" />
          <p className="text-sm">{t("payment.payment.infoMessage")}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white rounded-lg shadow-lg border border-[#c8c2fd]/30 p-6">
          <div className="flex flex-row items-center justify-between">
            <h3 className="text-sm font-medium text-[#1e3a8a]">{t("payment.payment.metrics.totalReceived.title")}</h3>
            <div className="bg-[#6D28D9]/10 p-2 rounded-full">
              <DollarSign className="h-5 w-5 text-[#6D28D9]" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-[#1e3a8a]">{t("payment.payment.metrics.totalReceived.value")}</div>
            <p className="text-xs text-[#6D28D9]/70">{t("payment.payment.metrics.totalReceived.description")}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg border border-[#c8c2fd]/30 p-6">
          <div className="flex flex-row items-center justify-between">
            <h3 className="text-sm font-medium text-[#1e3a8a]">{t("payment.payment.metrics.pending.title")}</h3>
            <div className="bg-[#6D28D9]/10 p-2 rounded-full">
              <Clock className="h-5 w-5 text-[#6D28D9]" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-[#1e3a8a]">{t("payment.payment.metrics.pending.value")}</div>
            <p className="text-xs text-[#6D28D9]/70">{t("payment.payment.metrics.pending.description")}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg border border-[#c8c2fd]/30 p-6">
          <div className="flex flex-row items-center justify-between">
            <h3 className="text-sm font-medium text-[#1e3a8a]">{t("payment.payment.metrics.nextPayment.title")}</h3>
            <div className="bg-[#6D28D9]/10 p-2 rounded-full">
              <Calendar className="h-5 w-5 text-[#6D28D9]" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-[#1e3a8a]">{t("payment.payment.metrics.nextPayment.value")}</div>
            <p className="text-xs text-[#6D28D9]/70">{t("payment.payment.metrics.nextPayment.description")}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-4 items-center">
        <div className="relative flex-1">
          <div className="relative">
            <Search className={`absolute ${lang === "ar" ? "right-3" : "left-3"} top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400`} />
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

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => setIsFiltersVisible(!isFiltersVisible)}
            className="md:hidden inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <Filter className="mr-2 h-4 w-4" />
            {t("payment.payment.filters")} {isFiltersVisible ? "▲" : "▼"}
          </button>
        </div>
      </div>
      <div
        className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${
          isFiltersVisible || window.innerWidth >= 768 ? "block" : "hidden md:block"
        }`}
      >
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
            <div className={`absolute inset-y-0 ${lang === "ar" ? "left-0" : "right-0"} flex items-center px-2 pointer-events-none`}>
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

      {filteredPayments.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-[#c8c2fd]/30">
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
        <div className="border border-[#c8c2fd]/30 shadow-lg rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#c8c2fd]/30">
              <thead className="bg-[#1e3a8a]">
                <tr>
                  <th className="px-6 py-3 text-start text-xs font-medium text-white uppercase tracking-wider">
                    {t("payment.payment.table.headers.id")}
                  </th>
                  <th className="hidden md:table-cell px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                    {t("payment.payment.table.headers.date")}
                  </th>
                  <th className="hidden md:table-cell px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                    {t("payment.payment.table.headers.order")}
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                    {t("payment.payment.table.headers.method")}
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                    {t("payment.payment.table.headers.amount")}
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
                    <td className="px-6 py-4 whitespace-nowrap text-start text-sm font-medium text-[#1e3a8a]">{payment.id}</td>
                    <td className="hidden md:table-cell px-6 py-4 text-center whitespace-nowrap text-sm text-gray-500">
                      {payment.date}
                    </td>
                    <td className="hidden md:table-cell px-6 py-4 text-center whitespace-nowrap text-sm text-gray-500">
                      {payment.orderId}
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap text-sm">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#c8c2fd]/20 text-[#6D28D9]">
                        {getMethodText(payment.method)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap text-sm font-medium text-[#6D28D9]">
                      {payment.amount.toFixed(2)} €
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap text-sm">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(payment.status)}`}
                      >
                        {getStatusText(payment.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-end">
                    <div className=" inline-block text-end action-menu">
                        <button
                          type="button"
                          onClick={() => handleActionClick(order.id)}
                          className=" cursor-pointer text-blue-500 focus:outline-none p-1 rounded-full hover:bg-blue-500/10 transition-colors"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleActionClick(order.id)}
                          className=" cursor-pointer text-green-500 focus:outline-none p-1 rounded-full hover:bg-green-500/10 transition-colors"
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
      )}
    </div>
  )
}
