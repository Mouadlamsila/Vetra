const ownerEn = {
  welcome: {
    title: "Welcome!",
    subtitle: "Do you want to be an owner?",
    startButton: "Yes, let's get started"
  },
  steps: {
    confirmation: "Owner Confirmation",
    experience: "Previous Experience",
    timeCommitment: "Time Commitment",
    businessExperience: "Business Experience",
    contactInfo: "Contact Information",
    completion: "Completion"
  },
  experience: {
    title: "Previous Experience & Delivery",
    storeQuestion: "Have you owned or operated a store before?",
    deliveryQuestion: "Will your business require delivery services?",
    yes: "Yes",
    no: "No"
  },
  timeCommitment: {
    title: "Suppliers & Time Commitment",
    supplierQuestion: "Do you already have suppliers for your business?",
    timeQuestion: "How much time can you dedicate to your business daily?",
    timeOptions: {
      "1-2 hours": "1-2 hours",
      "3-4 hours": "3-4 hours",
      "5-6 hours": "5-6 hours",
      "7-8 hours": "7-8 hours",
      "More than 8 hours": "More than 8 hours"
    }
  },
  businessExperience: {
    title: "Business Experience",
    subtitle: "How long have you been in this business?",
    options: {
      just_starting: "Just starting",
      less_than_6_months: "Less than 6 months",
      between_6_12_months: "Between 6-12 months",
      more_than_a_year: "More than a year",
      more_than_3_years: "More than 3 years"
    }
  },
  contactInfo: {
    title: "Contact Information",
    phone: "Phone Number",
    phonePlaceholder: "Enter your phone number",
    address: {
      line1: "Address Line 1",
      line1Placeholder: "Street address",
      line2: "Address Line 2",
      line2Placeholder: "Apartment, suite, unit, etc. (optional)",
      city: "City",
      cityPlaceholder: "City",
      country: "Country",
      countryPlaceholder: "Country",
      postalCode: "Postal Code",
      postalCodePlaceholder: "Postal code"
    }
  },
  completion: {
    title: "Congratulations!",
    message: "You have successfully completed the owner registration process.",
    subMessage: "You can now start creating your store and begin your business journey.",
    createStore: "Create Your Store",
    returnHome: "Return to Home"
  },
  navigation: {
    previous: "Previous",
    next: "Next",
    submit: "Submit"
  },
  validation: {
    previousExperience: "Please indicate if you have previous store experience",
    deliveryRequired: "Please indicate if delivery services are required",
    suppliers: "Please indicate if you have suppliers",
    timeAvailable: "Please select your daily time commitment",
    businessDuration: "Please select your business duration",
    phone: {
      required: "Phone number is required",
      invalid: "Please enter a valid phone number"
    },
    address: {
      line1: "Address Line 1 is required",
      city: "City is required",
      country: "Country is required",
      postalCode: "Postal code is required"
    }
  },
  toast: {
    completeFields: "Please complete all required fields before proceeding",
    success: "Business survey submitted successfully!",
    error: {
      userNotAuth: "User not authenticated",
      uploadFailed: "Failed to upload photo",
      updateFailed: "Failed to update user",
      surveyFailed: "Failed to create survey",
      serverError: "Server error occurred",
      networkError: "No response from server. Please check your internet connection.",
      unexpectedError: "An unexpected error occurred. Please try again."
    }
  }
};

export default ownerEn; 