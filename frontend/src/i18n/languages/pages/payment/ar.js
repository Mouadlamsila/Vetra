export const paymentAr = {
  payment: {
    title: "المدفوعات",
    subtitle: "إدارة المدفوعات والمعاملات",
    infoMessage: "هنا يمكنك إدارة جميع المدفوعات والمعاملات",
    filters: "تصفيات",
    loading: "جارٍ التحميل...",
    metrics: {
      totalReceived: {
        title: "إجمالي المدفوعات المستلمة",
        value: "12,450",
        description: "زيادة بنسبة 12% عن الشهر الماضي"
      },
      pending: {
        title: "المدفوعات المعلقة",
        value: "2,150",
        description: "3 مدفوعات معلقة"
      },
      nextScheduled: {
        title: "الدفعة المجدولة التالية",
        value: "5,000",
        description: "مستحقة في 15 مارس 2024"
      },
      nextPayment: {
        title: "الدفعة المجدولة التالية",
        value: "5,000",
        description: "مستحقة في 15 مارس 2024"
      }
    },
    search: {
      placeholder: "البحث عن المدفوعات..."
    },
    status: {
      all: "جميع الحالات",
      completed: "مكتمل",
      pending: "معلق",
      failed: "فشل"
    },
    table: {
      headers: {
        id: "المعرف",
        date: "التاريخ",
        order: "الطلب",
        method: "الطريقة",
        amount: "المبلغ",
        status: "الحالة",
        actions: "الإجراءات",
        products: "المنتجات",
        items: "{{nbr}} العناصر",
        paymentInfo: "معلومات الدفع",
        paymentMethod: "طريقة الدفع",
        quantity: "الكمية",
        sku: "SKU",
      }
    },
    methods: {
      card: "بطاقة",
      paypal: "باي بال",
      bank: "تحويل بنكي"
    },
    actions: {
      title: "الإجراءات",
      viewDetails: "عرض التفاصيل",
      downloadReceipt: "تحميل الإيصال",
      download: "تحميل",
      view: "عرض",
      close : "إغلاق",
      viewPayment: "عرض الدفع",
      showMore: "عرض المزيد",
      showLess: "عرض أقل",
      
    },
    noPaymentsFound: "لم يتم العثور على مدفوعات",
    paymentsFound: "تم العثور على مدفوعات",
    filterByStatus: "تصفية بالحالة",
    resetFilters: "إعادة تصفية",
    tryDifferentFilters: "حاول تصفيات مختلفة"
  }
}; 