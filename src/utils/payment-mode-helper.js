// Payment Mode Determination - Reusable Logic
// Use this logic across all courier integrations

/**
 * Determines if an order should be shipped as COD or Prepaid
 *
 * @param {Object} order - The order object from database
 * @returns {boolean} - true if COD, false if Prepaid
 */
function isCODOrder(order) {
  // COD if:
  // 1. Explicitly selected COD payment mode, OR
  // 2. Online payment selected but not completed (fallback scenario)
  return (
    order.paymentMode === "cod" ||
    (order.paymentMode === "online" && order.paymentStatus === "pending")
  );
}

/**
 * Get payment mode string for courier APIs
 *
 * @param {Object} order - The order object from database
 * @returns {string} - 'COD' or 'Prepaid'
 */
function getPaymentMode(order) {
  return isCODOrder(order) ? "COD" : "Prepaid";
}

/**
 * Get COD amount to collect
 *
 * @param {Object} order - The order object from database
 * @returns {number} - Amount to collect (0 for prepaid)
 */
function getCODAmount(order) {
  return isCODOrder(order) ? order.finalPrice : 0;
}

/**
 * Log warning if order has pending online payment
 * These orders shouldn't exist but we handle them gracefully
 *
 * @param {Object} order - The order object from database
 */
function logPendingPaymentWarning(order) {
  if (order.paymentMode === "online" && order.paymentStatus === "pending") {
    console.warn(
      "⚠️ WARNING: Shipping order with pending online payment as COD fallback:",
      order.orderId
    );
    console.warn(
      "   This order should not have been created. Check order creation flow."
    );
  }
}

// ============================================
// USAGE EXAMPLE IN COURIER INTEGRATION
// ============================================

export async function POST(req) {
  try {
    // ... fetch order from database ...

    // Determine payment mode
    const isCOD = isCODOrder(order);

    // Log warning for edge cases
    logPendingPaymentWarning(order);

    // Prepare shipment data
    const shipmentData = {
      // ... other fields ...
      payment_mode: getPaymentMode(order),
      cod_amount: getCODAmount(order),
      // ... other fields ...
    };

    // Create shipment
    const response = await courierAPI.createShipment(shipmentData);

    // ... rest of the logic ...
  } catch (error) {
    // ... error handling ...
  }
}

// ============================================
// PAYMENT STATUS REFERENCE
// ============================================

/*
ORDER SCENARIOS:

1. COD Order (Correct)
   paymentMode: "cod"
   paymentStatus: "pending"
   → Ship as: COD
   → cod_amount: order.finalPrice
   
2. Online Payment - Paid (Correct)
   paymentMode: "online"
   paymentStatus: "paid"
   → Ship as: Prepaid
   → cod_amount: 0
   
3. Online Payment - Pending (Should NOT exist)
   paymentMode: "online"
   paymentStatus: "pending"
   → Prevented at order creation
   → If exists (legacy): Ship as COD (fallback)
   → cod_amount: order.finalPrice
   
4. Online Payment - Failed (Should NOT exist)
   paymentMode: "online"
   paymentStatus: "failed"
   → Order should not be created
   → If exists: Do not ship
*/

// ============================================
// ORDER CREATION VALIDATION
// ============================================

/*
In /api/orders/create/route.js:

// Prevent order creation for unverified online payments
if (paymentMode === 'online' && !paymentVerified) {
  return NextResponse.json({
    error: 'Payment verification required',
    message: 'Online payment orders can only be created after successful payment verification.',
    code: 'PAYMENT_NOT_VERIFIED'
  }, { status: 400 });
}
*/

module.exports = {
  isCODOrder,
  getPaymentMode,
  getCODAmount,
  logPendingPaymentWarning,
};
