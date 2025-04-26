FROM node:23-alpine AS build

WORKDIR /app

RUN corepack enable

COPY --from=root package*.json pnpm*.yaml ./
COPY --from=root packages ./packages

COPY package.json ./apps/services/user-service/

RUN pnpm install

COPY . ./apps/services/user-service/

RUN pnpm --filter user-service run build

FROM node:23-alpine AS runtime

WORKDIR /app

RUN corepack enable

COPY --from=build /app/packages ./packages
COPY --from=build /app/pnpm-*.yaml /app/package*.json ./

WORKDIR /app/apps/services/user-service

COPY --from=build /app/apps/services/user-service/package*.json ./
COPY --from=build /app/apps/services/user-service/dist ./dist

RUN pnpm install --prod

CMD ["node", "dist/app.js"]