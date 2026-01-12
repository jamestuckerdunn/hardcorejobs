# HARDCOREJOBS

High-paying job listings ($100K+) that require zero experience and no degree. Built for those willing to work hard and relocate anywhere.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 4
- **Authentication**: Clerk
- **Payments**: Stripe
- **Database**: Neon PostgreSQL
- **Deployment**: Vercel

## Features

- **Job Listings**: Browse high-paying jobs with filters (location, remote type, salary)
- **Job Aggregation**: Automated daily sync from multiple job APIs (Adzuna, Remotive, TheMuse, etc.)
- **Featured Jobs**: Premium job placement for employers ($99/month)
- **Resume Database**: Employer access to candidate profiles ($199/month)
- **The Hardcore Pledge**: Candidate commitment system

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL database (Neon recommended)
- Clerk account (for auth)
- Stripe account (for payments)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/hardcorejobs.git
cd hardcorejobs
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure your `.env.local` with:
   - Database connection string
   - Clerk API keys
   - Stripe API keys
   - (Optional) Job API keys for aggregation

5. Run database migrations:
```bash
# Start the dev server first
npm run dev

# Then call the migration endpoint (requires CRON_SECRET)
curl -X POST http://localhost:3000/api/db/migrate \
  -H "Authorization: Bearer your-cron-secret"
```

6. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Environment Variables

See `.env.example` for a complete list. Key variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `POSTGRES_URL` | Neon database connection string | Yes |
| `CLERK_SECRET_KEY` | Clerk API secret | Yes |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key | Yes |
| `STRIPE_SECRET_KEY` | Stripe API secret | Yes |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret | Yes |
| `CRON_SECRET` | Secret for cron job authentication | Yes |
| `NEXT_PUBLIC_APP_URL` | Your application URL | Yes (production) |

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── jobs/          # Job listings endpoints
│   │   ├── stripe/        # Payment endpoints
│   │   └── cron/          # Scheduled job endpoints
│   ├── jobs/              # Job listing pages
│   └── (auth)/            # Auth pages (sign-in, sign-up)
├── components/            # React components
│   ├── jobs/              # Job-related components
│   ├── layout/            # Header, Footer
│   └── ui/                # Reusable UI components
├── lib/                   # Utilities and helpers
│   ├── job-aggregator/    # Job sync from external APIs
│   ├── db/                # Database utilities
│   ├── constants.ts       # App configuration
│   └── logger.ts          # Structured logging
└── public/                # Static assets
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/jobs` | GET | List jobs with filters |
| `/api/jobs/[id]` | GET | Get single job details |
| `/api/jobs/featured` | GET | Get featured jobs |
| `/api/health` | GET | Health check |
| `/api/stripe/checkout` | POST | Create checkout session |
| `/api/stripe/webhook` | POST | Stripe webhook handler |
| `/api/cron/sync-jobs` | POST | Sync jobs from external APIs |

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy

The app includes:
- Automatic cron job for daily job sync (`vercel.json`)
- Security headers configured
- SEO metadata and sitemap

### Manual Deployment

```bash
npm run build
npm start
```

## Security

- HTTPS enforced with HSTS
- SQL injection protection (parameterized queries)
- XSS protection (DOMPurify for HTML, CSP headers)
- CSRF protection (built into Next.js)
- Authentication required for protected routes
- Webhook signature validation

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `npm run lint` to check for issues
5. Submit a pull request

## License

This project is proprietary. All rights reserved.
