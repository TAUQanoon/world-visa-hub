# GlobalVisa Consultancy Platform

## Overview
A comprehensive visa consultation and case management platform for students seeking to study abroad, particularly in China and Saudi Arabia. The application provides role-based portals for clients, staff, and administrators with integrated document management, messaging, payments tracking, and Builder.io CMS capabilities.

## Project Status
**Last Updated:** November 6, 2025
**Current State:** Successfully migrated from Lovable.dev/Vercel to Replit
**Environment:** Development

## Technology Stack
- **Frontend:** React 18.3.1 + TypeScript
- **Build Tool:** Vite 5.4.11
- **Styling:** Tailwind CSS 3.4.18
- **UI Components:** Radix UI, shadcn/ui
- **Backend/Auth:** Supabase (PostgreSQL + Authentication)
- **CMS:** Builder.io
- **Package Manager:** npm (previously attempted with Bun, but switched due to sucrase compatibility issues)

## Recent Changes (Migration from Vercel to Replit)

### November 6, 2025 - Replit Migration
**Changes Made:**
1. Resolved multiple git merge conflicts in:
   - `src/main.tsx` - cleaned up Builder.io initialization imports
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
   - VITE_BUILDER_IO_API_KEY

**Critical Technical Details:**
- The app MUST use npm (not Bun) due to Tailwind CSS's dependency on `sucrase`
- Dev server MUST run on port 5000 with host 0.0.0.0 for Replit compatibility
- Workflow configured as: `npm run dev` with webview output on port 5000

## Architecture

### User Roles & Portals
1. **Client Portal** (`/client/*`)
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
   - Builder.io integration (webhooks, forms, analytics)
   - System-wide settings

### Key Features
- **Authentication:** Supabase-based auth with role-based access control
- **Document Management:** Upload, categorize, and track visa-related documents
- **Case Tracking:** Complete lifecycle management from application to decision
- **Messaging:** Real-time communication between clients and staff
- **Builder.io CMS:** Dynamic content management for marketing pages
- **Payment Tracking:** Monitor payment status and history

## Project Structure
```
src/
├── components/
│   ├── admin/          # Admin-specific components
│   ├── builder/        # Builder.io integration components
│   ├── case-detail/    # Case management components
│   ├── client-profile/ # Client profile components
│   ├── documents/      # Document upload/management
│   └── ui/            # Reusable UI components (shadcn/ui)
├── contexts/
│   └── AuthContext.tsx # Authentication state management
├── hooks/             # Custom React hooks
├── integrations/
│   └── supabase/      # Supabase client and types
├── layouts/           # Role-based layout wrappers
├── lib/               # Utility functions and helpers
├── pages/             # Route components
│   ├── admin/
│   ├── client/
│   └── staff/
└── main.tsx          # App entry point
```

## Development

### Prerequisites
- Node.js 20.x (provided by Replit)
- npm (DO NOT use Bun)
- Supabase account with project credentials
- Builder.io account (optional, for CMS features)

### Environment Variables
Required secrets (configured in Replit Secrets):
```
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-anon-key
VITE_BUILDER_IO_API_KEY=your-builder-io-api-key (optional)
```

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
2. **Builder.io Warning:** Console shows "isPreviewing is not available" - this is a known issue and doesn't affect functionality
3. **@types/dompurify:** Deprecated package warning (dompurify includes its own types)
4. **Security:** 2 moderate vulnerabilities reported by npm audit (review with `npm audit` for details)

## User Preferences
- None documented yet

## Future Improvements
- Address npm security vulnerabilities
- Consider upgrading to Tailwind CSS v4 (requires PostCSS config changes)
- Remove deprecated @types/dompurify package
- Add comprehensive error handling for Builder.io integration
- Implement proper loading states for all async operations

## Deployment
For production deployment on Replit:
1. Ensure all environment variables are set in production secrets
2. Run `npm run build` to create production build
3. Configure deployment to serve from `dist/` folder
4. Set up proper domain/SSL via Replit deployment settings

## Support & Resources
- Original Project: https://lovable.dev/projects/12b75b12-c2d5-486a-9d9a-038cb17ebc7b
- Supabase Docs: https://supabase.com/docs
- Builder.io Docs: https://www.builder.io/c/docs
- Replit Docs: https://docs.replit.com
