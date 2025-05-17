export default {
  title: "Gestion des catégories",
  subtitle: "Créer et gérer les catégories de produits",
  addCategory: "Ajouter une catégorie",
  table: {
    category: "Catégorie",
    id: "ID: #{{id}}",
    createdAt: "Créé le",
    actions: "Actions"
  },
  form: {
    name: {
      label: "Nom de la catégorie",
      placeholder: "Ex: Électronique"
    },
    photo: {
      label: "Photo de la catégorie",
      upload: "Télécharger une photo",
      dragDrop: "ou glisser-déposer",
      format: "PNG, JPG, GIF jusqu'à 10MB"
    }
  },
  modals: {
    create: {
      title: "Créer une nouvelle catégorie",
      buttons: {
        create: "Créer la catégorie",
        creating: "Création en cours...",
        cancel: "Annuler"
      }
    },
    edit: {
      title: "Modifier la catégorie",
      buttons: {
        update: "Mettre à jour",
        updating: "Mise à jour en cours...",
        cancel: "Annuler"
      },
      changePhoto: "Changer la photo"
    },
    delete: {
      title: "Supprimer la catégorie",
      message: "Êtes-vous sûr de vouloir supprimer la catégorie \"{{name}}\" ? Les produits associés à cette catégorie ne seront plus catégorisés.",
      buttons: {
        confirm: "Supprimer",
        cancel: "Annuler",
        processing: "Suppression..."
      }
    }
  },
  allCategories: "Toutes les catégories",
  noCategories: "Aucune catégorie trouvée",
  errors: {
    fetchFailed: "Échec du chargement des catégories",
    createFailed: "Échec de la création de la catégorie",
    updateFailed: "Échec de la mise à jour de la catégorie",
    deleteFailed: "Échec de la suppression de la catégorie"
  }
} 