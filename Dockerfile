FROM node:16-slim
WORKDIR /var/www
RUN npm i express
COPY ./dist/* dist/
COPY ./server.js .
EXPOSE 3000
CMD node server.js
