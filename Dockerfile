FROM node:20.1.0-alpine as  build-stage
WORKDIR /app
COPY . .
RUN yarn cache clean && yarn install --ignore-engines && yarn build

FROM bitnami/nginx:1.24 as production-stage
WORKDIR /app
COPY --from=build-stage /app/dist .
COPY start.sh .
USER 0
RUN chmod -R g+rwx /app
USER 1001
CMD ["./start.sh"]
