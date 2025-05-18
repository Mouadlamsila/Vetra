export default {
  title: "Gestion des boutiques",
  subtitle: "Gérer les boutiques de la marketplace",
  pendingApprovals: {
    title: "Boutiques en attente d'approbation",
    noStores: "Aucune boutique en attente d'approbation",
    location: "Emplacement",
    submittedOn: "Soumis le",
    details: "Détails",
    approve: "Approuver",
    reject: "Refuser",
    pending: "En attente",
    submitted: "Soumis le"
  },
  allStores: {
    title: "Toutes les boutiques",
    search: {
      placeholder: "Rechercher une boutique...",
      status: {
        all: "Tous les statuts",
        active: "Actives",
        suspended: "Suspendues",
        pending: "En attente"
      }
    },
    table: {
      store: "Boutique",
      owner: "Propriétaire",
      category: "Catégorie",
      location: "Emplacement",
      status: "Statut",
      id: "ID: #{{id}}",
      categories: {
        clothing: "Vêtements",
        electronics: "Électronique",
        food: "Alimentation & Boissons",
        health: "Santé & Beauté",
        beauty: "Santé & Beauté",
        home: "Maison & Jardin",
        sports: "Sports & Loisirs",
        other: "Autre"
      },
      actions: {
        name: "Actions",
        view: "Voir les détails de la boutique",
        enable: "Activer la boutique",
        disable: "Désactiver la boutique",
        delete: "Supprimer la boutique"
      }
    },
    noStores: "Aucune boutique trouvée"
  },
  status: {
    active: "Actif",
    suspended: "Suspendu",
    pending: "En attente"
  },
  actions: {
    viewStore: "Voir la boutique",
    suspend: "Suspendre",
    activate: "Activer",
    delete: "Supprimer"
  },
  modals: {
    view: {
      title: "Détails de la boutique",
      description: "Description",
      category: "Catégorie",
      location: "Emplacement",
      creationDate: "Date de création",
      owner: "Propriétaire",
      address: "Adresse",
      banner: "Bannière"
    },
    confirm: {
      approve: {
        title: "Confirmer l'approbation",
        message: "Êtes-vous sûr de vouloir approuver la boutique \"{{name}}\" ? Une notification sera envoyée au propriétaire."
      },
      reject: {
        title: "Confirmer le rejet",
        message: "Êtes-vous sûr de vouloir rejeter la boutique \"{{name}}\" ? Une notification sera envoyée au propriétaire."
      },
      suspend: {
        title: "Confirmer la suspension",
        message: "Êtes-vous sûr de vouloir suspendre la boutique \"{{name}}\" ? Elle ne sera plus visible sur la marketplace."
      },
      delete: {
        title: "Confirmer la suppression",
        message: "Êtes-vous sûr de vouloir supprimer définitivement la boutique \"{{name}}\" ? Cette action est irréversible."
      },
      activate: {
        title: "Confirmer l'activation",
        message: "Êtes-vous sûr de vouloir activer la boutique \"{{name}}\" ? Elle sera à nouveau visible sur la marketplace."
      },
      buttons: {
        processing: "Traitement...",
        approve: "Approuver",
        reject: "Rejeter",
        suspend: "Suspendre",
        delete: "Supprimer",
        activate: "Activer",
        cancel: "Annuler"
      }
    }
  }
} 