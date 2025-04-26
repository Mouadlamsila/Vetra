export const paymentEn = {
  payment: {
    title: "Payments",
    subtitle: "Manage received and pending payments",
    infoMessage: "Here you can manage all payments and transactions",
    filters: "Filters",
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
      title: "Actions",
      viewDetails: "View details",
      downloadReceipt: "Download receipt",
      download: "Download",
      view: "View"
    },
    noPaymentsFound: "No payments found",
    paymentsFound: "Payments found",
    filterByStatus: "Filter by status",
    resetFilters: "Reset filters",
    tryDifferentFilters: "Try different filters"
  }
};
