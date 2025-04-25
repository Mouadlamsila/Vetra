export const settingsEn = {
  settings: {
    title: "Settings",
    subtitle: "Manage your account settings",
    tabs: {
      general: "General",
      notifications: "Notifications",
      security: "Security"
    },
    general: {
      language: {
        title: "Language",
        description: "Choose the interface language",
        options: {
          fr: { name: "French", native: "Français" },
          en: { name: "English", native: "English" },
          ar: { name: "Arabic", native: "العربية" }
        }
      },
      timezone: {
        title: "Timezone",
        description: "Set your timezone",
        options: {
          europeParis: { label: "Europe/Paris (UTC+01:00)" },
          europeLondon: { label: "Europe/London (UTC+00:00)" },
          americaNewYork: { label: "America/New_York (UTC-05:00)" }
        }
      },
      currency: {
        title: "Currency Format",
        description: "Choose your preferred currency format",
        options: {
          eur: { label: "Euro (€)" },
          usd: { label: "US Dollar ($)" },
          gbp: { label: "British Pound (£)" }
        }
      }
    },
    notifications: {
      email: {
        title: "Email Notifications",
        description: "Manage your email notification preferences",
        options: {
          newOrder: {
            label: "New Orders",
            description: "Receive an email for each new order"
          },
          orderStatus: {
            label: "Status Changes",
            description: "Receive an email when an order status changes"
          },
          lowStock: {
            label: "Low Stock Alert",
            description: "Receive an email when a product reaches low stock level"
          },
          marketing: {
            label: "Marketing Emails",
            description: "Receive tips, offers and updates"
          }
        }
      },
      push: {
        title: "Push Notifications",
        description: "Manage your push notification preferences",
        options: {
          orders: {
            label: "Orders",
            description: "Receive notifications for new orders"
          },
          messages: {
            label: "Messages",
            description: "Receive notifications for new messages"
          }
        }
      }
    },
    security: {
      twoFactor: {
        title: "Two-Factor Authentication",
        description: "Add an extra layer of security to your account",
        label: "Enable two-factor authentication",
        description: "Protect your account with two-factor authentication",
        configure: "Configure"
      },
      sessions: {
        title: "Active Sessions",
        description: "Manage your active sessions on different devices",
        current: "Current",
        disconnect: "Disconnect",
        thisAppareil: "This device",
        chromeInWindows: "Chrome in Windows",
        parisRecent: "Paris, France · Last activity 2 minutes ago",
        lyonDays: "Lyon, France · Last activity 3 days ago",
       
      },
      deleteAccount: {
        title: "Delete Account",
        description: "Permanently delete your account and all your data",
        warning: {
          title: "Warning",
          description: "This action is irreversible. All your data, stores and products will be permanently deleted."
        },
        button: "Delete my account"
      }
    }
  }
};
