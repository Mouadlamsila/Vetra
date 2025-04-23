import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import resources from './languages';

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem("lang") || "ar",
  fallbackLng: "ar",
  interpolation: { escapeValue: false }
});

export const changeLanguage = (lng) => {
  i18n.changeLanguage(lng);
  document.documentElement.lang = lng;
  document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
  
  // Remove existing font classes
  document.documentElement.classList.remove('font-arabic', 'font-french', 'font-english');
  
  // Add appropriate font class based on language
  switch(lng) {
    case 'ar':
      document.documentElement.classList.add('font-arabic');
      break;
    case 'fr':
      document.documentElement.classList.add('font-french');
      break;
    case 'en':
      document.documentElement.classList.add('font-english');
      break;
  }
  
  localStorage.setItem("lang", lng);
};

// Apply initial font based on saved language
const savedLang = localStorage.getItem("lang") || "ar";
changeLanguage(savedLang);

export default i18n;