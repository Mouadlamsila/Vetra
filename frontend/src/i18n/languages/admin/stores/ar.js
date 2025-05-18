export default {
  title: "إدارة المتاجر",
  subtitle: "إدارة متاجر المنصة",
  pendingApprovals: {
    title: "المتاجر في انتظار الموافقة",
    noStores: "لا توجد متاجر في انتظار الموافقة",
    location: "الموقع",
    submittedOn: "تم التقديم في",
    details: "التفاصيل",
    approve: "موافقة",
    reject: "رفض"
  },
  allStores: {
    title: "جميع المتاجر",
    search: {
      placeholder: "البحث عن متجر...",
      status: {
        all: "جميع الحالات",
        active: "نشط",
        suspended: "معلق",
        pending: "قيد الانتظار"
      }
    },
    table: {
      store: "المتجر",
      owner: "المالك",
      category: "الفئة",
      location: "الموقع",
      status: "الحالة",
 
      id: "معرف: #{{id}}",
      categories: {
        clothing: "ملابس",
        electronics: "إلكترونيات",
        food: "طعام ومشروبات",
        health: "صحة وجمال",
        beauty: "صحة وجمال",
        home: "منزل وحديقة",
        sports: "رياضة وأنشطة خارجية",
        other: "أخرى"
      },
      actions: {
        name: "الإجراءات",
        view: "عرض تفاصيل المتجر",
        enable: "تفعيل المتجر",
        disable: "تعطيل المتجر",
        delete: "حذف المتجر"
      }
    },
    noStores: "لم يتم العثور على متاجر"
  },
  status: {
    active: "نشط",
    suspended: "معلق",
    pending: "قيد الانتظار"
  },
  actions: {
    viewStore: "عرض المتجر",
    suspend: "تعليق",
    activate: "تنشيط",
    delete: "حذف"
  },
  modals: {
    view: {
      title: "تفاصيل المتجر",
      description: "الوصف",
      category: "الفئة",
      location: "الموقع",
      creationDate: "تاريخ الإنشاء",
      owner: "المالك",
      address: "العنوان",
      banner: "الصورة"
    },
    confirm: {
      approve: {
        title: "تأكيد الموافقة",
        message: "هل أنت متأكد من الموافقة على المتجر \"{{name}}\"؟ سيتم إرسال إشعار إلى المالك."
      },
      reject: {
        title: "تأكيد الرفض",
        message: "هل أنت متأكد من رفض المتجر \"{{name}}\"؟ سيتم إرسال إشعار إلى المالك."
      },
      suspend: {
        title: "تأكيد التعليق",
        message: "هل أنت متأكد من تعليق المتجر \"{{name}}\"؟ لن يكون مرئياً في المنصة."
      },
      delete: {
        title: "تأكيد الحذف",
        message: "هل أنت متأكد من حذف المتجر \"{{name}}\" نهائياً؟ هذا الإجراء لا يمكن التراجع عنه."
      },
      activate: {
        title: "تأكيد التنشيط",
        message: "هل أنت متأكد من تنشيط المتجر \"{{name}}\"؟ سيكون مرئياً مرة أخرى في المنصة."
      },
      buttons: {
        processing: "جاري المعالجة...",
        approve: "موافقة",
        reject: "رفض",
        suspend: "تعليق",
        delete: "حذف",
        activate: "تنشيط",
        cancel: "إلغاء"
      }
    }
  }
} 