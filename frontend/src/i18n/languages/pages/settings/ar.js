export const settingsAr = {
  settings: {
    title: "الإعدادات",
    subtitle: "إدارة إعدادات حسابك",
    tabs: {
      general: "عام",
      notifications: "الإشعارات",
      security: "الأمان"
    },
    general: {
      language: {
        title: "اللغة",
        description: "اختر لغة الواجهة",
        options: {
          fr: {
            name: "الفرنسية",
            native: "Français"
          },
          en: {
            name: "الإنجليزية",
            native: "English"
          },
          ar: {
            name: "العربية",
            native: "العربية"
          }
        }
      },
      timezone: {
        title: "المنطقة الزمنية",
        description: "حدد منطقتك الزمنية",
        options: {
          "europe-paris": {
            label: "أوروبا/باريس (UTC+01:00)"
          },
          "europe-london": {
            label: "أوروبا/لندن (UTC+00:00)"
          },
          "america-new_york": {
            label: "أمريكا/نيويورك (UTC-05:00)"
          }
        }
      },
      currency: {
        title: "تنسيق العملة",
        description: "اختر تنسيق العملة المفضل لديك",
        options: {
          eur: {
            label: "يورو (€)"
          },
          usd: {
            label: "دولار أمريكي ($)"
          },
          gbp: {
            label: "جنيه إسترليني (£)"
          }
        }
      }
    },
    notifications: {
      email: {
        title: "إشعارات البريد الإلكتروني",
        description: "إدارة تفضيلات إشعارات البريد الإلكتروني",
        options: {
          newOrder: {
            label: "الطلبات الجديدة",
            description: "تلقي بريد إلكتروني لكل طلب جديد"
          },
          orderStatus: {
            label: "تغييرات الحالة",
            description: "تلقي بريد إلكتروني عند تغيير حالة الطلب"
          },
          lowStock: {
            label: "تنبيه المخزون المنخفض",
            description: "تلقي بريد إلكتروني عندما يصل المنتج إلى مستوى مخزون منخفض"
          },
          marketing: {
            label: "رسائل البريد الإلكتروني التسويقية",
            description: "تلقي النصائح والعروض والتحديثات"
          }
        }
      },
      push: {
        title: "إشعارات الدفع",
        description: "إدارة تفضيلات إشعارات الدفع",
        options: {
          pushOrders: {
            label: "الطلبات",
            description: "تلقي إشعارات للطلبات الجديدة"
          },
          pushMessages: {
            label: "الرسائل",
            description: "تلقي إشعارات للرسائل الجديدة"
          }
        }
      }
    },
    security: {
      twoFactor: {
        title: "المصادقة الثنائية",
        description: "أضف طبقة أمان إضافية لحسابك",
        label: "تفعيل المصادقة الثنائية",
        configure: "تكوين"
      },
      sessions: {
        title: "الجلسات النشطة",
        description: "إدارة جلساتك النشطة على الأجهزة المختلفة",
        current: "الحالي",
        disconnect: "تسجيل الخروج"
      },
      deleteAccount: {
        title: "حذف الحساب",
        description: "حذف حسابك وبياناتك نهائيًا",
        warning: {
          title: "تحذير",
          description: "هذا الإجراء لا رجعة فيه. سيتم حذف جميع بياناتك ومتاجرك ومنتجاتك نهائيًا."
        },
        button: "حذف حسابي"
      }
    }
  }
}; 