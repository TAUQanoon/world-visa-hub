# GlobalVisa Consultancy Platform

## Overview
A comprehensive visa consultation and case management platform for students seeking to study abroad, particularly in China and Saudi Arabia. The application provides role-based portals for clients, staff, and administrators with integrated document management, messaging, and payments tracking.

## Project Status
**Last Updated:** November 6, 2025
**Current State:** Successfully migrated from Lovable.dev/Vercel to Replit
**Environment:** Development

## Technology Stack
- **Frontend:** React 18.3.1 + TypeScript
- **Build Tool:** Vite 5.4.11
- **Styling:** Tailwind CSS 3.4.18
- **UI Components:** Radix UI, shadcn/ui
- **Visual Page Builder:** Plasmic (@plasmicapp/loader-react)
- **Backend/Auth:** Supabase (PostgreSQL + Authentication)
- **Package Manager:** npm (previously attempted with Bun, but switched due to sucrase compatibility issues)

## Recent Changes

### November 6, 2025 - Plasmic Integration & Component Registration
**Changes Made:**
- Installed and configured Plasmic visual page builder (@plasmicapp/loader-react)
- Created `src/components/plasmic-components/` directory with reusable, functional components
- Registered 20+ components with Plasmic for drag-and-drop page building:
  - **Functional Action Components:** SignInButton, SignUpButton, GetStartedButton, LogoutButton
  - **Auth Components:** UserAvatar, ProtectedContent, NavigationLink
  - **UI Components:** Button, Card (+ sub-components), Input, Badge, Alert (+ sub-components), Separator
- Updated `src/lib/plasmic.ts` with full component registration including prop configurations
- Environment variables configured with VITE_ prefix for client-side access:
  - VITE_PLASMIC_PROJECT_ID
  - VITE_PLASMIC_API_TOKEN

**How It Works:**
- Team members can create/edit pages visually at https://studio.plasmic.app
- Pages automatically sync and appear at `/content/[page-name]` routes
- No code deployment needed - changes from Plasmic Studio sync automatically
- Registered components maintain full functionality (buttons navigate, auth works, etc.)

### November 6, 2025 - Builder.io Cleanup
**Changes Made:**
- Removed all Builder.io related code and dependencies
- Cleaned up admin portal to remove Builder-specific features
- Updated routing to use standard 404 page instead of dynamic Builder content
- Removed @builder.io/react package (73 packages removed)
- Deleted all Builder.io components, pages, hooks, and Supabase functions
- Updated admin sidebar to remove Builder menu items

### November 6, 2025 - Replit Migration
**Changes Made:**
1. Resolved multiple git merge conflicts in:
   - `src/main.tsx` - cleaned up initialization imports
   - `src/pages/BuilderContent.tsx` - unified preview/edit mode checking logic

2. Fixed Vite configuration for Replit:
   - Changed server port from 8080 to 5000 (Replit requirement)
   - Updated host from "::" to "0.0.0.0" (proper Replit binding)

3. Resolved package manager issues:
   - Initial attempt with Bun failed due to `sucrase` package not installing properly (missing dist/ folder)
   - Tailwind CSS v3 depends on `sucrase` which wasn't compatible with Bun's installation
   - Switched to npm which properly installs all dependencies including `sucrase` build artifacts
   - Removed incompatible `@tailwindcss/postcss` v4.1.16 (conflicted with Tailwind v3)

4. Cleaned up dependencies:
   - Removed `vercel.json` (no longer needed)
   - Removed `sucrase` from direct dependencies (it's a transitive dependency of Tailwind)
   - Installed missing `react-router-dom` dependency

5. Environment variables configured:
   - VITE_SUPABASE_URL
   - VITE_SUPABASE_PUBLISHABLE_KEY

**Critical Technical Details:**
- The app MUST use npm (not Bun) due to Tailwind CSS's dependency on `sucrase`
- Dev server MUST run on port 5000 with host 0.0.0.0 for Replit compatibility
- Workflow configured as: `npm run dev` with webview output on port 5000

## Architecture

### User Roles & Portals
1. **Client Portal** (`/portal/*`)
   - Dashboard with case overview
   - Document upload/management
   - Messaging with staff
   - Payment tracking
   - Profile management with travel history

2. **Staff Portal** (`/staff/*`)
   - Case management dashboard
   - Case details with activity timeline
   - Internal notes
   - Message handling
   - Document review

3. **Admin Portal** (`/admin/*`)
   - User management
   - Visa types configuration
   - Form templates (coming soon)
   - Payment management (coming soon)
   - System-wide settings (coming soon)

### Key Features
- **Authentication:** Supabase-based auth with role-based access control
- **Document Management:** Upload, categorize, and track visa-related documents
- **Case Tracking:** Complete lifecycle management from application to decision
- **Messaging:** Real-time communication between clients and staff
- **Payment Tracking:** Monitor payment status and history

## Project Structure
```
src/
├── components/
│   ├── admin/              # Admin-specific components
│   ├── case-detail/        # Case management components
│   ├── client-profile/     # Client profile components
│   ├── documents/          # Document upload/management
│   ├── plasmic/            # Plasmic page rendering
│   ├── plasmic-components/ # Registered components for Plasmic
│   └── ui/                 # Reusable UI components (shadcn/ui)
├── contexts/
│   └── AuthContext.tsx     # Authentication state management
├── hooks/                  # Custom React hooks
├── integrations/
│   └── supabase/           # Supabase client and types
├── layouts/                # Role-based layout wrappers
├── lib/
│   ├── plasmic.ts          # Plasmic loader & component registration
│   └── utils.ts            # Utility functions and helpers
├── pages/                  # Route components
│   ├── admin/
│   ├── client/
│   └── staff/
└── main.tsx               # App entry point
```

## Development

### Prerequisites
- Node.js 20.x (provided by Replit)
- npm (DO NOT use Bun)
- Supabase account with project credentials

### Environment Variables
Required secrets (configured in Replit Secrets):
```
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-anon-key
VITE_PLASMIC_PROJECT_ID=your-plasmic-project-id
VITE_PLASMIC_API_TOKEN=your-plasmic-api-token
```

**Important:** All environment variables must have the `VITE_` prefix to be accessible in the browser (Vite requirement for security).

### Running the App
The development server is configured to auto-start via Replit workflow:
- Command: `npm run dev`
- Port: 5000
- Output: Webview

To manually restart:
1. Stop the current workflow
2. Run `npm run dev`
3. Access via the Replit webview

### Database
The app uses Supabase PostgreSQL with migrations located in `supabase/migrations/`.
Database schema includes:
- User profiles
- Cases
- Documents
- Messages
- Payments
- Visa types
- Travel history

## Known Issues & Warnings
1. **Package Manager:** Must use npm, not Bun (due to sucrase/Tailwind compatibility)
2. **@types/dompurify:** Deprecated package warning (dompurify includes its own types)
3. **Security:** 2 moderate vulnerabilities reported by npm audit (review with `npm audit` for details)

## User Preferences
- None documented yet

## Future Improvements
- Address npm security vulnerabilities
- Consider upgrading to Tailwind CSS v4 (requires PostCSS config changes)
- Remove deprecated @types/dompurify package
- Implement proper loading states for all async operations
- Add comprehensive form templates system
- Build out payment management features

## Deployment

### Deployment Configuration
The app is configured for **Autoscale Deployment** (stateless web application):
- **Build Command:** `npm run build`
- **Run Command:** `npx serve -s dist -l 5000`
- **Deployment Type:** Autoscale (perfect for stateless React SPAs)

### How to Deploy

1. **Open Deployments Tool:**
   - Click "All tools" in left sidebar
   - Select "Deployments"
   - Or search for "Deployments"

2. **Configure Production Secrets:**
   Before deploying, add these environment variables in the deployment settings:
   ```
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-key
   VITE_PLASMIC_PROJECT_ID=your-plasmic-project-id
   VITE_PLASMIC_API_TOKEN=your-plasmic-api-token
   ```

3. **Deploy:**
   - Select "Autoscale" deployment
   - Choose your domain (subdomain or custom)
   - Click "Deploy"
   - Your app will build and go live in a few minutes

4. **Access Your Site:**
   - Production URL will be provided after deployment
   - Site runs 24/7 without needing Replit open
   - Scales automatically based on traffic

### Build Process
The production build:
- Compiles TypeScript to optimized JavaScript
- Bundles all React components and dependencies
- Generates static HTML, CSS, and JS files in `dist/` folder
- Minifies and optimizes for performance
- Total build size: ~1.2MB (gzipped: ~319KB)

## Plasmic Visual Page Builder

### Overview
Plasmic is integrated to allow non-technical team members to create and manage content pages visually, similar to Shopify's experience. Team members can control themes, colors, fonts, and layout without touching code.

### Available Components
The following components are registered and available in Plasmic Studio:

**Functional Action Components:**
- `SignInButton` - Redirects to /auth sign-in page
- `SignUpButton` - Redirects to /auth sign-up page
- `GetStartedButton` - Customizable CTA with configurable redirect
- `LogoutButton` - Signs user out and shows logout icon

**Auth Components:**
- `UserAvatar` - Displays current user's avatar with optional name
- `ProtectedContent` - Shows/hides content based on authentication status
- `NavigationLink` - Navigates to internal routes with React Router

**UI Components:**
- `Button` - Full button with variants (default, outline, ghost, etc.)
- `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter` - Card layout components
- `Input` - Text input fields
- `Badge` - Labels and tags
- `Alert`, `AlertTitle`, `AlertDescription` - Alert messages
- `Separator` - Horizontal/vertical dividers

### How to Use Plasmic

1. **Access Plasmic Studio:** Visit https://studio.plasmic.app and log in
2. **Create Pages:** Design pages visually using drag-and-drop
3. **Use Registered Components:** All components listed above are available in the component panel
4. **Configure Props:** Each component has configurable properties (text, variant, size, etc.)
5. **Publish:** Changes auto-sync - no code deployment needed
6. **Access Pages:** Pages appear at `/content/[page-name]` routes automatically

### Routes
- Existing portals (`/portal/*`, `/staff/*`, `/admin/*`) remain code-based
- Plasmic pages render at `/content/*` routes
- Example: A page named "homepage" in Plasmic → accessible at `/content/homepage`

### Technical Details
- **Component Source:** `src/components/plasmic-components/`
- **Registration File:** `src/lib/plasmic.ts`
- **Page Renderer:** `src/components/plasmic/PlasmicPage.tsx`
- **Routing:** Configured in `src/App.tsx` with catch-all route `/content/*`
- **Context Handling:** All components are designed to work with or without React Router/Auth context
  - Navigation components use React Router when available, fall back to `window.location`
  - Auth components gracefully handle missing AuthContext and render appropriate fallbacks
  - This ensures components work reliably in any Plasmic page configuration

## Support & Resources
- Original Project: https://lovable.dev/projects/12b75b12-c2d5-486a-9d9a-038cb17ebc7b
- Supabase Docs: https://supabase.com/docs
- Replit Docs: https://docs.replit.com
- Plasmic Docs: https://docs.plasmic.app
