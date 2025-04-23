const paymentEn = {
  payment: {
    title: "Payments",
    subtitle: "Manage received and pending payments",
    metrics: {
      totalReceived: {
        title: "Total Received",
        value: "€4,550.50",
        description: "This month"
      },
      pending: {
        title: "Pending",
        value: "€305.74",
        description: "2 pending payments"
      },
      nextPayment: {
        title: "Next Payment",
        value: "€1,245.25",
        description: "Scheduled for 15/04/2023"
      }
    },
    search: {
      placeholder: "Search a payment..."
    },
    status: {
      all: "All statuses",
      completed: "Completed",
      pending: "Pending",
      failed: "Failed"
    },
    table: {
      headers: {
        id: "Payment ID",
        date: "Date",
        order: "Order",
        method: "Method",
        amount: "Amount",
        status: "Status",
        actions: "Actions"
      }
    },
    methods: {
      card: "Card",
      paypal: "PayPal",
      bank: "Bank Transfer"
    },
    actions: {
      viewDetails: "View details",
      downloadReceipt: "Download receipt"
    }
  }
};

export default paymentEn; 