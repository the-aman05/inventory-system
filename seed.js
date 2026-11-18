// Optional: run `npm run seed` to insert 12 sample products (needed for pagination demo)
require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const data = [
  { name: 'Study Table', sku: 'FURN-TB-812', category: 'Furniture', price: 3999, quantity: 2, reorderLevel: 4, supplier: 'IKEA India' },
  { name: 'Office Chair', sku: 'FURN-CH-101', category: 'Furniture', price: 5499, quantity: 15, reorderLevel: 5, supplier: 'Godrej' },
  { name: 'Laptop 15 inch', sku: 'ELEC-LP-201', category: 'Electronics', price: 55000, quantity: 3, reorderLevel: 5, supplier: 'Dell' },
  { name: 'Wireless Mouse', sku: 'ELEC-MS-202', category: 'Electronics', price: 799, quantity: 40, reorderLevel: 10, supplier: 'Logitech' },
  { name: 'Bluetooth Speaker', sku: 'ELEC-SP-203', category: 'Electronics', price: 2499, quantity: 8, reorderLevel: 10, supplier: 'boAt' },
  { name: 'Mechanical Keyboard', sku: 'ELEC-KB-204', category: 'Electronics', price: 3499, quantity: 45, reorderLevel: 10, supplier: 'Redragon' },
  { name: 'Cotton T-Shirt', sku: 'APRL-TS-301', category: 'Apparel', price: 599, quantity: 60, reorderLevel: 20, supplier: 'Levis' },
  { name: 'Denim Jacket', sku: 'APRL-JK-302', category: 'Apparel', price: 2199, quantity: 18, reorderLevel: 10, supplier: 'Levis' },
  { name: 'Notebook A4', sku: 'STNY-NB-401', category: 'Stationery', price: 60, quantity: 200, reorderLevel: 50, supplier: 'Classmate' },
  { name: 'Gel Pen Pack of 15', sku: 'STNY-PN-713', category: 'Stationery', price: 120, quantity: 12, reorderLevel: 20, supplier: 'Cello Pens' },
  { name: 'Basmati Rice 5kg', sku: 'GROC-RC-501', category: 'Grocery', price: 650, quantity: 70, reorderLevel: 25, supplier: 'India Gate' },
  { name: 'Olive Oil 1L', sku: 'GROC-OL-502', category: 'Grocery', price: 899, quantity: 5, reorderLevel: 10, supplier: 'Figaro' },
];

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Product.deleteMany();
  await Product.insertMany(data);
  console.log(`Seeded ${data.length} products`);
  await mongoose.disconnect();
})();
