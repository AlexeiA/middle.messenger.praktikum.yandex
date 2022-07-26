FROM node:16-slim
WORKDIR /var/www
COPY ./dist/* dist/
EXPOSE 3000
CMD node server.js
