"use client"

import React, { useState, useEffect } from 'react';
import { Download, Eye, FileText, MoreHorizontal, Search, ShoppingBag, Filter, X, RefreshCw, Info, AlertTriangle, ChevronDown, Package } from 'lucide-react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

export default function OrdersPage() {
  const { t } = useTranslation();
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openActionMenu, setOpenActionMenu] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const IDUser = localStorage.getItem('IDUser');
  const lang = localStorage.getItem('lang');
  // Add filtered orders state
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:1337/api/orders?populate=*&filters[customer][id][$eq]=${IDUser}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        setOrders(response.data.data);
        setFilteredOrders(response.data.data); // Initialize filtered orders
        setLoading(false);
      } catch (err) {
        setError(t('orders.orders.error'));
        setLoading(false);
        console.error('Error fetching orders:', err);
      }
    };

    fetchOrders();
  }, [IDUser, t]);

  // Add useEffect for filtering
  useEffect(() => {
    let filtered = [...orders];

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(order => order.statusOrder === selectedStatus);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(order => 
        order.id.toString().toLowerCase().includes(query) ||
        (order.customer?.data?.attributes?.username || '').toLowerCase().includes(query) ||
        order.statusOrder.toLowerCase().includes(query)
      );
    }

    setFilteredOrders(filtered);
  }, [orders, selectedStatus, searchQuery]);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800';
      case 'Processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'Pending':
        return 'bg-gray-100 text-gray-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'Delivered':
        return t('orders.orders.status.delivered');
      case 'Shipped':
        return t('orders.orders.status.shipped');
      case 'Processing':
        return t('orders.orders.status.processing');
      case 'Pending':
        return t('orders.orders.status.pending');
      case 'Cancelled':
        return t('orders.orders.status.cancelled');
      default:
        return status;
    }
  };

  const handleActionClick = (orderId) => {
    setOpenActionMenu(openActionMenu === orderId ? null : orderId);
  };

  const handleViewDetails = (orderId) => {
    console.log('View order details:', orderId);
    setOpenActionMenu(null);
  };

  const handleViewInvoice = (orderId) => {
    console.log('View invoice:', orderId);
    setOpenActionMenu(null);
  };

  const handleDownloadInvoice = (orderId) => {
    console.log('Download invoice:', orderId);
    setOpenActionMenu(null);
  };

  const resetFilters = () => {
    setSelectedStatus('all');
    setSearchQuery('');
  };

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (openActionMenu && !event.target.closest('.action-menu')) {
        setOpenActionMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openActionMenu]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6D28D9]"></div>
          <p className="text-[#6D28D9] font-medium">{t('orders.orders.loading')}</p>
        </div>
      </div>
    );
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
            {t('orders.orders.retry')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 bg-white">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-[#6D28D9] p-3 rounded-lg shadow-lg">
          <ShoppingBag className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1e3a8a]">{t('orders.orders.title')}</h1>
          <p className="text-[#6D28D9]/70">{t('orders.orders.subtitle')}</p>
        </div>
      </div>

      <div className="bg-[#c8c2fd]/10 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-2 text-[#6D28D9]">
          <Info className="h-5 w-5" />
          <p className="text-sm">{t('orders.orders.infoMessage')}</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-4 items-center">
        <div className="relative flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={t('orders.orders.search')}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:border-[#6D28D9]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
            {t('orders.orders.filters')} {isFiltersVisible ? "▲" : "▼"}
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
            <Package className="h-4 w-4 mr-1" />
            {t('orders.orders.filterByStatus')}
          </label>
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:border-[#6D28D9]"
            >
              <option value="all">{t('orders.orders.allStatuses')}</option>
              <option value="Pending">{t('orders.orders.status.pending')}</option>
              <option value="Processing">{t('orders.orders.status.processing')}</option>
              <option value="Shipped">{t('orders.orders.status.shipped')}</option>
              <option value="Delivered">{t('orders.orders.status.delivered')}</option>
              <option value="Cancelled">{t('orders.orders.status.cancelled')}</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="flex items-end">
          <button
            onClick={resetFilters}
            className="inline-flex items-center px-4 py-2 border border-[#6D28D9] text-[#6D28D9] rounded-lg hover:bg-[#6D28D9]/10 transition-colors"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            {t('orders.orders.resetFilters')}
          </button>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-[#c8c2fd]/30">
          <Package className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">{t('orders.orders.noOrdersFound')}</h3>
          <p className="text-gray-500 mb-4">{t('orders.orders.tryDifferentFilters')}</p>
          <div className="flex justify-center space-x-3">
            <button
              onClick={resetFilters}
              className="inline-flex items-center px-4 py-2 border border-[#6D28D9] text-[#6D28D9] rounded-lg hover:bg-[#6D28D9]/10 transition-colors"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              {t('orders.orders.resetFilters')}
            </button>
          </div>
        </div>
      ) : (
        <div className="border border-[#c8c2fd]/30 shadow-lg rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#c8c2fd]/30">
              <thead className="bg-[#1e3a8a]">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    {t('orders.orders.table.order')}
                  </th>
                  <th scope="col" className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    {t('orders.orders.table.date')}
                  </th>
                  <th scope="col" className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    {t('orders.orders.table.customer')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                    {t('orders.orders.table.items')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">
                    {t('orders.orders.table.total')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                    {t('orders.orders.table.status')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">
                    {t('orders.orders.table.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[#c8c2fd]/30">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#c8c2fd]/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-[#1e3a8a]">ORD-{order.id}</span>
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order?.createdAt).toLocaleDateString()}
                    </td>
                    <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order?.customer?.data?.attributes?.username || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                      {order?.order_items?.data?.length || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-[#6D28D9]">
                      {order?.totalAmount.toFixed(2)} €
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(order?.statusOrder)}`}>
                        {getStatusText(order?.statusOrder)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="relative inline-block text-left action-menu">
                        <button
                          type="button"
                          onClick={() => handleActionClick(order.id)}
                          className="hover:text-[#c8c2fd] text-[#6D28D9] focus:outline-none p-1 rounded-full hover:bg-[#6D28D9]/10 transition-colors"
                        >
                          <MoreHorizontal className="h-5 w-5" />
                        </button>
                        {openActionMenu === order.id && (
                          <div className={`absolute ${
                            lang === 'ar' ? 'left-6' : 'right-6'
                          } mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-[#c8c2fd] ring-opacity-5 z-50`}
                          >
                            <div className="py-1">
                              <div className="px-4 py-2 text-start text-sm text-[#1e3a8a] font-medium border-b border-[#c8c2fd]/30">
                                {t('orders.orders.table.actions')}
                              </div>
                              <button
                                onClick={() => handleViewDetails(order.id)}
                                className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-[#c8c2fd]/10 flex items-center"
                                role="menuitem"
                              >
                                <Eye className="mr-2 h-4 w-4 text-[#6D28D9]" />
                                {t('orders.orders.actions.viewDetails')}
                              </button>
                              <button
                                onClick={() => handleViewInvoice(order.id)}
                                className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-[#c8c2fd]/10 flex items-center"
                                role="menuitem"
                              >
                                <FileText className="mr-2 h-4 w-4 text-[#6D28D9]" />
                                {t('orders.orders.actions.viewInvoice')}
                              </button>
                              <button
                                onClick={() => handleDownloadInvoice(order.id)}
                                className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-[#c8c2fd]/10 flex items-center"
                                role="menuitem"
                              >
                                <Download className="mr-2 h-4 w-4 text-[#6D28D9]" />
                                {t('orders.orders.actions.downloadInvoice')}
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
          <div className="bg-gray-50 px-6 py-3 border-t border-[#c8c2fd]/30 text-sm text-gray-500">
            {filteredOrders.length} {t('orders.orders.ordersFound')}
          </div>
        </div>
      )}
    </div>
  );
}
