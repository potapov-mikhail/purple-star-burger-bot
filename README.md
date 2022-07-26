# Purple Star Burger Bot

## Getting started

Clone this project and run installation

```
npm ci
```

Create .env file (from .env.example) and fill it.

If you are using docker, you can use docker-compose.dev for development.

```
docker compose -f docker-compose.dev.yml up -d
```

Run migration

```
npx prisma migrate dev --name init
```

Run seed script for filing database with dummy data on its initialization

```
npx prisma db seed
```

## Usage

Run project in development mode

```
npm run dev
```

Run project in production mode

```
npm build
npm start
```
