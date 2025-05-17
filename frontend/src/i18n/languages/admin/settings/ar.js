export default {
  title: "الإعدادات",
  subtitle: "تكوين إعدادات الموقع العامة",
  tabs: {
    localization: "التوطين",
    notifications: "الإشعارات",
    permissions: "الصلاحيات"
  },
  localization: {
    title: "التوطين",
    subtitle: "تكوين إعدادات اللغة والعملة",
    defaultLanguage: {
      label: "اللغة الافتراضية",
      options: {
        fr: "الفرنسية",
        en: "الإنجليزية",
        ar: "العربية"
      }
    },
    currency: {
      label: "العملة",
      options: {
        EUR: "يورو (€)",
        USD: "دولار أمريكي ($)",
        GBP: "جنيه إسترليني (£)",
        JPY: "ين ياباني (¥)"
      }
    },
    dateFormat: {
      label: "تنسيق التاريخ",
      options: {
        ddMMyyyy: "يوم/شهر/سنة",
        MMddyyyy: "شهر/يوم/سنة",
        yyyyMMdd: "سنة-شهر-يوم"
      }
    }
  },
  notifications: {
    title: "الإشعارات",
    subtitle: "إدارة إعدادات إشعارات النظام",
    emailNotifications: {
      label: "إشعارات البريد الإلكتروني",
      description: "إرسال إشعارات بالبريد الإلكتروني للمستخدمين"
    },
    newStoreNotifications: {
      label: "إشعارات المتاجر الجديدة",
      description: "تلقي إشعار عند إنشاء متجر جديد"
    },
    supportNotifications: {
      label: "إشعارات الدعم",
      description: "تلقي إشعار لطلبات الدعم الجديدة"
    }
  },
  permissions: {
    title: "الصلاحيات",
    subtitle: "تكوين أدوار وصلاحيات المستخدمين",
    manualStoreApproval: {
      label: "الموافقة اليدوية على المتاجر",
      description: "يجب الموافقة على المتاجر الجديدة يدويًا من قبل المسؤول"
    },
    sellerAutoRegistration: {
      label: "التسجيل التلقائي للبائعين",
      description: "يمكن للمستخدمين التسجيل كبائعين دون موافقة"
    },
    productModeration: {
      label: "مراجعة المنتجات",
      description: "يجب الموافقة على المنتجات الجديدة من قبل المسؤول"
    }
  },
  buttons: {
    save: "حفظ الإعدادات",
    saving: "جاري الحفظ..."
  },
  messages: {
    saveSuccess: "تم حفظ الإعدادات بنجاح"
  }
} 