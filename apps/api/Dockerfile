# Node 22 required for Prisma 7.x
FROM node:22 AS base

RUN npm i -g pnpm@9.15.4

FROM base AS dependencies

WORKDIR /app
COPY apps/api/package.json .
# Skip Prisma postinstall to avoid binary generation issues
RUN pnpm install --ignore-scripts

FROM base AS build
WORKDIR /app
COPY apps/api/ .
COPY --from=dependencies /app/node_modules ./node_modules
# Generate Prisma client (binary targets configured in schema.prisma)
RUN npx prisma generate
RUN pnpm run build

FROM base AS production
WORKDIR /app
COPY --from=build /app/dist/ ./dist/
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/prisma ./prisma

CMD [ "node", "dist/src/main" ]
