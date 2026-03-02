FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma

RUN npm ci

RUN DATABASE_URL="x" npx prisma generate

COPY . .
RUN npm run build

# ---- Final image ----
FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY package*.json ./

ENV NODE_ENV=production

CMD ["npm", "start"]