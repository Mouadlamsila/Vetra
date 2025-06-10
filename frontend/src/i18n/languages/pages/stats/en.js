const statsEn = {
  stats: {
    title: "Statistics",
    subtitle: "Analyze your stores' performance",
    period: {
      title: "Period",
      options: {
        last7Days: "Last 7 days",
        last30Days: "Last 30 days",
        last3Months: "Last 3 months",
        last12Months: "Last 12 months"
      }
    },
    metrics: {
      totalSales: {
        title: "Total Sales",
        value: "€4,550.50",
        change: "+12.5% compared to last month"
      },
      orders: {
        title: "Orders",
        value: "45",
        change: "+8.2% compared to last month"
      },
      averageCart: {
        title: "Average Cart",
        value: "€101.12",
        change: "+3.1% compared to last month"
      },
      visitors: {
        title: "Visitors",
        value: "1,245",
        change: "+18.7% compared to last month"
      }
    },
    tabs: {
      sales: "Sales",
      products: "Products",
      customers: "Customers"
    },
    charts: {
      sales: {
        title: "Daily Sales",
        subtitle: "Sales evolution over the last 30 days",
        tooltip: {
          sales: "Sales"
        }
      },
      products: {
        bestSellers: {
          title: "Best Sellers",
          subtitle: "Most sold products",
          tooltip: {
            units: "units",
            sales: "Sales"
          }
        },
        distribution: {
          title: "Sales Distribution",
          subtitle: "By product category",
          tooltip: {
            percentage: "Percentage",
            count : "Count",
            products: "Products"
          }
        }
      },
      customers: {
        title: "Customer Acquisition",
        subtitle: "New customers per day",
        tooltip: {
          new: "New",
          total: "Total"
        }
      }
    }
  }
};

export default statsEn; 