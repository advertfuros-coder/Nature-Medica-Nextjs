import fetch from "node-fetch";

const BASE_URL = "http://localhost:3000";

async function testOrderFlow() {
  console.log("🚀 Starting End-to-End Order Notification Test...\n");

  try {
    // Step 1: Fetch a valid product to order
    console.log("1️⃣  Fetching a product to use in the order...");
    const productsRes = await fetch(`${BASE_URL}/api/products?limit=1`);
    const productsData = await productsRes.json();

    if (
      !productsData.success ||
      !productsData.products ||
      productsData.products.length === 0
    ) {
      console.error(
        "❌ No products found. Please create a product in the admin panel first."
      );
      process.exit(1);
    }

    const product = productsData.products[0];
    console.log(`✅ Found product: "${product.title}" (ID: ${product._id})\n`);

    // Step 2: Define order payload
    const orderPayload = {
      items: [
        {
          product: product._id,
          title: product.title,
          quantity: 1,
          price: 100, // Mock price
          variant: "Default",
        },
      ],
      totalPrice: 100,
      finalPrice: 100,
      shippingAddress: {
        name: "Test User",
        phone: "9999999999",
        street: "123 Test St",
        city: "Test City",
        state: "Test State",
        pincode: "123456",
      },
      paymentMode: "cod", // Cash on Delivery for easiest testing
      isGuest: true,
      guestName: "Test User",
      guestEmail: "test@example.com",
    };

    // Step 3: Create Order
    console.log("2️⃣  Creating test order...");
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
      console.log(
        "\n👀 Check your admin email inbox (or the console logs of the running server) to verify the notification was sent."
      );
    } else {
      console.error("❌ Failed to create order:", orderData);
    }
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    if (error.code === "ECONNREFUSED") {
      console.error(
        "   (Make sure your Next.js server is running on localhost:3000)"
      );
    }
  }
}

testOrderFlow();
