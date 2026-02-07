FROM node:20-alpine AS base
WORKDIR /app
RUN corepack enable

FROM base AS deps
COPY package.json yarn.lock .yarnrc.yml ./
COPY scrum-app-api/package.json scrum-app-api/package.json
COPY scrum-app-web/package.json scrum-app-web/package.json
RUN yarn install --immutable

FROM deps AS build
COPY . .
RUN yarn --cwd scrum-app-web build

FROM base AS runtime
ENV NODE_ENV=production
ENV PORT=8080
WORKDIR /app
COPY --from=build /app/scrum-app-web/.next/standalone /app
COPY --from=build /app/scrum-app-web/.next/static /app/scrum-app-web/.next/static
COPY --from=build /app/scrum-app-web/public /app/scrum-app-web/public
EXPOSE 8080
CMD ["node", "scrum-app-web/server.js"]
