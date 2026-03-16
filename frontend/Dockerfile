# Build Stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the source code
COPY . .

# Accept build arguments and set them to environment variables
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Build the Next.js application
RUN npm run build

# Final Stage
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
# Render автоматически назначает порт 10000, нам нужно заставить Next.js его слушать
ENV PORT=10000
# Это важно: заставляем сервер слушать внешний трафик, а не только локальный
ENV HOSTNAME="0.0.0.0"

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Убираем копирование next.config.ts, в standalone режиме он не нужен
# Порт 10000 для Render
EXPOSE 10000

CMD ["node", "server.js"]
