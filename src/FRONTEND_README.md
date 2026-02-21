# Glitch Enterprises - Business Management & Donation Platform

A modern business management and donation platform built on the Internet Computer with React, TypeScript, and advanced authorization features.

## Features

### Admin Dashboard
- **Product Management**
  - Add, edit, and delete products
  - Upload product images via blob storage
  - Set product prices in USD (stored as cents)
  - View all products in a responsive grid

- **Donations Tracking**
  - View all donations with donor information
  - Track total donations and statistics
  - Average donation calculator
  - Formatted timestamps

- **Stripe Configuration**
  - Configure Stripe payment processing
  - Set allowed countries for payments
  - Secure secret key management

### Customer Storefront
- **Product Catalog**
  - Browse all available products
  - View product details, prices, and images
  - Responsive card-based layout

- **Donation System**
  - Preset donation amounts ($5, $10, $25, $50, $100)
  - Custom donation amount input
  - Stripe checkout integration
  - Anonymous donations supported (no login required)
  - Success/failure payment handling

### Authentication & Authorization
- **Internet Identity Integration**
  - Secure login/logout
  - Role-based access control (Admin/User/Guest)
  - User profile management
  - Profile setup on first login

## Design System

### Visual Direction
- **Industrial-tech aesthetic** with geometric precision
- **Sharp angles and bold contrasts** - brutalist meets digital commerce
- **Asymmetric layouts** with distinctive positioning

### Typography
- **Display/Headers**: Orbitron (geometric, futuristic)
- **Body**: Space Grotesk (contemporary geometric sans)
- **Numerics**: JetBrains Mono (monospace for prices/amounts)

### Color Palette
- **Primary**: Electric cyan (high chroma, tech-forward)
- **Accent**: Hot magenta (bold contrast)
- **Neutrals**: Cool grays with slight blue tint
- **Backgrounds**: Near-black (dark mode) / stark white (light mode)

### Signature Details
- Clip-corner product cards (geometric edge cutoff)
- Glitch hover effects on interactive elements
- Zero border radius (sharp, industrial feel)
- Glow shadows on primary interactive elements

## Tech Stack

### Frontend
- **React 19** with TypeScript
- **TanStack Router** for routing
- **TanStack React Query** for data fetching
- **shadcn/ui** component library
- **Tailwind CSS** with OKLCH color system
- **Lucide React** for icons

### Backend
- **Motoko** canisters on Internet Computer
- **Internet Identity** for authentication
- **Stripe** payment processing
- **Blob Storage** for image management

## Architecture

### Pages
- `/` - Storefront (customer view)
- `/donate` - Donation page
- `/admin` - Admin product management (protected)
- `/admin/donations` - Admin donations view (protected)
- `/payment-success` - Stripe success handler
- `/payment-failure` - Stripe cancel handler

### Key Components
- `Header` - Navigation with auth and theme toggle
- `Footer` - Branding and attribution
- `ProfileSetup` - First-login user profile modal
- `StripeSetup` - Admin Stripe configuration modal
- `ProductCard` - Reusable product display
- `ProductForm` - Add/edit product modal

### Hooks
- `useQueries.ts` - All React Query hooks for backend calls
- `useActor.ts` - Internet Computer actor hook (generated)
- `useInternetIdentity.ts` - Auth hook (generated)

### Backend Integration
All backend calls use React Query for caching and state management:
- Products: `useGetAllProducts`, `useCreateProduct`, `useUpdateProduct`, `useDeleteProduct`
- Donations: `useGetAllDonations`, `useRecordDonation`
- Auth: `useIsCallerAdmin`, `useGetCallerUserRole`
- Profile: `useGetCallerUserProfile`, `useSaveCallerUserProfile`
- Stripe: `useIsStripeConfigured`, `useSetStripeConfiguration`, `useCreateCheckoutSession`

## Development

### Build Commands
```bash
# Install dependencies
pnpm install

# Type check
pnpm --filter '@caffeine/template-frontend' typescript-check

# Lint
pnpm --filter '@caffeine/template-frontend' lint

# Build
pnpm --filter '@caffeine/template-frontend' build:skip-bindings
```

## Design Tokens

Custom OKLCH color tokens are defined in `index.css` with full light/dark mode support. All colors use raw L C H values for precise color control and AA+ contrast compliance.

Typography tokens in `tailwind.config.js` map to Google Fonts CDN imports.

## Future Enhancements
- Product categories and filtering
- Shopping cart functionality
- Order history for customers
- Export donations to CSV
- Email notifications for donations
- Product inventory management

---

© 2026. Built with ❤️ using [caffeine.ai](https://caffeine.ai)
