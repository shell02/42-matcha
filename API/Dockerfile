FROM node:18-alpine

WORKDIR ./app/backend

ENV NODE_ENV production

COPY --chown=node:node package*.json ./

RUN npm ci --omit=dev

COPY --chown=node:node . .

EXPOSE 3000

USER node

CMD [ "npm", "start" ]