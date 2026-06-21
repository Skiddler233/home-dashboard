# Multi-stage Dockerfile: build frontend with Vite, then package with Node server
# Builder
FROM node:20-bullseye as builder
WORKDIR /app
COPY package*.json ./
COPY . .
RUN npm ci --no-audit --no-fund
RUN npm run build

# Runtime
FROM node:20-bullseye-slim
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/server ./server
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
# install only production deps
RUN npm ci --only=production --no-audit --no-fund
EXPOSE 5174
ENV PORT=5174
CMD ["node", "server/server.js"]
