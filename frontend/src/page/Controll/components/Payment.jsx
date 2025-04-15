"use client"

import React, { useState } from 'react';
import { CreditCard, Download, Eye, MoreHorizontal, Search } from "lucide-react"

export default function PaymentsPage() {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openActionMenu, setOpenActionMenu] = useState(null);

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

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Complété';
      case 'pending':
        return 'En attente';
      case 'failed':
        return 'Échoué';
      default:
        return status;
    }
  }

  const getMethodText = (method) => {
    switch (method) {
      case 'card':
        return 'Carte';
      case 'paypal':
        return 'PayPal';
      case 'bank':
        return 'Virement';
      default:
        return method;
    }
  }

  const handleActionClick = (paymentId) => {
    setOpenActionMenu(openActionMenu === paymentId ? null : paymentId);
  }

  const handleViewDetails = (paymentId) => {
    console.log('View details for payment:', paymentId);
    setOpenActionMenu(null);
  }

  const handleDownloadReceipt = (paymentId) => {
    console.log('Download receipt for payment:', paymentId);
    setOpenActionMenu(null);
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Paiements</h1>
        <p className="text-gray-500">Gérez les paiements reçus et à recevoir</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-row items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">Total reçu</h3>
            <CreditCard className="h-4 w-4 text-[#6D28D9]" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold">€4,550.50</div>
            <p className="text-xs text-gray-500">Ce mois-ci</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-row items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">En attente</h3>
            <CreditCard className="h-4 w-4 text-[#6D28D9]" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold">€305.74</div>
            <p className="text-xs text-gray-500">2 paiements en attente</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-row items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">Prochain versement</h3>
            <CreditCard className="h-4 w-4 text-[#6D28D9]" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold">€1,245.25</div>
            <p className="text-xs text-gray-500">Prévu le 15/04/2023</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un paiement..."
            className="w-full pl-8 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="w-full md:w-[180px] py-2 px-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:border-transparent"
        >
          <option value="all">Tous les statuts</option>
          <option value="completed">Complété</option>
          <option value="pending">En attente</option>
          <option value="failed">Échoué</option>
        </select>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">ID Paiement</th>
                <th className="hidden md:table-cell px-4 py-3 text-left text-sm font-medium text-gray-500">Date</th>
                <th className="hidden md:table-cell px-4 py-3 text-left text-sm font-medium text-gray-500">Commande</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">Méthode</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Montant</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">Statut</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium">{payment.id}</td>
                  <td className="hidden md:table-cell px-4 py-3 text-sm text-gray-500">{payment.date}</td>
                  <td className="hidden md:table-cell px-4 py-3 text-sm text-gray-500">{payment.orderId}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {getMethodText(payment.method)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-medium">{payment.amount.toFixed(2)} €</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(payment.status)}`}>
                      {getStatusText(payment.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="relative">
                      <button
                        onClick={() => handleActionClick(payment.id)}
                        className="p-2 hover:bg-gray-100 rounded-full"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                      {openActionMenu === payment.id && (
                        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                          <div className="py-1">
                            <button
                              onClick={() => handleViewDetails(payment.id)}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Voir les détails
                            </button>
                            <button
                              onClick={() => handleDownloadReceipt(payment.id)}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <Download className="mr-2 h-4 w-4" />
                              Télécharger le reçu
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
    </div>
  )
}
