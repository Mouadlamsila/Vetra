export const settingsFr = {
  settings: {
    title: "Paramètres",
    subtitle: "Gérez les paramètres de votre compte",
    tabs: {
      general: "Général",
      notifications: "Notifications",
      security: "Sécurité"
    },
    general: {
      language: {
        title: "Langue",
        description: "Choisissez la langue de l'interface",
        options: {
          fr: {
            name: "Français",
            native: "Français"
          },
          en: {
            name: "English",
            native: "English"
          },
          ar: {
            name: "Arabic",
            native: "العربية"
          }
        }
      },
      timezone: {
        title: "Fuseau horaire",
        description: "Définissez votre fuseau horaire",
        options: {
          "europe-paris": {
            label: "Europe/Paris (UTC+01:00)"
          },
          "europe-london": {
            label: "Europe/London (UTC+00:00)"
          },
          "america-new_york": {
            label: "America/New_York (UTC-05:00)"
          }
        }
      },
      currency: {
        title: "Format de devise",
        description: "Choisissez votre format de devise préféré",
        options: {
          eur: {
            label: "Euro (€)"
          },
          usd: {
            label: "Dollar US ($)"
          },
          gbp: {
            label: "Livre Sterling (£)"
          }
        }
      }
    },
    notifications: {
      email: {
        title: "Notifications par email",
        description: "Gérez vos préférences de notifications par email",
        options: {
          newOrder: {
            label: "Nouvelles commandes",
            description: "Recevoir un email pour chaque nouvelle commande"
          },
          orderStatus: {
            label: "Changements de statut",
            description: "Recevoir un email quand le statut d'une commande change"
          },
          lowStock: {
            label: "Alerte stock faible",
            description: "Recevoir un email quand un produit atteint un niveau de stock faible"
          },
          marketing: {
            label: "Emails marketing",
            description: "Recevoir des conseils, offres et mises à jour"
          }
        }
      },
      push: {
        title: "Notifications push",
        description: "Gérez vos préférences de notifications push",
        options: {
          pushOrders: {
            label: "Commandes",
            description: "Recevoir des notifications pour les nouvelles commandes"
          },
          pushMessages: {
            label: "Messages",
            description: "Recevoir des notifications pour les nouveaux messages"
          }
        }
      }
    },
    security: {
      twoFactor: {
        title: "Authentification à deux facteurs",
        description: "Ajoutez une couche de sécurité supplémentaire à votre compte",
        label: "Activer l'authentification à deux facteurs",
        configure: "Configurer"
      },
      sessions: {
        title: "Sessions actives",
        description: "Gérez vos sessions actives sur différents appareils",
        current: "Actuel",
        disconnect: "Déconnecter"
      },
      deleteAccount: {
        title: "Supprimer le compte",
        description: "Supprimez définitivement votre compte et toutes vos données",
        warning: {
          title: "Attention",
          description: "Cette action est irréversible. Toutes vos données, boutiques et produits seront définitivement supprimés."
        },
        button: "Supprimer mon compte"
      }
    }
  }
}; 