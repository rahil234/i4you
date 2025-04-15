# --- Stage 1: Build Dependencies ---
FROM node:23-alpine AS build

WORKDIR /app

RUN corepack enable

# Copy workspace-related config files
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./

# Copy local packages and the user-service package.json
COPY packages ./packages

COPY apps/services/user-service/package.json apps/services/user-service/

# Install dependencies for the entire workspace (including local packages)
RUN pnpm install

# Copy the entire monorepo after dependencies are installed
COPY . .

# Build the user-service if needed
RUN pnpm --filter=user-service run build


# --- Stage 2: Production Image ---
FROM node:23-alpine AS runtime

WORKDIR /app

# Copy only necessary runtime files from the build stage
COPY --from=build /app/apps/services/user-service ./apps/services/user-service
COPY --from=build /app/packages ./packages
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/pnpm-lock.yaml ./

# Set working directory to user-service
WORKDIR /app/apps/services/user-service

COPY --from=build /app/apps/services/user-service/node_modules/@repo/proto-files/proto/ dist/proto

#CMD ["ls", "dist/proto-files-old"]
CMD ["node", "dist/index.js"]