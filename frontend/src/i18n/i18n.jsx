import i18n from "i18next";

import { initReactI18next } from "react-i18next";

const resources = {
  ar: {
    translation: {
      Features: "الميزات",
      AboutUs: "معلومات عنا",
      Services: "الخدمات",
      Contact: "اتصل",
      Login: "تسجيل الدخول",
    }
  },
  fr: {
    translation: {
      Features: "Fonctionnalités",
      AboutUs: "À propos de nous",
      Services: "Services",
      Contact: "Contact",
      Login: "Connecter",
    }
  },
  en: {
    translation: {
      Features: "Features",
      AboutUs: "About Us",
      Services: "Services",
      Contact: "Contact",
      Login: "Login",
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem("lang") || "ar", // اجعل اللغة محفوظة حتى بعد إعادة تحميل الصفحة
  fallbackLng: "ar",
  interpolation: { escapeValue: false }
});

export const changeLanguage = (lng) => {
  i18n.changeLanguage(lng);
  document.documentElement.lang = lng;
  document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
  localStorage.setItem("lang", lng);
};

export default i18n;