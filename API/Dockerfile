FROM node:18-alpine

WORKDIR ./app/backend

ENV NODE_ENV production

COPY --chown=node:node package*.json ./

RUN npm install
COPY --chown=node:node . .

EXPOSE 3001

RUN mkdir dist && chown node:node dist

RUN npm run build

USER node

CMD [ "npm", "start" ]