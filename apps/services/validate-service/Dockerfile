# === STAGE 1: build ===
FROM node:22-alpine AS build

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

RUN npm run build

# === STAGE 2: runtime ===
FROM node:22-alpine AS runtime

WORKDIR /app

COPY --from=build /app/package*.json /app/

RUN npm install --prod

COPY --from=build /app/dist ./dist

CMD ["npm", "run", "start"]
