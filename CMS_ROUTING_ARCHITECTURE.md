# 🗺️ Lawfinity CMS - Complete Routing Architecture & Developer Guide

## 📋 Table of Contents

1. [System Architecture Overview](#system-architecture-overview)
2. [Current Project Structure](#current-project-structure)
3. [URL Structure](#url-structure)
4. [API Routes Reference](#api-routes-reference)
5. [Data Flow](#data-flow)
6. [Implementation Guide](#implementation-guide)
7. [Developer Checklist](#developer-checklist)

---

## 🏗️ System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    INTERNAL.LAWFINITY.IN                         │
│                    (CMS Admin Panel)                             │
│            SEO Team manages all content here                     │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ API Calls (CRUD Operations)
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                   BACKEND API SERVER                             │
│              (Can be part of internal.lawfinity.in)              │
│                   MongoDB Database                               │
│              DigitalOcean Spaces (Images)                        │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ API Fetch / ISR Revalidation
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    WWW.LAWFINITY.IN                              │
│                  (Public Website - Next.js)                      │
│          Dynamically fetches content from API                    │
│               UI is fixed, content is dynamic                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 Current Project Structure

### Your Current www.lawfinity.in Structure:

```
src/
├── app/
│   ├── services/[slug]/           ← Service pages (dynamic)
│   ├── lp/[slug]/                 ← Landing pages
│   ├── sectors/[slug]/            ← Sector pages
│   └── api/                       ← 28 existing API routes
│
├── data/                          ← CURRENT CONTENT (JSON)
│   ├── landing-pages/             ← 12 JSON files
│   ├── services/                  ← 123 JSON files
│   ├── sector/                    ← 8 JSON files
│   └── pricing.json
│
├── components/                    ← Reusable UI components
├── models/                        ← Database models (exists)
├── controllers/                   ← Business logic (exists)
└── utils/                         ← Helper functions
```

### Migration Strategy:

✅ Keep JSON files as **backup/fallback**  
✅ Move content to **MongoDB**  
✅ Update pages to fetch from **API** instead of JSON  
✅ SEO team manages via **CMS panel**  
✅ Website **automatically updates**

---

## 🌐 Complete URL Structure

### 1. CMS Admin Panel URLs

**Base:** `https://internal.lawfinity.in`

#### A. Authentication

| URL                | Purpose         | Access        |
| ------------------ | --------------- | ------------- |
| `/login`           | Login page      | Public        |
| `/logout`          | Logout endpoint | Authenticated |
| `/forgot-password` | Password reset  | Public        |

#### B. Dashboard

| URL              | Purpose        | Access        | Description                    |
| ---------------- | -------------- | ------------- | ------------------------------ |
| `/cms`           | Main dashboard | Admin, Editor | Overview stats, recent changes |
| `/cms/dashboard` | Analytics      | Admin, Editor | Page views, content statistics |

#### C. Pages Management

| URL                        | Purpose         | Access        | Description             |
| -------------------------- | --------------- | ------------- | ----------------------- |
| `/cms/pages`               | List all pages  | All           | View all pages in table |
| `/cms/pages?type=landing`  | Landing pages   | All           | Filter landing pages    |
| `/cms/pages?type=service`  | Service pages   | All           | Filter service pages    |
| `/cms/pages?status=draft`  | Draft pages     | All           | Filter by status        |
| `/cms/pages/create`        | Create page     | Admin, Editor | New page form           |
| `/cms/pages/:id/edit`      | Edit page       | Admin, Editor | Full editor             |
| `/cms/pages/:id/preview`   | Preview         | All           | See before publish      |
| `/cms/pages/:id/versions`  | Version history | All           | Past versions           |
| `/cms/pages/:id/duplicate` | Clone page      | Admin, Editor | Create copy             |

#### D. Media Library

| URL                             | Purpose       | Access        | Description     |
| ------------------------------- | ------------- | ------------- | --------------- |
| `/cms/media`                    | Media library | All           | Browse images   |
| `/cms/media?folder=hero-images` | Filter folder | All           | Specific folder |
| `/cms/media/upload`             | Upload        | Admin, Editor | Bulk upload     |
| `/cms/media/:id`                | Image details | All           | Edit metadata   |

#### E. Blog Management

| URL                      | Purpose    | Access        | Description        |
| ------------------------ | ---------- | ------------- | ------------------ |
| `/cms/blogs`             | List blogs | All           | All blog posts     |
| `/cms/blogs/create`      | New blog   | Admin, Editor | Rich text editor   |
| `/cms/blogs/:id/edit`    | Edit blog  | Admin, Editor | Update content     |
| `/cms/blogs/:id/preview` | Preview    | All           | See before publish |

#### F. FAQ Management

| URL                              | Purpose      | Access        | Description       |
| -------------------------------- | ------------ | ------------- | ----------------- |
| `/cms/faqs`                      | List FAQs    | All           | All FAQs          |
| `/cms/faqs/create`               | New FAQ      | Admin, Editor | Add FAQ           |
| `/cms/faqs/:id/edit`             | Edit FAQ     | Admin, Editor | Update FAQ        |
| `/cms/faqs?service=drug-licence` | Service FAQs | All           | Filter by service |

#### G. Static Pages Management
| URL | Purpose | Access | Description |
|-----|---------|--------|-------------|
| `/cms/static-pages` | List static pages | All | Homepage, About, Contact, etc. |
| `/cms/static-pages/home` | Edit Homepage | Admin, Editor | Hero, features, testimonials |
| `/cms/static-pages/about` | Edit About Us | Admin, Editor | Company info, team, mission |
| `/cms/static-pages/contact` | Edit Contact | Admin, Editor | Address, phone, email, map |
| `/cms/static-pages/privacy` | Edit Privacy | Admin, Editor | Privacy policy content |
| `/cms/static-pages/terms` | Edit Terms | Admin, Editor | Terms & conditions |
| `/cms/static-pages/refund` | Edit Refund | Admin, Editor | Refund policy |
| `/cms/static-pages/disclaimer` | Edit Disclaimer | Admin, Editor | Disclaimer text |
| `/cms/static-pages/career` | Edit Career | Admin, Editor | Job listings, apply form |
| `/cms/static-pages/sectors` | Edit All Sectors | Admin, Editor | Sectors listing page |

#### H. Settings

| URL                   | Purpose      | Access | Description      |
| --------------------- | ------------ | ------ | ---------------- |
| `/cms/settings`       | Settings     | Admin  | System config    |
| `/cms/settings/users` | User mgmt    | Admin  | Add/remove users |
| `/cms/audit-logs`     | Activity log | Admin  | Who changed what |

---

### 2. Public Website URLs

**Base:** `https://www.lawfinity.in`

#### Dynamic Pages (Already Covered)

| URL Pattern       | Purpose       | Data Source                    | Example                               |
| ----------------- | ------------- | ------------------------------ | ------------------------------------- |
| `/`               | Homepage      | **API → /api/cms/pages/home**  | `https://www.lawfinity.in`            |
| `/services`       | Services list | API                            | `/services`                           |
| `/services/:slug` | Service page  | **API → /api/cms/pages/:slug** | `/services/drug-licence-registration` |
| `/lp/:slug`       | Landing page  | **API → /api/cms/pages/:slug** | `/lp/company-registration`            |
| `/sectors/:slug`  | Sector page   | **API → /api/cms/pages/:slug** | `/sectors/pharmaceutical-industry`    |
| `/blogs`          | Blog list     | API                            | `/blogs`                              |
| `/blogs/:slug`    | Blog post     | **API → /api/cms/blogs/:slug** | `/blogs/how-to-register`              |

#### Static/Content Pages (CMS Managed)

| URL                               | Purpose          | Data Source                                   | CMS Type    |
| --------------------------------- | ---------------- | --------------------------------------------- | ----------- |
| `/aboutus`                        | About Us page    | **API → /api/cms/pages/aboutus**              | Static Page |
| `/contact`                        | Contact page     | **API → /api/cms/pages/contact**              | Static Page |
| `/privacy-policy`                 | Privacy Policy   | **API → /api/cms/pages/privacy-policy**       | Legal Page  |
| `/terms-and-conditions`           | Terms            | **API → /api/cms/pages/terms-and-conditions** | Legal Page  |
| `/refund-and-cancellation-policy` | Refund Policy    | **API → /api/cms/pages/refund-policy**        | Legal Page  |
| `/disclaimer`                     | Disclaimer       | **API → /api/cms/pages/disclaimer**           | Legal Page  |
| `/career`                         | Career page      | **API → /api/cms/pages/career**               | Static Page |
| `/all-sectors`                    | All sectors list | **API → /api/cms/pages/all-sectors**          | Static Page |
| `/payments` or `/pay-now`         | Payment page     | Partial CMS (text only)                       | Static Page |

**Note:** HCM (Human Capital Management) would likely be a separate module, but content can be managed if needed.

---

## 🔌 API Routes Reference

### Base URL Options:

- `https://internal.lawfinity.in/api` (Recommended)
- `https://api.lawfinity.in` (Separate server)

### A. Authentication API

| Method | Endpoint           | Purpose      | Body                  | Response          |
| ------ | ------------------ | ------------ | --------------------- | ----------------- |
| POST   | `/api/auth/login`  | Login        | `{ email, password }` | `{ token, user }` |
| POST   | `/api/auth/logout` | Logout       | -                     | `{ success }`     |
| GET    | `/api/auth/me`     | Current user | -                     | `{ user }`        |

### B. Pages API

| Method | Endpoint                                   | Purpose     | Permissions   |
| ------ | ------------------------------------------ | ----------- | ------------- |
| GET    | `/api/cms/pages`                           | List pages  | All           |
| GET    | `/api/cms/pages/:slug`                     | Get by slug | All           |
| POST   | `/api/cms/pages`                           | Create      | Admin, Editor |
| PUT    | `/api/cms/pages/:id`                       | Update      | Admin, Editor |
| DELETE | `/api/cms/pages/:id`                       | Delete      | Admin         |
| POST   | `/api/cms/pages/:id/publish`               | Publish     | Admin, Editor |
| POST   | `/api/cms/pages/:id/unpublish`             | Unpublish   | Admin, Editor |
| GET    | `/api/cms/pages/:id/versions`              | Versions    | All           |
| POST   | `/api/cms/pages/:id/versions/:ver/restore` | Restore     | Admin, Editor |
| POST   | `/api/cms/pages/:id/duplicate`             | Duplicate   | Admin, Editor |
| POST   | `/api/cms/pages/bulk`                      | Bulk ops    | Admin         |

**Query Parameters:**

```
GET /api/cms/pages?type=landing&status=published&page=1&limit=20&search=company&sortBy=updatedAt&sortOrder=desc
```

### C. Media API

| Method | Endpoint                     | Purpose         | Permissions   |
| ------ | ---------------------------- | --------------- | ------------- |
| GET    | `/api/cms/media`             | List media      | All           |
| POST   | `/api/cms/media/upload`      | Upload          | Admin, Editor |
| PUT    | `/api/cms/media/:id`         | Update metadata | Admin, Editor |
| DELETE | `/api/cms/media/:id`         | Delete          | Admin         |
| POST   | `/api/cms/media/bulk-delete` | Bulk delete     | Admin         |
| GET    | `/api/cms/media/folders`     | List folders    | All           |
| GET    | `/api/cms/media/:id/usage`   | Check usage     | All           |

**Query Parameters:**

```
GET /api/cms/media?folder=hero-images&fileType=image/jpeg&tags=homepage&page=1&limit=50
```

### D. Blog API

| Method | Endpoint                     | Purpose     | Permissions   |
| ------ | ---------------------------- | ----------- | ------------- |
| GET    | `/api/cms/blogs`             | List blogs  | All           |
| GET    | `/api/cms/blogs/:slug`       | Get by slug | All           |
| POST   | `/api/cms/blogs`             | Create      | Admin, Editor |
| PUT    | `/api/cms/blogs/:id`         | Update      | Admin, Editor |
| DELETE | `/api/cms/blogs/:id`         | Delete      | Admin         |
| POST   | `/api/cms/blogs/:id/publish` | Publish     | Admin, Editor |
| GET    | `/api/cms/blogs/categories`  | Categories  | All           |

### E. FAQ API

| Method | Endpoint                         | Purpose    | Permissions   |
| ------ | -------------------------------- | ---------- | ------------- |
| GET    | `/api/cms/faqs`                  | List FAQs  | All           |
| GET    | `/api/cms/faqs/by-service/:slug` | By service | All           |
| POST   | `/api/cms/faqs`                  | Create     | Admin, Editor |
| PUT    | `/api/cms/faqs/:id`              | Update     | Admin, Editor |
| DELETE | `/api/cms/faqs/:id`              | Delete     | Admin         |
| PUT    | `/api/cms/faqs/reorder`          | Reorder    | Admin, Editor |

### F. Static Pages API

| Method | Endpoint | Purpose | Permissions |
|--------|----------|---------|-------------|
| GET | `/api/cms/static-pages` | List all static pages | All |
| GET | `/api/cms/static-pages/:pageKey` | Get specific page | All |
| PUT | `/api/cms/static-pages/:pageKey` | Update page | Admin, Editor |
| POST | `/api/cms/static-pages/:pageKey/publish` | Publish | Admin, Editor |

**Available Page Keys:**
- `home` - Homepage content
- `about` - About Us page
- `contact` - Contact page
- `privacy-policy` - Privacy Policy
- `terms-and-conditions` - Terms & Conditions
- `refund-and-cancellation` - Refund Policy
- `disclaimer` - Disclaimer
- `career` - Career page
- `all-sectors` - All Sectors listing

**Example Response for Home Page:**
```json
{
  "pageKey": "home",
  "title": "Lawfinity - Legal Compliance Solutions",
  "sections": {
    "hero": {
      "headline": "Your Trusted Partner...",
      "subtext": "Expert guidance...",
      "cta": "Get Started",
      "backgroundImage": "https://cdn.../hero.jpg"
    },
    "features": [
      { "icon": "...", "title": "...", "description": "..." }
    ],
    "testimonials": [...],
    "stats": { "clients": 5000, "services": 200, ... }
  },
  "meta": {
    "title": "...",
    "description": "...",
    "keywords": [...]
  }
}
```

### G. Revalidation API

| Method | Endpoint          | Purpose         | Body                     |
| ------ | ----------------- | --------------- | ------------------------ |
| POST   | `/api/revalidate` | Trigger rebuild | `{ secret, slug, type }` |

---

## 🔄 Data Flow: CMS to Website

### Complete Flow When SEO Updates Content:

```
STEP 1: Edit in CMS
└─ URL: https://internal.lawfinity.in/cms/pages/12345/edit
   └─ Update content, upload images
   └─ Click "Save Draft"
      └─ API: PUT /api/cms/pages/12345
         ├─ Save to MongoDB
         ├─ Create version snapshot
         └─ Log audit trail

STEP 2: Publish
└─ Click "Publish" button
   └─ API: POST /api/cms/pages/12345/publish
      ├─ status = "published"
      ├─ publishedAt = now
      └─ Trigger webhook
         └─ POST /api/revalidate
            └─ { slug: "drug-licence", type: "service" }

STEP 3: Next.js Rebuilds
└─ www.lawfinity.in/api/revalidate
   └─ Validate secret
   └─ revalidatePath('/services/drug-licence')
      └─ Fetch fresh data from API
      └─ Generate new HTML

STEP 4: Live Update
└─ User visits: www.lawfinity.in/services/drug-licence
   └─ Shows updated content ✅
```

---

## 🛠️ Implementation Guide

### Phase 1: Backend Setup (internal.lawfinity.in)

**Developer Creates:**

1. **MongoDB Models:**
   - **Page** (landing + services + sectors)
   - **StaticPage** (home, about, contact, legal pages)
   - **PageVersion** (version history)
   - **Media** (images)
   - **Blog**
   - **FAQ**
   - **AuditLog**

2. **Static Page Model Structure:**
```javascript
{
  pageKey: "home" | "about" | "contact" | "privacy-policy" | etc.,
  title: "Homepage",
  status: "draft" | "published",
  sections: {
    // Flexible JSON structure per page type
    // Homepage example:
    hero: { headline, subtext, cta, backgroundImage },
    features: [{ icon, title, description }],
    testimonials: [...],
    stats: { clients, services, satisfaction }
    
    // About page example:
    mission: { title, content },
    team: [{ name, role, image, bio }],
    values: [{ icon, title, description }]
    
    // Contact page example:
    address: { street, city, state, zip, country },
    phones: [{ label, number }],
    emails: [{ label, email }],
    map: { lat, lng, embedUrl },
    hours: { weekdays, weekends }
    
    // Legal pages (Privacy, Terms, etc.):
    content: "Rich HTML content",
    lastUpdated: Date,
    sections: [{ heading, content }]
  },
  meta: {
    title: "SEO title",
    description: "SEO description",
    keywords: [...]
  },
  updatedBy: ObjectId,
  publishedBy: ObjectId,
  publishedAt: Date,
  version: Number
}
```

3. **API Routes:** All endpoints listed above (including static pages)

4. **DigitalOcean Spaces:**
   - Create bucket: `lawfinity-media`
   - Enable CDN
   - Configure CORS

5. **Environment Variables:**

```env
MONGODB_URI=mongodb+srv://...
DO_SPACES_ENDPOINT=sgp1.digitaloceanspaces.com
DO_SPACES_BUCKET=lawfinity-media
DO_SPACES_ACCESS_KEY=...
DO_SPACES_SECRET_KEY=...
DO_SPACES_CDN_URL=https://lawfinity-media.sgp1.cdn.digitaloceanspaces.com
JWT_SECRET=...
REVALIDATION_SECRET=...
```

### Phase 2: CMS Frontend (internal.lawfinity.in)

**Developer Creates Pages:**

1. `/login` - JWT authentication
2. `/cms` - Dashboard with stats
3. `/cms/pages` - Table with filters
4. `/cms/pages/create` - Multi-section form
5. `/cms/pages/:id/edit` - Same form, pre-filled
6. `/cms/media` - Grid view with upload
7. `/cms/blogs/create` - Rich text editor
8. `/cms/faqs` - List with inline edit

### Phase 3: Content Migration

**Developer Creates Script:**

```javascript
// Migration script logic
1. Read all JSON files from:
   - src/data/landing-pages/*.json (12 files)
   - src/data/services/*.json (123 files)
   - src/data/sector/*.json (8 files)

2. For each file:
   - Parse JSON
   - Create MongoDB document
   - Set type based on folder
   - Set status = "published"
   - Import to database

3. Keep JSON as backup

4. Verify: 12 + 123 + 8 = 143 pages
```

### Phase 4: Update www.lawfinity.in

**Files to Create/Modify:**

```
src/
├── lib/
│   └── cms-api.js                    ← NEW: API fetch functions
│
└── app/
    ├── services/[slug]/
    │   └── page.jsx                  ← MODIFY: Fetch from API
    │
    ├── lp/[slug]/
    │   └── page.jsx                  ← MODIFY: Fetch from API
    │
    ├── sectors/[slug]/
    │   └── page.jsx                  ← MODIFY: Fetch from API
    │
    └── api/
        └── revalidate/
            └── route.js              ← NEW: Webhook handler
```

**Example Changes in page.jsx:**

```javascript
// OLD: Import from JSON
import data from "@/data/services/drug-licence.json";

// NEW: Fetch from API
async function getPageData(slug) {
  const res = await fetch(
    `https://internal.lawfinity.in/api/cms/pages/${slug}?type=service&status=published`,
    { next: { revalidate: 3600 } } // ISR: 1 hour
  );
  if (!res.ok) return null;
  return res.json();
}
```

### Phase 5: Connect Systems

**Webhook Integration:**

1. **In CMS publish function:**

   - After saving to DB
   - Send POST to: `https://www.lawfinity.in/api/revalidate`
   - Body: `{ secret: "...", slug: "...", type: "service" }`

2. **In www.lawfinity.in/api/revalidate:**
   - Validate secret
   - Call `revalidatePath()`
   - Return success

---

## ✅ Developer Checklist

### Backend

- [ ] MongoDB connected
- [ ] All 6 models created
- [ ] All API routes working (pages, media, blogs, faqs, auth)
- [ ] JWT authentication
- [ ] RBAC (admin/editor roles)
- [ ] DigitalOcean Spaces configured
- [ ] Image upload + optimization
- [ ] Audit logging

### CMS Panel

- [ ] Login functional
- [ ] Dashboard shows stats
- [ ] Pages list with filters
- [ ] Page editor (all sections)
- [ ] Media library upload
- [ ] Image optimization
- [ ] Blog rich text editor
- [ ] FAQ manager
- [ ] Publish triggers webhook

### Public Website

- [ ] Services fetch from API
- [ ] Landing pages fetch from API
- [ ] Sectors fetch from API
- [ ] ISR enabled (revalidate: 3600)
- [ ] Revalidation webhook works
- [ ] 404 for missing pages
- [ ] SEO meta from API
- [ ] Images from CDN

### Content Migration

- [ ] 12 landing pages imported
- [ ] 123 service pages imported
- [ ] 8 sector pages imported
- [ ] JSON backup kept
- [ ] Count verified (143 total)

### Testing

- [ ] Edit → Save → Shows in CMS
- [ ] Publish → Shows on website
- [ ] Upload image → In library
- [ ] Delete unused → Removed
- [ ] Delete used → Blocked
- [ ] Version restore → Works
- [ ] Duplicate page → Creates copy
- [ ] Bulk publish → Multiple pages
- [ ] Editor permissions → Correct

---

## 📝 SEO Team Usage Guide

### What SEO Team Will Do:

1. **Login:** `https://internal.lawfinity.in/login`

2. **Manage Dynamic Pages:**
   - Navigate to `/cms/pages`
   - Edit service pages, landing pages, sector pages
   
3. **Manage Static Pages:**
   - Navigate to `/cms/static-pages`
   - Edit Homepage, About, Contact, Privacy Policy, etc.

4. **Update Content:**
   - Change titles, descriptions
   - Add/remove benefits, steps
   - Update pricing
   - Edit FAQs
   - Upload images
   - Change meta tags
   - Update legal policies
   - Modify contact information
   - Add team members (About page)
   - Update career listings

5. **Save:** Click "Save Draft"
6. **Preview:** See how it looks
7. **Publish:** Goes live instantly!

### What They CAN Control:

#### Dynamic Pages (Services, Landing Pages, Sectors):
✅ All text content  
✅ All images  
✅ SEO meta tags  
✅ Benefits, steps, FAQs  
✅ Pricing  
✅ Create new pages  
✅ Connected services

#### Static Pages:
✅ **Homepage:**
  - Hero section (headline, subtext, CTA, background)
  - Features section
  - Testimonials
  - Statistics (clients count, services count, etc.)
  
✅ **About Us:**
  - Company mission/vision
  - Team members (photos, names, roles, bios)
  - Company values
  - History/timeline
  
✅ **Contact:**
  - Office address
  - Phone numbers
  - Email addresses
  - Business hours
  - Map location
  
✅ **Legal Pages:**
  - Privacy Policy full text
  - Terms & Conditions
  - Refund & Cancellation Policy
  - Disclaimer
  
✅ **Career:**
  - Job listings
  - Company culture content
  - Benefits of working
  - Application instructions
  
✅ **All Sectors:**
  - Sector descriptions
  - Icons/images
  - Call-to-action text

#### Blogs:
✅ Create/edit blog posts  
✅ Add featured images  
✅ Categorize and tag  
✅ Schedule publishing

### What They CANNOT Control:
❌ Page design/layout  
❌ UI components  
❌ Colors/fonts  
❌ Navigation menu  
❌ Form functionality  
❌ Payment integration

---

## 🎯 Key Benefits

1. **Separation of Concerns:**

   - Developers: Control UI/design
   - SEO Team: Control content

2. **Instant Updates:**

   - Publish → Live in seconds
   - No developer needed

3. **Version Control:**

   - Track all changes
   - Rollback anytime

4. **Permission System:**

   - Admin: Full access
   - Editor: Create/edit content
   - Viewer: Read-only

5. **Scalability:**
   - 143+ pages currently
   - Can handle thousands

---

## 📞 Support

For technical questions:

- Architecture: Reference this document
- API Reference: See API Routes section
- Implementation: See Implementation Guide

---

**Last Updated:** December 2025  
**Version:** 1.0  
**Status:** Ready for Implementation
