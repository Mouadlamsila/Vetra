const ownerFr = {
  welcome: {
    title: "Bienvenue !",
    subtitle: "Voulez-vous devenir propriétaire ?",
    startButton: "Oui, commençons"
  },
  steps: {
    confirmation: "Confirmation Propriétaire",
    experience: "Expérience Précédente",
    timeCommitment: "Engagement Temporel",
    businessExperience: "Expérience Commerciale",
    contactInfo: "Informations de Contact",
    completion: "Finalisation"
  },
  experience: {
    title: "Expérience & Livraison",
    storeQuestion: "Avez-vous déjà possédé ou exploité un magasin ?",
    deliveryQuestion: "Votre entreprise nécessitera-t-elle des services de livraison ?",
    yes: "Oui",
    no: "Non"
  },
  timeCommitment: {
    title: "Fournisseurs & Engagement Temporel",
    supplierQuestion: "Avez-vous déjà des fournisseurs pour votre entreprise ?",
    timeQuestion: "Combien de temps pouvez-vous consacrer à votre entreprise quotidiennement ?",
    timeOptions: {
      "1-2 hours": "1-2 heures",
      "3-4 hours": "3-4 heures",
      "5-6 hours": "5-6 heures",
      "7-8 hours": "7-8 heures",
      "More than 8 hours": "Plus de 8 heures"
    }
  },
  businessExperience: {
    title: "Expérience Commerciale",
    subtitle: "Depuis combien de temps êtes-vous dans ce secteur ?",
    options: {
      just_starting: "Je commence juste",
      less_than_6_months: "Moins de 6 mois",
      between_6_12_months: "Entre 6-12 mois",
      more_than_a_year: "Plus d'un an",
      more_than_3_years: "Plus de 3 ans"
    }
  },
  contactInfo: {
    title: "Informations de Contact",
    phone: "Numéro de Téléphone",
    phonePlaceholder: "Entrez votre numéro de téléphone",
    address: {
      line1: "Adresse Ligne 1",
      line1Placeholder: "Adresse postale",
      line2: "Adresse Ligne 2",
      line2Placeholder: "Appartement, suite, unité, etc. (optionnel)",
      city: "Ville",
      cityPlaceholder: "Ville",
      country: "Pays",
      countryPlaceholder: "Pays",
      postalCode: "Code Postal",
      postalCodePlaceholder: "Code postal"
    }
  },
  completion: {
    title: "Félicitations !",
    message: "Vous avez terminé avec succès le processus d'inscription en tant que propriétaire.",
    subMessage: "Vous pouvez maintenant commencer à créer votre magasin et lancer votre aventure commerciale.",
    createStore: "Créer Votre Magasin",
    returnHome: "Retour à l'Accueil"
  },
  navigation: {
    previous: "Précédent",
    next: "Suivant",
    submit: "Soumettre"
  },
  validation: {
    previousExperience: "Veuillez indiquer si vous avez une expérience de magasin",
    deliveryRequired: "Veuillez indiquer si des services de livraison sont nécessaires",
    suppliers: "Veuillez indiquer si vous avez des fournisseurs",
    timeAvailable: "Veuillez sélectionner votre engagement temporel quotidien",
    businessDuration: "Veuillez sélectionner votre expérience commerciale",
    phone: {
      required: "Le numéro de téléphone est requis",
      invalid: "Veuillez entrer un numéro de téléphone valide"
    },
    address: {
      line1: "L'adresse ligne 1 est requise",
      city: "La ville est requise",
      country: "Le pays est requis",
      postalCode: "Le code postal est requis"
    }
  },
  toast: {
    completeFields: "Veuillez remplir tous les champs requis avant de continuer",
    success: "Enquête commerciale soumise avec succès !",
    error: {
      userNotAuth: "Utilisateur non authentifié",
      uploadFailed: "Échec du téléchargement de la photo",
      updateFailed: "Échec de la mise à jour de l'utilisateur",
      surveyFailed: "Échec de la création de l'enquête",
      serverError: "Une erreur serveur s'est produite",
      networkError: "Pas de réponse du serveur. Veuillez vérifier votre connexion internet.",
      unexpectedError: "Une erreur inattendue s'est produite. Veuillez réessayer."
    }
  }
};

export default ownerFr; 