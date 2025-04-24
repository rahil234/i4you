# --- Stage 1: Build Dependencies ---
FROM node:23-alpine AS build

WORKDIR /app

RUN corepack enable

COPY --from=root package*.json pnpm*.yaml ./
COPY --from=root packages ./packages

COPY . ./apps/services/user-service

RUN pnpm install

RUN pnpm --filter=user-service run build

# --- Stage 2: Production Image ---
FROM node:23-alpine AS runtime

WORKDIR /app

RUN corepack enable

COPY --from=build /app/apps/services/user-service/dist ./apps/services/user-service/dist
COPY --from=build /app/apps/services/user-service/package.json ./apps/services/user-service/package.json
COPY --from=build /app/packages ./packages
COPY --from=build /app/pnpm-*.yaml ./

RUN pnpm install --filter user-service --prod

CMD ["pnpm", "run", "--filter", "user-service", "start"]