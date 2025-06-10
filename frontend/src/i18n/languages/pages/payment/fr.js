export const paymentFr = {
  payment: {
    title: "Paiements",
    subtitle: "Gérez les paiements reçus et à recevoir",
    infoMessage: "Voici comment vous pouvez gérer toutes les paiements et les transactions",
    filters: "Filtres",
    loading: "Chargement...",
    metrics: {
      totalReceived: {
        title: "Total reçu",
        value: "€4,550.50",
        description: "Ce mois-ci"
      },
      pending: {
        title: "En attente",
        value: "€305.74",
        description: "2 paiements en attente"
      },
      nextPayment: {
        title: "Prochain versement",
        value: "€1,245.25",
        description: "Prévu le 15/04/2023"
      }
    },
    search: {
      placeholder: "Rechercher un paiement..."
    },
    status: {
      all: "Tous les statuts",
      completed: "Complété",
      pending: "En attente",
      failed: "Échoué"
    },
    table: {
      headers: {
        id: "ID Paiement",
        date: "Date",
        order: "Commande",
        method: "Méthode",
        amount: "Montant",
        status: "Statut",
        actions: "Actions",
        products: "Produits",
        items: "{{nbr}} articles",
        paymentInfo: "Informations de paiement",
        paymentMethod: "Méthode de paiement",
        quantity: "Quantité",
        sku: "SKU",
        total: "Total",
      }
    },
    methods: {
      card: "Carte",
      paypal: "PayPal",
      bank: "Virement"
    },
    actions: {
      title: "Actions",
      viewDetails: "Voir les détails",
      downloadReceipt: "Télécharger le reçu",
      download: "Télécharger",
      view: "Voir",
      close: "Fermer",
      edit: "Modifier",
      showMore: "Afficher plus",
      showLess: "Afficher moins",
    },
    noPaymentsFound: "Aucun paiement trouvé",
    paymentsFound: "Paiements trouvés",
    filterByStatus: "Filtrer par statut",
    resetFilters: "Réinitialiser les filtres",
    tryDifferentFilters: "Essayez différents filtres"
  }
};

