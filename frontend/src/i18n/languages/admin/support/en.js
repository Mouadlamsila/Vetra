export default {
  title: "Customer Support",
  subtitle: "Manage support requests and reports",
  stats: {
    openRequests: {
      title: "Open Requests",
      description: "Total open support tickets"
    },
    inProgress: {
      title: "In Progress",
      description: "Tickets being handled"
    },
    resolved: {
      title: "Resolved",
      description: "Successfully resolved tickets"
    },
    urgent: {
      title: "Urgent",
      description: "High priority tickets"
    }
  },
  table: {
    title: "All Support Requests",
    columns: {
      request: "Request",
      id: "ID: #{{id}}",
      user: "User",
      status: "Status",
      date: "Date",
      actions: "Actions"
    },
    noRequests: "No support requests found"
  },
  status: {
    open: "Open",
    in_progress: "In Progress",
    resolved: "Resolved",
    urgent: "Urgent"
  },
  filters: {
    all: "All Requests",
    open: "Open",
    inProgress: "In Progress",
    urgent: "Urgent"
  },
  search: {
    placeholder: "Search requests..."
  },
  actions: {
    reply: "Reply"
  },
  chat: {
    placeholder: "Enter your message...",
    send: "Send Message",
    sending: "Sending...",
    noMessages: "No messages yet",
    hoursAgo: "{{hours}} hour(s) ago",
    documentId: "Document ID: {{id}}"
  },
  modals: {
    reply: {
      title: "Reply to Request",
      label: "Your Reply",
      placeholder: "Enter your message...",
      buttons: {
        close: "Close",
        send: "Send Reply"
      }
    }
  }
} 