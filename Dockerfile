FROM node:19-alpine
RUN apk update
RUN apk upgrade
RUN apk add bash curl yarn
RUN yarn add vite
WORKDIR /app
COPY . /app
COPY ./dist /app
RUN chown -R 1001:1001 /app
EXPOSE 8080
RUN chmod +x start.sh
USER 1001
CMD [ "./start.sh" ]
