FROM node:16-alpine3.11
ENV TZ Europe/Helsinki

RUN mkdir -p /app

COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json

WORKDIR /app
RUN npm install

COPY . .