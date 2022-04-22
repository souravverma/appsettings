FROM r-2e28-caas-prod-docker-virtual.artifactory.2b82.aws.cloud.airbus.corp/airbus/airbus-nodejs-12-ubi8:latest AS builder

ARG NPM_USR
ARG NPM_PSW

# Create app
USER root
WORKDIR /usr/src/app

# Copy all necessary project files
COPY .npmrc ./

COPY package*.json ./
RUN npm ci

COPY tsconfig*.json ./
COPY src ./src
RUN npm run build

RUN npm prune --production

FROM r-2e28-caas-prod-docker-virtual.artifactory.2b82.aws.cloud.airbus.corp/airbus/airbus-nodejs-12-ubi8:latest
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules

EXPOSE 3000
CMD [ "node", "dist/server.js" ]