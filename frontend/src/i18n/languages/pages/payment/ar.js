const paymentAr = {
  payment: {
    title: "المدفوعات",
    subtitle: "إدارة المدفوعات المستلمة والمعلقة",
    metrics: {
      totalReceived: {
        title: "إجمالي المستلم",
        value: "€4,550.50",
        description: "هذا الشهر"
      },
      pending: {
        title: "قيد الانتظار",
        value: "€305.74",
        description: "مدفوعتان معلقتان"
      },
      nextPayment: {
        title: "الدفعة القادمة",
        value: "€1,245.25",
        description: "مقرر في 15/04/2023"
      }
    },
    search: {
      placeholder: "البحث عن دفعة..."
    },
    status: {
      all: "جميع الحالات",
      completed: "مكتمل",
      pending: "قيد الانتظار",
      failed: "فشل"
    },
    table: {
      headers: {
        id: "معرف الدفع",
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
      viewDetails: "عرض التفاصيل",
      downloadReceipt: "تحميل الإيصال"
    }
  }
};

export default paymentAr; 