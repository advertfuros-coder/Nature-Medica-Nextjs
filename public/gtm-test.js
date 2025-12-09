/**
 * GTM DataLayer Event Testing Guide
 * Run these checks in your browser console to verify all events are firing correctly
 */

// ===== SETUP =====
// Open browser console (F12) and paste these functions

// Helper function to check if dataLayer exists
function checkDataLayer() {
  if (!window.dataLayer) {
    console.error("❌ window.dataLayer is not defined!");
    return false;
  }
  console.log("✅ window.dataLayer exists");
  console.log(`📊 ${window.dataLayer.length} events in dataLayer`);
  return true;
}

// Function to display all events in a nice format
function showAllEvents() {
  if (!checkDataLayer()) return;

  console.log("\n=== ALL DATALAYER EVENTS ===");
  window.dataLayer.forEach((event, index) => {
    if (event.event) {
      console.log(`\n[${index}] Event: ${event.event}`);
      console.log(event);
    }
  });
}

// Function to filter events by type
function filterEvents(eventName) {
  if (!checkDataLayer()) return;

  const filtered = window.dataLayer.filter((e) => e.event === eventName);
  console.log(
    `\n=== ${eventName.toUpperCase()} EVENTS (${filtered.length}) ===`
  );
  filtered.forEach((event, index) => {
    console.log(`\n[${index}]`, event);
  });
  return filtered;
}

// Function to show the latest event
function showLatestEvent() {
  if (!checkDataLayer()) return;

  const events = window.dataLayer.filter((e) => e.event);
  if (events.length === 0) {
    console.log("No events found");
    return;
  }

  const latest = events[events.length - 1];
  console.log("\n=== LATEST EVENT ===");
  console.log(`Event: ${latest.event}`);
  console.log(latest);
  return latest;
}

// Validation function for event structure
function validateEvent(event, eventType) {
  const validations = {
    view_item: {
      required: [
        "event",
        "ecommerce.currency",
        "ecommerce.value",
        "ecommerce.items",
      ],
      itemFields: ["item_id", "item_name", "price", "quantity"],
    },
    add_to_cart: {
      required: [
        "event",
        "ecommerce.currency",
        "ecommerce.value",
        "ecommerce.items",
      ],
      itemFields: ["item_id", "item_name", "price", "quantity"],
    },
    begin_checkout: {
      required: [
        "event",
        "ecommerce.currency",
        "ecommerce.value",
        "ecommerce.items",
        "ecommerce.coupon",
      ],
      itemFields: ["item_id", "item_name", "price", "quantity"],
    },
    checkout: {
      required: [
        "event",
        "ecommerce.currency",
        "ecommerce.value",
        "ecommerce.shipping_tier",
        "ecommerce.coupon",
        "ecommerce.items",
      ],
      itemFields: ["item_id", "item_name", "price", "quantity"],
    },
    purchase: {
      required: [
        "event",
        "ecommerce.transaction_id",
        "ecommerce.currency",
        "ecommerce.value",
        "ecommerce.tax",
        "ecommerce.shipping",
        "ecommerce.items",
      ],
      itemFields: ["item_id", "item_name", "price", "quantity"],
    },
  };

  const config = validations[eventType];
  if (!config) {
    console.warn(`No validation config for event type: ${eventType}`);
    return false;
  }

  let isValid = true;

  // Check required fields
  config.required.forEach((field) => {
    const keys = field.split(".");
    let value = event;

    for (const key of keys) {
      value = value?.[key];
    }

    if (value === undefined || value === null) {
      console.error(`❌ Missing required field: ${field}`);
      isValid = false;
    } else {
      console.log(
        `✅ ${field}: ${typeof value === "object" ? "present" : value}`
      );
    }
  });

  // Check item fields
  if (event.ecommerce?.items?.length > 0) {
    console.log(`\n📦 Validating ${event.ecommerce.items.length} item(s):`);
    event.ecommerce.items.forEach((item, idx) => {
      console.log(`\nItem ${idx + 1}:`);
      config.itemFields.forEach((field) => {
        if (item[field] === undefined || item[field] === null) {
          console.error(`  ❌ Missing ${field}`);
          isValid = false;
        } else {
          console.log(`  ✅ ${field}: ${item[field]}`);
        }
      });
    });
  }

  // Check that values are strings
  console.log("\n🔤 Checking value types (should be strings):");
  if (event.ecommerce?.value) {
    const valueType = typeof event.ecommerce.value;
    console.log(
      `  value: ${valueType} ${valueType === "string" ? "✅" : "❌"}`
    );
  }
  if (event.ecommerce?.items?.[0]?.price) {
    const priceType = typeof event.ecommerce.items[0].price;
    console.log(
      `  item price: ${priceType} ${priceType === "string" ? "✅" : "❌"}`
    );
  }
  if (event.ecommerce?.items?.[0]?.quantity) {
    const qtyType = typeof event.ecommerce.items[0].quantity;
    console.log(
      `  item quantity: ${qtyType} ${qtyType === "string" ? "✅" : "❌"}`
    );
  }

  return isValid;
}

// ===== TESTING GUIDE =====
console.log(`
╔════════════════════════════════════════════════════════╗
║       GTM DATALAYER EVENT TESTING GUIDE               ║
╚════════════════════════════════════════════════════════╝

Available functions:
  
  checkDataLayer()        - Verify dataLayer exists
  showAllEvents()         - Display all events
  showLatestEvent()       - Show the most recent event
  filterEvents('name')    - Filter by event name
  validateEvent(event, 'type') - Validate event structure

Usage examples:

  // 1. Check if GTM is working
  checkDataLayer()
  
  // 2. View all events
  showAllEvents()
  
  // 3. View latest event (after performing an action)
  showLatestEvent()
  
  // 4. View specific event type
  filterEvents('add_to_cart')
  filterEvents('purchase')
  
  // 5. Validate the latest event
  const latest = showLatestEvent()
  validateEvent(latest, 'add_to_cart')

=== MANUAL TESTING STEPS ===

1. VIEW_ITEM:
   - Navigate to any product detail page
   - Run: filterEvents('view_item')
   - Verify product data is correct

2. ADD_TO_CART:
   - Click "Add to Cart" on any product
   - Run: showLatestEvent()
   - Verify quantity and price

3. REMOVE_FROM_CART:
   - Remove item from cart
   - Run: filterEvents('remove_from_cart')

4. VIEW_CART:
   - Go to cart page with items
   - Run: filterEvents('view_cart')

5. BEGIN_CHECKOUT:
   - Click "Proceed to Checkout"
   - Run: filterEvents('begin_checkout')
   - Verify coupon code if applied

6. CHECKOUT:
   - Select payment method (COD or Online)
   - Run: filterEvents('checkout')
   - Verify shipping_tier is present

7. PURCHASE:
   - Complete an order
   - Run: filterEvents('purchase')
   - Verify transaction_id, tax, shipping

=== VALIDATION CHECKLIST ===

For each event, verify:
  ✓ Event name is correct
  ✓ All required fields present
  ✓ Values are strings (not numbers)
  ✓ Items array populated
  ✓ Item data complete
  ✓ Currency is "INR"
  ✓ Empty fields are "" not null

=== QUICK TEST ===

Run this after page load:
  checkDataLayer()
  showAllEvents()
  
Then perform actions and run:
  showLatestEvent()

Good luck! 🚀
`);

// Auto-run basic check
checkDataLayer();
