import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import ShiprocketService from "@/lib/shiprocket";
import { requireAdmin } from "@/middleware/auth";

export async function POST(req) {
  try {
    await requireAdmin(req);
    await connectDB();

    const { orderId, status, note } = await req.json();

    const order = await Order.findOne({ orderId });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Update order status
    const oldStatus = order.orderStatus;
    order.orderStatus = status;
    order.statusHistory.push({
      status,
      updatedAt: new Date(),
      note: note || `Status updated to ${status}`,
    });

    await order.save();

    // Auto-create shipment if status changed to Processing and auto-create is enabled
    if (
      status === "Processing" &&
      oldStatus !== "Processing" &&
      !order.shiprocketOrderId &&
      process.env.SHIPROCKET_AUTO_CREATE === "true"
    ) {
      console.log("🚀 Auto-creating shipment for order:", orderId);

      try {
        // Prepare Shiprocket order data
        const shiprocketOrderData = {
          order_id: order.orderId,
          order_date: order.createdAt.toISOString().split("T")[0],
          pickup_location: "Home",
          billing_customer_name: order.shippingAddress.name,
          billing_last_name: "",
          billing_address: order.shippingAddress.street,
          billing_city: order.shippingAddress.city,
          billing_pincode: order.shippingAddress.pincode,
          billing_state: order.shippingAddress.state,
          billing_country: "India",
          billing_email: order.userEmail,
          billing_phone: order.shippingAddress.phone,
          shipping_is_billing: true,
          order_items: order.items.map((item) => ({
            name: item.title,
            sku: item.product.toString(),
            units: item.quantity,
            selling_price: item.price,
          })),
          payment_method:
            order.paymentMode === "cod" ||
            (order.paymentMode === "online" &&
              order.paymentStatus === "pending")
              ? "COD"
              : "Prepaid",
          sub_total: order.totalPrice,
          length: 10,
          breadth: 10,
          height: 10,
          weight: 0.5,
        };

        // Create order in Shiprocket
        const shiprocketResponse = await ShiprocketService.createOrder(
          shiprocketOrderData
        );

        order.shiprocketOrderId = shiprocketResponse.order_id;
        order.shiprocketShipmentId = shiprocketResponse.shipment_id;

        order.statusHistory.push({
          status: "Processing",
          updatedAt: new Date(),
          note: "Shipment auto-created in Shiprocket",
        });

        await order.save();

        console.log(
          "✅ Shipment auto-created:",
          shiprocketResponse.shipment_id
        );

        // Try to auto-select cheapest courier and generate AWB
        try {
          const couriers = await ShiprocketService.getCourierServiceability(
            process.env.SHIPROCKET_PICKUP_PINCODE,
            order.shippingAddress.pincode,
            0.5,
            order.paymentMode === "cod",
            order.finalPrice
          );

          const cheapestCourier = couriers.available_courier_companies
            .filter((c) => c.is_surface)
            .sort((a, b) => a.rate - b.rate)[0];

          if (cheapestCourier) {
            const awbResponse = await ShiprocketService.generateAWB(
              shiprocketResponse.shipment_id,
              cheapestCourier.courier_company_id
            );

            order.trackingId = awbResponse.response.data.awb_code;
            order.courierName = awbResponse.response.data.courier_name;
            await order.save();

            // Schedule pickup
            await ShiprocketService.schedulePickup(
              shiprocketResponse.shipment_id
            );

            console.log("✅ AWB auto-generated:", order.trackingId);
          }
        } catch (awbError) {
          console.error("AWB auto-generation failed:", awbError);
        }
      } catch (shipmentError) {
        console.error("Auto shipment creation failed:", shipmentError);
        // Continue without failing the status update
      }
    }

    return NextResponse.json({
      success: true,
      message: "Order status updated",
      order: {
        orderId: order.orderId,
        status: order.orderStatus,
        shiprocketOrderId: order.shiprocketOrderId,
        trackingId: order.trackingId,
      },
    });
  } catch (error) {
    console.error("Update status error:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to update status",
      },
      { status: 500 }
    );
  }
}
