"use client"

import { useState, useEffect } from "react"
import { Eye, X, Check, PlayCircle, StopCircle, Trash2, MapPin, Phone, Mail, Calendar, Tag } from "lucide-react"
import axios from "axios"
import { useTranslation } from 'react-i18next'

export default function Stores() {
  const { t } = useTranslation()
  const [stores, setStores] = useState([])
  const [selectedStore, setSelectedStore] = useState(null)
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [confirmAction, setConfirmAction] = useState("approve")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [statusFilter, setStatusFilter] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [users, setUsers] = useState([])
  const Languages = localStorage.getItem("lang")

  // Fetch stores and users from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [storesResponse, usersResponse] = await Promise.all([
          axios.get('http://localhost:1337/api/boutiques?populate=*'),
          axios.get('http://localhost:1337/api/users?populate=*')
        ])
        setStores(storesResponse.data.data)
        setUsers(usersResponse.data)
        setIsLoading(false)
      } catch (err) {
        setError('Failed to fetch data')
        setIsLoading(false)
        console.error('Error fetching data:', err)
      }
    }

    fetchData()
  }, [])

  // Get owner details
  const getOwnerDetails = (ownerId) => {
    const owner = users.find(user => user.id === ownerId)
    return owner || null
  }

  // Get owner photo URL
  const getOwnerPhotoUrl = (ownerId) => {
    const owner = getOwnerDetails(ownerId)
    if (owner?.photo?.formats?.thumbnail?.url) {
      return `http://localhost:1337${owner.photo.formats.thumbnail.url}`
    }
    return null
  }

  // Get owner initials
  const getOwnerInitials = (ownerId) => {
    const owner = getOwnerDetails(ownerId)
    if (owner?.username) {
      return owner.username.charAt(0).toUpperCase()
    }
    return '?'
  }

  // Get pending stores
  const pendingStores = stores.filter((store) => store.statusBoutique === "pending")
  
  const openConfirmModal = (store, action) => {
    setSelectedStore(store)
    setConfirmAction(action)
    setConfirmModalOpen(true)
  }

  const handleConfirmAction = async () => {
    if (!selectedStore) return

    setIsSubmitting(true)

    try {
      if (confirmAction === "delete") {
        // Delete the store from the API
        await axios.delete(`http://localhost:1337/api/boutiques/${selectedStore.documentId}`)
        
        // Update local state by removing the deleted store
        const updatedStores = stores.filter(store => store.id !== selectedStore.id)
        setStores(updatedStores)
      } else {
        // Update store status in the API
        await axios.put(`http://localhost:1337/api/boutiques/${selectedStore.documentId}`, {
          data: {
            statusBoutique: confirmAction === "approve" || confirmAction === "enable" ? "active" : "suspended"
          }
        })

        // Update local state
        const updatedStores = stores.map((store) =>
          store.id === selectedStore.id
            ? {
                ...store,
                statusBoutique: confirmAction === "approve" || confirmAction === "enable" ? "active" : "suspended"
              }
            : store
        )

        setStores(updatedStores)
      }
      setConfirmModalOpen(false)
    } catch (error) {
      console.error('Error updating store:', error)
      setError('Failed to update store status')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get store status badge
  const getStoreStatusBadge = (status) => {
    switch (status) {
      case "active":
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">{t('storesAdmin.status.active')}</span>
      case "suspended":
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">{t('storesAdmin.status.suspended')}</span>
      case "pending":
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">{t('storesAdmin.status.pending')}</span>
        )
      default:
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">{status}</span>
    }
  }

  // Filter stores based on search term and status filter
  const filteredStores = stores.filter((store) => {
    const matchesSearch = store.nom.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter ? store.statusBoutique === statusFilter : true

    return matchesSearch && matchesStatus
  })

  const openViewModal = (store) => {
    setSelectedStore(store)
    setViewModalOpen(true)
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
          <h1 className="text-2xl font-bold text-gray-800">{t('storesAdmin.title')}</h1>
          <p className="text-gray-500">{t('storesAdmin.subtitle')}</p>
        </div>
      </div>

      {/* Pending Store Approvals */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">{t('storesAdmin.pendingApprovals.title')}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pendingStores.length > 0 ? (
            pendingStores.map((store) => (
              <div key={store.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 mr-3">
                        {store.logo?.formats?.thumbnail?.url ? (
                          <img
                            src={`http://localhost:1337${store.logo.formats.thumbnail.url}`}
                            alt={store.nom}
                            className="h-full w-full object-cover rounded-lg"
                          />
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                            />
                          </svg>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">{store.nom}</h3>
                        <p className="text-gray-500 text-sm">{store.owner?.data?.attributes?.email}</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                      En attente
                    </span>
                  </div>

                  <p className="mt-3 text-sm text-gray-600">{store.description}</p>

                  <div className="mt-3 flex items-center text-xs text-gray-500">
                    <span className="flex items-center mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {store.emplacement}
                    </span>
                    <span className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Soumis le {new Date(store.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex justify-between">
                  <button 
                    className="flex items-center px-3 py-1 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50"
                    onClick={() => openViewModal(store)}
                  >
                    <Eye className="mr-1 h-4 w-4" />
                    {t('storesAdmin.pendingApprovals.details')}
                  </button>

                  <div className="flex items-center space-x-2">
                    <button
                      className="flex items-center px-3 py-1 text-sm border border-green-300 rounded-md text-green-600 hover:bg-green-50"
                      onClick={() => openConfirmModal(store, "approve")}
                    >
                      <Check className="mr-1 h-4 w-4" />
                      {t('storesAdmin.pendingApprovals.approve')}
                    </button>
                    <button
                      className="flex items-center px-3 py-1 text-sm border border-red-300 rounded-md text-red-600 hover:bg-red-50"
                      onClick={() => openConfirmModal(store, "reject")}
                    >
                      <X className="mr-1 h-4 w-4" />
                      {t('storesAdmin.pendingApprovals.reject')}
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-gray-500">
              {t('storesAdmin.pendingApprovals.noStores')}
            </div>
          )}
        </div>
      </div>

      {/* All Stores Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">{t('storesAdmin.allStores.title')}</h2>
        </div>

        <div className="p-4 border-b border-gray-200 flex flex-wrap gap-4">
          <div className="w-full md:w-auto flex-1">
            <input
              type="text"
              placeholder={t('storesAdmin.allStores.search.placeholder')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="w-full md:w-auto">
            <select
              className="w-full md:w-[180px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">{t('storesAdmin.allStores.search.status.all')}</option>
              <option value="active">{t('storesAdmin.allStores.search.status.active')}</option>
              <option value="suspended">{t('storesAdmin.allStores.search.status.suspended')}</option>
              <option value="pending">{t('storesAdmin.allStores.search.status.pending')}</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-10 py-3 text-start  text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('storesAdmin.allStores.table.store')}
                </th>
                <th scope="col" className="px-10 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('storesAdmin.allStores.table.owner')}
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('storesAdmin.allStores.table.category')}
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('storesAdmin.allStores.table.location')}
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('storesAdmin.allStores.table.status')}
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('storesAdmin.allStores.table.actions.name')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStores.map((store) => (
                <tr key={store.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 ${Languages === "ar" ? "ml-3" : "mr-3"}`}>
                        {store.logo?.formats?.thumbnail?.url ? (
                          <img
                            src={`http://localhost:1337${store.logo.formats.thumbnail.url}`}
                            alt={store.nom}
                            className="h-full w-full object-cover rounded-lg"
                          />
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                            />
                          </svg>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">{store.nom}</p>
                        <p className="text-gray-500 text-xs">ID: #{store.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 ${Languages === "ar" ? "ml-2" : "mr-2"}`}>
                        {store.owner?.id && getOwnerPhotoUrl(store.owner.id) ? (
                          <img
                            src={getOwnerPhotoUrl(store.owner.id)}
                            alt={store.owner.username}
                            className="h-full w-full object-cover rounded-full"
                          />
                        ) : (
                          <span className="text-xs font-medium">
                            {store.owner?.id ? getOwnerInitials(store.owner.id) : '?'}
                          </span>
                        )}
                      </div>
                      <span className="text-sm">{store.owner?.email || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="px-6 text-center py-4 whitespace-nowrap">
                    <span className="text-sm capitalize">
                      {t(`storesAdmin.allStores.table.categories.${store.category?.toLowerCase() || 'other'}`)}
                    </span>
                  </td>
                  <td className="px-6 text-center py-4 whitespace-nowrap">
                    <span className="text-sm">{store.emplacement}</span>
                  </td>
                  <td className="px-6 text-center py-4 whitespace-nowrap">
                    {getStoreStatusBadge(store.statusBoutique)}
                  </td>
                  <td className="px-6  py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center justify-center w-full space-x-2">
                      <button 
                        className="text-gray-500 hover:text-gray-700" 
                        title={t('storesAdmin.allStores.table.actions.view')}
                        onClick={() => openViewModal(store)}
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {store.statusBoutique === "active" ? (
                        <button
                          className="text-red-600 hover:text-red-900"
                          title={t('storesAdmin.allStores.table.actions.disable')}
                          onClick={() => openConfirmModal(store, "disable")}
                        >
                          <StopCircle className="h-4 w-4" />
                        </button>
                      ) : store.statusBoutique === "suspended" ? (
                        <>
                          <button
                            className={`text-green-600 hover:text-green-900 ${Languages === "ar" ? "ml-2" :"mr-2"} `}
                            title={t('storesAdmin.allStores.table.actions.enable')}
                            onClick={() => openConfirmModal(store, "enable")}
                          >
                            <PlayCircle className="h-4 w-4" />
                          </button>
                          <button
                            className="text-red-600 hover:text-red-900"
                            title={t('storesAdmin.allStores.table.actions.delete')}
                            onClick={() => openConfirmModal(store, "delete")}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredStores.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">{t('storesAdmin.allStores.noStores')}</p>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {confirmModalOpen && (
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
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    {confirmAction === "approve" || confirmAction === "enable" ? (
                      <Check className="h-6 w-6 text-blue-600" />
                    ) : confirmAction === "delete" ? (
                      <Trash2 className="h-6 w-6 text-red-600" />
                    ) : (
                      <X className="h-6 w-6 text-red-600" />
                    )}
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {t(`storesAdmin.modals.confirm.${confirmAction}.title`)}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        {t(`storesAdmin.modals.confirm.${confirmAction}.message`, { name: selectedStore?.nom })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ${
                    confirmAction === "approve" || confirmAction === "enable"
                      ? "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                      : "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                  }`}
                  onClick={handleConfirmAction}
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? t('storesAdmin.modals.confirm.buttons.processing')
                    : t(`storesAdmin.modals.confirm.buttons.${confirmAction}`)}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setConfirmModalOpen(false)}
                  disabled={isSubmitting}
                >
                  {t('storesAdmin.modals.confirm.buttons.cancel')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewModalOpen && selectedStore && (
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
                      {selectedStore.logo?.formats?.thumbnail?.url ? (
                        <img
                          src={`http://localhost:1337${selectedStore.logo.formats.thumbnail.url}`}
                          alt={selectedStore.nom}
                          className="h-full w-full object-cover rounded-lg"
                        />
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                          />
                        </svg>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{selectedStore.nom}</h3>
                      {getStoreStatusBadge(selectedStore.statusBoutique)}
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
                  {/* Store Details */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">{t('storesAdmin.modals.view.description')}</h4>
                      <p className="text-gray-900">{selectedStore.description}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">{t('storesAdmin.modals.view.category')}</h4>
                      <div className="flex items-center">
                        <Tag className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-900 capitalize">{selectedStore.category}</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">{t('storesAdmin.modals.view.location')}</h4>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-900">{selectedStore.emplacement}</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">{t('storesAdmin.modals.view.creationDate')}</h4>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-900">
                          {new Date(selectedStore.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Owner Details */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">{t('storesAdmin.modals.view.owner')}</h4>
                    <div className="flex items-center space-x-3">
                      <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                        {selectedStore.owner?.id && getOwnerPhotoUrl(selectedStore.owner.id) ? (
                          <img
                            src={getOwnerPhotoUrl(selectedStore.owner.id)}
                            alt={selectedStore.owner.username}
                            className="h-full w-full object-cover rounded-full"
                          />
                        ) : (
                          <span className="text-sm font-medium">
                            {selectedStore.owner?.id ? getOwnerInitials(selectedStore.owner.id) : '?'}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{selectedStore.owner?.username}</p>
                        <div className="flex items-center text-sm text-gray-500">
                          <Mail className="h-4 w-4 mr-1" />
                          {selectedStore.owner?.email}
                        </div>
                        {selectedStore.owner?.phone && (
                          <div className="flex items-center text-sm text-gray-500">
                            <Phone className="h-4 w-4 mr-1" />
                            {selectedStore.owner.phone}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Location Details */}
                    {selectedStore.location && selectedStore.location.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-500 mb-2">{t('storesAdmin.modals.view.address')}</h4>
                        <div className="bg-gray-50 p-3 rounded-md">
                          <p className="text-sm text-gray-900">
                            {selectedStore.location[0].addressLine1}
                            {selectedStore.location[0].addressLine2 && `, ${selectedStore.location[0].addressLine2}`}
                          </p>
                          <p className="text-sm text-gray-900">
                            {selectedStore.location[0].postalCode} {selectedStore.location[0].city}
                          </p>
                          <p className="text-sm text-gray-900">{selectedStore.location[0].country}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Banner Image */}
                {selectedStore.banniere?.formats?.large?.url && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">{t('storesAdmin.modals.view.banner')}</h4>
                    <img
                      src={`http://localhost:1337${selectedStore.banniere.formats.large.url}`}
                      alt={`${t('storesAdmin.modals.view.banner')} ${selectedStore.nom}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
