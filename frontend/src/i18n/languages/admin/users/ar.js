export default {
  title: "إدارة المستخدمين",
  subtitle: "إدارة جميع مستخدمي المنصة",
  addUser: "إضافة",
  search: {
    placeholder: "البحث عن مستخدم...",
    status: {
      all: "جميع الحالات",
      active: "نشط",
      blocked: "محظور"
    }
  },
  table: {
    user: "المستخدم",
    email: "البريد الإلكتروني",
    phone: "الهاتف",
    role: "الدور",
    status: "الحالة",
    registrationDate: "تاريخ التسجيل",
    actions: "الإجراءات",
    id: "معرف: #{{id}}",
    roles: {
      owner: "مالك",
      user: "مستخدم",
      admin: "مدير"
    }
  },
  status: {
    active: "نشط",
    blocked: "محظور"
  },
  actions: {
    viewProfile: "عرض الملف",
    edit: "تعديل",
    block: "حظر",
    unblock: "إلغاء الحظر",
    delete: "حذف"
  },
  noUsers: "لم يتم العثور على مستخدمين",
  modals: {
    view: {
      title: "تفاصيل المستخدم",
      basicInfo: "المعلومات الأساسية",
      address: "العنوان",
      businessInfo: "معلومات العمل",
      stores: "المتاجر",
      storeStatus: "الحالة",
      storeCategory: "الفئة"
    },
    edit: {
      title: "تعديل المستخدم",
      basicInfo: "المعلومات الأساسية",
      username: "اسم المستخدم",
      email: "البريد الإلكتروني",
      phone: "الهاتف",
      role: "الدور",
      roles: {
        owner: "مالك",
        user: "مستخدم"
      },
      address: {
        title: "العنوان",
        line1: "العنوان سطر 1",
        line2: "العنوان سطر 2",
        city: "المدينة",
        postalCode: "الرمز البريدي",
        country: "البلد"
      },
      businessInfo: {
        title: "معلومات العمل",
        hasPreviousStore: "لديه متجر سابق",
        deliveryRequired: "التوصيل مطلوب",
        hasSuppliers: "لديه موردين",
        dailyTimeAvailable: "الوقت المتاح يومياً",
        businessDuration: "مدة العمل",
        timeOptions: {
          "1-2": "1-2 ساعة",
          "3-4": "3-4 ساعات",
          "5-6": "5-6 ساعات",
          "7+": "7+ ساعات"
        },
        durationOptions: {
          justStarting: "بداية جديدة",
          lessThan1Year: "أقل من سنة",
          "1to3Years": "1-3 سنوات",
          moreThan3Years: "أكثر من 3 سنوات"
        }
      },
      buttons: {
        update: "تحديث",
        updating: "جاري التحديث...",
        cancel: "إلغاء"
      }
    },
    add: {
      title: "إضافة مستخدم",
      password: "كلمة المرور",
      buttons: {
        create: "إنشاء",
        creating: "جاري الإنشاء...",
        cancel: "إلغاء"
      }
    },
    confirm: {
      block: {
        title: "حظر المستخدم",
        message: "هل أنت متأكد من حظر هذا المستخدم؟ لن يتمكن من تسجيل الدخول إلى حسابه.",
        buttons: {
          confirm: "حظر",
          processing: "جاري المعالجة...",
        }
        
      },
      unblock: {
        title: "إلغاء حظر المستخدم",
        message: "هل أنت متأكد من إلغاء حظر هذا المستخدم؟ سيتمكن من تسجيل الدخول إلى حسابه مرة أخرى.",
        buttons: {
          confirm: "إلغاء الحظر",
          processing: "جاري المعالجة...",
        }
      },
      delete: {
        title: "حذف المستخدم",
        message: "هل أنت متأكد من حذف هذا المستخدم؟ هذا الإجراء لا يمكن التراجع عنه."
      },
      buttons: {
        confirm: "تأكيد",
        processing: "جاري المعالجة...",
        cancel: "إلغاء"
      }
    }
  },
  topBar: {
    titles: {
      dashboard: "لوحة التحكم",
      users: "إدارة المستخدمين",
      stores: "إدارة المتاجر",
      products: "إدارة المنتجات",
      categories: "إدارة الفئات",
      support: "دعم العملاء",
      settings: "الإعدادات"
    },
    notifications: {
      title: "الإشعارات",
      newStore: "متجر جديد في انتظار الموافقة",
      noNotifications: "لا توجد إشعارات",
      logout: "تسجيل الخروج"
    }
  }
} 