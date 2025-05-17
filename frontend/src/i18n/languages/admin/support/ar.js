export default {
  title: "دعم العملاء",
  subtitle: "إدارة طلبات الدعم والتقارير",
  stats: {
    openRequests: {
      title: "الطلبات المفتوحة",
      description: "إجمالي تذاكر الدعم المفتوحة"
    },
    inProgress: {
      title: "قيد التنفيذ",
      description: "التذاكر قيد المعالجة"
    },
    resolved: {
      title: "تم الحل",
      description: "التذاكر التي تم حلها بنجاح"
    },
    urgent: {
      title: "عاجل",
      description: "التذاكر ذات الأولوية العالية"
    }
  },
  table: {
    title: "جميع طلبات الدعم",
    columns: {
      request: "الطلب",
      id: "المعرف: #{{id}}",
      user: "المستخدم",
      status: "الحالة",
      date: "التاريخ",
      actions: "الإجراءات"
    },
    noRequests: "لم يتم العثور على طلبات دعم"
  },
  status: {
    open: "مفتوح",
    in_progress: "قيد التنفيذ",
    resolved: "تم الحل",
    urgent: "عاجل"
  },
  filters: {
    all: "جميع الطلبات",
    open: "مفتوحة",
    inProgress: "قيد التنفيذ",
    urgent: "عاجلة"
  },
  search: {
    placeholder: "البحث في الطلبات..."
  },
  actions: {
    reply: "الرد"
  },
  chat: {
    placeholder: "أدخل رسالتك...",
    send: "إرسال الرسالة",
    sending: "جاري الإرسال...",
    noMessages: "لا توجد رسائل حتى الآن",
    hoursAgo: "منذ {{hours}} ساعة",
    documentId: "معرف المستند: {{id}}"
  },
  modals: {
    reply: {
      title: "الرد على الطلب",
      label: "ردك",
      placeholder: "أدخل رسالتك...",
      buttons: {
        close: "إغلاق",
        send: "إرسال الرد"
      }
    }
  }
} 