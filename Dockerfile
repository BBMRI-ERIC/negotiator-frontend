FROM node:6.9.5-alpine
RUN apk update
RUN apk upgrade
RUN apk add bash
WORKDIR /app
ADD . /app
RUN npm install -g -s yarn
RUN chown -R 1001:1001 /app
EXPOSE 8080
RUN chmod +x start.sh
USER 1001
CMD [ "./start.sh" ]
