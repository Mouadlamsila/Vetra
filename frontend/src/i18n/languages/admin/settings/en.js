export default {
  title: "Settings",
  subtitle: "Configure global site settings",
  tabs: {
    localization: "Localization",
    notifications: "Notifications",
    permissions: "Permissions"
  },
  localization: {
    title: "Localization",
    subtitle: "Configure language and currency settings",
    defaultLanguage: {
      label: "Default Language",
      options: {
        fr: "French",
        en: "English",
        es: "Spanish",
        de: "German"
      }
    },
    currency: {
      label: "Currency",
      options: {
        EUR: "Euro (€)",
        USD: "US Dollar ($)",
        GBP: "British Pound (£)",
        JPY: "Japanese Yen (¥)"
      }
    },
    dateFormat: {
      label: "Date Format",
      options: {
        ddMMyyyy: "DD/MM/YYYY",
        MMddyyyy: "MM/DD/YYYY",
        yyyyMMdd: "YYYY-MM-DD"
      }
    }
  },
  notifications: {
    title: "Notifications",
    subtitle: "Manage system notification settings",
    emailNotifications: {
      label: "Email Notifications",
      description: "Send email notifications to users"
    },
    newStoreNotifications: {
      label: "New Store Notifications",
      description: "Receive notification when a new store is created"
    },
    supportNotifications: {
      label: "Support Notifications",
      description: "Receive notification for new support requests"
    }
  },
  permissions: {
    title: "Permissions",
    subtitle: "Configure user roles and permissions",
    manualStoreApproval: {
      label: "Manual Store Approval",
      description: "New stores must be manually approved by an administrator"
    },
    sellerAutoRegistration: {
      label: "Seller Auto-Registration",
      description: "Users can register as sellers without approval"
    },
    productModeration: {
      label: "Product Moderation",
      description: "New products must be approved by an administrator"
    }
  },
  buttons: {
    save: "Save Settings",
    saving: "Saving..."
  },
  messages: {
    saveSuccess: "Settings saved successfully"
  }
} 