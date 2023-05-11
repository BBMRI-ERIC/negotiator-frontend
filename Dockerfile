FROM node:20.1.0-alpine as  build-stage
WORKDIR /app
COPY . .
RUN yarn install --network-timeout 1000000000  --ignore-engines
RUN yarn build

FROM bitnami/nginx:1.24 as production-stage
WORKDIR /app
COPY --from=build-stage /app/dist .
COPY nginx.conf /opt/bitnami/nginx/conf/server_blocks/my_server_block.conf
COPY start.sh .
USER 0
RUN chmod -R g+rwx /app
USER 1001
CMD ["./start.sh"]
