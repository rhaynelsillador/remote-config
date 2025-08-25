# Build stage
FROM node:20 AS builder
WORKDIR /app

# Copy dependencies and install
COPY package*.json ./
#COPY .npmrc .   # optional, only if you still need custom configs
RUN npm install

COPY prisma ./prisma

RUN npx prisma generate

# Copy source and build
COPY . .
RUN npm run prepare
RUN npm run build
RUN npm prune --production

# Runtime stage
FROM node:20
RUN apt-get update && apt-get install -y \
    ca-certificates \
    && update-ca-certificates \
    && rm -rf /var/lib/apt/lists/*

ENV NODE_EXTRA_CA_CERTS=/etc/ssl/certs/ca-certificates.crt
ENV NODE_OPTIONS="--dns-result-order=ipv4first"
WORKDIR /app

# Copy build artifacts
COPY --from=builder /app/build sv-cashier-web/build/
COPY --from=builder /app/node_modules sv-cashier-web/node_modules
COPY --from=builder /app/package.json sv-cashier-web/package.json

EXPOSE 3000
ENV NODE_ENV=production

CMD ["node", "sv-cashier-web/build"]
