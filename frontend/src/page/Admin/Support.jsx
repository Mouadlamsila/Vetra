"use client"

import { useState } from "react"
import { HeadphonesIcon, Send, Clock, CheckCircle, AlertCircle, MessageCircle } from "lucide-react"

// Mock data for support requests
const initialSupportRequests = [
  {
    id: 1,
    title: "Problème de paiement",
    userId: 2,
    status: "open",
    message: "Je n'arrive pas à finaliser mon paiement, une erreur s'affiche à chaque fois.",
    createdAt: "2023-06-15T10:30:00Z",
  },
  {
    id: 2,
    title: "Produit non reçu",
    userId: 3,
    status: "in_progress",
    message: "J'ai commandé il y a 2 semaines et je n'ai toujours pas reçu ma commande.",
    createdAt: "2023-06-10T14:20:00Z",
  },
  {
    id: 3,
    title: "Demande de remboursement",
    userId: 4,
    status: "resolved",
    message: "Je souhaite être remboursé pour ma commande #12345 car le produit est défectueux.",
    createdAt: "2023-06-08T09:15:00Z",
  },
  {
    id: 4,
    title: "Compte bloqué",
    userId: 5,
    status: "urgent",
    message: "Mon compte a été bloqué sans raison, je ne peux plus me connecter.",
    createdAt: "2023-06-05T16:45:00Z",
  },
  {
    id: 5,
    title: "Question sur livraison",
    userId: 6,
    status: "open",
    message: "Quels sont les délais de livraison pour la France métropolitaine ?",
    createdAt: "2023-06-03T11:10:00Z",
  },
]

// Mock data for support messages
const initialSupportMessages = [
  {
    id: 1,
    requestId: 2,
    userId: 3,
    message: "Bonjour, j'ai commandé il y a 2 semaines et je n'ai toujours pas reçu ma commande #54321.",
    createdAt: "2023-06-10T14:20:00Z",
  },
  {
    id: 2,
    requestId: 2,
    userId: 1,
    message: "Bonjour, merci pour votre message. Pouvez-vous me confirmer votre adresse de livraison ?",
    createdAt: "2023-06-11T09:30:00Z",
  },
  {
    id: 3,
    requestId: 2,
    userId: 3,
    message: "Mon adresse est 123 rue de Paris, 75001 Paris.",
    createdAt: "2023-06-11T10:15:00Z",
  },
  {
    id: 4,
    requestId: 2,
    userId: 1,
    message:
      "Merci pour ces informations. Je viens de vérifier et votre colis est en cours de livraison. Vous devriez le recevoir d'ici 2 jours ouvrés.",
    createdAt: "2023-06-11T11:05:00Z",
  },
]

export default function Support() {
  const [supportRequests, setSupportRequests] = useState(initialSupportRequests)
  const [supportMessages, setSupportMessages] = useState(initialSupportMessages)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [replyMessage, setReplyMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

  // Get user details (normally would be fetched from the API)
  const getUserDetails = (userId) => {
    // This is a mock function - in a real app, you'd fetch this from the API
    const mockUsers = [
      { id: 1, name: "Admin Principal", email: "admin@marketplace.com", initials: "AP" },
      { id: 2, name: "Marie Laurent", email: "marie@example.com", initials: "ML" },
      { id: 3, name: "Thomas Dubois", email: "thomas@example.com", initials: "TD" },
      { id: 4, name: "Sophie Lefèvre", email: "sophie@example.com", initials: "SL" },
      { id: 5, name: "Alain Martin", email: "alain@example.com", initials: "AM" },
      { id: 6, name: "Julie Bernard", email: "julie@example.com", initials: "JB" },
    ]

    const user = mockUsers.find((u) => u.id === userId) || mockUsers[0]
    return {
      name: user.name,
      email: user.email,
      initials: user.initials,
    }
  }

  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case "open":
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">Ouvert</span>
      case "in_progress":
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">En cours</span>
        )
      case "resolved":
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Résolu</span>
      case "urgent":
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Urgent</span>
      default:
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">{status}</span>
    }
  }

  const viewDetails = (request) => {
    setSelectedRequest(request)
    setDetailsOpen(true)
  }

  const handleStatusChange = (status) => {
    if (!selectedRequest) return

    // Update the status of the selected request
    const updatedRequests = supportRequests.map((req) => (req.id === selectedRequest.id ? { ...req, status } : req))

    setSupportRequests(updatedRequests)
    setSelectedRequest({ ...selectedRequest, status })
  }

  const handleSendReply = (e) => {
    e.preventDefault()

    if (!replyMessage.trim() || !selectedRequest) return

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      // Create a new message
      const newMessage = {
        id: supportMessages.length + 1,
        requestId: selectedRequest.id,
        userId: 1, // Admin user ID
        message: replyMessage,
        createdAt: new Date().toISOString(),
      }

      setSupportMessages([...supportMessages, newMessage])

      // If the request was open, update it to in_progress
      if (selectedRequest.status === "open") {
        handleStatusChange("in_progress")
      }

      setReplyMessage("")
      setIsSubmitting(false)
    }, 500)
  }

  // Get messages for the selected request
  const getRequestMessages = () => {
    if (!selectedRequest) return []
    return supportMessages.filter((msg) => msg.requestId === selectedRequest.id)
  }

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  // Format date and time
  const formatDateTime = (dateString) => {
    const date = new Date(dateString)
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
  }

  // Get relative time
  const getRelativeTime = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffSec = Math.round(diffMs / 1000)
    const diffMin = Math.round(diffSec / 60)
    const diffHour = Math.round(diffMin / 60)
    const diffDay = Math.round(diffHour / 24)

    if (diffSec < 60) return "à l'instant"
    if (diffMin < 60) return `il y a ${diffMin} min`
    if (diffHour < 24) return `il y a ${diffHour} h`
    if (diffDay < 7) return `il y a ${diffDay} j`
    return formatDate(dateString)
  }

  // Filter requests based on active tab
  const filteredRequests = supportRequests.filter((req) => {
    if (activeTab === "all") return true
    return req.status === activeTab
  })

  // Count requests by status
  const countByStatus = (status) => {
    return supportRequests.filter((req) => req.status === status).length
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Support client</h1>
          <p className="text-gray-500">Gérer les demandes de support et les signalements</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Demandes ouvertes</p>
            <p className="text-2xl font-bold mt-1">{countByStatus("open")}</p>
          </div>
          <div className="bg-blue-100 text-blue-600 rounded-full p-3">
            <Clock className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">En cours</p>
            <p className="text-2xl font-bold mt-1">{countByStatus("in_progress")}</p>
          </div>
          <div className="bg-yellow-100 text-yellow-600 rounded-full p-3">
            <MessageCircle className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Résolues</p>
            <p className="text-2xl font-bold mt-1">{countByStatus("resolved")}</p>
          </div>
          <div className="bg-green-100 text-green-600 rounded-full p-3">
            <CheckCircle className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Urgentes</p>
            <p className="text-2xl font-bold mt-1">{countByStatus("urgent")}</p>
          </div>
          <div className="bg-red-100 text-red-600 rounded-full p-3">
            <AlertCircle className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Support Requests */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            <button
              className={`px-4 py-3 text-sm font-medium ${activeTab === "all" ? "text-purple-600 border-b-2 border-purple-600" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => setActiveTab("all")}
            >
              Toutes les demandes
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium ${activeTab === "open" ? "text-purple-600 border-b-2 border-purple-600" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => setActiveTab("open")}
            >
              Ouvertes
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium ${activeTab === "in_progress" ? "text-purple-600 border-b-2 border-purple-600" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => setActiveTab("in_progress")}
            >
              En cours
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium ${activeTab === "urgent" ? "text-purple-600 border-b-2 border-purple-600" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => setActiveTab("urgent")}
            >
              Urgentes
            </button>
          </div>
        </div>

        <div className="p-4 border-b border-gray-200">
          <input
            type="text"
            placeholder="Rechercher une demande..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Titre
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
                  Statut
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date
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
              {filteredRequests.map((request) => {
                const user = getUserDetails(request.userId)

                return (
                  <tr key={request.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                          <HeadphonesIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">{request.title}</p>
                          <p className="text-gray-500 text-xs">ID: #{request.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 mr-2">
                          <span className="text-xs font-medium">{user.initials}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(request.status)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm">{formatDate(request.createdAt)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        className="flex items-center px-3 py-1 text-sm border border-purple-300 rounded-md text-purple-600 hover:bg-purple-50"
                        onClick={() => viewDetails(request)}
                      >
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Répondre
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filteredRequests.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">Aucune demande trouvée</p>
          </div>
        )}
      </div>

      {/* Support Request Details Modal */}
      {detailsOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">{selectedRequest?.title}</h3>
                  <div className="flex items-center space-x-2">
                    {selectedRequest && getStatusBadge(selectedRequest.status)}
                    <div className="flex space-x-1">
                      <button
                        className={`p-1 rounded-md ${selectedRequest?.status === "open" ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600"}`}
                        disabled={selectedRequest?.status === "open"}
                        onClick={() => handleStatusChange("open")}
                        title="Marquer comme ouvert"
                      >
                        <Clock className="h-4 w-4" />
                      </button>
                      <button
                        className={`p-1 rounded-md ${selectedRequest?.status === "in_progress" ? "bg-yellow-100 text-yellow-600" : "bg-gray-100 text-gray-600 hover:bg-yellow-100 hover:text-yellow-600"}`}
                        disabled={selectedRequest?.status === "in_progress"}
                        onClick={() => handleStatusChange("in_progress")}
                        title="Marquer comme en cours"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </button>
                      <button
                        className={`p-1 rounded-md ${selectedRequest?.status === "resolved" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-600"}`}
                        disabled={selectedRequest?.status === "resolved"}
                        onClick={() => handleStatusChange("resolved")}
                        title="Marquer comme résolu"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </button>
                      <button
                        className={`p-1 rounded-md ${selectedRequest?.status === "urgent" ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600"}`}
                        disabled={selectedRequest?.status === "urgent"}
                        onClick={() => handleStatusChange("urgent")}
                        title="Marquer comme urgent"
                      >
                        <AlertCircle className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {selectedRequest && (
                  <div className="mt-4">
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <div className="flex items-start space-x-3">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                          <span className="text-sm font-medium">{getUserDetails(selectedRequest.userId).initials}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">{getUserDetails(selectedRequest.userId).name}</p>
                            <span className="text-xs text-gray-500">{formatDateTime(selectedRequest.createdAt)}</span>
                          </div>
                          <p className="mt-2 text-gray-700">{selectedRequest.message}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 max-h-[300px] overflow-y-auto mb-4">
                      {getRequestMessages().length > 0 ? (
                        getRequestMessages().map((message) => {
                          const isAdmin = message.userId === 1
                          const user = getUserDetails(message.userId)

                          return (
                            <div
                              key={message.id}
                              className={`flex items-start space-x-3 ${isAdmin ? "justify-end" : ""}`}
                            >
                              {!isAdmin && (
                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                                  <span className="text-sm font-medium">{user.initials}</span>
                                </div>
                              )}
                              <div
                                className={`flex-1 max-w-[80%] ${isAdmin ? "bg-purple-50 border border-purple-100" : "bg-gray-50"} p-3 rounded-lg`}
                              >
                                <div className="flex items-center justify-between">
                                  <p className="font-medium">{user.name}</p>
                                  <span className="text-xs text-gray-500">{getRelativeTime(message.createdAt)}</span>
                                </div>
                                <p className="mt-1 text-gray-700">{message.message}</p>
                              </div>
                              {isAdmin && (
                                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                                  <span className="text-sm font-medium">{user.initials}</span>
                                </div>
                              )}
                            </div>
                          )
                        })
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-gray-500">Aucun message pour l'instant</p>
                        </div>
                      )}
                    </div>

                    <form onSubmit={handleSendReply}>
                      <div className="mb-4">
                        <label htmlFor="reply" className="block text-sm font-medium text-gray-700 mb-1">
                          Votre réponse
                        </label>
                        <textarea
                          id="reply"
                          rows="3"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                          placeholder="Entrez votre message..."
                          value={replyMessage}
                          onChange={(e) => setReplyMessage(e.target.value)}
                          disabled={selectedRequest?.status === "resolved" || isSubmitting}
                        ></textarea>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <button
                          type="button"
                          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                          onClick={() => setDetailsOpen(false)}
                          disabled={isSubmitting}
                        >
                          Fermer
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center"
                          disabled={!replyMessage.trim() || selectedRequest?.status === "resolved" || isSubmitting}
                        >
                          {isSubmitting ? (
                            <span>Envoi en cours...</span>
                          ) : (
                            <>
                              <Send className="mr-2 h-4 w-4" />
                              Envoyer
                            </>
                          )}
                        </button>
                      </div>
                    </form>
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
