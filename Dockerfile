# build stage
FROM node:lts-alpine as build-stage
WORKDIR /app
COPY package.json ./
RUN yarn install
COPY . .
RUN yarn build
# production stage
FROM bitnami/nginx:1.24 as production-stage
EXPOSE 80
USER 1000
COPY --from=build-stage /app/dist /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]

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
