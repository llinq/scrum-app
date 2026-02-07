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
RUN yarn --cwd scrum-app-api build

FROM base AS runtime
ENV NODE_ENV=production
ENV PORT=8080
WORKDIR /app
COPY package.json yarn.lock .yarnrc.yml ./
COPY scrum-app-api/package.json scrum-app-api/package.json
COPY scrum-app-web/package.json scrum-app-web/package.json
RUN yarn workspaces focus --production scrum-app-api
COPY --from=build /app/scrum-app-api/dist /app/scrum-app-api/dist
EXPOSE 8080
CMD ["node", "scrum-app-api/dist/main"]
