import {
  initialBusinessProfile,
  initialProducts,
  initialCustomers,
  initialSuppliers,
  initialInvoices,
  initialActivityLogs
} from '../mockData';

// Helper to load or initialize from localStorage
const getStorageItem = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    return fallback;
  }
};

const setStorageItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    // Ignore storage issues
  }
};

export const apiService = {
  getBusinessProfile: () => getStorageItem('business_profile', initialBusinessProfile),
  saveBusinessProfile: (profile) => {
    setStorageItem('business_profile', profile);
    return profile;
  },

  getProducts: () => getStorageItem('products', initialProducts),
  saveProducts: (products) => {
    setStorageItem('products', products);
    return products;
  },

  getCustomers: () => getStorageItem('customers', initialCustomers),
  saveCustomers: (customers) => {
    setStorageItem('customers', customers);
    return customers;
  },

  getSuppliers: () => getStorageItem('suppliers', initialSuppliers),
  saveSuppliers: (suppliers) => {
    setStorageItem('suppliers', suppliers);
    return suppliers;
  },

  getInvoices: () => getStorageItem('invoices', initialInvoices),
  saveInvoices: (invoices) => {
    setStorageItem('invoices', invoices);
    return invoices;
  },

  getActivityLogs: () => getStorageItem('activity_logs', initialActivityLogs),
  saveActivityLogs: (logs) => {
    setStorageItem('activity_logs', logs);
    return logs;
  }
};
