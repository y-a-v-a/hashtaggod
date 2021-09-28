FROM node:16-alpine

RUN mkdir -p /home/app

WORKDIR /home/app

COPY . .

RUN npm i

EXPOSE 8080

ENV DEBUG_COLORS=false

ENV DEBUG=*

USER node

CMD [ "node", "./index.js" ]
