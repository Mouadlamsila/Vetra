import React, { useState, useEffect } from 'react';
import { Download, Eye, FileText, MoreHorizontal, Search, ShoppingBag } from "lucide-react";
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
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('orders.orders.title')}</h1>
        <p className="text-gray-500">{t('orders.orders.subtitle')}</p>
      </div>

      <div className="flex flex-col h-11 md:flex-row gap-4 items-end">
        <div className="relative h-full flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder={t('orders.orders.search')}
            className="pl-8 py-2 px-4 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="w-full h-full md:w-[180px] py-2 px-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:border-transparent"
        >
          <option value="all">{t('orders.orders.allStatuses')}</option>
          <option value="Pending">{t('orders.orders.status.pending')}</option>
          <option value="Processing">{t('orders.orders.status.processing')}</option>
          <option value="Shipped">{t('orders.orders.status.shipped')}</option>
          <option value="Delivered">{t('orders.orders.status.delivered')}</option>
          <option value="Cancelled">{t('orders.orders.status.cancelled')}</option>
        </select>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="min-w-full divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('orders.orders.table.order')}
              </th>
              <th scope="col" className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('orders.orders.table.date')}
              </th>
              <th scope="col" className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('orders.orders.table.customer')}
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('orders.orders.table.items')}
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('orders.orders.table.total')}
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('orders.orders.table.status')}
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('orders.orders.table.actions')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                  {t('orders.orders.noOrders')}
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">ORD-{order.id}</span>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                    {order?.totalAmount.toFixed(2)} €
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(order?.statusOrder)}`}>
                      {getStatusText(order?.statusOrder)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="relative inline-block text-left action-menu">
                      <button
                        type="button"
                        onClick={() => handleActionClick(order.id)}
                        className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c8c2fd]"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                      {openActionMenu === order.id && (
                        <div className={`origin-top-right absolute ${lang === 'ar' ? 'left-0' : 'right-0'} mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-[99]`}
                          style={{
                            position: 'fixed',
                            top: 'auto',
                            bottom: 'auto',
                            transform: 'translateY(0)'
                          }}
                        >
                          <div className="py-1" role="menu" aria-orientation="vertical">
                            <button
                              onClick={() => handleViewDetails(order.id)}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              role="menuitem"
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              {t('orders.orders.actions.viewDetails')}
                            </button>
                            <button
                              onClick={() => handleViewInvoice(order.id)}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              role="menuitem"
                            >
                              <FileText className="mr-2 h-4 w-4" />
                              {t('orders.orders.actions.viewInvoice')}
                            </button>
                            <button
                              onClick={() => handleDownloadInvoice(order.id)}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              role="menuitem"
                            >
                              <Download className="mr-2 h-4 w-4" />
                              {t('orders.orders.actions.downloadInvoice')}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
