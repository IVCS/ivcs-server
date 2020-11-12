FROM node:15.2.0-alpine3.12

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY --chown=node:node package*.json ./

USER node

RUN npm install

COPY --chown=node:node . .

EXPOSE 3001

CMD [ "node", "--experimental-modules", "src/app.mjs" ]
