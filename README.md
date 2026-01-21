# Prospera

A personal finance tracking application built as a monorepo with a NestJS API backend and Nuxt web frontend.

## Project Structure

```
money-tracker/
├── apps/
│   ├── api/          # NestJS backend API (port 3001)
│   └── web/          # Nuxt frontend (port 3000)
└── package.json      # Root monorepo configuration
```

## Prerequisites

- Node.js 22+
- pnpm 9.x
- PostgreSQL (for the API database)
- Docker (optional, for containerized deployment)

## Getting Started

### Install Dependencies

```bash
pnpm install
```

### Environment Setup

The API requires environment variables for database connection and JWT configuration. Create a `.env` file in `apps/api/`:

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/money_tracker"
JWT_SECRET="your-secret-key"
```

### Database Setup

```bash
# Generate Prisma client
pnpm --filter @money-tracker/api run db:generate

# Run database migrations
pnpm --filter @money-tracker/api run db:migrate
```

## Running the Applications

### Run Both Applications (Development)

```bash
pnpm dev
```

This starts both the API and web applications in parallel.

### Run Individual Applications

```bash
# API only (NestJS - runs on port 3001)
pnpm dev:api

# Web only (Nuxt - runs on port 3000)
pnpm dev:web
```

## Building for Production

### Build Both Applications

```bash
pnpm build
```

### Build Individual Applications

```bash
# Build API
pnpm build:api

# Build Web
pnpm build:web
```

## Docker

### Build Docker Images

```bash
# Build API image
docker build -t money-tracker-api -f apps/api/Dockerfile .

# Build Web image
docker build -t money-tracker-web -f apps/web/Dockerfile .
```

### Run Docker Containers

```bash
# Run API container
docker run -p 3001:3001 \
  -e DATABASE_URL="postgresql://user:password@host:5432/money_tracker" \
  -e JWT_SECRET="your-secret-key" \
  money-tracker-api

# Run Web container
docker run -p 3000:3000 money-tracker-web
```

### Docker Compose (Example)

Create a `docker-compose.yml` in the project root:

```yaml
version: "3.8"

services:
  db:
    image: postgres:16
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: money_tracker
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  api:
    build:
      context: .
      dockerfile: apps/api/Dockerfile
    ports:
      - "3001:3001"
    environment:
      DATABASE_URL: postgresql://postgres:postgres@db:5432/money_tracker
      JWT_SECRET: your-secret-key
    depends_on:
      - db

  web:
    build:
      context: .
      dockerfile: apps/web/Dockerfile
    ports:
      - "3000:3000"
    depends_on:
      - api

volumes:
  postgres_data:
```

Then run:

```bash
docker-compose up --build
```

## Testing

```bash
# Run all tests
pnpm test

# Run API tests
pnpm --filter @money-tracker/api run test

# Run API e2e tests
pnpm --filter @money-tracker/api run test:e2e
```

## Linting

```bash
pnpm lint
```

## License

MIT
