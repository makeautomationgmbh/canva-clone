# CANVA_CLONE

Monorepo with Next.js client and Node microservices.

- client: Next.js app
- server/api-gateway: Express gateway
- server/design-service: Express service
- server/subscription-service: Express service
- server/upload-service: Express service

Prerequisites: Node 18+ and npm.

Run locally (separate terminals):
- cd client && npm install && npm run dev
- cd server/api-gateway && npm install && npm start
- cd server/design-service && npm install && npm start
- cd server/subscription-service && npm install && npm start
- cd server/upload-service && npm install && npm start

Environment: Create .env files as needed (e.g., client/.env, server/**/.env).

License: MIT
