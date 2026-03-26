# Stage 1: Build client
FROM node:18-alpine AS client-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

# Stage 2: Build server
FROM node:18-alpine AS server-build
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci
COPY server/ ./
RUN npm run build

# Stage 3: Production
FROM node:18-alpine
WORKDIR /app

COPY server/package*.json ./server/
RUN cd server && npm ci --omit=dev

COPY --from=server-build /app/server/dist ./server/dist
COPY --from=client-build /app/client/dist ./client/dist

# Seed script needs ts-node, so copy source too
COPY server/src ./server/src
COPY server/tsconfig.json ./server/
RUN cd server && npm install ts-node typescript

EXPOSE 5000

CMD ["node", "server/dist/index.js"]
