# HARDCOREJOBS

High-paying job board ($100K+) for motivated candidates who don't require a degree or prior experience.

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Authentication**: Clerk
- **Database**: Neon PostgreSQL (serverless)
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript (strict mode)

## Prerequisites

- Node.js 18+
- npm or yarn
- Neon PostgreSQL database
- Clerk account for authentication

## Installation

```bash
npm install
```

## Environment Setup

Copy the example environment file and fill in your values:

```bash
cp .env.example .env.local
```

Required environment variables:
- `POSTGRES_URL` - Neon database connection string
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk public key
- `CLERK_SECRET_KEY` - Clerk secret key

See [.env.example](./.env.example) for all available options.

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint errors |
| `npm run type-check` | Run TypeScript type checking |

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication routes
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   ├── jobs/              # Job listing pages
│   └── ...
├── components/
│   ├── jobs/              # Job-related components
│   ├── layout/            # Layout components (header, footer)
│   └── ui/                # Reusable UI components
├── lib/
│   └── db/                # Database utilities
└── public/                # Static assets
```

## Database Setup

Run the migration endpoint to set up the database schema:

```bash
curl -X POST http://localhost:3000/api/db/migrate
```

## Deployment

Deploy to Vercel:

```bash
vercel
```

Or see the [Next.js deployment documentation](https://nextjs.org/docs/deployment).

## License

Private - All rights reserved
