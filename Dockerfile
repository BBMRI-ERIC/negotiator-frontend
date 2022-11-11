FROM node:lts-alpine
RUN npm install -g http-server
WORKDIR /app
COPY package*.json ./
RUN yarn install
COPY . .
RUN chown -R 1001:1001 /app
RUN npm run build
EXPOSE 8080
RUN chmod +x start.sh
USER 1001
CMD [ "./start.sh" ]
