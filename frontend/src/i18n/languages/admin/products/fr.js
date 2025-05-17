export default {
  title: "Gestion des produits",
  subtitle: "Gérer tous les produits disponibles sur la marketplace",
  search: {
    placeholder: "Rechercher un produit...",
    filters: {
      category: {
        label: "Toutes les catégories",
        placeholder: "Filtrer par catégorie"
      },
      store: {
        label: "Toutes les boutiques",
        placeholder: "Filtrer par boutique"
      }
    },
    reset: "Réinitialiser les filtres"
  },
  table: {
    product: "Produit",
    price: "Prix",
    store: "Boutique",
    category: "Catégorie",
    stock: "Stock",
    addedOn: "Ajouté le",
    actions: "Actions",
    id: "ID: #{{id}}"
  },
  status: {
    inStock: "{{count}} unités",
    lowStock: "{{count}} unités",
    outOfStock: "Rupture de stock"
  },
  noProducts: "Aucun produit trouvé",
  modals: {
    view: {
      title: "Détails du produit",
      description: "Description",
      priceAndStock: "Prix et Stock",
      currentPrice: "Prix actuel",
      comparePrice: "Prix barré",
      stockCount: "Quantité en stock",
      lowStockAlert: "Alerte stock bas",
      dimensionsAndWeight: "Dimensions et Poids",
      dimensions: "Dimensions",
      weight: "Poids",
      additionalInfo: "Informations supplémentaires",
      sku: "Référence",
      shippingClass: "Classe d'expédition",
      store: "Boutique",
      storeDescription: "Description de la boutique",
      storeLocation: "Emplacement de la boutique",
      additionalImages: "Images supplémentaires"
    },
    delete: {
      title: "Supprimer le produit",
      message: "Êtes-vous sûr de vouloir supprimer le produit \"{{name}}\" ? Cette action est irréversible.",
      buttons: {
        confirm: "Supprimer",
        cancel: "Annuler",
        processing: "Suppression..."
      }
    }
  }
} 