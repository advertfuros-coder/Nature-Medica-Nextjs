// Debug Ekart Credentials
require("dotenv").config({ path: ".env.local" });

console.log("🔍 Checking Ekart Configuration...\n");

console.log("Environment Variables:");
console.log("─────────────────────────");
console.log(
  "EKART_CLIENT_ID:",
  process.env.EKART_CLIENT_ID
    ? `${process.env.EKART_CLIENT_ID.substring(0, 10)}...`
    : "❌ NOT SET"
);
console.log("EKART_USERNAME:", process.env.EKART_USERNAME || "❌ NOT SET");
console.log(
  "EKART_PASSWORD:",
  process.env.EKART_PASSWORD
    ? "***" + process.env.EKART_PASSWORD.slice(-3)
    : "❌ NOT SET"
);

console.log("\n📋 Credential Status:");
console.log("─────────────────────────");

if (
  !process.env.EKART_CLIENT_ID ||
  process.env.EKART_CLIENT_ID === "YOUR_CLIENT_ID_HERE_FROM_DASHBOARD"
) {
  console.log("❌ CLIENT_ID not properly set");
  console.log("\n🔧 SOLUTION:");
  console.log("1. Login to: https://app.elite.ekartlogistics.in/");
  console.log("2. Email: naturemedica09@gmail.com");
  console.log("3. Password: Abid9721@@");
  console.log("4. Go to: Dashboard → Settings → API Settings");
  console.log('5. Look for "Client ID" or "API Key"');
  console.log("6. Copy it and update .env.local:");
  console.log("   EKART_CLIENT_ID=your_actual_client_id_here");
  console.log("\n⚠️  The CLIENT_ID is usually a long alphanumeric string");
  console.log("   Example format: abc123def456 or ABCD-1234-EFGH-5678");
} else if (!process.env.EKART_USERNAME) {
  console.log("❌ USERNAME not set");
} else if (!process.env.EKART_PASSWORD) {
  console.log("❌ PASSWORD not set");
} else {
  console.log("✅ All credentials are set");
  console.log("\n🔄 Testing authentication...");

  const axios = require("axios");

  (async () => {
    try {
      const response = await axios.post(
        `https://app.elite.ekartlogistics.in/integrations/v2/auth/token/${process.env.EKART_CLIENT_ID}`,
        {
          username: process.env.EKART_USERNAME,
          password: process.env.EKART_PASSWORD,
        }
      );

      console.log("\n✅ AUTHENTICATION SUCCESSFUL!");
      console.log("─────────────────────────────────");
      console.log(
        "Access Token:",
        response.data.access_token.substring(0, 20) + "..."
      );
      console.log("Token Type:", response.data.token_type);
      console.log("Expires In:", response.data.expires_in, "seconds");
      console.log("Scope:", response.data.scope);
      console.log("\n🎉 Ekart integration is working!");
      console.log("You can now ship orders via Ekart.");
    } catch (error) {
      console.log("\n❌ AUTHENTICATION FAILED!");
      console.log("─────────────────────────────────");

      if (error.response) {
        const errorData = error.response.data;
        console.log("Error Code:", errorData.code);
        console.log("Error Message:", errorData.message);
        console.log("Description:", errorData.description);

        if (errorData.message === "INVALID_CLIENT_ID") {
          console.log("\n🔧 PROBLEM: Invalid Client ID");
          console.log("\n💡 SOLUTIONS:");
          console.log("1. The CLIENT_ID you entered is incorrect");
          console.log("2. The CLIENT_ID might not belong to this account");
          console.log("\n📝 How to find correct CLIENT_ID:");
          console.log("   Step 1: Login to Ekart dashboard");
          console.log("   Step 2: Go to Settings or Profile");
          console.log(
            '   Step 3: Look for "API Credentials" or "API Settings"'
          );
          console.log(
            '   Step 4: Find "Client ID" (might be called "API Key")'
          );
          console.log("   Step 5: Copy EXACTLY as shown");
          console.log("\n   If you can't find it:");
          console.log("   - Contact Ekart support: support@ekartlogistics.in");
          console.log('   - Ask for: "API Client ID for my account"');
          console.log("   - Account: naturemedica09@gmail.com");
        } else if (errorData.message === "INVALID_CREDENTIALS") {
          console.log("\n🔧 PROBLEM: Username or Password is incorrect");
          console.log("   Current username:", process.env.EKART_USERNAME);
          console.log("   Please verify these are correct");
        }
      } else {
        console.log("Network Error:", error.message);
      }
    }
  })();
}
