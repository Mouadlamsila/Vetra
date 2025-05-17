export default {
  title: "Paramètres",
  subtitle: "Configurer les paramètres globaux du site",
  tabs: {
    localization: "Localisation",
    notifications: "Notifications",
    permissions: "Permissions"
  },
  localization: {
    title: "Localisation",
    subtitle: "Configurez les paramètres de langue et de devise",
    defaultLanguage: {
      label: "Langue par défaut",
      options: {
        fr: "Français",
        en: "Anglais",
        es: "Espagnol",
        de: "Allemand"
      }
    },
    currency: {
      label: "Devise",
      options: {
        EUR: "Euro (€)",
        USD: "Dollar US ($)",
        GBP: "Livre sterling (£)",
        JPY: "Yen japonais (¥)"
      }
    },
    dateFormat: {
      label: "Format de date",
      options: {
        ddMMyyyy: "JJ/MM/AAAA",
        MMddyyyy: "MM/JJ/AAAA",
        yyyyMMdd: "AAAA-MM-JJ"
      }
    }
  },
  notifications: {
    title: "Notifications",
    subtitle: "Gérez les paramètres de notification du système",
    emailNotifications: {
      label: "Notifications par email",
      description: "Envoyer des notifications par email aux utilisateurs"
    },
    newStoreNotifications: {
      label: "Notifications de nouvelles boutiques",
      description: "Recevoir une notification quand une nouvelle boutique est créée"
    },
    supportNotifications: {
      label: "Notifications de support",
      description: "Recevoir une notification pour les nouvelles demandes de support"
    }
  },
  permissions: {
    title: "Permissions",
    subtitle: "Configurez les rôles et les permissions des utilisateurs",
    manualStoreApproval: {
      label: "Approbation manuelle des boutiques",
      description: "Les nouvelles boutiques doivent être approuvées manuellement par un administrateur"
    },
    sellerAutoRegistration: {
      label: "Auto-inscription des vendeurs",
      description: "Les utilisateurs peuvent s'inscrire comme vendeurs sans approbation"
    },
    productModeration: {
      label: "Modération des produits",
      description: "Les nouveaux produits doivent être approuvés par un administrateur"
    }
  },
  buttons: {
    save: "Sauvegarder les paramètres",
    saving: "Sauvegarde en cours..."
  },
  messages: {
    saveSuccess: "Paramètres sauvegardés avec succès"
  }
} 