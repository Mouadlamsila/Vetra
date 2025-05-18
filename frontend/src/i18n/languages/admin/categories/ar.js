export default {
  title: "إدارة الفئات",
  subtitle: "إنشاء وإدارة فئات المنتجات",
  addCategory: "إضافة فئة",
  table: {
    category: "الفئة",
    id: "المعرف: #{{id}}",
    createdAt: "تم الإنشاء في",
    actions: "الإجراءات",
    documentId: "المعرف: #{{id}}"
  },
  form: {
    name: {
      label: "اسم الفئة",
      placeholder: "مثال: إلكترونيات"
    },
    photo: {
      label: "صورة الفئة",
      upload: "تحميل صورة",
      dragDrop: "أو اسحب وأفلت",
      format: "PNG، JPG، GIF حتى 10 ميجابايت"
    }
  },
  modals: {
    create: {
      title: "إنشاء فئة جديدة",
      buttons: {
        create: "إنشاء الفئة",
        creating: "جاري الإنشاء...",
        cancel: "إلغاء"
      }
    },
    edit: {
      title: "تعديل الفئة",
      buttons: {
        update: "تحديث",
        updating: "جاري التحديث...",
        cancel: "إلغاء"
      },
      changePhoto: "تغيير الصورة"
    },
    delete: {
      title: "حذف الفئة",
      message: "هل أنت متأكد من حذف الفئة \"{{name}}\"؟ المنتجات المرتبطة بهذه الفئة لن تكون مصنفة بعد الآن.",
      buttons: {
        confirm: "حذف",
        cancel: "إلغاء",
        processing: "جاري الحذف..."
      }
    }
  },
  allCategories: "جميع الفئات",
  noCategories: "لم يتم العثور على فئات",
  errors: {
    fetchFailed: "فشل في تحميل الفئات",
    createFailed: "فشل في إنشاء الفئة",
    updateFailed: "فشل في تحديث الفئة",
    deleteFailed: "فشل في حذف الفئة"
  }
} 