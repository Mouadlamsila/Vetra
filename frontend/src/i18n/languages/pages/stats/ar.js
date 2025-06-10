const statsAr = {
  stats: {
    title: "الإحصائيات",
    subtitle: "تحليل أداء متاجرك",
    period: {
      title: "الفترة",
      options: {
        last7Days: "آخر 7 أيام",
        last30Days: "آخر 30 يوم",
        last3Months: "آخر 3 أشهر",
        last12Months: "آخر 12 شهر"
      }
    },
    metrics: {
      totalSales: {
        title: "إجمالي المبيعات",
        value: "€4,550.50",
        change: "+12.5% مقارنة بالشهر الماضي"
      },
      orders: {
        title: "الطلبات",
        value: "45",
        change: "+8.2% مقارنة بالشهر الماضي"
      },
      averageCart: {
        title: "متوسط السلة",
        value: "€101.12",
        change: "+3.1% مقارنة بالشهر الماضي"
      },
      visitors: {
        title: "الزوار",
        value: "1,245",
        change: "+18.7% مقارنة بالشهر الماضي"
      }
    },
    tabs: {
      sales: "المبيعات",
      products: "المنتجات",
      customers: "العملاء"
    },
    charts: {
      sales: {
        title: "المبيعات اليومية",
        subtitle: "تطور المبيعات خلال آخر 30 يوم",
        tooltip: {
          sales: "المبيعات"
        }
      },
      products: {
        bestSellers: {
          title: "أفضل المنتجات مبيعاً",
          subtitle: "المنتجات الأكثر مبيعاً",
          tooltip: {
            units: "وحدات",
            sales: "المبيعات"
          }
        },
        distribution: {
          title: "توزيع المبيعات",
          subtitle: "حسب فئة المنتج",
          tooltip: {
            percentage: "النسبة المئوية",
            count : "العدد",
            products: "المنتجات"
          }
        }
      },
      customers: {
        title: "اكتساب العملاء",
        subtitle: "العملاء الجدد يومياً",
        tooltip: {
          new: "جديد",
          total: "إجمالي"
        }
      }
    }
  }
};

export default statsAr; 