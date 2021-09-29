FROM node:16-alpine3.11 as base-image
ENV TZ Europe/Helsinki

RUN mkdir -p /app

COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json

WORKDIR /app
RUN npm install

COPY . .


FROM base-image as build

RUN npm run build


FROM nginx:1.19.6 as prod
RUN rm /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]