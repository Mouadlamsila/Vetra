import React, { useState } from 'react';
import { Download, Eye, FileText, MoreHorizontal, Search, ShoppingBag } from "lucide-react";

export default function OrdersPage() {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openActionMenu, setOpenActionMenu] = useState(null);

  const orders = [
    {
      id: "ORD-2023-001",
      date: "2023-04-10",
      customer: "Jean Dupont",
      total: 129.99,
      status: "delivered",
      items: 2,
    },
    {
      id: "ORD-2023-002",
      date: "2023-04-09",
      customer: "Marie Martin",
      total: 89.5,
      status: "shipped",
      items: 1,
    },
    {
      id: "ORD-2023-003",
      date: "2023-04-08",
      customer: "Pierre Durand",
      total: 245.75,
      status: "processing",
      items: 3,
    },
    {
      id: "ORD-2023-004",
      date: "2023-04-07",
      customer: "Sophie Petit",
      total: 59.99,
      status: "pending",
      items: 1,
    },
    {
      id: "ORD-2023-005",
      date: "2023-04-06",
      customer: "Lucas Bernard",
      total: 175.25,
      status: "cancelled",
      items: 2,
    },
  ];

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'delivered':
        return 'Livrée';
      case 'shipped':
        return 'Expédiée';
      case 'processing':
        return 'En traitement';
      case 'pending':
        return 'En attente';
      case 'cancelled':
        return 'Annulée';
      default:
        return status;
    }
  };

  const handleActionClick = (orderId) => {
    setOpenActionMenu(openActionMenu === orderId ? null : orderId);
  };

  const handleViewDetails = (orderId) => {
    console.log('Voir les détails de la commande:', orderId);
    setOpenActionMenu(null);
  };

  const handleViewInvoice = (orderId) => {
    console.log('Voir la facture de la commande:', orderId);
    setOpenActionMenu(null);
  };

  const handleDownloadInvoice = (orderId) => {
    console.log('Télécharger la facture de la commande:', orderId);
    setOpenActionMenu(null);
  };

  // Fermer le menu si on clique en dehors
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (openActionMenu && !event.target.closest('.action-menu')) {
        setOpenActionMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openActionMenu]);

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Commandes</h1>
        <p className="text-gray-500">Gérez les commandes de vos clients</p>
      </div>

      <div className="flex flex-col h-11 md:flex-row gap-4 items-end">
        <div className="relative h-full  flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher une commande..."
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
          <option value="all">Tous les statuts</option>
          <option value="pending">En attente</option>
          <option value="processing">En traitement</option>
          <option value="shipped">Expédiée</option>
          <option value="delivered">Livrée</option>
          <option value="cancelled">Annulée</option>
        </select>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="min-w-full  divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Commande
              </th>
              <th scope="col" className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Articles
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">
                      <ShoppingBag className="h-4 w-4 text-gray-500" />
                    </div>
                    <span className="font-medium">{order.id}</span>
                  </div>
                </td>
                <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.date}
                </td>
                <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.customer}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                  {order.items}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                  {order.total.toFixed(2)} €
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(order.status)}`}>
                    {getStatusText(order.status)}
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
                      <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-[99]"
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
                            Voir les détails
                          </button>
                          <button
                            onClick={() => handleViewInvoice(order.id)}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            role="menuitem"
                          >
                            <FileText className="mr-2 h-4 w-4" />
                            Voir la facture
                          </button>
                          <button
                            onClick={() => handleDownloadInvoice(order.id)}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            role="menuitem"
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Télécharger la facture
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
    </div>
  );
}
