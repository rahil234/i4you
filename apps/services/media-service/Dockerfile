FROM node:23-alpine AS build

WORKDIR /app

RUN corepack enable

COPY --from=root package*.json pnpm*.yaml ./
COPY --from=root packages ./packages

COPY package.json ./apps/services/media-service/

RUN pnpm install

COPY . ./apps/services/media-service/

RUN pnpm --filter media-service run build

FROM node:23-alpine AS runtime

WORKDIR /app

RUN corepack enable

COPY --from=build /app/packages ./packages
COPY --from=build /app/pnpm-*.yaml /app/package*.json ./

WORKDIR /app/apps/services/media-service

COPY --from=build /app/apps/services/media-service/package*.json ./

RUN pnpm install --prod

COPY --from=build /app/apps/services/media-service/dist ./dist

CMD ["node", "dist/app.js"]
