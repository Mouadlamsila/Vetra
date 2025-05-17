export default {
  title: "Category Management",
  subtitle: "Create and manage product categories",
  addCategory: "Add Category",
  table: {
    category: "Category",
    id: "ID: #{{id}}",
    createdAt: "Created on",
    actions: "Actions"
  },
  form: {
    name: {
      label: "Category Name",
      placeholder: "Ex: Electronics"
    },
    photo: {
      label: "Category Photo",
      upload: "Upload a photo",
      dragDrop: "or drag and drop",
      format: "PNG, JPG, GIF up to 10MB"
    }
  },
  modals: {
    create: {
      title: "Create New Category",
      buttons: {
        create: "Create Category",
        creating: "Creating...",
        cancel: "Cancel"
      }
    },
    edit: {
      title: "Edit Category",
      buttons: {
        update: "Update",
        updating: "Updating...",
        cancel: "Cancel"
      },
      changePhoto: "Change photo"
    },
    delete: {
      title: "Delete Category",
      message: "Are you sure you want to delete the category \"{{name}}\"? Products associated with this category will no longer be categorized.",
      buttons: {
        confirm: "Delete",
        cancel: "Cancel",
        processing: "Deleting..."
      }
    }
  },
  allCategories: "All Categories",
  noCategories: "No categories found",
  errors: {
    fetchFailed: "Failed to fetch categories",
    createFailed: "Failed to create category",
    updateFailed: "Failed to update category",
    deleteFailed: "Failed to delete category"
  }
} 