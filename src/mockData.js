export const initialBusinessProfile = {
  name: "Apex Electronics & Retail",
  gstin: "07AAAAA1111A1Z1",
  email: "billing@apexelectronics.com",
  phone: "+91 98765 43210",
  address: "Building 45, Connaught Place, New Delhi",
  state: "Delhi",
  stateCode: "07",
  currency: "INR"
};

export const initialProducts = [
  { id: "p1", name: "Wireless Headphones", sku: "WHP-880", hsn: "85183000", basePrice: 1680, gstRate: 18, stock: 45, minStock: 10, unit: "PCS", category: "Electronics", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&q=80&fit=crop", lastRestocked: "21 Jun 2026" },
  { id: "p2", name: "UltraWide Gaming Monitor 34\"", sku: "MON-34W", hsn: "85285200", basePrice: 25000, gstRate: 18, stock: 12, minStock: 3, unit: "PCS", category: "Electronics", image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=80&q=80&fit=crop", lastRestocked: "19 Jun 2026" },
  { id: "p3", name: "USB-C Fast Charging Hub", sku: "HUB-C5", hsn: "85044090", basePrice: 950, gstRate: 12, stock: 8, minStock: 15, unit: "PCS", category: "Accessories", image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=80&q=80&fit=crop", lastRestocked: "20 Jun 2026" },
  { id: "p4", name: "Smart Fitness Watch S3", sku: "SMW-S3", hsn: "85176290", basePrice: 4200, gstRate: 18, stock: 30, minStock: 8, unit: "PCS", category: "Wearables", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80&q=80&fit=crop", lastRestocked: "21 Jun 2026" },
  { id: "p5", name: "LED Desk Lamp with Qi Charger", sku: "LMP-QI", hsn: "94052000", basePrice: 1500, gstRate: 12, stock: 25, minStock: 5, unit: "PCS", category: "Home Appliances", image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=80&q=80&fit=crop", lastRestocked: "18 Jun 2026" }
];

export const initialCustomers = [
  { id: "c1", name: "Rajesh Kumar", email: "rajesh.k@gmail.com", phone: "+91 99887 76655", gstin: "", state: "Delhi", stateCode: "07", address: "Lajpat Nagar, New Delhi" },
  { id: "c2", name: "Neha Sharma", email: "neha@sharma.com", phone: "+91 91234 56789", gstin: "07BCDEF2222B2Z2", state: "Delhi", stateCode: "07", address: "Sector 12, Dwarka, New Delhi" },
  { id: "c3", name: "Amit Verma", email: "amit.verma@hotmail.com", phone: "+91 88776 65544", gstin: "", state: "Delhi", stateCode: "07", address: "Connaught Place, New Delhi" },
  { id: "c4", name: "Priya Singh", email: "priya@techcorp.in", phone: "+91 80234 5678", gstin: "29GHIJK4444D4Z4", state: "Karnataka", stateCode: "29", address: "Whitefield, Bengaluru" },
  { id: "c5", name: "Vikas Traders", email: "info@vikastraders.com", phone: "+91 92222 33333", gstin: "27ABCDE3333C3Z3", state: "Maharashtra", stateCode: "27", address: "Andheri West, Mumbai" }
];

export const initialSuppliers = [
  { 
    id: "s1", 
    name: "Microchip Distributors India", 
    email: "orders@microchipdist.com", 
    phone: "+91 90000 11111", 
    gstin: "27SUPPL5555E5Z5", 
    state: "Maharashtra", 
    stateCode: "27", 
    address: "MIDC Area, Pune",
    ledgerBalance: 12500,
    purchases: [
      { id: "po-1", purchaseNo: "PO/2026/055", date: "20 Jun 2026", amount: 12500, status: "Unpaid" },
      { id: "po-2", purchaseNo: "PO/2026/050", date: "15 Jun 2026", amount: 45000, status: "Paid" }
    ]
  },
  { 
    id: "s2", 
    name: "National Logistics & Spares", 
    email: "spares@natlogistics.com", 
    phone: "+91 92222 33333", 
    gstin: "07SUPPL6666F6Z6", 
    state: "Delhi", 
    stateCode: "07", 
    address: "Okhla Phase III, New Delhi",
    ledgerBalance: 0,
    purchases: [
      { id: "po-3", purchaseNo: "PO/2026/048", date: "10 Jun 2026", amount: 8400, status: "Paid" }
    ]
  }
];

export const initialInvoices = [
  {
    id: "inv-1003",
    invoiceNumber: "INV/2026/1003",
    customerName: "Rajesh Kumar",
    customerId: "c1",
    date: "21 Jun 2026",
    items: [
      { productId: "p1", name: "Wireless Headphones", sku: "WHP-880", hsn: "85183000", quantity: 2, price: 1680, gstRate: 18, cgst: 302.40, sgst: 302.40, igst: 0, total: 3964.80 }
    ],
    subtotal: 3360,
    cgstTotal: 302.40,
    sgstTotal: 302.40,
    igstTotal: 0,
    grandTotal: 3964.80,
    status: "Paid"
  },
  {
    id: "inv-1002",
    invoiceNumber: "INV/2026/1002",
    customerName: "Neha Sharma",
    customerId: "c2",
    date: "20 Jun 2026",
    items: [
      { productId: "p5", name: "LED Desk Lamp with Qi Charger", sku: "LMP-QI", hsn: "94052000", quantity: 1, price: 1500, gstRate: 12, cgst: 90, sgst: 90, igst: 0, total: 1680 }
    ],
    subtotal: 2187.50,
    cgstTotal: 131.25,
    sgstTotal: 131.25,
    igstTotal: 0,
    grandTotal: 2450.00,
    status: "Paid"
  },
  {
    id: "inv-1001",
    invoiceNumber: "INV/2026/1001",
    customerName: "Amit Verma",
    customerId: "c3",
    date: "18 Jun 2026",
    items: [
      { productId: "p5", name: "LED Desk Lamp with Qi Charger", sku: "LMP-QI", hsn: "94052000", quantity: 1, price: 1500, gstRate: 12, cgst: 90, sgst: 90, igst: 0, total: 1680 }
    ],
    subtotal: 1500,
    cgstTotal: 90,
    sgstTotal: 90,
    igstTotal: 0,
    grandTotal: 1680.00,
    status: "Unpaid"
  },
  {
    id: "inv-1000",
    invoiceNumber: "INV/2026/1000",
    customerName: "Priya Singh",
    customerId: "c4",
    date: "15 Jun 2026",
    items: [
      { productId: "p4", name: "Smart Fitness Watch S3", sku: "SMW-S3", hsn: "85176290", quantity: 1, price: 4200, gstRate: 18, cgst: 0, sgst: 0, igst: 756, total: 4956 }
    ],
    subtotal: 4500,
    cgstTotal: 0,
    sgstTotal: 0,
    igstTotal: 540,
    grandTotal: 5040.00,
    status: "Paid"
  },
  {
    id: "inv-0999",
    invoiceNumber: "INV/2026/0999",
    customerName: "Vikas Traders",
    customerId: "c5",
    date: "14 Jun 2026",
    items: [
      { productId: "p3", name: "USB-C Fast Charging Hub", sku: "HUB-C5", hsn: "85044090", quantity: 2, price: 950, gstRate: 12, cgst: 0, sgst: 0, igst: 228, total: 2128 }
    ],
    subtotal: 2000,
    cgstTotal: 0,
    sgstTotal: 0,
    igstTotal: 240,
    grandTotal: 2240.00,
    status: "Paid"
  }
];

export const initialActivityLogs = [
  { id: "log-1", user: "Vikram Malhotra", role: "Owner", action: "Created Invoice INV/2026/1003", timestamp: "21 Jun 2026, 11:30 AM", details: "Invoice for Rajesh Kumar (Retail) worth ₹3,964.80" },
  { id: "log-2", user: "Neha Sharma", role: "Staff", action: "Stock Inward WHP-880", timestamp: "21 Jun 2026, 10:15 AM", details: "Added +10 Premium Wireless Headphones to inventory" },
  { id: "log-3", user: "Vikram Malhotra", role: "Owner", action: "Added Customer Future Retail Hub", timestamp: "20 Jun 2026, 11:00 AM", details: "Customer from Maharashtra with GSTIN: 27ABCDE3333C3Z3..." },
  { id: "log-4", user: "Neha Sharma", role: "Staff", action: "Created Invoice INV/2026/1002", timestamp: "20 Jun 2026, 10:45 AM", details: "Invoice for Neha Sharma worth ₹2,450.00" }
];
