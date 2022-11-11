FROM node:lts-alpine
RUN apk update
RUN apk upgrade
RUN apk add bash
WORKDIR /app
COPY . /app
RUN npm install -g http-server
RUN chown -R 1001:1001 /app
EXPOSE 8080
RUN chmod +x start.sh
USER 1001
CMD [ "./start.sh" ]
