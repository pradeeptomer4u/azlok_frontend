import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';

// Add the missing types for jsPDF-autotable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface OrderItem {
  product_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

interface Address {
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

interface User {
  name: string;
  email: string;
  phone?: string;
  company_name: string;
}

interface Order {
  id: string;
  order_number: string;
  order_date: string;
  user: User;
  shipping_address: Address;
  order_items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping_cost: number;
  total_amount: number;
  payment_method: string;
  payment_status: string;
}

export const generateInvoicePDF = (order: Order): jsPDF => {
  // Create a new PDF document
  const doc = new jsPDF();
  
  // Set company information
  const companyName = 'AzLok Marketplace';
  const companyAddress = '123 Tech Park, Bengaluru, Karnataka 560001, India';
  const companyEmail = 'support@azlok.com';
  const companyPhone = '+91 80 1234 5678';
  const companyWebsite = 'www.azlok.com';
  const companyGST = 'GSTIN: 29AABCU9603R1ZX';
  
  // Set document title
  doc.setFontSize(20);
  doc.setTextColor(0, 0, 0);
  doc.text('INVOICE', 105, 20, { align: 'center' });
  
  // Add company logo (placeholder)
  // doc.addImage('/logo.png', 'PNG', 14, 10, 30, 30);
  
  // Add company information
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(companyName, 14, 40);
  doc.text(companyAddress, 14, 45);
  doc.text(`Email: ${companyEmail} | Phone: ${companyPhone}`, 14, 50);
  doc.text(`Website: ${companyWebsite} | ${companyGST}`, 14, 55);
  
  // Add a line separator
  doc.setDrawColor(220, 220, 220);
  doc.line(14, 60, 196, 60);
  
  // Add invoice details
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text(`Invoice Number: INV-${order.order_number}`, 14, 70);
  doc.text(`Order Number: ${order.order_number}`, 14, 75);
  doc.text(`Date: ${format(new Date(order.order_date), 'dd/MM/yyyy')}`, 14, 80);
  doc.text(`Payment Method: ${order.payment_method}`, 14, 85);
  doc.text(`Payment Status: ${order.payment_status.toUpperCase()}`, 14, 90);
  
  // Add customer information
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Bill To:', 140, 70);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(order.user.company_name || order.user.name, 140, 75);
  doc.text(order.shipping_address.street, 140, 80);
  doc.text(`${order.shipping_address.city}, ${order.shipping_address.state} ${order.shipping_address.postal_code}`, 140, 85);
  doc.text(order.shipping_address.country, 140, 90);
  doc.text(`Email: ${order.user.email}`, 140, 95);
  if (order.user.phone) {
    doc.text(`Phone: ${order.user.phone}`, 140, 100);
  }
  
  // Add a line separator
  doc.setDrawColor(220, 220, 220);
  doc.line(14, 105, 196, 105);
  
  // Add order items table
  const tableColumn = ["Item", "Quantity", "Unit Price", "Total"];
  const tableRows: any[] = [];
  
  order.order_items.forEach(item => {
    const itemData = [
      item.product_name,
      item.quantity,
      formatCurrency(item.unit_price),
      formatCurrency(item.subtotal)
    ];
    tableRows.push(itemData);
  });
  
  // Generate the table
  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 110,
    theme: 'grid',
    headStyles: {
      fillColor: [51, 51, 51],
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    styles: {
      cellPadding: 3,
      fontSize: 9
    },
    columnStyles: {
      0: { cellWidth: 'auto' },
      1: { cellWidth: 20, halign: 'center' },
      2: { cellWidth: 30, halign: 'right' },
      3: { cellWidth: 30, halign: 'right' }
    }
  });
  
  // Get the Y position after the table
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  
  // Add summary
  doc.setFontSize(10);
  doc.text('Subtotal:', 140, finalY);
  doc.text(formatCurrency(order.subtotal), 180, finalY, { align: 'right' });
  
  doc.text('Tax:', 140, finalY + 5);
  doc.text(formatCurrency(order.tax), 180, finalY + 5, { align: 'right' });
  
  doc.text('Shipping:', 140, finalY + 10);
  doc.text(formatCurrency(order.shipping_cost), 180, finalY + 10, { align: 'right' });
  
  doc.setDrawColor(220, 220, 220);
  doc.line(140, finalY + 15, 196, finalY + 15);
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Total:', 140, finalY + 20);
  doc.text(formatCurrency(order.total_amount), 180, finalY + 20, { align: 'right' });
  
  // Add footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      'Thank you for your business. For any queries, please contact our customer support.',
      105,
      doc.internal.pageSize.height - 20,
      { align: 'center' }
    );
    doc.text(
      `Page ${i} of ${pageCount}`,
      105,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
  }
  
  return doc;
};

export const downloadInvoice = (order: Order): void => {
  const doc = generateInvoicePDF(order);
  doc.save(`Invoice-${order.order_number}.pdf`);
};

// Helper function to format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};
