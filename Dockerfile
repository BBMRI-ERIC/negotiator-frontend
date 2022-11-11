FROM node:6.9.5-alpine
WORKDIR /app
COPY ./dist/negotiator-v3-frontend .
RUN chown -R 1001:1001 /app
EXPOSE 8080
RUN chmod +x start.sh
USER 1001
CMD [ "yarn", "start" ]
