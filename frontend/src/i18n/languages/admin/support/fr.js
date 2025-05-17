export default {
  title: "Support Client",
  subtitle: "Gérer les demandes de support et les signalements",
  stats: {
    openRequests: {
      title: "Demandes Ouvertes",
      description: "Total des tickets de support ouverts"
    },
    inProgress: {
      title: "En Cours",
      description: "Tickets en cours de traitement"
    },
    resolved: {
      title: "Résolus",
      description: "Tickets résolus avec succès"
    },
    urgent: {
      title: "Urgents",
      description: "Tickets haute priorité"
    }
  },
  table: {
    title: "Toutes les Demandes de Support",
    columns: {
      request: "Demande",
      id: "ID: #{{id}}",
      user: "Utilisateur",
      status: "Statut",
      date: "Date",
      actions: "Actions"
    },
    noRequests: "Aucune demande de support trouvée"
  },
  status: {
    open: "Ouvert",
    in_progress: "En Cours",
    resolved: "Résolu",
    urgent: "Urgent"
  },
  filters: {
    all: "Toutes les Demandes",
    open: "Ouvertes",
    inProgress: "En Cours",
    urgent: "Urgentes"
  },
  search: {
    placeholder: "Rechercher des demandes..."
  },
  actions: {
    reply: "Répondre"
  },
  chat: {
    placeholder: "Entrez votre message...",
    send: "Envoyer le Message",
    sending: "Envoi en cours...",
    noMessages: "Aucun message pour l'instant",
    hoursAgo: "Il y a {{hours}} heure(s)",
    documentId: "ID du Document: {{id}}"
  },
  modals: {
    reply: {
      title: "Répondre à la Demande",
      label: "Votre Réponse",
      placeholder: "Entrez votre message...",
      buttons: {
        close: "Fermer",
        send: "Envoyer la Réponse"
      }
    }
  }
} 