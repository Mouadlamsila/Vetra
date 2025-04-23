export const paymentAr = {
  payment: {
    title: "المدفوعات",
    subtitle: "إدارة المدفوعات والمعاملات",
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
        actions: "الإجراءات"
      }
    },
    methods: {
      card: "بطاقة",
      paypal: "باي بال",
      bank: "تحويل بنكي"
    },
    actions: {
      view: "عرض التفاصيل",
      download: "تحميل الإيصال"
    }
  }
}; 