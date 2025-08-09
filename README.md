# 8gent Recruiter

A modern recruiting dashboard built with Next.js App Router, Tailwind CSS, and shadcn/ui. It includes candidate and job management, meetings, billing, and team features packaged into a clean dashboard with a responsive sidebar layout [^1].

## Features

- Dashboard analytics with charts (pipeline, sources, departments, trends)
- Jobs and Applicants
  - Applicants table with details dialog, stage changes, and actions
- Team
  - Members management and Permissions with safe, non-nested forms
  - Meetings: list and calendar view with filters and day details
  - Optional multi-round interviews (series and rounds)
- Finance
  - Plans & Billing (tiers, usage visualization)
  - Invoices, Payments, Payment Methods
- Settings
  - Branding basics
  - Meetings Integration: provider + API key fields (demo persistence)
- Responsive and accessible UI using shadcn/ui components and Lucide icons [^1]

## Tech Stack

- Next.js (App Router)
- React Server Components + Client Components
- Tailwind CSS
- shadcn/ui (Sidebar, Dialog, Table, Card, Tabs, etc.) [^1]
- Lucide React icons
- In-memory demo store with server actions for CRUD-like flows

## Getting Started

1. Install dependencies
   - npm install
   - or: pnpm install / yarn install

2. Run the dev server
   - npm run dev
   - Open http://localhost:3000

3. Build and start
   - npm run build
   - npm start

No environment variables are required for the demo. Use your own storage and secrets manager for production API keys.

## Key Paths

- app/dashboard/page.tsx — Analytics overview
- app/jobs/* — Jobs listing and details
- app/applicants/page.tsx — Applicants table with details dialog
- app/team/meetings/page.tsx — Meetings list + calendar
- app/billing/* — Billing overview, invoices, payments, methods
- app/settings/page.tsx — Branding + Meetings Integration
- components/kokonutui/sidebar.tsx — Primary sidebar with “8gent” + “recruiter” badge

## Branding

- Sidebar brand shows the original logo icon and the project title:
  - Icon: light/dark variants are preserved
  - Title: "8gent"
  - Badge: "recruiter"

## Notes

- The app uses shadcn/ui’s sidebar primitives and composable components to build the layout and navigation [^1].
- In-memory data is for demo purposes. Use a real database (e.g., Postgres/Neon) and secure secret storage in production.

## License

MIT
\`\`\`

```json file="package.json"
[v0-no-op-code-block-prefix]{
  "name": "8gent-recruiter",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@hookform/resolvers": "^3.9.1",
    "@radix-ui/react-accordion": "1.2.2",
    "@radix-ui/react-alert-dialog": "1.1.4",
    "@radix-ui/react-aspect-ratio": "1.1.1",
    "@radix-ui/react-avatar": "1.1.2",
    "@radix-ui/react-checkbox": "1.1.3",
    "@radix-ui/react-collapsible": "1.1.2",
    "@radix-ui/react-context-menu": "2.2.4",
    "@radix-ui/react-dialog": "1.1.4",
    "@radix-ui/react-dropdown-menu": "2.1.4",
    "@radix-ui/react-hover-card": "1.1.4",
    "@radix-ui/react-label": "2.1.1",
    "@radix-ui/react-menubar": "1.1.4",
    "@radix-ui/react-navigation-menu": "1.2.3",
    "@radix-ui/react-popover": "1.1.4",
    "@radix-ui/react-progress": "1.1.1",
    "@radix-ui/react-radio-group": "1.2.2",
    "@radix-ui/react-scroll-area": "1.2.2",
    "@radix-ui/react-select": "2.1.4",
    "@radix-ui/react-separator": "1.1.1",
    "@radix-ui/react-slider": "1.2.2",
    "@radix-ui/react-slot": "1.1.1",
    "@radix-ui/react-switch": "1.1.2",
    "@radix-ui/react-tabs": "1.1.2",
    "@radix-ui/react-toast": "1.2.4",
    "@radix-ui/react-toggle": "1.1.1",
    "@radix-ui/react-toggle-group": "1.1.1",
    "@radix-ui/react-tooltip": "1.1.6",
    "autoprefixer": "^10.4.20",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cmdk": "1.0.4",
    "date-fns": "4.1.0",
    "embla-carousel-react": "8.5.1",
    "geist": "^1.3.1",
    "input-otp": "1.4.1",
    "lucide-react": "^0.454.0",
    "next": "14.2.25",
    "next-themes": "^0.4.4",
    "react": "^19",
    "react-day-picker": "9.8.0",
    "react-dom": "^19",
    "react-hook-form": "^7.54.1",
    "react-resizable-panels": "^2.1.7",
    "recharts": "2.15.0",
    "sonner": "^1.7.1",
    "tailwind-merge": "^2.5.5",
    "tailwindcss-animate": "^1.0.7",
    "vaul": "^0.9.6",
    "zod": "^3.24.1"
  },
  "devDependencies": {
    "@types/node": "^22",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "postcss": "^8.5",
    "tailwindcss": "^3.4.17",
    "typescript": "5.7.3"
  }
}
