export default {
  title: "User Management",
  subtitle: "Manage all platform users",
  addUser: "Add",
  search: {
    placeholder: "Search for a user...",
    status: {
      all: "All statuses",
      active: "Active",
      blocked: "Blocked"
    }
  },
  table: {
    user: "User",
    email: "Email",
    phone: "Phone",
    role: "Role",
    status: "Status",
    registrationDate: "Registration Date",
    actions: "Actions",
    id: "ID: #{{id}}"
  },
  status: {
    active: "Active",
    blocked: "Blocked"
  },
  actions: {
    viewProfile: "View profile",
    edit: "Edit",
    block: "Block",
    unblock: "Unblock",
    delete: "Delete"
  },
  noUsers: "No users found",
  modals: {
    view: {
      title: "User Details",
      basicInfo: "Basic Information",
      address: "Address",
      businessInfo: "Business Information",
      stores: "Stores",
      storeStatus: "Status",
      storeCategory: "Category"
    },
    edit: {
      title: "Edit User",
      basicInfo: "Basic Information",
      username: "Username",
      email: "Email",
      phone: "Phone",
      role: "Role",
      roles: {
        owner: "Owner",
        user: "User"
      },
      address: {
        title: "Address",
        line1: "Address Line 1",
        line2: "Address Line 2",
        city: "City",
        postalCode: "Postal Code",
        country: "Country"
      },
      businessInfo: {
        title: "Business Information",
        hasPreviousStore: "Has previous store",
        deliveryRequired: "Delivery required",
        hasSuppliers: "Has suppliers",
        dailyTimeAvailable: "Daily time available",
        businessDuration: "Business duration",
        timeOptions: {
          "1-2": "1-2 hours",
          "3-4": "3-4 hours",
          "5-6": "5-6 hours",
          "7+": "7+ hours"
        },
        durationOptions: {
          justStarting: "Just starting",
          lessThan1Year: "Less than 1 year",
          "1to3Years": "1 to 3 years",
          moreThan3Years: "More than 3 years"
        }
      },
      buttons: {
        update: "Update",
        updating: "Updating...",
        cancel: "Cancel"
      }
    },
    add: {
      title: "Add User",
      password: "Password",
      buttons: {
        create: "Create",
        creating: "Creating...",
        cancel: "Cancel"
      }
    },
    confirm: {
      block: {
        title: "Block User",
        message: "Are you sure you want to block this user? They will no longer be able to log into their account."
      },
      unblock: {
        title: "Unblock User",
        message: "Are you sure you want to unblock this user? They will be able to log into their account again."
      },
      delete: {
        title: "Delete User",
        message: "Are you sure you want to delete this user? This action is irreversible."
      },
      buttons: {
        confirm: "Confirm",
        processing: "Processing...",
        cancel: "Cancel"
      }
    }
  },
  topBar: {
    titles: {
      dashboard: "Dashboard",
      users: "User Management",
      stores: "Store Management",
      products: "Product Management",
      categories: "Category Management",
      support: "Customer Support",
      settings: "Settings"
    },
    notifications: {
      title: "Notifications",
      newStore: "New store pending approval",
      noNotifications: "No notifications",
      logout: "Logout"
    }
  }
} 