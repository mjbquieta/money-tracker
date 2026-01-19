# Node 22 for consistency with API
FROM node:22 AS base

RUN npm i -g pnpm@9.15.4

FROM base AS dependencies

WORKDIR /app
COPY apps/web/package.json .
RUN pnpm install

FROM base AS build
WORKDIR /app
COPY apps/web/ .
COPY --from=dependencies /app/node_modules ./node_modules
RUN pnpm run build

FROM base AS production
WORKDIR /app
COPY --from=build /app/.output ./.output

ENV HOST=0.0.0.0
ENV PORT=3000

EXPOSE 3000

CMD [ "node", ".output/server/index.mjs" ]
