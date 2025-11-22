import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";

export async function POST(req) {
  try {
    await connectDB();

    const {
      items,
      totalPrice,
      discount,
      gst,
      finalPrice,
      shippingAddress,
      paymentMode,
      couponCode,
      isGuest,
      guestEmail,
      guestName,
    } = await req.json();

    let user = null;
    let userId = null;
    let userName = guestName || "Guest";
    let userEmail = guestEmail || "";

    // If not a guest user, try to get authenticated user
    if (!isGuest) {
      try {
        const { requireAuth } = await import("@/middleware/auth");
        const authData = await requireAuth(req);
        user = await User.findById(authData.userId).lean();

        if (user) {
          userId = user._id;
          userName = user.name;
          userEmail = user.email;
        }
      } catch (authError) {
        // If auth fails but isGuest is false, it means they were trying to authenticate
        // We can continue as guest if guest details are provided
        if (!guestEmail || !guestName) {
          return NextResponse.json(
            {
              error: "Authentication required or provide guest details",
            },
            { status: 401 }
          );
        }
      }
    }

    // Validation
    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items in order" }, { status: 400 });
    }

    if (
      !shippingAddress?.name ||
      !shippingAddress?.phone ||
      !shippingAddress?.street ||
      !shippingAddress?.city ||
      !shippingAddress?.state ||
      !shippingAddress?.pincode
    ) {
      return NextResponse.json(
        {
          error: "Complete shipping address is required",
        },
        { status: 400 }
      );
    }

    // Stock validation
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return NextResponse.json(
          {
            error: `Product not found: ${item.title}`,
          },
          { status: 400 }
        );
      }
      if (product.stock < item.quantity) {
        return NextResponse.json(
          {
            error: `Insufficient stock for ${item.title}. Available: ${product.stock}`,
          },
          { status: 400 }
        );
      }
    }

    // Generate Order ID
    const orderCount = await Order.countDocuments();
    const orderId = `NM${String(orderCount + 1).padStart(6, "0")}`;

    // Prepare order data
    const orderData = {
      orderId,
      user: userId, // null for guest users
      userName,
      userEmail,
      isGuestOrder: isGuest || false,
      items: items.map((item) => ({
        product: item.product,
        title: item.title,
        image: item.image || "",
        quantity: item.quantity,
        price: item.price,
        variant: item.variant || "",
      })),
      totalPrice,
      discount: discount || 0,
      gst: gst || 0,
      finalPrice,
      shippingAddress: {
        name: shippingAddress.name,
        phone: shippingAddress.phone,
        street: shippingAddress.street,
        city: shippingAddress.city,
        state: shippingAddress.state,
        pincode: shippingAddress.pincode,
        landmark: shippingAddress.landmark || "",
        type: shippingAddress.type || "home",
      },
      paymentMode,
      paymentStatus: "pending",
      orderStatus: "Pending",
      couponCode: couponCode || null,
      statusHistory: [
        {
          status: "Pending",
          updatedAt: new Date(),
          note: isGuest ? "Guest order created" : "Order created",
        },
      ],
    };

    // Create order in database
    const newOrder = await Order.create(orderData);

    console.log(
      `✅ ${isGuest ? "Guest" : "User"} order created:`,
      newOrder.orderId
    );

    // Return order details for frontend
    return NextResponse.json({
      success: true,
      orderId: newOrder.orderId,
      amount: newOrder.finalPrice,
      mobileNumber: shippingAddress.phone,
    });
  } catch (error) {
    console.error("❌ Create order error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create order" },
      { status: 500 }
    );
  }
}
