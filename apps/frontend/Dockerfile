FROM node:18-alpine AS builder

WORKDIR /app

COPY --from=root package*.json pnpm*.yaml turbo.json ./
COPY --from=root packages packages

COPY package.json ./apps/frontend/

RUN corepack enable && pnpm install --frozen-lockfile

COPY . ./apps/frontend

COPY .env.production ./apps/frontend/.env

RUN pnpm run --filter=frontend build

RUN pnpm prune --prod

EXPOSE 3000

CMD ["pnpm", "run", "--filter=frontend", "start"]
