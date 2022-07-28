FROM node:16-slim
WORKDIR /var/www
RUN npm i --production
COPY ./dist/* dist/
COPY ./server.js .
EXPOSE 3000
CMD npm run start
