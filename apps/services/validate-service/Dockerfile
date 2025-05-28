FROM node:22-alpine AS build

WORKDIR /app

RUN corepack enable

COPY --from=root package*.json pnpm*.yaml ./
COPY --from=root packages ./packages

COPY package.json ./apps/services/validate-service/

RUN pnpm install

COPY . ./apps/services/validate-service/

RUN pnpm --filter validate-service run build

FROM node:22-alpine AS runtime

WORKDIR /app

RUN corepack enable

COPY --from=build /app/packages ./packages
COPY --from=build /app/pnpm-*.yaml /app/package*.json ./

WORKDIR /app/apps/services/validate-service

COPY --from=build /app/apps/services/validate-service/package*.json ./

RUN pnpm install --prod

COPY --from=build /app/apps/services/validate-service/dist ./dist

ENTRYPOINT ["node", "dist/app.js"]
