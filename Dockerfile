FROM node:20.1.0-alpine as  build-stage
WORKDIR /app
COPY . .
RUN yarn config set network-timeout 600000 -g
RUN yarn cache clean
RUN yarn --ignore-engines
RUN yarn build

FROM bitnami/nginx:1.24 as production-stage
WORKDIR /app
COPY --from=build-stage /app/dist .
COPY src/assets/scss /app/assets
COPY nginx.conf /opt/bitnami/nginx/conf/server_blocks/my_server_block.conf
COPY start.sh .
USER 0
RUN chmod -R g+rwx /app
USER 1001
CMD ["./start.sh"]
