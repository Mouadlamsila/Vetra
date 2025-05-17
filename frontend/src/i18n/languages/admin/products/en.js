export default {
  title: "Product Management",
  subtitle: "Manage all products available on the marketplace",
  search: {
    placeholder: "Search for a product...",
    filters: {
      category: {
        label: "All categories",
        placeholder: "Filter by category"
      },
      store: {
        label: "All stores",
        placeholder: "Filter by store"
      }
    },
    reset: "Reset filters"
  },
  table: {
    product: "Product",
    price: "Price",
    store: "Store",
    category: "Category",
    stock: "Stock",
    addedOn: "Added on",
    actions: "Actions",
    id: "ID: #{{id}}"
  },
  status: {
    inStock: "{{count}} units",
    lowStock: "{{count}} units",
    outOfStock: "Out of stock"
  },
  noProducts: "No products found",
  modals: {
    view: {
      title: "Product Details",
      description: "Description",
      priceAndStock: "Price and Stock",
      currentPrice: "Current price",
      comparePrice: "Compare at price",
      stockCount: "Stock count",
      lowStockAlert: "Low stock alert",
      dimensionsAndWeight: "Dimensions and Weight",
      dimensions: "Dimensions",
      weight: "Weight",
      additionalInfo: "Additional Information",
      sku: "SKU",
      shippingClass: "Shipping class",
      store: "Store",
      storeDescription: "Store description",
      storeLocation: "Store location",
      additionalImages: "Additional Images"
    },
    delete: {
      title: "Delete Product",
      message: "Are you sure you want to delete the product \"{{name}}\"? This action is irreversible.",
      buttons: {
        confirm: "Delete",
        cancel: "Cancel",
        processing: "Deleting..."
      }
    }
  }
} 