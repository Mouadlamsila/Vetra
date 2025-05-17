export default {
  title: "إدارة المنتجات",
  subtitle: "إدارة جميع المنتجات المتاحة في المنصة",
  search: {
    placeholder: "البحث عن منتج...",
    filters: {
      category: {
        label: "جميع الفئات",
        placeholder: "تصفية حسب الفئة"
      },
      store: {
        label: "جميع المتاجر",
        placeholder: "تصفية حسب المتجر"
      }
    },
    reset: "إعادة تعيين التصفية"
  },
  table: {
    product: "المنتج",
    price: "السعر",
    store: "المتجر",
    category: "الفئة",
    stock: "المخزون",
    addedOn: "تمت الإضافة في",
    actions: "الإجراءات",
    id: "المعرف: #{{id}}"
  },
  status: {
    inStock: "{{count}} وحدة",
    lowStock: "{{count}} وحدة",
    outOfStock: "نفذ من المخزون"
  },
  noProducts: "لم يتم العثور على منتجات",
  modals: {
    view: {
      title: "تفاصيل المنتج",
      description: "الوصف",
      priceAndStock: "السعر والمخزون",
      currentPrice: "السعر الحالي",
      comparePrice: "سعر المقارنة",
      stockCount: "عدد المخزون",
      lowStockAlert: "تنبيه المخزون المنخفض",
      dimensionsAndWeight: "الأبعاد والوزن",
      dimensions: "الأبعاد",
      weight: "الوزن",
      additionalInfo: "معلومات إضافية",
      sku: "رمز المنتج",
      shippingClass: "فئة الشحن",
      store: "المتجر",
      storeDescription: "وصف المتجر",
      storeLocation: "موقع المتجر",
      additionalImages: "صور إضافية"
    },
    delete: {
      title: "حذف المنتج",
      message: "هل أنت متأكد من حذف المنتج \"{{name}}\"؟ هذا الإجراء لا يمكن التراجع عنه.",
      buttons: {
        confirm: "حذف",
        cancel: "إلغاء",
        processing: "جاري الحذف..."
      }
    }
  }
} 