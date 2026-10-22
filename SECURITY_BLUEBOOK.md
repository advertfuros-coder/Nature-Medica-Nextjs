# Bluebook: Nature Medica Enterprise Security Hardening & Threat Mitigation

> **Authoritative Specification:** E-Commerce Architecture, Payment/Order Integrity, Access Boundaries (IDOR/BOLA), and Defense-in-Depth.

---

## 1. Executive Security Benchmark (Competitor Comparison)

| Defense Layer | Industry Leader (Kama / Nykaa / Minimalist) | Nature Medica (Before Audit) | Nature Medica (Hardened State) |
|---|---|---|---|
| **Brute Force Protection** | IP Sliding Window + Exponential Backoff | ❌ None (Unlimited attempts) | ✅ **5 attempts / 15m (Login), 5 / 10m (OTP)** |
| **HTTP Security Headers** | HSTS (max-age=63072000), CSP, X-Frame-Options | ❌ Default Next.js headers | ✅ **HSTS, nosniff, SAMEORIGIN, Strict-Origin, Permissions-Policy** |
| **Cart Price Tampering** | Server-calculated line totals; zero client pricing trusted | ⚠️ Client sends `finalPrice` | ✅ **Server DB price validation & strict calculation** |
| **Object Access (IDOR)** | Scoped multi-tenant queries `(id, user_id)` | ⚠️ Invoices checked only `orderId` | ✅ **Scoped session ownership & verified auth on invoices** |
| **Session Hardening** | `httpOnly`, `secure`, `sameSite=lax`, 7-day JWT | ✅ `httpOnly`, `secure`, `sameSite=lax` | ✅ **Maintained & hardened with token rotation** |
| **Policy Visibility** | SSR / Static crawlable clauses | ⚠️ JS Accordion collapsed | ✅ **Crawler-accessible DOM rendering** |

---

## 2. Threat Vector Breakdown & Hardening Specifications

### Vector 1: Price Tampering & Business Logic Bypass (T05)
* **Threat:** Malicious client intercepts checkout POST request and alters `finalPrice: 1` or `price: 1` using proxy tools (Burp Suite, OWASP ZAP).
* **Remediation Specification:**
  - Route: [`src/app/api/orders/create/route.js`](file:///Users/harsh/Developer/Personal%20Projects/Nature-Medica-Nextjs/src/app/api/orders/create/route.js)
  - Backend must query the `Product` collection for every item in `items`, multiply `dbProduct.price * item.quantity`, calculate total server-side, apply verified server coupon rules, add delivery charges (₹0 if total >= ₹499 else ₹49), and reject order creation if client-provided `finalPrice` differs by > ₹1 from server-calculated total.

### Vector 2: Invoice & Order Data Exposure / IDOR (T03)
* **Threat:** Unauthenticated visitor downloads another user's invoice by guessing `NM000123` via `/api/orders/[orderId]/invoice`.
* **Remediation Specification:**
  - Route: [`src/app/api/orders/[orderId]/invoice/route.js`](file:///Users/harsh/Developer/Personal%20Projects/Nature-Medica-Nextjs/src/app/api/orders/%5BorderId%5D/invoice/route.js)
  - Verify that the requesting user's session matches `order.user` (or is an authorized admin). For guest orders, authenticate with an encrypted signature or order phone/email verification.

### Vector 3: Enterprise HTTP Transport & Browser Headers (T11)
* **Threat:** Clickjacking via invisible iframes, MIME-type confusion attacks, downgrade attacks.
* **Remediation Specification:**
  - File: [`next.config.mjs`](file:///Users/harsh/Developer/Personal%20Projects/Nature-Medica-Nextjs/next.config.mjs)
  - Inject global `headers()` returning:
    - `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
    - `X-Content-Type-Options: nosniff`
    - `X-Frame-Options: SAMEORIGIN`
    - `Referrer-Policy: strict-origin-when-cross-origin`
    - `Permissions-Policy: camera=(), microphone=(), geolocation=()`

---

## 3. Implementation Plan & Prioritized Execution Queue

1. **Step 1: Next.js Security Headers (`next.config.mjs`)**
   - Apply production enterprise headers across all routes `/:path*`.
2. **Step 2: Server-Side Price Verification (`/api/orders/create`)**
   - Recalculate true prices from DB for every item.
   - Guard against price tampering attacks.
3. **Step 3: Invoice Route Access Control (`/api/orders/[orderId]/invoice`)**
   - Check authenticated caller identity or admin role before returning customer invoice PDF.
