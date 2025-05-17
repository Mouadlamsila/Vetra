export default {
  title: "Gestion des utilisateurs",
  subtitle: "Gérer tous les utilisateurs de la plateforme",
  addUser: "Ajouter",
  search: {
    placeholder: "Rechercher un utilisateur...",
    status: {
      all: "Tous les statuts",
      active: "Actifs",
      blocked: "Bloqués"
    }
  },
  table: {
    user: "Utilisateur",
    email: "Email",
    phone: "Téléphone",
    role: "Rôle",
    status: "Statut",
    registrationDate: "Date d'inscription",
    actions: "Actions",
    id: "ID: #{{id}}"
  },
  status: {
    active: "Actif",
    blocked: "Bloqué"
  },
  actions: {
    viewProfile: "Voir le profil",
    edit: "Modifier",
    block: "Bloquer",
    unblock: "Débloquer",
    delete: "Supprimer"
  },
  noUsers: "Aucun utilisateur trouvé",
  modals: {
    view: {
      title: "Détails de l'utilisateur",
      basicInfo: "Informations de base",
      address: "Adresse",
      businessInfo: "Informations Business",
      stores: "Boutiques",
      storeStatus: "Statut",
      storeCategory: "Catégorie"
    },
    edit: {
      title: "Modifier l'utilisateur",
      basicInfo: "Informations de base",
      username: "Nom d'utilisateur",
      email: "Email",
      phone: "Téléphone",
      role: "Rôle",
      roles: {
        owner: "Owner",
        user: "User"
      },
      address: {
        title: "Adresse",
        line1: "Adresse ligne 1",
        line2: "Adresse ligne 2",
        city: "Ville",
        postalCode: "Code postal",
        country: "Pays"
      },
      businessInfo: {
        title: "Informations Business",
        hasPreviousStore: "A déjà eu une boutique",
        deliveryRequired: "Livraison requise",
        hasSuppliers: "A des fournisseurs",
        dailyTimeAvailable: "Temps disponible quotidien",
        businessDuration: "Durée de l'activité",
        timeOptions: {
          "1-2": "1-2 heures",
          "3-4": "3-4 heures",
          "5-6": "5-6 heures",
          "7+": "7+ heures"
        },
        durationOptions: {
          justStarting: "Je débute",
          lessThan1Year: "Moins d'un an",
          "1to3Years": "1 à 3 ans",
          moreThan3Years: "Plus de 3 ans"
        }
      },
      buttons: {
        update: "Mettre à jour",
        updating: "Mise à jour...",
        cancel: "Annuler"
      }
    },
    add: {
      title: "Ajouter un utilisateur",
      password: "Mot de passe",
      buttons: {
        create: "Créer",
        creating: "Création...",
        cancel: "Annuler"
      }
    },
    confirm: {
      block: {
        title: "Bloquer l'utilisateur",
        message: "Êtes-vous sûr de vouloir bloquer cet utilisateur ? Il ne pourra plus se connecter à son compte."
      },
      unblock: {
        title: "Débloquer l'utilisateur",
        message: "Êtes-vous sûr de vouloir débloquer cet utilisateur ? Il pourra à nouveau se connecter à son compte."
      },
      delete: {
        title: "Supprimer l'utilisateur",
        message: "Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible."
      },
      buttons: {
        confirm: "Confirmer",
        processing: "Traitement...",
        cancel: "Annuler"
      }
    }
  },
  topBar: {
    titles: {
      dashboard: "Tableau de bord",
      users: "Gestion des Utilisateurs",
      stores: "Gestion des Boutiques",
      products: "Gestion des Produits",
      categories: "Gestion des Catégories",
      support: "Support Client",
      settings: "Paramètres"
    },
    notifications: {
      title: "Notifications",
      newStore: "Nouvelle boutique en attente d'approbation",
      noNotifications: "Aucune notification",
      logout: "Déconnexion"
    }
  }
} 