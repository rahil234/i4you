# Stage 1: Build Stage
FROM node:23-alpine

RUN mkdir -p /app

WORKDIR /app

COPY package*.json ./

RUN #npm install

COPY . .

CMD ["npm", "run", "dev"]
