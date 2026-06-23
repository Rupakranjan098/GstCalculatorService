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

// Seed default users
const defaultUsers = [
  {
    name: 'Vikram Malhotra',
    email: 'owner@apex.com',
    password: 'password',
    role: 'Owner'
  },
  {
    name: 'Neha Sharma',
    email: 'staff@apex.com',
    password: 'password',
    role: 'Staff'
  }
];

export const apiService = {
  // Authentication
  getUsers: () => getStorageItem('auth_users', defaultUsers),
  
  register: (name, email, password, role) => {
    const users = getStorageItem('auth_users', defaultUsers);
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('User already exists with this email.');
    }
    const newUser = { name, email, password, role };
    users.push(newUser);
    setStorageItem('auth_users', users);
    return newUser;
  },

  login: (email, password) => {
    const users = getStorageItem('auth_users', defaultUsers);
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!user) {
      throw new Error('Invalid email or password.');
    }
    setStorageItem('current_session_user', user);
    return user;
  },

  logout: () => {
    try {
      localStorage.removeItem('current_session_user');
    } catch (e) {}
  },

  getCurrentUser: () => {
    return getStorageItem('current_session_user', null);
  },

  // Business DB profile
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
