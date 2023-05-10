# build stage
FROM node:20.1.0-alpine as  build-stage
WORKDIR /app
COPY . .
RUN yarn install --ignore-engines
RUN yarn build

# production stage
FROM bitnami/nginx:1.24 as production-stage
WORKDIR /app
COPY --from=build-stage /app/dist .
COPY start.sh .
USER 0
RUN chmod -R g+rwx /app
USER 1001
CMD ["./start.sh"]

#FROM node:19-alpine
#RUN apk update
#RUN apk upgrade
#RUN apk add bash curl yarn
#RUN yarn add vite
#WORKDIR /app
#COPY . /app
#COPY ./dist /app
#RUN chown -R 1001:1001 /app
#EXPOSE 8080
#RUN chmod +x start.sh
#USER 1001
#CMD [ "./start.sh" ]
