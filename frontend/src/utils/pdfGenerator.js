import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export const generatePaymentReceipt = (payment) => {
  if (!payment) return

  // Initialize document with proper configuration
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })

  // Add header
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(20)
  doc.text('Payment Receipt', 105, 20, { align: 'center' })
  
  // Add payment details
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(12)
  doc.text(`Receipt ID: ${payment.sessionId || 'N/A'}`, 20, 40)
  doc.text(`Date: ${payment.createdAt ? new Date(payment.createdAt).toLocaleDateString() : 'N/A'}`, 20, 50)
  doc.text(`Status: ${payment.status_checkout || 'N/A'}`, 20, 60)
  
  // Add customer info if available
  if (payment.customer) {
    doc.text('Customer Information:', 20, 80)
    doc.text(`Name: ${payment.customer.name || 'N/A'}`, 30, 90)
    doc.text(`Email: ${payment.customer.email || 'N/A'}`, 30, 100)
  }

  // Add products table
  const tableColumn = ['Product', 'Quantity', 'Price', 'Total']
  const tableRows = (payment.products || []).map(product => {
    if (!product) return ['N/A', 'N/A', 'N/A', 'N/A']
    
    const quantity = payment.quantities?.[product.id] || 1
    const price = product.prix || 0
    const total = price * quantity
    
    return [
      product.name || 'N/A',
      quantity,
      `${price.toFixed(2)} ${payment.currency?.toUpperCase() || 'USD'}`,
      `${total.toFixed(2)} ${payment.currency?.toUpperCase() || 'USD'}`
    ]
  })

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: payment.customer ? 120 : 80,
    theme: 'grid',
    styles: { fontSize: 10 },
    headStyles: { fillColor: [109, 40, 217] }
  })

  // Add total
  const finalY = doc.lastAutoTable.finalY || 120
  doc.setFont('helvetica', 'bold')
  doc.text(`Total Amount: ${payment.amount || 0} ${payment.currency?.toUpperCase() || 'USD'}`, 20, finalY + 20)

  // Save the PDF
  doc.save(`payment-receipt-${payment.sessionId || 'unknown'}.pdf`)
}

export const generateOrderInvoice = (order) => {
  if (!order) return

  // Initialize document with proper configuration
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })

  // Add header
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(20)
  doc.text('Order Invoice', 105, 20, { align: 'center' })
  
  // Add order details
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(12)
  doc.text(`Order Number: ${order.orderNumber || 'N/A'}`, 20, 40)
  doc.text(`Date: ${order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}`, 20, 50)
  doc.text(`Status: ${order.statusOrder || 'N/A'}`, 20, 60)
  doc.text(`Payment Status: ${order.paymentStatus || 'N/A'}`, 20, 70)
  
  // Add customer info
  doc.text('Customer Information:', 20, 90)
  doc.text(`Username: ${order.user?.username || 'N/A'}`, 30, 100)
  doc.text(`Email: ${order.user?.email || 'N/A'}`, 30, 110)

  // Add products table
  const tableColumn = ['Product', 'Quantity', 'Price', 'Total']
  const tableRows = (order.products || []).map(product => {
    if (!product) return ['N/A', 'N/A', 'N/A', 'N/A']
    
    const quantity = order.quantities?.[product.id] || 1
    const price = product.prix || 0
    const total = price * quantity
    
    return [
      product.name || 'N/A',
      quantity,
      `${price.toFixed(2)} ${order.currency?.toUpperCase() || 'USD'}`,
      `${total.toFixed(2)} ${order.currency?.toUpperCase() || 'USD'}`
    ]
  })

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 130,
    theme: 'grid',
    styles: { fontSize: 10 },
    headStyles: { fillColor: [109, 40, 217] }
  })

  // Add total
  const finalY = doc.lastAutoTable.finalY || 130
  doc.setFont('helvetica', 'bold')
  doc.text(`Total Amount: ${order.totalAmount?.toFixed(2) || '0.00'} ${order.currency?.toUpperCase() || 'USD'}`, 20, finalY + 20)

  // Save the PDF
  doc.save(`order-invoice-${order.orderNumber || 'unknown'}.pdf`)
} 