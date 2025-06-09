# === STAGE 1: merge-overrides ===
FROM node:22-alpine AS overrides

WORKDIR /app

RUN corepack enable

# Only copy what's needed for merge-overrides
COPY package.json pnpm-overrides.json ./

# Run merge-overrides once
RUN npx merge-overrides

# === STAGE 2: build ===
FROM node:22-alpine AS build

WORKDIR /app

RUN corepack enable

COPY --from=overrides /app/package.json /app/

RUN pnpm install

COPY . .

RUN pnpm run build

# === STAGE 3: runtime ===
FROM node:22-alpine AS runtime

WORKDIR /app

RUN corepack enable

COPY --from=overrides /app/package.json /app/

COPY --from=build /app/pnpm-*.yaml ./

RUN pnpm install --prod

COPY --from=build /app/dist ./dist

CMD ["pnpm", "run", "start"]
