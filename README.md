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

Run prisma studio

```
npx prisma studio
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

You can also change the log level by passing the DEBUG_LEVEL environment variable:
| lvl | Description |
| ----- | -------------------------- |
| error | Only error messages |
| warn | Error and warning messages |
| info | Error, warning and log messages |
| debug | All messages |
