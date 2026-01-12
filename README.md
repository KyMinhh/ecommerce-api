# E-commerce REST API (Node.js)

Backend REST API for a simple e-commerce system built with **Node.js**, **Express**, **MySQL**, **JWT**, and **Docker**.

## Tech Stack
- Node.js, Express
- MySQL (Docker)
- JWT Auth, bcrypt
- (Planned) Swagger API Docs
- (Planned) Dockerized deployment

## Features (Planned)
- Auth: Register / Login (JWT)
- Roles: USER / ADMIN
- Products: CRUD + pagination + search
- Cart & Orders
- Validation & centralized error handling
- API Documentation (Swagger)
- Docker & deployment

## Project Structure (Planned)

```
src/
  app.js
  server.js
  config/
  middlewares/
  modules/
    auth/
    user/
    product/
    order/
  utils/
docs/
```

## Getting Started

### 1) Install
```bash
npm install
```

### 2) Environment

Create `.env` from `.env.example`:

```bash
cp .env.example .env
```

### 3) Run (development)
```bash
npm run dev
```

Health check:

```
GET http://localhost:3000/health
```

## Scripts

- `npm run dev` - start with nodemon
- `npm start` - start in production mode

## Git Workflow

- Work on `dev`
- Create feature branches: `feature/<name>`
- Merge `feature` → `dev`
- Release: merge `dev` → `main` and tag

## License

MIT
