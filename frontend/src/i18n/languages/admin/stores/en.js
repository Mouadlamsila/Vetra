export default {
  title: "Store Management",
  subtitle: "Manage marketplace stores",
  pendingApprovals: {
    title: "Stores Pending Approval",
    noStores: "No stores pending approval",
    location: "Location",
    submittedOn: "Submitted on",
    details: "Details",
    approve: "Approve",
    reject: "Reject",
    pending: "Pending",
    submitted: "Submitted on"
  },
  allStores: {
    title: "All Stores",
    search: {
      placeholder: "Search for a store...",
      status: {
        all: "All statuses",
        active: "Active",
        suspended: "Suspended",
        pending: "Pending"
      }
    },
    table: {
      store: "Store",
      owner: "Owner",
      category: "Category",
      location: "Location",
      status: "Status",
      id: "ID: #{{id}}",
      categories: {
        clothing: "Clothing",
        electronics: "Electronics",
        food: "Food & Beverages",
        health: "Health & Beauty",
        beauty: "Health & Beauty",
        home: "Home & Garden",
        sports: "Sports & Outdoors",
        other: "Other"
      },
      actions: {
        name: "Actions",
        view: "View store details",
        enable: "Enable store",
        disable: "Disable store",
        delete: "Delete store"
      }
    },
    noStores: "No stores found"
  },
  status: {
    active: "Active",
    suspended: "Suspended",
    pending: "Pending"
  },
  actions: {
    viewStore: "View store",
    suspend: "Suspend",
    activate: "Activate",
    delete: "Delete"
  },
  modals: {
    view: {
      title: "Store Details",
      description: "Description",
      category: "Category",
      location: "Location",
      creationDate: "Creation Date",
      owner: "Owner",
      address: "Address",
      banner: "Banner"
    },
    confirm: {
      approve: {
        title: "Confirm Approval",
        message: "Are you sure you want to approve the store \"{{name}}\"? A notification will be sent to the owner."
      },
      disable: {
        title: "Confirm Disabling",
        message: "Are you sure you want to disable the store \"{{name}}\"? It will no longer be visible on the marketplace."
      },
      enable: {
        title: "Confirm Enabling",
        message: "Are you sure you want to enable the store \"{{name}}\"? It will be visible again on the marketplace."
      },
      reject: {
        title: "Confirm Rejection",
        message: "Are you sure you want to reject the store \"{{name}}\"? A notification will be sent to the owner."
      },
      suspend: {
        title: "Confirm Suspension",
        message: "Are you sure you want to suspend the store \"{{name}}\"? It will no longer be visible on the marketplace."
      },
      delete: {
        title: "Confirm Deletion",
        message: "Are you sure you want to permanently delete the store \"{{name}}\"? This action is irreversible."
      },
      activate: {
        title: "Confirm Activation",
        message: "Are you sure you want to activate the store \"{{name}}\"? It will be visible again on the marketplace."
      },
      buttons: {
        processing: "Processing...",
        approve: "Approve",
        reject: "Reject",
        suspend: "Suspend",
        delete: "Delete",
        activate: "Activate",
        cancel: "Cancel",
        disable: "Disable",
        enable: "Enable Store"
      }
    }
  }
} 