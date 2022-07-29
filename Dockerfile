FROM node:16-slim
WORKDIR /var/www
COPY . .
RUN npm i
EXPOSE 3000
CMD node run start
