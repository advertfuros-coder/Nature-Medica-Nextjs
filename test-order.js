// Test Script for Partial Payment Order
// This script bypasses OTP for testing in development mode only

const TEST_MODE = process.env.NODE_ENV !== "production";

// Test order configuration
const testOrder = {
  // Customer Details
  customer: {
    name: "Test Customer",
    email: "test@naturemedica.com",
    phone: "9999999999",
  },

  // Shipping Address
  address: {
    name: "Test Customer",
    phone: "9999999999",
    street: "123 Test Street, Test Building",
    city: "Lucknow",
    state: "Uttar Pradesh",
    pincode: "226024",
    landmark: "Near Test Mall",
    type: "home",
  },

  // Cart Items (example)
  items: [
    {
      productId: "test_product_1",
      title: "Test Product",
      price: 1000,
      quantity: 1,
      variant: "Default",
    },
  ],

  // Payment Details
  payment: {
    method: "partial_cod", // partial_cod, online, or cod
    totalAmount: 1000,
    advanceAmount: 200, // 20%
    codAmount: 800, // 80%
  },
};

console.log("🧪 Test Order Configuration:");
console.log(JSON.stringify(testOrder, null, 2));
console.log("\n✅ Use this configuration in your checkout form");
console.log("📱 Phone: 9999999999 (test number)");
console.log("🔐 OTP: Any 6 digits (e.g., 123456)");
console.log("💳 Test Card: 4111 1111 1111 1111");

module.exports = testOrder;
