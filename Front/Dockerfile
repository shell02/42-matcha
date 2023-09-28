FROM node:18-alpine as build

WORKDIR ./app/frontend

COPY --chown=node:node ./package*.json ./

RUN npm install

COPY --chown=node:node ./src src/
COPY --chown=node:node ./public public/

RUN npm run build

FROM nginx:alpine

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY config/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/frontend/build .

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]
