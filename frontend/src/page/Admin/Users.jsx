"use client"

import { useState, useEffect } from "react"
import { Eye, Pencil, UserMinus, UserCheck, Trash2, MapPin, Phone, Mail, Calendar, Tag, Building, FileText } from "lucide-react"
import axios from "axios"

export default function Users() {
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [addUserModalOpen, setAddUserModalOpen] = useState(false)
  const [confirmAction, setConfirmAction] = useState("block")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [statusFilter, setStatusFilter] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUsers, setSelectedUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    role: ""
  })
  const [newUserData, setNewUserData] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    role: "4", // Default to User role
    addressLine1: "",
    addressLine2: "",
    city: "",
    country: "",
    postalCode: "",
    has_previous_store: false,
    delivery_required: false,
    has_suppliers: false,
    daily_time_available: "1-2 hours",
    business_duration: "just_starting"
  })

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:1337/api/users?populate=*')
        setUsers(response.data)
        setIsLoading(false)
      } catch (err) {
        setError('Failed to fetch users')
        setIsLoading(false)
        console.error('Error fetching users:', err)
      }
    }

    fetchUsers()
  }, [])

  // Generate initials from email
  const getInitials = (email) => {
    return email
      .split("@")[0]
      .split(".")
      .map((part) => part[0]?.toUpperCase())
      .join("")
      .slice(0, 2)
  }

  // Format status badge
  const getUserStatusBadge = (blocked) => {
    return blocked ? (
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Bloqué</span>
    ) : (
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Actif</span>
    )
  }

  const openBlockModal = (user, action) => {
    setSelectedUser(user)
    setConfirmAction(action)
    setConfirmModalOpen(true)
  }

  const openViewModal = (user) => {
    setSelectedUser(user)
    setViewModalOpen(true)
  }

  const openEditModal = (user) => {
    setSelectedUser(user)
    setFormData({
      username: user.username,
      email: user.email,
      phone: user.phone || "",
      role: user.role?.id || "",
      addressLine1: user.adress?.addressLine1 || "",
      addressLine2: user.adress?.addressLine2 || "",
      city: user.adress?.city || "",
      country: user.adress?.country || "",
      postalCode: user.adress?.postalCode || "",
      has_previous_store: user.business_survey?.has_previous_store || false,
      delivery_required: user.business_survey?.delivery_required || false,
      has_suppliers: user.business_survey?.has_suppliers || false,
      daily_time_available: user.business_survey?.daily_time_available || "1-2 hours",
      business_duration: user.business_survey?.business_duration || "just_starting"
    })
    setEditModalOpen(true)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleUpdateUser = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Don't allow changing role to admin
      if (formData.role === "3") {
        setError("Vous ne pouvez pas attribuer le rôle d'administrateur")
        setIsSubmitting(false)
        return
      }

      // Update user basic info
      await axios.put(`http://localhost:1337/api/users/${selectedUser.id}`, {
        username: formData.username,
        email: formData.email,
        role: formData.role
      })

      // Handle address update
      if (selectedUser.adress) {
        await axios.put(`http://localhost:1337/api/adresses/${selectedUser.adress.id}`, {
          data: {
            addressLine1: formData.addressLine1,
            addressLine2: formData.addressLine2,
            city: formData.city,
            country: formData.country,
            postalCode: formData.postalCode
          }
        })
      } else if (formData.role === "1" && formData.addressLine1) {
        // Create new address if it doesn't exist and role is Owner
        await axios.post('http://localhost:1337/api/adresses', {
          data: {
            addressLine1: formData.addressLine1,
            addressLine2: formData.addressLine2,
            city: formData.city,
            country: formData.country,
            postalCode: formData.postalCode,
            user: selectedUser.id
          }
        })
      }

      // Handle business survey update for owners
      if (formData.role === "1") {
        if (selectedUser.business_survey) {
          await axios.put(`http://localhost:1337/api/business-surveis/${selectedUser.business_survey.id}`, {
            data: {
              has_previous_store: formData.has_previous_store,
              delivery_required: formData.delivery_required,
              has_suppliers: formData.has_suppliers,
              daily_time_available: formData.daily_time_available,
              business_duration: formData.business_duration
            }
          })
        } else {
          await axios.post('http://localhost:1337/api/business-surveis', {
            data: {
              has_previous_store: formData.has_previous_store,
              delivery_required: formData.delivery_required,
              has_suppliers: formData.has_suppliers,
              daily_time_available: formData.daily_time_available,
              business_duration: formData.business_duration,
              user: selectedUser.id
            }
          })
        }
      }

      // Update phone number if role is Owner
      if (formData.role === "1") {
        await axios.put(`http://localhost:1337/api/users/${selectedUser.id}`, {
          phone: formData.phone
        })
      }

      // Refresh user data
      const response = await axios.get('http://localhost:1337/api/users?populate=*')
      setUsers(response.data)
      setEditModalOpen(false)
      
      // Reset form data
      setFormData({
        username: "",
        email: "",
        phone: "",
        role: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        country: "",
        postalCode: "",
        has_previous_store: false,
        delivery_required: false,
        has_suppliers: false,
        daily_time_available: "1-2 hours",
        business_duration: "just_starting"
      })
    } catch (error) {
      console.error('Error updating user:', error)
      setError('Failed to update user')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleConfirmAction = async () => {
    if (!selectedUser) return

    setIsSubmitting(true)

    try {
      // Update user status in the API
      await axios.put(`http://localhost:1337/api/users/${selectedUser.id}`, {
        blocked: confirmAction === "block"
      })

      // Update local state
      const updatedUsers = users.map((user) =>
        user.id === selectedUser.id ? { ...user, blocked: confirmAction === "block" } : user
      )

      setUsers(updatedUsers)
      setConfirmModalOpen(false)
    } catch (error) {
      console.error('Error updating user:', error)
      setError('Failed to update user status')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteUser = async () => {
    if (!selectedUser) return

    setIsSubmitting(true)

    try {
      await axios.delete(`http://localhost:1337/api/users/${selectedUser.id}`)

      // Update local state
      const updatedUsers = users.filter((user) => user.id !== selectedUser.id)
      setUsers(updatedUsers)
      setConfirmModalOpen(false)
    } catch (error) {
      console.error('Error deleting user:', error)
      setError('Failed to delete user')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Toggle user selection
  const toggleUserSelection = (userId) => {
    setSelectedUsers((prev) => {
      if (prev.includes(userId)) {
        return prev.filter((id) => id !== userId)
      } else {
        return [...prev, userId]
      }
    })
  }

  // Toggle all users selection
  const toggleAllUsers = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(filteredUsers.map((user) => user.id))
    }
  }

  // Filter users based on search term and status filter
  const filteredUsers = users.filter((user) => {
    // Don't show admin users
    if (user.role?.type === "admin") return false;

    const matchesSearch =
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter ? user.blocked === (statusFilter === "blocked") : true

    return matchesSearch && matchesStatus
  })

  const handleAddUser = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Create user
      const userData = {
        username: newUserData.username,
        email: newUserData.email,
        password: newUserData.password,
        phone: newUserData.phone,
        role: newUserData.role,
      }

      const response = await axios.post('http://localhost:1337/api/users', userData)
      const userId = response.data.id

      // If address fields are filled, create address
      if (newUserData.addressLine1 || newUserData.city || newUserData.country) {
        const addressData = {
          data: {
            addressLine1: newUserData.addressLine1,
            addressLine2: newUserData.addressLine2,
            city: newUserData.city,
            country: newUserData.country,
            postalCode: newUserData.postalCode,
            user: userId
          }
        }
        await axios.post('http://localhost:1337/api/adresses', addressData)
      }

      // If role is Owner, create business survey
      if (newUserData.role === "1") {
        const businessData = {
          data: {
            has_previous_store: newUserData.has_previous_store,
            delivery_required: newUserData.delivery_required,
            has_suppliers: newUserData.has_suppliers,
            daily_time_available: newUserData.daily_time_available,
            business_duration: newUserData.business_duration,
            user: userId
          }
        }
        await axios.post('http://localhost:1337/api/business-surveis', businessData)
      }

      // Refresh users list
      const updatedResponse = await axios.get('http://localhost:1337/api/users?populate=*')
      setUsers(updatedResponse.data)

      setAddUserModalOpen(false)
      setNewUserData({
        username: "",
        email: "",
        password: "",
        phone: "",
        role: "4",
        addressLine1: "",
        addressLine2: "",
        city: "",
        country: "",
        postalCode: "",
        has_previous_store: false,
        delivery_required: false,
        has_suppliers: false,
        daily_time_available: "1-2 hours",
        business_duration: "just_starting"
      })
    } catch (error) {
      console.error('Error creating user:', error)
      setError('Failed to create user')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNewUserInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setNewUserData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
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
          <h1 className="text-2xl font-bold text-gray-800">Gestion des utilisateurs</h1>
          <p className="text-gray-500">Gérer tous les utilisateurs de la plateforme</p>
        </div>
        <button
          onClick={() => setAddUserModalOpen(true)}
          className="mt-4 md:mt-0 flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
        >
          <span className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Ajouter
          </span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-wrap gap-4">
        <div className="w-full md:w-auto flex-1">
          <input
            type="text"
            placeholder="Rechercher un utilisateur..."
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
            <option value="">Tous les statuts</option>
            <option value="active">Actifs</option>
            <option value="blocked">Bloqués</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                      onChange={toggleAllUsers}
                    />
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Utilisateur
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Téléphone
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Rôle
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Statut
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date d'inscription
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => {
                const initials = getInitials(user.email)

                return (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => toggleUserSelection(user.id)}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 mr-3">
                          {user.photo?.formats?.thumbnail?.url ? (
                            <img
                              src={`http://localhost:1337${user.photo.formats.thumbnail.url}`}
                              alt={user.username}
                              className="h-full w-full object-cover rounded-full"
                            />
                          ) : (
                            <span className="text-sm font-medium">{initials}</span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">{user.username}</p>
                          <p className="text-gray-500 text-xs">ID: #{user.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm">{user.email}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm">{user.phone || '-'}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                        {user.role?.name || 'User'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{getUserStatusBadge(user.blocked)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm">{new Date(user.createdAt).toLocaleDateString()}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          className="text-gray-500 hover:text-gray-700"
                          title="Voir le profil"
                          onClick={() => openViewModal(user)}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          className="text-gray-500 hover:text-gray-700"
                          title="Modifier"
                          onClick={() => openEditModal(user)}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        {!user.blocked ? (
                          <button
                            className="text-red-600 hover:text-red-900"
                            title="Bloquer"
                            onClick={() => openBlockModal(user, "block")}
                          >
                            <UserMinus className="h-4 w-4" />
                          </button>
                        ) : (
                          <button
                            className="text-green-600 hover:text-green-900"
                            title="Débloquer"
                            onClick={() => openBlockModal(user, "unblock")}
                          >
                            <UserCheck className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          className="text-red-600 hover:text-red-900"
                          title="Supprimer"
                          onClick={() => {
                            setSelectedUser(user)
                            setConfirmAction("delete")
                            setConfirmModalOpen(true)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">Aucun utilisateur trouvé</p>
          </div>
        )}
      </div>

      {/* View Modal */}
      {viewModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Détails de l'utilisateur
                      </h3>
                      <button
                        onClick={() => setViewModalOpen(false)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <span className="sr-only">Fermer</span>
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="mt-4">
                      <div className="flex items-center space-x-4 mb-6">
                        <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                          {selectedUser.photo?.formats?.thumbnail?.url ? (
                            <img
                              src={`http://localhost:1337${selectedUser.photo.formats.thumbnail.url}`}
                              alt={selectedUser.username}
                              className="h-full w-full object-cover rounded-full"
                            />
                          ) : (
                            <span className="text-xl font-medium">{getInitials(selectedUser.email)}</span>
                          )}
                        </div>
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">{selectedUser.username}</h4>
                          <p className="text-sm text-gray-500">{selectedUser.email}</p>
                          <span className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            {selectedUser.role?.name || 'User'}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-4">
                          <div className="flex items-center space-x-2">
                            <Mail className="h-5 w-5 text-gray-400" />
                            <span className="text-sm text-gray-600">{selectedUser.email}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="h-5 w-5 text-gray-400" />
                            <span className="text-sm text-gray-600">{selectedUser.phone || 'Non renseigné'}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-5 w-5 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              Inscrit le {new Date(selectedUser.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Tag className="h-5 w-5 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              Statut: {selectedUser.blocked ? 'Bloqué' : 'Actif'}
                            </span>
                          </div>
                        </div>

                        {selectedUser.adress && (
                          <div className="space-y-4">
                            <h5 className="font-medium text-gray-900">Adresse</h5>
                            <div className="flex items-start space-x-2">
                              <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                              <div className="text-sm text-gray-600">
                                <p>{selectedUser.adress.addressLine1}</p>
                                {selectedUser.adress.addressLine2 && <p>{selectedUser.adress.addressLine2}</p>}
                                <p>{selectedUser.adress.city}, {selectedUser.adress.postalCode}</p>
                                <p>{selectedUser.adress.country}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {selectedUser.business_survey && (
                          <div className="space-y-4">
                            <h5 className="font-medium text-gray-900">Informations Business</h5>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <Building className="h-5 w-5 text-gray-400" />
                                <span className="text-sm text-gray-600">
                                  Expérience: {selectedUser.business_survey.has_previous_store ? 'Oui' : 'Non'}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <FileText className="h-5 w-5 text-gray-400" />
                                <span className="text-sm text-gray-600">
                                  Durée: {selectedUser.business_survey.business_duration}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {selectedUser.boutiques && selectedUser.boutiques.length > 0 && (
                        <div className="mt-6">
                          <h5 className="font-medium text-gray-900 mb-3">Boutiques</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {selectedUser.boutiques.map((boutique) => (
                              <div key={boutique.id} className="bg-gray-50 p-4 rounded-lg">
                                <h6 className="font-medium text-gray-900">{boutique.nom}</h6>
                                <p className="text-sm text-gray-600">{boutique.description}</p>
                                <div className="mt-2 flex items-center space-x-2">
                                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                    {boutique.statusBoutique}
                                  </span>
                                  <span className="text-xs text-gray-500">{boutique.category}</span>
                                </div>
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
        </div>
      )}

      {/* Edit Modal */}
      {editModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Modifier l'utilisateur
                      </h3>
                      <button
                        onClick={() => setEditModalOpen(false)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <span className="sr-only">Fermer</span>
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <form onSubmit={handleUpdateUser}>
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                            Nom d'utilisateur
                          </label>
                          <input
                            type="text"
                            name="username"
                            id="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                          </label>
                          <input
                            type="email"
                            name="email"
                            id="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                            Téléphone
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            id="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                          />
                        </div>
                        <div>
                          <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                            Rôle
                          </label>
                          <select
                            name="role"
                            id="role"
                            value={formData.role}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                          >
                            <option value="1">Owner</option>
                            <option value="4">User</option>
                          </select>
                        </div>
                      </div>
                      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                        <button
                          type="submit"
                          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:ml-3 sm:w-auto sm:text-sm"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Mise à jour..." : "Mettre à jour"}
                        </button>
                        <button
                          type="button"
                          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:mt-0 sm:w-auto sm:text-sm"
                          onClick={() => setEditModalOpen(false)}
                          disabled={isSubmitting}
                        >
                          Annuler
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    {confirmAction === "block" ? (
                      <UserMinus className="h-6 w-6 text-red-600" />
                    ) : confirmAction === "delete" ? (
                      <Trash2 className="h-6 w-6 text-red-600" />
                    ) : (
                      <UserCheck className="h-6 w-6 text-green-600" />
                    )}
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {confirmAction === "block"
                        ? "Bloquer l'utilisateur"
                        : confirmAction === "delete"
                          ? "Supprimer l'utilisateur"
                          : "Débloquer l'utilisateur"}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        {confirmAction === "block"
                          ? "Êtes-vous sûr de vouloir bloquer cet utilisateur ? Il ne pourra plus se connecter à son compte."
                          : confirmAction === "delete"
                            ? "Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible."
                            : "Êtes-vous sûr de vouloir débloquer cet utilisateur ? Il pourra à nouveau se connecter à son compte."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ${confirmAction === "block" || confirmAction === "delete"
                      ? "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                      : "bg-green-600 hover:bg-green-700 focus:ring-green-500"
                    }`}
                  onClick={confirmAction === "delete" ? handleDeleteUser : handleConfirmAction}
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Traitement..."
                    : confirmAction === "block"
                      ? "Bloquer"
                      : confirmAction === "delete"
                        ? "Supprimer"
                        : "Débloquer"}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setConfirmModalOpen(false)}
                  disabled={isSubmitting}
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {addUserModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleAddUser}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Ajouter un utilisateur</h3>
                    <button type="button" onClick={() => setAddUserModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                      <span className="sr-only">Fermer</span>
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* Basic Information */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-gray-900">Informations de base</h4>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Nom d'utilisateur</label>
                          <input
                            type="text"
                            name="username"
                            value={newUserData.username}
                            onChange={handleNewUserInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Email</label>
                          <input
                            type="email"
                            name="email"
                            value={newUserData.email}
                            onChange={handleNewUserInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
                          <input
                            type="password"
                            name="password"
                            value={newUserData.password}
                            onChange={handleNewUserInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Rôle</label>
                          <select
                            name="role"
                            value={newUserData.role}
                            onChange={handleNewUserInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                          >
                            <option value="4">User</option>
                            <option value="1">Owner</option>
                          </select>
                        </div>
                        {newUserData.role === "1" &&
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                            <input
                              type="tel"
                              name="phone"
                              value={newUserData.phone}
                              onChange={handleNewUserInputChange}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                            />
                          </div>}
                      </div>
                    </div>

                    {/* Address Information */}
                    {newUserData.role === "1" &&
                      <div className="space-y-4">
                        <h4 className="text-sm font-medium text-gray-900">Adresse</h4>
                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Adresse ligne 1</label>
                            <input
                              type="text"
                              name="addressLine1"
                              value={newUserData.addressLine1}
                              onChange={handleNewUserInputChange}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Adresse ligne 2</label>
                            <input
                              type="text"
                              name="addressLine2"
                              value={newUserData.addressLine2}
                              onChange={handleNewUserInputChange}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Ville</label>
                              <input
                                type="text"
                                name="city"
                                value={newUserData.city}
                                onChange={handleNewUserInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Code postal</label>
                              <input
                                type="text"
                                name="postalCode"
                                value={newUserData.postalCode}
                                onChange={handleNewUserInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Pays</label>
                            <input
                              type="text"
                              name="country"
                              value={newUserData.country}
                              onChange={handleNewUserInputChange}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                            />
                          </div>
                        </div>
                      </div>}

                    {/* Business Survey (Only for Owners) */}
                    {newUserData.role === "1" && (
                      <div className="space-y-4">
                        <h4 className="text-sm font-medium text-gray-900">Informations Business</h4>
                        <div className="space-y-4">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              name="has_previous_store"
                              checked={newUserData.has_previous_store}
                              onChange={handleNewUserInputChange}
                              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                            />
                            <label className="ml-2 block text-sm text-gray-700">
                              A déjà eu une boutique
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              name="delivery_required"
                              checked={newUserData.delivery_required}
                              onChange={handleNewUserInputChange}
                              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                            />
                            <label className="ml-2 block text-sm text-gray-700">
                              Livraison requise
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              name="has_suppliers"
                              checked={newUserData.has_suppliers}
                              onChange={handleNewUserInputChange}
                              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                            />
                            <label className="ml-2 block text-sm text-gray-700">
                              A des fournisseurs
                            </label>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Temps disponible quotidien
                            </label>
                            <select
                              name="daily_time_available"
                              value={newUserData.daily_time_available}
                              onChange={handleNewUserInputChange}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                            >
                              <option value="1-2 hours">1-2 heures</option>
                              <option value="3-4 hours">3-4 heures</option>
                              <option value="5-6 hours">5-6 heures</option>
                              <option value="7+ hours">7+ heures</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Durée de l'activité
                            </label>
                            <select
                              name="business_duration"
                              value={newUserData.business_duration}
                              onChange={handleNewUserInputChange}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                            >
                              <option value="just_starting">Je débute</option>
                              <option value="less_than_1_year">Moins d'un an</option>
                              <option value="1_to_3_years">1 à 3 ans</option>
                              <option value="more_than_3_years">Plus de 3 ans</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:ml-3 sm:w-auto sm:text-sm"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Création..." : "Créer"}
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setAddUserModalOpen(false)}
                    disabled={isSubmitting}
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
