# Glitch Enterprises - Business Management & Donation Platform

## Current State

Fresh Caffeine project with standard boilerplate:
- Basic React + TypeScript setup with Internet Identity authentication
- shadcn/ui component library installed
- No App.tsx or business logic yet
- No backend implementation

## Requested Changes (Diff)

### Add

**Backend:**
- Product management system with CRUD operations (create, read, update, delete products)
- Product model with fields: id, name, description, price, imageUrl, createdAt
- Donation system integrated with Stripe for payment processing
- Authorization system with two roles:
  - Admin role: can add/edit/remove products, view all donations
  - Customer role: can browse products and make donations
- Blob storage for product images

**Frontend:**
- App.tsx with routing and role-based navigation
- Admin dashboard with product management interface:
  - Product list view with edit/delete actions
  - Add product form with image upload
  - Edit product form with image replacement
  - Donations received list/summary
- Customer storefront:
  - Product catalog display with images and details
  - Donation page with Stripe payment integration
  - Custom donation amount input
- Login/logout functionality with Internet Identity
- Responsive design with Glitch Enterprises branding

### Modify

- None (new project)

### Remove

- None (new project)

## Implementation Plan

1. **Select Caffeine Components:**
   - authorization (role-based access control)
   - stripe (donation payments)
   - blob-storage (product images)

2. **Generate Backend (Motoko):**
   - Product management: create, list, update, delete products with persistence
   - Donation tracking: record donations with amounts, timestamps, and donor info
   - Authorization: admin and customer roles, role assignment and verification
   - Image storage integration for product photos

3. **Build Frontend:**
   - Create App.tsx with routing (admin/customer/public views)
   - Admin pages: product management dashboard, add/edit product forms with image upload
   - Customer pages: product catalog display, donation form with Stripe checkout
   - Authentication flow with Internet Identity
   - Role-based UI rendering
   - Glitch Enterprises branding and professional styling

4. **Validate:**
   - TypeScript compilation
   - Lint checks
   - Build verification

## UX Notes

- **Admin Experience:** Simple dashboard to manage products efficiently with inline editing and quick delete actions
- **Customer Experience:** Clean storefront showcasing products with prominent donation call-to-action
- **Branding:** Use "Glitch Enterprises" as the business name throughout the interface
- **Donations:** Clear donation flow with preset amounts and custom input option
- **Images:** Product images enhance the catalog presentation and professionalism
- **Access Control:** Automatic role detection ensures admins see management tools while customers see the storefront
