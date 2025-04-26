FROM node:23-alpine AS build

WORKDIR /app

RUN corepack enable

COPY --from=root package*.json pnpm*.yaml ./
COPY --from=root packages ./packages

COPY package.json ./apps/gateway/

RUN pnpm install

COPY . ./apps/gateway/

RUN pnpm --filter gateway-server run build

FROM node:23-alpine AS runtime

WORKDIR /app

RUN corepack enable

COPY --from=build /app/pnpm-*.yaml /app/package*.json ./
COPY --from=build /app/packages ./packages

WORKDIR /app/apps/gateway

COPY --from=build /app/apps/gateway/package*.json ./
COPY --from=build /app/apps/gateway/dist ./dist

RUN pnpm install --prod

CMD ["node", "dist/app.js"]
