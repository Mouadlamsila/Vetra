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
      // Step 1 translations
      step1Title: "سجل وقم بإنشاء متجرك",
      step1Description: "ابدأ بإنشاء حسابك وقم بإعداد متجرك الإلكتروني في دقائق قليلة.",
      simpleRegistration: "تسجيل بسيط",
      simpleRegistrationDesc: "أنشئ حسابك باستخدام بريدك الإلكتروني أو وسائل التواصل الاجتماعي",
      storeCustomization: "تخصيص متجرك",
      storeCustomizationDesc: "اختر اسماً وشعاراً وقم بتخصيص المظهر",
      basicSettings: "الإعدادات الأساسية",
      basicSettingsDesc: "قم بتكوين المعلومات الأساسية لمتجرك",
      controlPanel: "لوحة التحكم",
      step1: "الخطوة 1",
      createAccount: "إنشاء حساب",
      configureStore: "تكوين المتجر",
      chooseDomain: "اختيار نطاق",
      // Step 2 translations
      step2Title: "أضف منتجاتك",
      step2Description: "أنشئ كتالوج المنتجات الخاص بك مع وصف تفصيلي وصور جذابة.",
      easyProductAddition: "إضافة سهلة للمنتجات",
      easyProductAdditionDesc: "قم بتحميل الصور وأضف وصفاً تفصيلياً",
      categoryOrganization: "تنظيم حسب الفئات",
      categoryOrganizationDesc: "صنف منتجاتك لتسهيل تصفح العملاء",
      deliveryOptions: "خيارات التوصيل",
      deliveryOptionsDesc: "حدد طرق الشحن وتكاليف التوصيل",
      productManagement: "إدارة المنتجات",
      step2: "الخطوة 2",
      addProduct: "إضافة منتج",
      manageCategories: "إدارة الفئات",
      // Step 3 translations
      step3Title: "اختر طرق الدفع الخاصة بك",
      step3Description: "قم بتكوين خيارات الدفع لتقديم تجربة شراء سلسة لعملائك.",
      multiplePaymentOptions: "خيارات دفع متعددة",
      multiplePaymentOptionsDesc: "بطاقات الائتمان، PayPal، التحويلات المصرفية والمزيد",
      secureTransactions: "معاملات آمنة",
      secureTransactionsDesc: "جميع المعاملات محمية بتشفير متقدم",
      salesTracking: "تتبع المبيعات",
      salesTrackingDesc: "اطلع على تقارير المبيعات والإحصائيات في الوقت الفعلي",
      paymentConfiguration: "تكوين المدفوعات",
      step3: "الخطوة 3",
      creditCards: "بطاقات الائتمان",
      mobilePayment: "الدفع عبر الهاتف المحمول",
      otherMethods: "طرق أخرى",
      add: "إضافة",
      howItWorks: "كيف يعمل",
      createYourOnlineStore: "أنشئ متجرك الإلكتروني",
      platformDescription: "تتيح لك منصتنا إنشاء وإدارة متجرك الإلكتروني بسهولة",
      startNow: "ابدأ الآن"
    }
  },
  fr: {
    translation: {
      Features: "Fonctionnalités",
      AboutUs: "À propos de nous",
      Services: "Services",
      Contact: "Contact",
      Login: "Connecter",
      // Step 1 translations
      step1Title: "Inscrivez-vous et créez votre boutique",
      step1Description: "Commencez par créer votre compte et configurez votre boutique en ligne en quelques minutes.",
      simpleRegistration: "Inscription simple",
      simpleRegistrationDesc: "Créez votre compte avec votre email ou vos réseaux sociaux",
      storeCustomization: "Personnalisation de votre boutique",
      storeCustomizationDesc: "Choisissez un nom, un logo et personnalisez l'apparence",
      basicSettings: "Paramètres de base",
      basicSettingsDesc: "Configurez les informations essentielles de votre boutique",
      controlPanel: "Panneau de contrôle",
      step1: "Étape 1",
      createAccount: "Créer un compte",
      configureStore: "Configurer la boutique",
      chooseDomain: "Choisir un domaine",
      // Step 2 translations
      step2Title: "Ajoutez vos produits",
      step2Description: "Créez votre catalogue de produits avec des descriptions détaillées et des images attrayantes.",
      easyProductAddition: "Ajout facile de produits",
      easyProductAdditionDesc: "Téléchargez des images et ajoutez des descriptions détaillées",
      categoryOrganization: "Organisation par catégories",
      categoryOrganizationDesc: "Classez vos produits pour faciliter la navigation des clients",
      deliveryOptions: "Options de livraison",
      deliveryOptionsDesc: "Définissez les méthodes d'expédition et les frais de livraison",
      productManagement: "Gestion des produits",
      step2: "Étape 2",
      addProduct: "Ajouter un produit",
      manageCategories: "Gérer les catégories",
      // Step 3 translations
      step3Title: "Choisissez vos méthodes de paiement",
      step3Description: "Configurez les options de paiement pour offrir une expérience d'achat fluide à vos clients.",
      multiplePaymentOptions: "Multiples options de paiement",
      multiplePaymentOptionsDesc: "Cartes de crédit, PayPal, virements bancaires et plus",
      secureTransactions: "Transactions sécurisées",
      secureTransactionsDesc: "Toutes les transactions sont protégées par un cryptage avancé",
      salesTracking: "Suivi des ventes",
      salesTrackingDesc: "Consultez les rapports de ventes et les statistiques en temps réel",
      paymentConfiguration: "Configuration des paiements",
      step3: "Étape 3",
      creditCards: "Cartes de crédit",
      mobilePayment: "Paiement mobile",
      otherMethods: "Autres méthodes",
      add: "Ajouter",
      howItWorks: "Comment ça fonctionne",
      createYourOnlineStore: "Créez votre boutique en ligne",
      platformDescription: "Notre plateforme vous permet de créer et gérer facilement votre boutique en ligne",
      startNow: "Commencer maintenant"
    }
  },
  en: {
    translation: {
      Features: "Features",
      AboutUs: "About Us",
      Services: "Services",
      Contact: "Contact",
      Login: "Login",
      // Step 1 translations
      step1Title: "Sign up and create your store",
      step1Description: "Start by creating your account and set up your online store in minutes.",
      simpleRegistration: "Simple registration",
      simpleRegistrationDesc: "Create your account with your email or social networks",
      storeCustomization: "Store customization",
      storeCustomizationDesc: "Choose a name, logo and customize the appearance",
      basicSettings: "Basic settings",
      basicSettingsDesc: "Configure the essential information of your store",
      controlPanel: "Control Panel",
      step1: "Step 1",
      createAccount: "Create account",
      configureStore: "Configure store",
      chooseDomain: "Choose domain",
      // Step 2 translations
      step2Title: "Add your products",
      step2Description: "Create your product catalog with detailed descriptions and attractive images.",
      easyProductAddition: "Easy product addition",
      easyProductAdditionDesc: "Upload images and add detailed descriptions",
      categoryOrganization: "Category organization",
      categoryOrganizationDesc: "Classify your products to facilitate customer navigation",
      deliveryOptions: "Delivery options",
      deliveryOptionsDesc: "Define shipping methods and delivery fees",
      productManagement: "Product Management",
      step2: "Step 2",
      addProduct: "Add product",
      manageCategories: "Manage categories",
      // Step 3 translations
      step3Title: "Choose your payment methods",
      step3Description: "Configure payment options to offer a smooth shopping experience to your customers.",
      multiplePaymentOptions: "Multiple payment options",
      multiplePaymentOptionsDesc: "Credit cards, PayPal, bank transfers and more",
      secureTransactions: "Secure transactions",
      secureTransactionsDesc: "All transactions are protected by advanced encryption",
      salesTracking: "Sales tracking",
      salesTrackingDesc: "View sales reports and real-time statistics",
      paymentConfiguration: "Payment Configuration",
      step3: "Step 3",
      creditCards: "Credit cards",
      mobilePayment: "Mobile payment",
      otherMethods: "Other methods",
      add: "Add",
      howItWorks: "How it works",
      createYourOnlineStore: "Create your online store",
      platformDescription: "Our platform allows you to easily create and manage your online store",
      startNow: "Start now"
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