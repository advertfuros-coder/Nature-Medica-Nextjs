# Payment Recovery Script

# For Order: NM000085_1764660705883

# Payment Amount: ₹51.00

# Payment Date: 2 December 2025, 1:02 pm

## Steps to Manually Create Order:

### Option 1: Using MongoDB Directly

1. Open your MongoDB database
2. Find the Cashfree payment details:

   - Cashfree Order ID: `NM000085_1764660705883`
   - Internal Order ID: `NM000085`
   - Payment Amount: ₹51.00

3. Check if order `NM000085` exists:

   ```javascript
   db.orders.findOne({ orderId: "NM000085" });
   ```

4. If it doesn't exist, you need the order data from sessionStorage (which is lost)
5. Contact the customer to get their order details

### Option 2: Create Recovery API Endpoint

Create `/api/admin/recover-payment` endpoint to:

1. Fetch payment from Cashfree using the payment ID
2. Get customer details from Cashfree
3. Create order manually with "paid" status
4. Send confirmation email to customer

### Option 3: Refund the Payment

Since order data was lost, you may need to:

1. Refund ₹51 to the customer via Cashfree dashboard
2. Ask customer to place order again

---

## What Happened:

1. ✅ Customer placed order NM000085
2. ✅ Payment of ₹51 was successful (visible in Cashfree)
3. ❌ Return URL didn't include `internal_order_id` parameter
4. ❌ Order creation failed with "Invalid order ID"
5. ❌ SessionStorage was cleared, order data lost

---

## Prevention (Already Fixed):

The code now:

- ✅ Extracts `NM000085` from `NM000085_1764660705883` if parameter missing
- ✅ Shows better error messages with payment ID
- ✅ Won't lose payments going forward

---

## For This Specific Payment:

**Cashfree Order ID:** `NM000085_1764660705883`
**Amount:** ₹51.00
**Status:** Paid in Cashfree, but order not created

**Recommended Action:**

1. Check your sessionStorage/browser console for order details OR
2. Contact customer to get order details (products, address) OR
3. Refund via Cashfree dashboard and ask customer to reorder

The fix is now in place, so future payments won't have this issue! ✅
