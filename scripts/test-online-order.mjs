import fetch from "node-fetch";

const BASE_URL = "http://localhost:3000";

async function testOnlineOrderFlow() {
  console.log("🚀 Starting Online (Paid) Order Notification Test...\n");

  try {
    // Step 1: Fetch a product
    const productsRes = await fetch(`${BASE_URL}/api/products?limit=1`);
    const productsData = await productsRes.json();
    const product = productsData.products[0];

    // Step 2: Define "Online Paid" order payload
    const orderPayload = {
      items: [
        {
          product: product._id,
          title: product.title,
          quantity: 2,
          price: 150,
          variant: "Premium",
        },
      ],
      totalPrice: 300,
      finalPrice: 300,
      shippingAddress: {
        name: "Verified Customer",
        phone: "9876543210",
        street: "456 Paid Lane",
        city: "Rich City",
        state: "Wealth State",
        pincode: "500001",
      },
      paymentMode: "online",
      paymentVerified: true, // Simulate successful payment
      cashfreePaymentId: "pay_test_123456789",
      isGuest: true,
      guestName: "Verified Customer",
      guestEmail: "paid@example.com",
    };

    // Step 3: Create Order
    console.log("2️⃣  Creating ONLINE (PAID) test order...");
    const orderRes = await fetch(`${BASE_URL}/api/orders/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderPayload),
    });

    const orderData = await orderRes.json();

    if (orderRes.ok && orderData.success) {
      console.log(
        `✅ Order Created Successfully! Order ID: ${orderData.orderId}`
      );
      console.log(`💰 Amount: ${orderData.amount}`);
      console.log(
        "\n👀 Check your admin email inbox. You should receive a notification for this PAID order too."
      );
    } else {
      console.error("❌ Failed to create order:", orderData);
    }
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

testOnlineOrderFlow();
