FROM artifacts-internal.mynt.xyz/dockerhub/node:20 as builder
WORKDIR /app
COPY package*.json ./
COPY .npmrc .
RUN npm config set @mynt:registry=https://nexus-internal.mynt.xyz/repository/mynt-npm-group/
RUN npm install
COPY . .
RUN npm run prepare
RUN npm run build
RUN npm prune --production

FROM artifacts-internal.mynt.xyz/dockerhub/node:20
RUN apt-get update && apt-get install -y \
    ca-certificates \
    && update-ca-certificates

ENV NODE_EXTRA_CA_CERTS=/etc/ssl/certs/ca-certificates.crt
ENV NODE_OPTIONS="--dns-result-order=ipv4first"
WORKDIR /app
COPY --from=builder /app/build sv-cashier-web/build/
COPY --from=builder /app/node_modules sv-cashier-web/node_modules
COPY --from=builder /app/package.json sv-cashier-web/package.json
EXPOSE 3000
ENV NODE_ENV=production
CMD [ "node", "sv-cashier-web/build" ]
