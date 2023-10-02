FROM node:18-alpine

WORKDIR ./app/backend

ENV NODE_ENV production

COPY --chown=node:node package*.json ./

RUN npm ci --omit=dev

COPY --chown=node:node . .

EXPOSE 3001

RUN mkdir dist && chown=node:node dist

USER node

CMD [ "npm", "start" ]